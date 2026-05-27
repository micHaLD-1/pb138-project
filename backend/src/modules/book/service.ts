import { eq, sql, and, or, ilike, exists, inArray } from "drizzle-orm";

import { NotFoundError, UnprocessableError } from "../../errors";
import { db, book, bookAuthor, bookGenre, bookCopy, publisher, author, genre } from "../../db";
// import { bookTag } from "../../db"; // TODO: Tagy
import { BookCopyStatus } from "../../enums";
import { storageService } from "../../cover-storage";

import {mapToBookDTO, mapToBooksDTOs} from "./mapper";
import type { BookCreationDTO, BookUpdateDTO, BookDTO, BooksDTO } from "./model";

const MAX_BOOK_COVER_SIZE = 5 * 1024 * 1024;
const ALLOWED_BOOK_COVER_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const bookCoverObjectKey = (bookId: number) => `book-covers/${bookId}/cover`;

const validateCoverFile = (file: File) => {
    if (!(file instanceof File)) {
        throw new UnprocessableError("Book cover must be uploaded as a file");
    }

    if (!file.type.startsWith("image/")) {
        throw new UnprocessableError("Book cover must be an image file");
    }

    if (!ALLOWED_BOOK_COVER_TYPES.has(file.type)) {
        throw new UnprocessableError("Book cover must be JPEG, PNG, WebP, or GIF");
    }

    if (file.size === 0) {
        throw new UnprocessableError("Book cover file is empty");
    }

    if (file.size > MAX_BOOK_COVER_SIZE) {
        throw new UnprocessableError("Book cover must be 5 MB or smaller");
    }
};

export const booksService = {

    findAll: async (
        page: number,
        pageSize: number,
        filters?: { search?: string; genreId?: number; authorId?: number }
    ): Promise<BooksDTO> => {
        const offset = (page - 1) * pageSize;

        // Build WHERE conditions from optional filters
        const conditions = [];

        if (filters?.search) {
            conditions.push(
                or(
                    ilike(book.title, `%${filters.search}%`),
                    ilike(book.description, `%${filters.search}%`)
                )
            );
        }

        if (filters?.genreId) {
            conditions.push(
                exists(
                    db.select({ one: sql`1` }).from(bookGenre).where(
                        and(
                            eq(bookGenre.bookId, book.id),
                            eq(bookGenre.genreId, filters.genreId)
                        )
                    )
                )
            );
        }

        if (filters?.authorId) {
            conditions.push(
                exists(
                    db.select({ one: sql`1` }).from(bookAuthor).where(
                        and(
                            eq(bookAuthor.bookId, book.id),
                            eq(bookAuthor.authorId, filters.authorId)
                        )
                    )
                )
            );
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        // Count total matching records (for pagination metadata)
        const [totalRecords] = await db
            .select({ count: sql<number>`count(*)` })
            .from(book)
            .where(whereClause);

        // Get the paginated IDs that match the filters
        const matchingIds = await db
            .select({ id: book.id })
            .from(book)
            .where(whereClause)
            .limit(pageSize)
            .offset(offset);

        if (matchingIds.length === 0) {
            return mapToBooksDTOs([], Number(totalRecords.count), page, pageSize);
        }

        // Fetch full book data with all relations for the matched IDs
        const result = await db.query.book.findMany({
            where: inArray(book.id, matchingIds.map(b => b.id)),
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
            const { authorIds, genreIds, copyCount, publisherId, ...bookData } = data;
            // const { tagIds, copyCount, ...bookData } = data; // TODO: Implement tags feature

            // Verify publisher exists
            const [pub] = await tx.select().from(publisher).where(eq(publisher.id, publisherId));
            if (!pub) {
                throw new NotFoundError(`Publisher ${publisherId} not found`);
            }

            // Verify authors exist
            if (authorIds && authorIds.length > 0) {
                const authors = await tx.select().from(author).where(eq(author.id, authorIds[0]));
                if (authors.length === 0) {
                    throw new NotFoundError(`Author ${authorIds[0]} not found`);
                }
            }

            // Verify genres exist
            if (genreIds && genreIds.length > 0) {
                const genres = await tx.select().from(genre).where(eq(genre.id, genreIds[0]));
                if (genres.length === 0) {
                    throw new NotFoundError(`Genre ${genreIds[0]} not found`);
                }
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

            const copyInserts = Array.from({ length: copyCount }, () => ({
                bookId: newBook.id,
                status: BookCopyStatus.AVAILABLE
            }));
            await tx.insert(bookCopy).values(copyInserts);

            return newBook;
        });
    },

    uploadCoverImage: async (id: number, file: File): Promise<void> => {
        const existing = await db.query.book.findFirst({
            where: eq(book.id, id),
            columns: { id: true, coverImageKey: true }
        });

        if (!existing) throw new NotFoundError(`Book ${id} not found`);

        validateCoverFile(file);

        const objectKey = bookCoverObjectKey(id);
        await storageService.uploadObject(objectKey, file);

        try {
            await db.update(book)
                .set({ coverImageKey: objectKey })
                .where(eq(book.id, id));
        } catch (error) {
            await storageService.removeObject(objectKey).catch(() => undefined);
            throw error;
        }
    },

    getCoverImageRedirectUrl: async (id: number): Promise<string> => {
        const existing = await db.query.book.findFirst({
            where: eq(book.id, id),
            columns: { id: true, coverImageKey: true }
        });

        if (!existing) throw new NotFoundError(`Book ${id} not found`);
        if (!existing.coverImageKey) throw new NotFoundError(`Book ${id} does not have a cover image`);

        return await storageService.getSignedDownloadUrl(existing.coverImageKey);
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
        const existing = await db.query.book.findFirst({
            where: eq(book.id, id),
            columns: { id: true, coverImageKey: true }
        });

        if (!existing) throw new NotFoundError(`Book ${id} not found`);

        if (existing.coverImageKey) {
            await storageService.removeObject(existing.coverImageKey).catch(() => undefined);
        }

        const [deleted] = await db.delete(book).where(eq(book.id, id)).returning();
        if (!deleted) throw new NotFoundError(`Book ${id} not found`);
    }
};
