import { db } from "../../db";
import { reservationService } from "./service";
import { NotFoundError, ConflictError } from "../../errors";
import { ReservationStatus, BookCopyStatus } from "../../enums";
import { describe, test, expect, mock, beforeEach } from "bun:test";

const mockDb = {
    select: mock(),
    insert: mock(),
    update: mock(),
    query: { reservation: { findMany: mock(), findFirst: mock() } },
    transaction: mock(async (cb) => cb(mockDb))
};

mock.module("../../db", () => ({
    db: mockDb,
    reservation: { id: "id", userId: "userId", status: "status", validityOfPickUpUntil: "validity" },
    bookCopy: { id: "id", bookId: "bookId", status: "status" },
    book: { id: "id" },
    user: { id: "id" }
}));

mock.module("drizzle-orm", () => ({
    eq: mock(),
    sql: mock(),
    and: mock()
}));

const fakeReservationWithRelations = {
    id: 1,
    userId: 10,
    bookCopyId: 100,
    fromDate: "2024-05-01",
    toDate: "2024-05-10",
    price: 15.0,
    status: ReservationStatus.ACTIVE,
    dateOfReservation: "2024-04-20",
    validityOfPickUpUntil: "2024-04-22",
    user: { id: 10, firstName: "John", lastName: "Doe" },
    bookCopy: {
        id: 100,
        bookId: 5,
        status: BookCopyStatus.RESERVED,
        book: { id: 5, title: "Test Book" }
    }
};

const setupSelectMock = (returnValues: any[]) => {
    const limitMock = mock().mockResolvedValue(returnValues);
    const whereMock = mock().mockImplementation(() => {
        const promise = Promise.resolve(returnValues) as any;
        promise.limit = limitMock;
        return promise;
    });
    const fromMock = mock().mockImplementation(() => {
        const promise = Promise.resolve(returnValues) as any;
        promise.where = whereMock;
        return promise;
    });
    (db.select as any).mockReturnValue({ from: fromMock });
    return { fromMock, whereMock, limitMock };
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

describe("Reservation Service", () => {

    beforeEach(() => {
        (db.select as any).mockClear();
        (db.insert as any).mockClear();
        (db.update as any).mockClear();
        (db.query.reservation.findMany as any).mockClear();
        (db.query.reservation.findFirst as any).mockClear();
        (db.transaction as any).mockClear();
    });

    describe("findAll()", () => {
        test("should return paginated reservations", async () => {
            setupSelectMock([{ count: 3 }]);
            (db.query.reservation.findMany as any).mockResolvedValue([fakeReservationWithRelations]);

            const result = await reservationService.findAll(1, 10);

            expect(result).toBeDefined();
            expect(result.reservations.length).toBe(1);
            expect(result.total).toBe(3);
            expect(db.query.reservation.findMany).toHaveBeenCalled();
            expect((db.query.reservation.findMany as any).mock.calls[0][0].limit).toBe(10);
            expect((db.query.reservation.findMany as any).mock.calls[0][0].offset).toBe(0);
        });
    });

    describe("findById()", () => {
        test("should return reservation if found", async () => {
            (db.query.reservation.findFirst as any).mockResolvedValue(fakeReservationWithRelations);
            const result = await reservationService.findById(1);
            expect(result.id).toBe(1);
        });

        test("should throw NotFoundError if reservation does not exist", async () => {
            (db.query.reservation.findFirst as any).mockResolvedValue(null);
            expect(reservationService.findById(999)).rejects.toThrow(NotFoundError);
        });
    });

    describe("create()", () => {
        const createData = {
            userId: 10,
            bookId: 5,
            fromDate: "2024-05-01",
            toDate: "2024-05-10",
            price: 15.0
        };

        test("should throw ConflictError if no book copies are available", async () => {
            setupSelectMock([]);
            expect(reservationService.create(createData)).rejects.toThrow(ConflictError);
        });

        test("should throw ConflictError if user already has an active reservation", async () => {
            setupSelectMock([{ id: 100 }]);
            (db.query.reservation.findFirst as any).mockResolvedValue({ id: 1, status: ReservationStatus.ACTIVE });

            expect(reservationService.create(createData)).rejects.toThrow(ConflictError);
        });

        test("should throw NotFoundError if created reservation fails to be fetched", async () => {
            setupSelectMock([{ id: 100 }]);

            (db.query.reservation.findFirst as any)
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce(null);

            setupInsertMock([{ id: 1 }]);
            setupUpdateMock();

            expect(reservationService.create(createData)).rejects.toThrow(NotFoundError);
        });

        test("should successfully create reservation and update book copy status", async () => {
            setupSelectMock([{ id: 100 }]); // Book copy found

            (db.query.reservation.findFirst as any)
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce(fakeReservationWithRelations);

            setupInsertMock([{ id: 1 }]);
            const { setMock } = setupUpdateMock();

            const result = await reservationService.create(createData);

            expect(result).toBeDefined();
            expect(result.id).toBe(1);
            expect(db.insert).toHaveBeenCalledTimes(1);

            expect(db.update).toHaveBeenCalledTimes(1);
            expect(setMock.mock.calls[0][0].status).toBe(BookCopyStatus.RESERVED);
        });
    });

    describe("update()", () => {
        const updateData = { fromDate: "2024-06-01", toDate: "2024-06-10", price: 20.0 };

        test("should throw NotFoundError if reservation does not exist", async () => {
            setupSelectMock([]);
            expect(reservationService.update(999, updateData)).rejects.toThrow(NotFoundError);
        });

        test("should throw ConflictError if reservation is not ACTIVE", async () => {
            setupSelectMock([{ id: 1, status: ReservationStatus.CANCELED }]);
            expect(reservationService.update(1, updateData)).rejects.toThrow(ConflictError);
        });

        test("should successfully update reservation and return DTO", async () => {
            setupSelectMock([{ id: 1, status: ReservationStatus.ACTIVE }]);
            setupUpdateMock([{ id: 1 }]);
            (db.query.reservation.findFirst as any).mockResolvedValue(fakeReservationWithRelations);

            const result = await reservationService.update(1, updateData);

            expect(result.id).toBe(1);
            expect(db.update).toHaveBeenCalledTimes(1);
            expect(db.query.reservation.findFirst).toHaveBeenCalledTimes(1);
        });
    });

    describe("cancel()", () => {
        test("should throw NotFoundError if reservation does not exist", async () => {
            setupSelectMock([]);
            expect(reservationService.cancel(999)).rejects.toThrow(NotFoundError);
        });

        test("should throw ConflictError if reservation is not ACTIVE", async () => {
            setupSelectMock([{ id: 1, status: ReservationStatus.CANCELED }]);
            expect(reservationService.cancel(1)).rejects.toThrow(ConflictError);
        });

        test("should successfully cancel reservation and free book copy", async () => {
            setupSelectMock([{ id: 1, status: ReservationStatus.ACTIVE, bookCopyId: 100 }]);
            const { setMock } = setupUpdateMock();

            await reservationService.cancel(1);

            expect(db.update).toHaveBeenCalledTimes(2);

            expect(setMock.mock.calls[0][0].status).toBe(ReservationStatus.CANCELED);
            expect(setMock.mock.calls[1][0].status).toBe(BookCopyStatus.AVAILABLE);
        });
    });

    describe("expireReservations()", () => {
        test("should do nothing if no expired reservations found", async () => {
            setupSelectMock([]);
            await reservationService.expireReservations();
            expect(db.transaction).not.toHaveBeenCalled();
        });

        test("should cancel all expired reservations and free their book copies", async () => {
            const expiredData = [
                { id: 1, bookCopyId: 101 },
                { id: 2, bookCopyId: 102 }
            ];
            setupSelectMock(expiredData);
            const { setMock } = setupUpdateMock();

            await reservationService.expireReservations();

            expect(db.transaction).toHaveBeenCalledTimes(2);

            expect(db.update).toHaveBeenCalledTimes(4);

            expect(setMock.mock.calls[0][0].status).toBe(ReservationStatus.CANCELED);
            expect(setMock.mock.calls[1][0].status).toBe(BookCopyStatus.AVAILABLE);

            expect(setMock.mock.calls[2][0].status).toBe(ReservationStatus.CANCELED);
            expect(setMock.mock.calls[3][0].status).toBe(BookCopyStatus.AVAILABLE);
        });
    });
});
