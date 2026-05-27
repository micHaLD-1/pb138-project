import { eq, sql } from "drizzle-orm";

import { db, publisher, book } from "../../db";
import { NotFoundError, ConflictError } from "../../errors";
import { mapToPublisherDTO, mapToPublishersDTOs } from "./mapper";
import type { PublisherCreationDTO, PublisherUpdateDTO, PublisherDTO, PublishersDTO } from "./model";

export const publisherService = {

    findAll: async (page: number, pageSize: number): Promise<PublishersDTO> => {
        const offset = (page - 1) * pageSize;
        const [totalRecords] = await db.select({ count: sql<number>`count(*)` }).from(publisher);
        const result = await db.query.publisher.findMany({ limit: pageSize, offset });
        return mapToPublishersDTOs(result, Number(totalRecords.count), page, pageSize);
    },

    findById: async (id: number): Promise<PublisherDTO> => {
        const [found] = await db.select().from(publisher).where(eq(publisher.id, id));
        if (!found) throw new NotFoundError(`Publisher ${id} not found`);
        return mapToPublisherDTO(found);
    },

    create: async (data: PublisherCreationDTO): Promise<PublisherDTO> => {
        const [created] = await db.insert(publisher).values(data).returning();
        return mapToPublisherDTO(created);
    },

    update: async (id: number, data: PublisherUpdateDTO): Promise<void> => {
        const [updated] = await db.update(publisher).set(data).where(eq(publisher.id, id)).returning();
        if (!updated) throw new NotFoundError(`Publisher ${id} not found`);
    },

    remove: async (id: number): Promise<void> => {
        const [bookCount] = await db
            .select({ count: sql<number>`count(*)` })
            .from(book)
            .where(eq(book.publisherId, id));

        if (Number(bookCount.count) > 0) {
            throw new ConflictError(`Publisher ${id} has assigned books and cannot be deleted`);
        }

        const [deleted] = await db.delete(publisher).where(eq(publisher.id, id)).returning();
        if (!deleted) throw new NotFoundError(`Publisher ${id} not found`);
    }
};
