import { describe, test, expect, mock, beforeEach } from "bun:test";

import { db } from "../../db";
import { publisherService } from "./service";
import { NotFoundError, ConflictError } from "../../errors";

const mockDb = {
    select: mock(),
    insert: mock(),
    update: mock(),
    delete: mock(),
    query: { publisher: { findMany: mock() } }
};

mock.module("../../db", () => ({
    db: mockDb,
    publisher: { id: "id" },
    book: { publisherId: "publisherId" }
}));

mock.module("drizzle-orm", () => ({
    eq: mock(),
    sql: mock()
}));

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

const fakePublisher = { id: 1, name: "Penguin Books" };

describe("Publisher Service", () => {

    beforeEach(() => {
        (db.select as any).mockClear();
        (db.insert as any).mockClear();
        (db.update as any).mockClear();
        (db.delete as any).mockClear();
        (db.query.publisher.findMany as any).mockClear();
    });

    describe("findAll()", () => {

        test("should return paginated publishers", async () => {
            setupSelectMock([{ count: 3 }]);
            (db.query.publisher.findMany as any).mockResolvedValue([fakePublisher]);

            const result = await publisherService.findAll(1, 10);

            expect(result).toBeDefined();
            expect(result.publishers.length).toBe(1);
            expect(result.total).toBe(3);
            expect(db.query.publisher.findMany).toHaveBeenCalled();
            expect((db.query.publisher.findMany as any).mock.calls[0][0].limit).toBe(10);
            expect((db.query.publisher.findMany as any).mock.calls[0][0].offset).toBe(0);
        });
    });

    describe("findById()", () => {

        test("should return publisher if found", async () => {
            setupSelectMock([fakePublisher]);
            const result = await publisherService.findById(1);
            expect(result.id).toBe(1);
            expect(result.name).toBe("Penguin Books");
        });

        test("should throw NotFoundError if publisher does not exist", async () => {
            setupSelectMock([]);
            expect(publisherService.findById(999)).rejects.toThrow(NotFoundError);
        });
    });

    describe("create()", () => {

        test("should successfully create publisher", async () => {
            setupDMLMock('insert', [fakePublisher]);
            const result = await publisherService.create({ name: "Penguin Books" });

            expect(result.id).toBe(1);
            expect(result.name).toBe("Penguin Books");
            expect(db.insert).toHaveBeenCalledTimes(1);
        });
    });

    describe("update()", () => {

        const updateData = { name: "Updated Publisher" };

        test("should successfully update publisher", async () => {
            setupDMLMock('update', [fakePublisher]);
            await expect(publisherService.update(1, updateData)).resolves.toBeUndefined();
            expect(db.update).toHaveBeenCalledTimes(1);
        });

        test("should throw NotFoundError if publisher to update does not exist", async () => {
            setupDMLMock('update', []); // returning empty array
            expect(publisherService.update(999, updateData)).rejects.toThrow(NotFoundError);
        });
    });

    describe("remove()", () => {

        test("should throw ConflictError if publisher has assigned books", async () => {
            setupSelectMock([{ count: 5 }]);
            expect(publisherService.remove(1)).rejects.toThrow(ConflictError);
            expect(db.delete).not.toHaveBeenCalled();
        });

        test("should successfully remove publisher if no books are assigned", async () => {
            setupSelectMock([{ count: 0 }]);
            setupDMLMock('delete', [{ id: 1 }]);

            await expect(publisherService.remove(1)).resolves.toBeUndefined();
            expect(db.delete).toHaveBeenCalledTimes(1);
        });

        test("should throw NotFoundError if publisher to remove does not exist", async () => {
            setupSelectMock([{ count: 0 }]);
            setupDMLMock('delete', []);

            expect(publisherService.remove(999)).rejects.toThrow(NotFoundError);
        });
    });
});
