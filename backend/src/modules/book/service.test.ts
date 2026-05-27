import { describe, test, expect, mock, beforeEach } from "bun:test";

import { db } from "../../db";
import { booksService } from "./service";
import { BookCopyStatus } from "../../enums";
import { storageService } from "../../cover-storage";
import { NotFoundError, UnprocessableError } from "../../errors";

const mockDb = {
    select: mock(),
    insert: mock(),
    update: mock(),
    delete: mock(),
    query: { book: { findMany: mock(), findFirst: mock() } },
    transaction: mock(async (cb) => cb(mockDb))
};

mock.module("../../db", () => ({
    db: mockDb,
    book: {},
    bookAuthor: { bookId: "bookId" },
    bookGenre: { bookId: "bookId" },
    bookCopy: {},
    publisher: { id: "id" },
    author: { id: "id" },
    genre: { id: "id" }
}));

mock.module("../../cover-storage", () => ({
    storageService: {
        uploadObject: mock().mockResolvedValue(undefined),
        removeObject: mock().mockResolvedValue(undefined),
        getSignedDownloadUrl: mock()
    }
}));

const mockBookWithRelations = {
    id: 1,
    title: "Test Book",
    language: "SK",
    publisherId: 1,
    yearPublished: 2024,
    description: "Test",
    coverImageKey: null,
    publisher: { id: 1, name: "Test Publisher" },
    bookCopies: [{ id: 1, status: BookCopyStatus.AVAILABLE }],
    bookGenres: [{ genre: { id: 1, name: "Sci-Fi" } }],
    bookAuthors: [{ author: { id: 1, firstName: "John", lastName: "Doe" } }]
};

describe("Books Service", () => {

    beforeEach(() => {
        (db.select as any).mockClear();
        (db.insert as any).mockClear();
        (db.update as any).mockClear();
        (db.delete as any).mockClear();
        (db.query.book.findMany as any).mockClear();
        (db.query.book.findFirst as any).mockClear();
        (db.transaction as any).mockClear();
        (storageService.uploadObject as any).mockClear();
        (storageService.removeObject as any).mockClear();
        (storageService.getSignedDownloadUrl as any).mockClear();
    });

    const setupSelectMock = (firstCallReturn: any[], secondCallReturn?: any[]) => {
        let callCount = 0;
        const getChain = (val: any) => {
            const offsetMock = mock().mockResolvedValue(val);
            const limitMock = mock().mockReturnValue({ offset: offsetMock });
            const whereMock = mock().mockImplementation(() => {
                const p = Promise.resolve(val) as any;
                p.limit = limitMock;
                p.offset = offsetMock;
                return p;
            });
            const fromPromise = Promise.resolve(val) as any;
            fromPromise.where = whereMock;
            fromPromise.limit = limitMock;
            fromPromise.offset = offsetMock;
            return fromPromise;
        };

        (db.select as any).mockImplementation(() => {
            const res = callCount === 0 ? firstCallReturn : (secondCallReturn ?? firstCallReturn);
            callCount++;
            return { from: mock().mockReturnValue(getChain(res)) };
        });
    };

    const setupDMLMock = (method: 'insert' | 'update' | 'delete', returningValues: any[]) => {
        const returningMock = mock().mockResolvedValue(returningValues);
        const whereMock = mock().mockReturnValue({ returning: returningMock });
        const valuesOrSetMock = mock().mockReturnValue({ returning: returningMock, where: whereMock });
        (db[method] as any).mockReturnValue({ values: valuesOrSetMock, set: valuesOrSetMock, where: whereMock });
        return { returningMock, whereMock, valuesOrSetMock };
    };

    describe("findAll()", () => {

        test("should return paginated books", async () => {
            setupSelectMock([{ count: 5 }], [{ id: 1 }]);
            (db.query.book.findMany as any).mockResolvedValue([mockBookWithRelations]);

            const result = await booksService.findAll(1, 10);

            expect(result).toBeDefined();
            expect(result.books.length).toBe(1);
            expect(db.query.book.findMany).toHaveBeenCalled();
            expect((db.query.book.findMany as any).mock.calls[0][0].where).toBeDefined();
        });
    });

    describe("findById()", () => {

        test("should return book if found", async () => {
            (db.query.book.findFirst as any).mockResolvedValue(mockBookWithRelations);
            const result = await booksService.findById(1);
            expect(result.id).toBe(1);
        });

        test("should throw NotFoundError if book does not exist", async () => {
            (db.query.book.findFirst as any).mockResolvedValue(null);
            expect(booksService.findById(999)).rejects.toThrow(NotFoundError);
        });
    });

    describe("create()", () => {
        const createData = {
            title: "New Book",
            language: "EN",
            yearPublished: 2024,
            description: "Test",
            publisherId: 1,
            copyCount: 2,
            authorIds: [1],
            genreIds: [1]
        };

        test("should throw NotFoundError if publisher does not exist", async () => {
            setupSelectMock([]);
            expect(booksService.create(createData as any)).rejects.toThrow(NotFoundError);
        });

        test("should successfully create book with relations and copies", async () => {
            setupSelectMock([{ id: 1 }]);
            setupDMLMock('insert', [{ id: 1 }]);

            const result = await booksService.create(createData as any);

            expect(result).toBeDefined();
            expect(result.id).toBe(1);
            expect(db.insert).toHaveBeenCalledTimes(4);
        });
    });

    describe("uploadCoverImage()", () => {

        const createValidFile = () => new File(["dummy"], "cover.jpg", { type: "image/jpeg" });

        test("should throw NotFoundError if book does not exist", async () => {
            (db.query.book.findFirst as any).mockResolvedValue(null);
            expect(booksService.uploadCoverImage(999, createValidFile())).rejects.toThrow(NotFoundError);
        });

        test("should throw UnprocessableError if input is not a File", async () => {
            (db.query.book.findFirst as any).mockResolvedValue({ id: 1 });
            expect(booksService.uploadCoverImage(1, "not-a-file" as any)).rejects.toThrow(UnprocessableError);
        });

        test("should throw UnprocessableError if file is not an image", async () => {
            (db.query.book.findFirst as any).mockResolvedValue({ id: 1 });
            const file = new File(["dummy"], "doc.txt", { type: "text/plain" });
            expect(booksService.uploadCoverImage(1, file)).rejects.toThrow(UnprocessableError);
        });

        test("should throw UnprocessableError if image type is not allowed", async () => {
            (db.query.book.findFirst as any).mockResolvedValue({ id: 1 });
            const file = new File(["dummy"], "img.bmp", { type: "image/bmp" });
            expect(booksService.uploadCoverImage(1, file)).rejects.toThrow(UnprocessableError);
        });

        test("should throw UnprocessableError if file is empty", async () => {
            (db.query.book.findFirst as any).mockResolvedValue({ id: 1 });
            const file = new File([], "cover.jpg", { type: "image/jpeg" });
            expect(booksService.uploadCoverImage(1, file)).rejects.toThrow(UnprocessableError);
        });

        test("should throw UnprocessableError if file is too large", async () => {
            (db.query.book.findFirst as any).mockResolvedValue({ id: 1 });
            const largeContent = new ArrayBuffer((5 * 1024 * 1024) + 1);
            const file = new File([largeContent], "cover.jpg", { type: "image/jpeg" });
            expect(booksService.uploadCoverImage(1, file)).rejects.toThrow(UnprocessableError);
        });

        test("should successfully upload cover and update db", async () => {
            (db.query.book.findFirst as any).mockResolvedValue({ id: 1 });
            setupDMLMock('update', [{ id: 1 }]);

            await booksService.uploadCoverImage(1, createValidFile());

            expect(storageService.uploadObject).toHaveBeenCalledTimes(1);
            expect(db.update).toHaveBeenCalledTimes(1);
        });

        test("should remove object from storage if db update fails", async () => {
            (db.query.book.findFirst as any).mockResolvedValue({ id: 1 });

            const setMock = mock().mockReturnValue({
                where: mock().mockImplementation(() => { throw new Error("DB Error"); })
            });
            (db.update as any).mockReturnValue({ set: setMock });

            await expect(booksService.uploadCoverImage(1, createValidFile())).rejects.toThrow("DB Error");
            expect(storageService.removeObject).toHaveBeenCalledTimes(1);
        });
    });

    describe("getCoverImageRedirectUrl()", () => {

        test("should throw NotFoundError if book does not exist", async () => {
            (db.query.book.findFirst as any).mockResolvedValue(null);
            expect(booksService.getCoverImageRedirectUrl(999)).rejects.toThrow(NotFoundError);
        });

        test("should throw NotFoundError if book has no cover", async () => {
            (db.query.book.findFirst as any).mockResolvedValue({ id: 1, coverImageKey: null });
            expect(booksService.getCoverImageRedirectUrl(1)).rejects.toThrow(NotFoundError);
        });

        test("should return signed url", async () => {
            (db.query.book.findFirst as any).mockResolvedValue({ id: 1, coverImageKey: "key" });
            (storageService.getSignedDownloadUrl as any).mockResolvedValue("http://signed.url");

            const url = await booksService.getCoverImageRedirectUrl(1);

            expect(url).toBe("http://signed.url");
            expect(storageService.getSignedDownloadUrl).toHaveBeenCalledWith("key");
        });
    });

    describe("update()", () => {

        const updateData = { title: "Updated Title", authorIds: [2], genreIds: [2] };

        test("should throw NotFoundError if book to update does not exist", async () => {
            setupSelectMock([]);
            expect(booksService.update(999, updateData as any)).rejects.toThrow(NotFoundError);
        });

        test("should successfully update book and relations", async () => {
            setupSelectMock([{ id: 1 }]);
            setupDMLMock('update', [{ id: 1 }]);
            setupDMLMock('delete', [{ id: 1 }]);
            setupDMLMock('insert', [{ id: 1 }]);

            await booksService.update(1, updateData as any);

            expect(db.update).toHaveBeenCalledTimes(1);
            expect(db.delete).toHaveBeenCalledTimes(2);
            expect(db.insert).toHaveBeenCalledTimes(2);
        });
    });

    describe("remove()", () => {

        test("should throw NotFoundError if book does not exist", async () => {
            (db.query.book.findFirst as any).mockResolvedValue(null);
            expect(booksService.remove(999)).rejects.toThrow(NotFoundError);
        });

        test("should remove book and cover from storage", async () => {
            (db.query.book.findFirst as any).mockResolvedValue({ id: 1, coverImageKey: "key" });
            setupDMLMock('delete', [{ id: 1 }]);

            await booksService.remove(1);

            expect(storageService.removeObject).toHaveBeenCalledWith("key");
            expect(db.delete).toHaveBeenCalledTimes(1);
        });

        test("should remove book even if cover image key is null", async () => {
            (db.query.book.findFirst as any).mockResolvedValue({ id: 1, coverImageKey: null });
            setupDMLMock('delete', [{ id: 1 }]);

            await booksService.remove(1);

            expect(storageService.removeObject).not.toHaveBeenCalled();
            expect(db.delete).toHaveBeenCalledTimes(1);
        });

        test("should throw NotFoundError if db delete fails to return record", async () => {
            (db.query.book.findFirst as any).mockResolvedValue({ id: 1, coverImageKey: null });
            setupDMLMock('delete', []);

            expect(booksService.remove(1)).rejects.toThrow(NotFoundError);
        });
    });
});
