import { describe, test, expect, mock, beforeEach } from "bun:test";

import { db } from "../../db";
import { loanService } from "./service";
import { LoanStatus, BookCopyStatus } from "../../enums";
import { NotFoundError, ConflictError } from "../../errors";

const mockDb = {
    select: mock(),
    insert: mock(),
    update: mock(),
    delete: mock(),
    query: { loan: { findMany: mock() } },
    transaction: mock(async (cb) => cb(mockDb))
};

mock.module("../../db", () => ({
    db: mockDb,
    loan: { id: "id" },
    bookCopy: { id: "id" }
}));

const fakeLoan = {
    id: 1,
    userId: 1,
    bookCopyId: 10,
    loanDate: "2024-01-01",
    expectedReturnDate: "2024-01-10",
    actualReturnDate: null,
    price: 5.0,
    status: LoanStatus.ACTIVE
};

const setupSelectMock = (returnValues: any[]) => {
    const whereMock = mock().mockResolvedValue(returnValues);
    const fromMock = mock().mockImplementation(() => {
        const promise = Promise.resolve(returnValues) as any;
        promise.where = whereMock;
        return promise;
    });
    (db.select as any).mockReturnValue({ from: fromMock });
    return whereMock;
};

const setupUpdateMock = (returnValues: any[] = []) => {
    const returningMock = mock().mockResolvedValue(returnValues);
    const whereMock = mock().mockImplementation(() => {
        const promise = Promise.resolve(returnValues) as any;
        promise.returning = returningMock;
        return promise;
    });
    const setMock = mock().mockReturnValue({ where: whereMock });
    (db.update as any).mockReturnValue({ set: setMock });
    return { setMock, whereMock, returningMock };
};

const setupInsertMock = (returnValues: any[]) => {
    const returningMock = mock().mockResolvedValue(returnValues);
    const valuesMock = mock().mockReturnValue({ returning: returningMock });
    (db.insert as any).mockReturnValue({ values: valuesMock });
    return valuesMock;
};

describe("Loan Service", () => {

    beforeEach(() => {
        (db.select as any).mockClear();
        (db.insert as any).mockClear();
        (db.update as any).mockClear();
        (db.delete as any).mockClear();
        (db.query.loan.findMany as any).mockClear();
        (db.transaction as any).mockClear();
    });

    describe("findAll()", () => {

        test("should return paginated loans", async () => {
            setupSelectMock([{ count: 5 }]);
            (db.query.loan.findMany as any).mockResolvedValue([fakeLoan]);

            const result = await loanService.findAll(1, 10);

            expect(result).toBeDefined();
            expect(result.loans.length).toBe(1);
            expect(result.total).toBe(5);
            expect(db.query.loan.findMany).toHaveBeenCalled();
            expect((db.query.loan.findMany as any).mock.calls[0][0].limit).toBe(10);
            expect((db.query.loan.findMany as any).mock.calls[0][0].offset).toBe(0);
        });
    });

    describe("findById()", () => {

        test("should return loan if found", async () => {
            setupSelectMock([fakeLoan]);
            const result = await loanService.findById(1);
            expect(result.id).toBe(1);
        });

        test("should throw NotFoundError if loan does not exist", async () => {
            setupSelectMock([]);
            expect(loanService.findById(999)).rejects.toThrow(NotFoundError);
        });
    });

    describe("create()", () => {

        const createData = {
            userId: 1,
            bookCopyId: 10,
            loanDate: "2024-01-01",
            expectedReturnDate: "2024-01-10",
            actualReturnDate: null,
            price: 5.0
        };

        test("should throw NotFoundError if book copy does not exist", async () => {
            setupSelectMock([]);
            expect(loanService.create(createData)).rejects.toThrow(NotFoundError);
        });

        test("should throw ConflictError if book copy is not AVAILABLE", async () => {
            setupSelectMock([{ id: 10, status: BookCopyStatus.BORROWED }]);
            expect(loanService.create(createData)).rejects.toThrow(ConflictError);
        });

        test("should successfully create loan and update book copy status", async () => {
            setupSelectMock([{ id: 10, status: BookCopyStatus.AVAILABLE }]);
            setupUpdateMock();
            setupInsertMock([fakeLoan]);

            const result = await loanService.create(createData);

            expect(result).toBeDefined();
            expect(result.id).toBe(fakeLoan.id);
            expect(db.update).toHaveBeenCalledTimes(1);
            expect(db.insert).toHaveBeenCalledTimes(1);
        });
    });

    describe("update()", () => {

        const updateData = { expectedReturnDate: "2024-02-01", price: 10 };

        test("should throw NotFoundError if loan does not exist", async () => {
            setupSelectMock([]);
            expect(loanService.update(999, updateData)).rejects.toThrow(NotFoundError);
        });

        test("should throw ConflictError if loan is not ACTIVE", async () => {
            setupSelectMock([{ ...fakeLoan, status: LoanStatus.RETURNED }]);
            expect(loanService.update(1, updateData)).rejects.toThrow(ConflictError);
        });

        test("should throw NotFoundError if update fails to return record", async () => {
            setupSelectMock([fakeLoan]);
            setupUpdateMock([]); // Empty array means not updated
            expect(loanService.update(1, updateData)).rejects.toThrow(NotFoundError);
        });

        test("should successfully update loan", async () => {
            setupSelectMock([fakeLoan]);
            setupUpdateMock([fakeLoan]);

            await expect(loanService.update(1, updateData)).resolves.toBeUndefined();
            expect(db.update).toHaveBeenCalledTimes(1);
        });
    });

    describe("return()", () => {

        test("should throw NotFoundError if loan does not exist", async () => {
            setupSelectMock([]);
            expect(loanService.return(999)).rejects.toThrow(NotFoundError);
        });

        test("should throw ConflictError if loan is not ACTIVE", async () => {
            setupSelectMock([{ ...fakeLoan, status: LoanStatus.RETURNED }]);
            expect(loanService.return(1)).rejects.toThrow(ConflictError);
        });

        test("should mark as RETURNED if returned on or before expected date", async () => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 5);
            const activeLoan = { ...fakeLoan, expectedReturnDate: futureDate.toISOString() };

            setupSelectMock([activeLoan]);
            const { setMock } = setupUpdateMock();

            await loanService.return(1);

            expect(db.update).toHaveBeenCalledTimes(2);

            const loanUpdateCall = setMock.mock.calls[0][0];
            expect(loanUpdateCall.status).toBe(LoanStatus.RETURNED);
            expect(loanUpdateCall.actualReturnDate).toBeDefined();
        });

        test("should mark as RETURNED_LATE if returned after expected date", async () => {
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - 5);
            const lateLoan = { ...fakeLoan, expectedReturnDate: pastDate.toISOString() };

            setupSelectMock([lateLoan]);
            const { setMock } = setupUpdateMock();

            await loanService.return(1);

            const loanUpdateCall = setMock.mock.calls[0][0];
            expect(loanUpdateCall.status).toBe(LoanStatus.RETURNED_LATE);
        });
    });

    describe("revert()", () => {

        test("should throw NotFoundError if loan does not exist", async () => {
            setupSelectMock([]);
            expect(loanService.revert(999)).rejects.toThrow(NotFoundError);
        });

        test("should throw ConflictError if loan is ACTIVE", async () => {
            setupSelectMock([{ ...fakeLoan, status: LoanStatus.ACTIVE }]);
            expect(loanService.revert(1)).rejects.toThrow(ConflictError);
        });

        test("should successfully revert RETURNED loan to ACTIVE", async () => {
            setupSelectMock([{ ...fakeLoan, status: LoanStatus.RETURNED }]);
            const { setMock } = setupUpdateMock();

            await loanService.revert(1);

            expect(db.update).toHaveBeenCalledTimes(2);

            const loanUpdateCall = setMock.mock.calls[0][0];
            expect(loanUpdateCall.status).toBe(LoanStatus.ACTIVE);
            expect(loanUpdateCall.actualReturnDate).toBeNull();

            const bookCopyUpdateCall = setMock.mock.calls[1][0];
            expect(bookCopyUpdateCall.status).toBe(BookCopyStatus.BORROWED);
        });
    });

    describe("cancel()", () => {

        test("should throw NotFoundError if loan does not exist", async () => {
            setupSelectMock([]);
            expect(loanService.cancel(999)).rejects.toThrow(NotFoundError);
        });

        test("should throw ConflictError if loan is not ACTIVE", async () => {
            setupSelectMock([{ ...fakeLoan, status: LoanStatus.CANCELED }]);
            expect(loanService.cancel(1)).rejects.toThrow(ConflictError);
        });

        test("should successfully cancel loan and free up book copy", async () => {
            setupSelectMock([fakeLoan]);
            const { setMock } = setupUpdateMock();

            await loanService.cancel(1);

            expect(db.update).toHaveBeenCalledTimes(2);

            const loanUpdateCall = setMock.mock.calls[0][0];
            expect(loanUpdateCall.status).toBe(LoanStatus.CANCELED);

            const bookCopyUpdateCall = setMock.mock.calls[1][0];
            expect(bookCopyUpdateCall.status).toBe(BookCopyStatus.AVAILABLE);
        });
    });
});
