import { describe, test, expect, mock, beforeEach } from "bun:test";

import { db } from "../../db";
import { authorService } from "./service";
import { NotFoundError, ConflictError } from "../../errors";

mock.module("../../db", () => {
    return {
        author: { id: "id_column", firstName: "firstName_column", lastName: "lastName_column" },
        bookAuthor: { authorId: "authorId_column" },
        db: {
            select: mock(),
            delete: mock(),
            insert: mock(),
            update: mock(),
            query: { author: { findMany: mock() } }
        }
    };
});

mock.module("drizzle-orm", () => ({
    eq: mock(),
    sql: mock(() => ({})),
}));

describe("Author Service", () => {

    beforeEach(() => {
        (db.select as any).mockClear();
        (db.delete as any).mockClear();
        (db.insert as any).mockClear();
        (db.update as any).mockClear();
        (db.query.author.findMany as any).mockClear();
    });

    describe("findAll()", () => {

        test("should return paginated authors without name filter", async () => {
            const countWhereMock = mock().mockResolvedValue([{ count: 2 }]);
            const countFromMock = mock().mockReturnValue({ where: countWhereMock });
            (db.select as any).mockReturnValue({ from: countFromMock });

            (db.query.author.findMany as any).mockResolvedValue([
                { id: 1, firstName: "John", lastName: "Doe" },
                { id: 2, firstName: "Jane", lastName: "Doe" }
            ]);

            const result = await authorService.findAll(1, 10);

            expect(result).toBeDefined();
            expect(db.query.author.findMany).toHaveBeenCalled();
            expect((db.query.author.findMany as any).mock.calls[0][0].limit).toBe(10);
            expect((db.query.author.findMany as any).mock.calls[0][0].offset).toBe(0);
        });

        test("should return paginated authors with name filter", async () => {
            const countWhereMock = mock().mockResolvedValue([{ count: 1 }]);
            const countFromMock = mock().mockReturnValue({ where: countWhereMock });
            (db.select as any).mockReturnValue({ from: countFromMock });

            (db.query.author.findMany as any).mockResolvedValue([
                { id: 1, firstName: "John", lastName: "Doe" }
            ]);

            await authorService.findAll(2, 5, "John");

            expect((db.query.author.findMany as any).mock.calls[0][0].limit).toBe(5);
            expect((db.query.author.findMany as any).mock.calls[0][0].offset).toBe(5);
            expect((db.query.author.findMany as any).mock.calls[0][0].where).toBeDefined();
        });
    });

    describe("findById()", () => {

        test("should return author if found", async () => {
            const fakeAuthor = { id: 1, firstName: "John", lastName: "Doe" };
            const whereMock = mock().mockResolvedValue([fakeAuthor]);
            const fromMock = mock().mockReturnValue({ where: whereMock });
            (db.select as any).mockReturnValue({ from: fromMock });

            const result = await authorService.findById(1);

            expect(result.id).toBe(1);
            expect(whereMock).toHaveBeenCalledTimes(1);
        });

        test("should throw NotFoundError if author does not exist", async () => {
            const whereMock = mock().mockResolvedValue([]);
            const fromMock = mock().mockReturnValue({ where: whereMock });
            (db.select as any).mockReturnValue({ from: fromMock });

            expect(authorService.findById(999)).rejects.toThrow(NotFoundError);
        });
    });

    describe("create()", () => {

        test("should create and return a new author", async () => {
            const newAuthorData = { firstName: "John", lastName: "Doe" };
            const createdAuthor = { id: 1, ...newAuthorData };

            const returningMock = mock().mockResolvedValue([createdAuthor]);
            const valuesMock = mock().mockReturnValue({ returning: returningMock });
            (db.insert as any).mockReturnValue({ values: valuesMock });

            const result = await authorService.create(newAuthorData);

            expect(result.id).toBe(1);
            expect(result.firstName).toBe("John");
            expect(db.insert).toHaveBeenCalledTimes(1);
        });
    });

    describe("update()", () => {

        test("should update author successfully", async () => {
            const updateData = { firstName: "Jane", lastName: "Doe" };
            const updatedAuthor = { id: 1, firstName: "Jane", lastName: "Doe" };

            const returningMock = mock().mockResolvedValue([updatedAuthor]);
            const whereMock = mock().mockReturnValue({ returning: returningMock });
            const setMock = mock().mockReturnValue({ where: whereMock });
            (db.update as any).mockReturnValue({ set: setMock });

            expect(authorService.update(1, updateData)).resolves.toBeUndefined();
            expect(db.update).toHaveBeenCalledTimes(1);
        });

        test("should throw NotFoundError if author to update does not exist", async () => {
            const returningMock = mock().mockResolvedValue([]);
            const whereMock = mock().mockReturnValue({ returning: returningMock });
            const setMock = mock().mockReturnValue({ where: whereMock });
            (db.update as any).mockReturnValue({ set: setMock });

            expect(authorService.update(999, { firstName: "Jane", lastName: "Doe" })).rejects.toThrow(NotFoundError);
        });
    });

    describe("remove()", () => {

        test("should throw ConflictError if author has assigned books", async () => {
            const whereMock = mock().mockResolvedValue([{ count: 5 }]);
            const fromMock = mock().mockReturnValue({ where: whereMock });
            (db.select as any).mockReturnValue({ from: fromMock });

            expect(authorService.remove(1)).rejects.toThrow(ConflictError);
            expect(db.delete).not.toHaveBeenCalled();
        });

        test("should successfully remove author if no books are assigned", async () => {
            const selectWhereMock = mock().mockResolvedValue([{ count: 0 }]);
            const selectFromMock = mock().mockReturnValue({ where: selectWhereMock });
            (db.select as any).mockReturnValue({ from: selectFromMock });

            const deleteReturningMock = mock().mockResolvedValue([{ id: 1 }]);
            const deleteWhereMock = mock().mockReturnValue({ returning: deleteReturningMock });
            (db.delete as any).mockReturnValue({ where: deleteWhereMock });

            expect(authorService.remove(1)).resolves.toBeUndefined();
            expect(deleteReturningMock).toHaveBeenCalledTimes(1);
        });

        test("should throw NotFoundError if author to remove does not exist", async () => {
            const selectWhereMock = mock().mockResolvedValue([{ count: 0 }]);
            const selectFromMock = mock().mockReturnValue({ where: selectWhereMock });
            (db.select as any).mockReturnValue({ from: selectFromMock });

            const deleteReturningMock = mock().mockResolvedValue([]);
            const deleteWhereMock = mock().mockReturnValue({ returning: deleteReturningMock });
            (db.delete as any).mockReturnValue({ where: deleteWhereMock });

            expect(authorService.remove(999)).rejects.toThrow(NotFoundError);
        });
    });
});
