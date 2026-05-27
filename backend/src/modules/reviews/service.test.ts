import { describe, test, expect, mock, beforeEach } from "bun:test";

import { db } from "../../db";
import { reviewsService } from "./service";
import { NotFoundError, ConflictError } from "../../errors";

const mockDb = {
    select: mock(),
    insert: mock(),
    update: mock(),
    delete: mock(),
    query: { review: { findMany: mock(), findFirst: mock() } }
};

mock.module("../../db", () => ({
    db: mockDb,
    review: { id: "id", bookId: "bookId", userId: "userId", createdAt: "createdAt" },
    user: { id: "id" }
}));

mock.module("drizzle-orm", () => ({
    eq: mock(),
    and: mock(),
    sql: mock()
}));

const fakeReviewWithUser = {
    id: 1,
    bookId: 10,
    userId: 5,
    content: "Great book!",
    createdAt: new Date("2024-01-01"),
    user: { id: 5, firstName: "John", lastName: "Doe" }
};

const setupSelectMock = (returnValues: any[]) => {
    const whereMock = mock().mockResolvedValue(returnValues);
    const fromMock = mock().mockImplementation(() => {
        const promise = Promise.resolve(returnValues) as any;
        promise.where = whereMock;
        return promise;
    });
    (db.select as any).mockReturnValue({ from: fromMock });
    return { fromMock, whereMock };
};

const setupDMLMock = (method: 'insert' | 'update' | 'delete', returningValues: any[]) => {
    const returningMock = mock().mockResolvedValue(returningValues);
    const whereMock = mock().mockReturnValue({ returning: returningMock });
    const valuesOrSetMock = mock().mockReturnValue({ returning: returningMock, where: whereMock });
    (db[method] as any).mockReturnValue({ values: valuesOrSetMock, set: valuesOrSetMock, where: whereMock });
    return { returningMock, whereMock, valuesOrSetMock };
};

describe("Reviews Service", () => {

    beforeEach(() => {
        (db.select as any).mockClear();
        (db.insert as any).mockClear();
        (db.update as any).mockClear();
        (db.delete as any).mockClear();
        (db.query.review.findMany as any).mockClear();
        (db.query.review.findFirst as any).mockClear();
    });

    describe("findByBookId()", () => {

        test("should return paginated reviews", async () => {
            setupSelectMock([{ count: 5 }]);
            (db.query.review.findMany as any).mockResolvedValue([fakeReviewWithUser]);

            const result = await reviewsService.findByBookId(10, 1, 10);

            expect(result).toBeDefined();
            expect(result.reviews.length).toBe(1);
            expect(result.total).toBe(5);
            expect(db.query.review.findMany).toHaveBeenCalled();
        });
    });

    describe("create()", () => {

        const createData = { bookId: 10, content: "Test" };

        test("should throw ConflictError if user already reviewed the book", async () => {
            (db.query.review.findFirst as any).mockResolvedValue({ id: 1 });
            expect(reviewsService.create(5, createData)).rejects.toThrow(ConflictError);
        });

        test("should throw NotFoundError if review cannot be fetched after creation", async () => {
            (db.query.review.findFirst as any)
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce(null);

            setupDMLMock('insert', [{ id: 1 }]);
            expect(reviewsService.create(5, createData)).rejects.toThrow(NotFoundError);
        });

        test("should successfully create review", async () => {
            (db.query.review.findFirst as any)
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce(fakeReviewWithUser);

            setupDMLMock('insert', [{ id: 1 }]);

            const result = await reviewsService.create(5, createData);
            expect(result.id).toBe(1);
            expect(db.insert).toHaveBeenCalledTimes(1);
        });
    });

    describe("update()", () => {

        const updateData = { content: "Updated" };

        test("should throw NotFoundError if review does not exist", async () => {
            setupSelectMock([]);
            expect(reviewsService.update(1, 5, updateData)).rejects.toThrow(NotFoundError);
        });

        test("should throw ConflictError if trying to update someone else's review", async () => {
            setupSelectMock([{ id: 1, userId: 999 }]); // Wrong user
            expect(reviewsService.update(1, 5, updateData)).rejects.toThrow(ConflictError);
        });

        test("should successfully update review", async () => {
            setupSelectMock([{ id: 1, userId: 5 }]); // Correct user
            setupDMLMock('update', [{ id: 1 }]);
            (db.query.review.findFirst as any).mockResolvedValue(fakeReviewWithUser);

            const result = await reviewsService.update(1, 5, updateData);
            expect(result.id).toBe(1);
            expect(db.update).toHaveBeenCalledTimes(1);
        });
    });

    describe("remove()", () => {

        test("should throw NotFoundError if review does not exist", async () => {
            setupSelectMock([]);
            expect(reviewsService.remove(1, 5)).rejects.toThrow(NotFoundError);
        });

        test("should throw ConflictError if trying to delete someone else's review", async () => {
            setupSelectMock([{ id: 1, userId: 999 }]); // Wrong user
            expect(reviewsService.remove(1, 5)).rejects.toThrow(ConflictError);
        });

        test("should successfully remove review", async () => {
            setupSelectMock([{ id: 1, userId: 5 }]); // Correct user
            const whereMock = mock().mockResolvedValue([]);
            (db.delete as any).mockReturnValue({ where: whereMock });

            expect(reviewsService.remove(1, 5)).resolves.toBeUndefined();
            expect(db.delete).toHaveBeenCalledTimes(1);
        });
    });
});
