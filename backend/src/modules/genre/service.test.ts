import { describe, test, expect, mock, beforeEach } from "bun:test";

import { db } from "../../db";
import { genreService } from "./service";
import { NotFoundError, ConflictError } from "../../errors";

const mockDb = {
    select: mock(),
    insert: mock(),
    delete: mock(),
    query: { genre: { findMany: mock() } }
};

mock.module("../../db", () => ({
    db: mockDb,
    genre: { id: "id" },
    bookGenre: { genreId: "genreId" }
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

const setupDMLMock = (method: 'insert' | 'delete', returningValues: any[]) => {
    const returningMock = mock().mockResolvedValue(returningValues);
    const whereMock = mock().mockReturnValue({ returning: returningMock });
    const valuesMock = mock().mockReturnValue({ returning: returningMock });
    (db[method] as any).mockReturnValue({ values: valuesMock, where: whereMock });
    return { returningMock, whereMock, valuesMock };
};

const fakeGenre = { id: 1, name: "Sci-Fi" };

describe("Genre Service", () => {

    beforeEach(() => {
        (db.select as any).mockClear();
        (db.insert as any).mockClear();
        (db.delete as any).mockClear();
        (db.query.genre.findMany as any).mockClear();
    });

    describe("findAll()", () => {

        test("should return paginated genres", async () => {
            setupSelectMock([{ count: 2 }]);
            (db.query.genre.findMany as any).mockResolvedValue([fakeGenre]);

            const result = await genreService.findAll(1, 10);

            expect(result).toBeDefined();
            expect(result.genres.length).toBe(1);
            expect(result.total).toBe(2);
            expect(db.query.genre.findMany).toHaveBeenCalled();
            expect((db.query.genre.findMany as any).mock.calls[0][0].limit).toBe(10);
            expect((db.query.genre.findMany as any).mock.calls[0][0].offset).toBe(0);
        });
    });

    describe("findById()", () => {

        test("should return genre if found", async () => {
            setupSelectMock([fakeGenre]);
            const result = await genreService.findById(1);
            expect(result.id).toBe(1);
            expect(result.name).toBe("Sci-Fi");
        });

        test("should throw NotFoundError if genre does not exist", async () => {
            setupSelectMock([]);
            expect(genreService.findById(999)).rejects.toThrow(NotFoundError);
        });
    });

    describe("create()", () => {

        test("should successfully create genre", async () => {
            setupDMLMock('insert', [fakeGenre]);
            const result = await genreService.create({ name: "Sci-Fi" });

            expect(result.id).toBe(1);
            expect(result.name).toBe("Sci-Fi");
            expect(db.insert).toHaveBeenCalledTimes(1);
        });
    });

    describe("remove()", () => {

        test("should throw ConflictError if genre has assigned books", async () => {
            setupSelectMock([{ count: 5 }]);
            expect(genreService.remove(1)).rejects.toThrow(ConflictError);
            expect(db.delete).not.toHaveBeenCalled();
        });

        test("should successfully remove genre if no books are assigned", async () => {
            setupSelectMock([{ count: 0 }]);
            setupDMLMock('delete', [{ id: 1 }]);

            await expect(genreService.remove(1)).resolves.toBeUndefined();
            expect(db.delete).toHaveBeenCalledTimes(1);
        });

        test("should throw NotFoundError if genre to remove does not exist", async () => {
            setupSelectMock([{ count: 0 }]);
            setupDMLMock('delete', []);

            expect(genreService.remove(999)).rejects.toThrow(NotFoundError);
        });
    });
});
