import { eq, sql } from "drizzle-orm";

import { NotFoundError } from "../../errors";
import { db, book, bookAuthor, bookGenre, bookCopy, branch, publisher, author } from "../../db";
// import { bookTag } from "../../db"; // TODO: Tagy
import { BookCopyStatus } from "../../enums";

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
                // bookTags: { // TODO: Tagy
                //     with: { tag: true } 
                // },
                bookCopies: true,
                publisher: true
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
                    with: { genre: true } },
                // bookTags: { // TODO: Tagy
                //     with: { tag: true } 
                // },
                bookCopies: true,
                publisher: true
            }
        });

        if (!result) throw new NotFoundError(`Book ${id} not found`);
        return mapToBookDTO(result);
    },

    create: async (data: BookCreationDTO) => {
        return await db.transaction(async (tx) => {
            const { authorIds, genreIds, copyCount, publisherName, ...bookData } = data;
            // const { tagIds, copyCount, ...bookData } = data; // TODO: Implement tags feature

            // je tu kinda chaos v name vs id
            let publisherId: number;
            if (publisherName) {
                let [pub] = await tx.select().from(publisher).where(eq(publisher.name, publisherName));
                if (!pub) {
                    [pub] = await tx.insert(publisher).values({ name: publisherName }).returning();
                }
                publisherId = pub.id;
            } else {
                // Nenasiel som publisher, pouzijem prveho autora ako publisher
                if (!authorIds || authorIds.length === 0) {
                    throw new Error("Either publisherName or authorIds must be provided");
                }
                const [firstAuthor] = await tx.select().from(author).where(eq(author.id, authorIds[0]));
                if (!firstAuthor) {
                    throw new Error("Author not found");
                }
                const authorFullName = `${firstAuthor.firstName} ${firstAuthor.lastName}`;
                let [pub] = await tx.select().from(publisher).where(eq(publisher.name, authorFullName));
                if (!pub) {
                    [pub] = await tx.insert(publisher).values({ name: authorFullName }).returning();
                }
                publisherId = pub.id;
            }

            const [newBook] = await tx.insert(book).values({
                ...bookData,
                publisherId
            }).returning();

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

            // TODO: Tagy
            // if (tagIds && tagIds.length > 0) {
            //     const tagInserts = tagIds.map(tId => ({
            //         bookId: newBook.id,
            //         tagId: tId
            //     }));
            //     await tx.insert(bookTag).values(tagInserts);
            // }

            // TODO: V ktorej Branchi sa maju tie book copies vytvorit?
            const [defaultBranch] = await tx.select().from(branch).limit(1);
            if (!defaultBranch) {
                throw new Error("No branch found to create book copies");
            }

            const copyInserts = Array.from({ length: copyCount }, () => ({
                bookId: newBook.id,
                branchId: defaultBranch.id,
                status: BookCopyStatus.AVAILABLE
            }));
            await tx.insert(bookCopy).values(copyInserts);

            return newBook;
        });
    },

    update: async (id: number, data: BookUpdateDTO) => {
        return await db.transaction(async (tx) => {
            const [existing] = await tx.select().from(book).where(eq(book.id, id));
            if (!existing) throw new NotFoundError(`Book ${id} not found`);

            const { authorIds, genreIds, ...bookData } = data;
            // const { authorIds, genreIds, tagIds, ...bookData } = data; // TODO: Tagy

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

            // TODO: Tagy
            // if (tagIds !== undefined) {
            //     await tx.delete(bookTag).where(eq(bookTag.bookId, id));
            //     if (tagIds.length > 0) {
            //         const tagInserts = tagIds.map(tId => ({ bookId: id, tagId: tId }));
            //         await tx.insert(bookTag).values(tagInserts);
            //     }
            // }
        });
    },

    remove: async (id: number): Promise<void> => {
        const [deleted] = await db.delete(book).where(eq(book.id, id)).returning();
        if (!deleted) throw new NotFoundError(`Book ${id} not found`);
    }
};
