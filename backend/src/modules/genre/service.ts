import { eq, sql } from "drizzle-orm";

import { NotFoundError, ConflictError } from "../../errors";
import { db, genre, bookGenre } from "../../db";

import { mapToGenreDTO, mapToGenresDTO } from "./mapper";
import type { GenreCreationDTO, GenreDTO, GenresDTO } from "./model";

export const genreService = {

    findAll: async (page: number, pageSize: number): Promise<GenresDTO> => {
        const offset = (page - 1) * pageSize;
        const [totalRecords] = await db.select({ count: sql<number>`count(*)` }).from(genre);
        const result = await db.query.genre.findMany({ limit: pageSize, offset });
        return mapToGenresDTO(result, Number(totalRecords.count), page, pageSize);
    },

    findById: async (id: number): Promise<GenreDTO> => {
        const [found] = await db.select().from(genre).where(eq(genre.id, id));
        if (!found) throw new NotFoundError(`Genre ${id} not found`);
        return mapToGenreDTO(found);
    },

    create: async (data: GenreCreationDTO): Promise<GenreDTO> => {
        const [created] = await db.insert(genre).values(data).returning();
        return mapToGenreDTO(created);
    },

    remove: async (id: number): Promise<void> => {
        const [bookCount] = await db
            .select({ count: sql<number>`count(*)` })
            .from(bookGenre)
            .where(eq(bookGenre.genreId, id));

        if (Number(bookCount.count) > 0) {
            throw new ConflictError(`Genre ${id} has assigned books and cannot be deleted`);
        }

        const [deleted] = await db.delete(genre).where(eq(genre.id, id)).returning();
        if (!deleted) throw new NotFoundError(`Genre ${id} not found`);
    }
};
