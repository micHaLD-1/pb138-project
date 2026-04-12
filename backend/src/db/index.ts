import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "library",
});

export const db = drizzle(pool, { schema });

export type Database = typeof db;

// Export all tables for direct imports
export {
  publishers,
  authors,
  genres,
  branches,
  books,
  bookAuthors,
  bookGenres,
  bookCopies,
  users,
  reviews,
  notifications,
  reservations,
  fines,
  loans,
} from "./schema";
