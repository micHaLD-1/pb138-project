import { eq, sql } from "drizzle-orm";

import { NotFoundError } from "../../errors";
import { db, book, bookAuthor, bookGenre } from "../../db";
import type { BookCreationDTO, BookUpdateDTO, BookDTO, BooksDTO } from "./model";

export const booksService = {

    findAll: async (page: number, pageSize: number): Promise<BooksDTO> => {

        const offset = (page - 1) * pageSize;
        const [totalRecords] = await db.select({ count: sql<number>`count(*)` }).from(book);

        const rawBooks = await db.query.book.findMany({
            limit: pageSize,
            offset,
            with: {
                bookAuthors: {
                    with: { author: true },
                },
                bookGenres: {
                    with: { genre: true },
                },
            },
        });

        const formattedBooks: BookDTO[] = rawBooks.map((b) => ({
            id: b.id,
            title: b.title,
            language: b.language,
            publisherId: b.publisherId,
            yearPublished: b.yearPublished,
            description: b.description,
            genres: b.bookGenres.map((bg) => ({
                id: bg.genre.id,
                name: bg.genre.name,
            })),
            authors: b.bookAuthors.map((ba) => ({
                id: ba.author.id,
                name: `${ba.author.firstName} ${ba.author.lastName}`.trim(),
            }))
        }));
        return {
            books: formattedBooks,
            total: Number(totalRecords.count),
            page,
            pageSize,
        };
    },

    findById: async (id: number): Promise<BookDTO> => {
        const rawBook = await db.query.book.findFirst({
            where: eq(book.id, id),
            with: {
                bookAuthors: { with: { author: true } },
                bookGenres: { with: { genre: true } }
            }
        });

        if (!rawBook) throw new NotFoundError(`Book ${id} not found`);

        return {
            id: rawBook.id,
            title: rawBook.title,
            language: rawBook.language,
            publisherId: rawBook.publisherId,
            yearPublished: rawBook.yearPublished,
            description: rawBook.description,
            genres: rawBook.bookGenres.map((bg) => ({
                id: bg.genre.id,
                name: bg.genre.name,
            })),
            authors: rawBook.bookAuthors.map((ba) => ({
                id: ba.author.id,
                name: `${ba.author.firstName} ${ba.author.lastName}`.trim(),
            }))
        };
    },
    create: async (data: BookCreationDTO) => {
        return await db.transaction(async (tx) => {

            const { authorIds, genreIds, ...bookData } = data;
            const [newBook] = await tx.insert(book).values(bookData).returning();

            if (authorIds && authorIds.length > 0) {
                const authorInserts = authorIds.map(aId => ({
                    bookId: newBook.id,
                    authorId: aId
                }));
                await tx.insert(bookAuthor).values(authorInserts);
            }

            if (genreIds && genreIds.length > 0) {
                const genreInserts = genreIds.map(gId => ({
                    bookId: newBook.id,
                    genreId: gId
                }));
                await tx.insert(bookGenre).values(genreInserts);
            }

            return newBook;
        });
    },

    update: async (id: number, data: BookUpdateDTO) => {
        return await db.transaction(async (tx) => {
            const [existing] = await tx.select().from(book).where(eq(book.id, id));
            if (!existing) throw new NotFoundError(`Book ${id} not found`);

            const { authorIds, genreIds, ...bookData } = data;

            const [updatedBook] = await tx
                .update(book)
                .set(bookData)
                .where(eq(book.id, id))
                .returning();

            if (authorIds !== undefined) {
                await tx.delete(bookAuthor).where(eq(bookAuthor.bookId, id));
                if (authorIds.length > 0) {
                    const authorInserts = authorIds.map(aId => ({ bookId: id, authorId: aId }));
                    await tx.insert(bookAuthor).values(authorInserts);
                }
            }

            if (genreIds !== undefined) {
                await tx.delete(bookGenre).where(eq(bookGenre.bookId, id));
                if (genreIds.length > 0) {
                    const genreInserts = genreIds.map(gId => ({ bookId: id, genreId: gId }));
                    await tx.insert(bookGenre).values(genreInserts);
                }
            }

            return updatedBook;
        });
    },

    remove: async (id: number): Promise<void> => {
        const [deleted] = await db.delete(book).where(eq(book.id, id)).returning();
        if (!deleted) throw new NotFoundError(`Book ${id} not found`);
    }
};
