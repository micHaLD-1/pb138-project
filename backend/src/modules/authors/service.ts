import { eq } from "drizzle-orm";
import { db, author } from "../../db";
import { NotFoundError } from "../../errors";
import type { AuthorCreationDTO, AuthorUpdateDTO, AuthorDTO } from "./model";

export const authorsService = {

  findAll: async (): Promise<AuthorDTO[]> => {
    return db.select().from(author);
  },

  findById: async (id: number): Promise<AuthorDTO> => {
    const [found] = await db.select().from(author).where(eq(author.id, id))
    if (!found) throw new NotFoundError(`Author ${id} not found`);
    return found;
  },

  create: async (data: AuthorCreationDTO): Promise<AuthorDTO> => {
    const [created] = await db.insert(author).values(data).returning();
    return created;
  },

  update: async (id: number, data: AuthorUpdateDTO): Promise<AuthorDTO> => {
    const [updated] = await db.update(author).set(data).where(eq(author.id, id)).returning();
    if (!updated) throw new NotFoundError(`Author ${id} not found`);
    return updated;
  },

  remove: async (id: number): Promise<void> => {
    const [deleted] = await db.delete(author).where(eq(author.id, id)).returning();
    if (!deleted) throw new NotFoundError(`Author ${id} not found`);
  }
};
