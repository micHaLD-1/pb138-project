import {eq, sql} from "drizzle-orm";

import {db, author} from "../../db";
import { NotFoundError } from "../../errors";

import {mapToAuthorDTO, mapToAuthorsDTOs} from "./mapper";
import type {AuthorCreationDTO, AuthorUpdateDTO, AuthorDTO, AuthorsDTO} from "./model";

export const authorService = {

  findAll: async (page: number, pageSize: number): Promise<AuthorsDTO> => {
    const offset = (page - 1) * pageSize;
    const [totalRecords] = await db.select({ count: sql<number>`count(*)` }).from(author);
    const result = await db.query.author.findMany({limit: pageSize, offset});
    return mapToAuthorsDTOs(result, Number(totalRecords.count), page, pageSize);
  },

  findById: async (id: number): Promise<AuthorDTO> => {
    const [found] = await db.select().from(author).where(eq(author.id, id))
    if (!found) throw new NotFoundError(`Author ${id} not found`);
    return mapToAuthorDTO(found);
  },

  create: async (data: AuthorCreationDTO): Promise<AuthorDTO> => {
    const [created] = await db.insert(author).values(data).returning();
    return mapToAuthorDTO(created);
  },

  update: async (id: number, data: AuthorUpdateDTO): Promise<void> => {
    const [updated] = await db.update(author).set(data).where(eq(author.id, id)).returning();
    if (!updated) throw new NotFoundError(`Author ${id} not found`);
  },

  remove: async (id: number): Promise<void> => {
    // TODO - kontrola či ma priradene nejake kinhy, ak ano tak vyhodime vyjimku

    const [deleted] = await db.delete(author).where(eq(author.id, id)).returning();
    if (!deleted) throw new NotFoundError(`Author ${id} not found`);
  }
};
