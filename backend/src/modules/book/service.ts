import { eq, sql } from "drizzle-orm";

import { NotFoundError } from "../../errors";
import { db, book, bookAuthor, bookGenre } from "../../db";

import {mapToBookDTO, mapToBooksDTOs} from "./mapper";
import type { BookCreationDTO, BookUpdateDTO, BookDTO, BooksDTO } from "./model";

export const booksService = {

    findAll: async (page: number, pageSize: number): Promise<BooksDTO> => {
        const offset = (page - 1) * pageSize;
        const [totalRecords] = await db.select({ count: sql<number>`count(*)` }).from(book);

        const result = await db.query.book.findMany({
            limit: pageSize,
            offset,
            with: {
                bookAuthors: {
                    with: { author: true } },
                bookGenres: {
                    with: { genre: true } },
            },
        });

        return mapToBooksDTOs(result, Number(totalRecords.count), page, pageSize);
    },

    findById: async (id: number): Promise<BookDTO> => {
        console.log("Prijatý request pre ID:", id);

        const result = await db.query.book.findFirst({
            where: eq(book.id, id),
            with: {
                bookAuthors: {
                    with: { author: true } },
                bookGenres: {
                    with: { genre: true } }
            }
        });

        if (!result) throw new NotFoundError(`Book ${id} not found`);
        return mapToBookDTO(result);
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
        });
    },

    remove: async (id: number): Promise<void> => {
        const [deleted] = await db.delete(book).where(eq(book.id, id)).returning();
        if (!deleted) throw new NotFoundError(`Book ${id} not found`);
    }
};
