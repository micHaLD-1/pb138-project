import { pgTable, serial, varchar, text, timestamp, integer, boolean, decimal, pgEnum, date, doublePrecision } from "drizzle-orm/pg-core";

// Enums
export const userRoleEnum = pgEnum("user_role", ["guest", "member", "staff", "admin"]);
export const bookCopyStatusEnum = pgEnum("book_copy_status", ["available", "borrowed", "reserved", "maintenance"]);
export const fineStatusEnum = pgEnum("fine_status", ["pending", "paid"]);

// PUBLISHER table
export const publishers = pgTable("publishers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
});

// AUTHOR table
export const authors = pgTable("authors", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
});

// GENRE table
export const genres = pgTable("genres", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
});

// BRANCH table
export const branches = pgTable("branches", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address"),
  contact: varchar("contact", { length: 255 }),
});

// BOOK table
export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  publisherId: integer("publisher_id").references(() => publishers.id),
  yearPublished: integer("year_published"),
  language: varchar("language", { length: 100 }),
  description: text("description"),
});

// BOOK_AUTHOR junction table (many-to-many)
export const bookAuthors = pgTable("book_authors", {
  bookId: integer("book_id").notNull().references(() => books.id),
  authorId: integer("author_id").notNull().references(() => authors.id),
});

// BOOK_GENRE junction table (many-to-many)
export const bookGenres = pgTable("book_genres", {
  bookId: integer("book_id").notNull().references(() => books.id),
  genreId: integer("genre_id").notNull().references(() => genres.id),
});

// BOOK_COPY table (physical copies)
export const bookCopies = pgTable("book_copies", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id").notNull().references(() => books.id),
  branchId: integer("branch_id").notNull().references(() => branches.id),
  status: bookCopyStatusEnum("status").default("available").notNull(),
});

// USER table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: userRoleEnum("role").default("member").notNull(),
  contact: varchar("contact", { length: 255 }),
});

// REVIEW table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  bookId: integer("book_id").notNull().references(() => books.id),
  text: text("text"),
  rating: integer("rating").notNull(),
  createdAt: date("created_at").defaultNow().notNull(),
});

// NOTIFICATION table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  text: text("text").notNull(),
  sentAt: date("sent_at").defaultNow().notNull(),
});

// RESERVATION table
export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  bookCopyId: integer("book_copy_id").notNull().references(() => bookCopies.id),
  fromDate: date("from_date").notNull(),
  toDate: date("to_date").notNull(),
  price: doublePrecision("price"),
});

// FINE table
export const fines = pgTable("fines", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: doublePrecision("amount").notNull(),
  description: text("description"),
  status: fineStatusEnum("status").default("pending").notNull(),
});

// LOAN table
export const loans = pgTable("loans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  bookCopyId: integer("book_copy_id").notNull().references(() => bookCopies.id),
  loanDate: date("loan_date").notNull(),
  dueDate: date("due_date").notNull(),
  returnDate: date("return_date"),
  price: doublePrecision("price"),
});
