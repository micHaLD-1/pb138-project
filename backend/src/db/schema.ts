import { relations } from "drizzle-orm";
import { pgTable, serial, varchar, text, timestamp, integer, pgEnum, date, doublePrecision } from "drizzle-orm/pg-core";

import {BookCopyStatus, FineStatus, LoanStatus, ReservationStatus, UserRole} from "../enums";

export const userRoleEnum = pgEnum("user_role", Object.values(UserRole) as [string, ...string[]]);
export const loanStatusEnum = pgEnum("loan_status", Object.values(LoanStatus) as [string, ...string[]]);
export const fineStatusEnum = pgEnum("fine_status", Object.values(FineStatus) as [string, ...string[]]);
export const bookCopyStatusEnum = pgEnum("book_copy_status", Object.values(BookCopyStatus) as [string, ...string[]]);
export const reservationStatusEnum = pgEnum("reservation_status", Object.values(ReservationStatus) as [string, ...string[]]);

export const branch = pgTable("branch", {
  id: serial("id_branch").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  address: varchar("address", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull()
});

export const genre = pgTable("genre", {
  id: serial("id_genre").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique()
});

export const author = pgTable("author", {
  id: serial("id_author").primaryKey(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull()
});

export const publisher = pgTable("publisher", {
  id: serial("id_publisher").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique()
});

export const book = pgTable("book", {
  id: serial("id_book").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  yearPublished: integer("year_published").notNull(),
  language: varchar("language", { length: 100 }).notNull(),
  description: varchar("description", { length: 500 }).notNull(),
  publisherId: integer("id_publisher").notNull().references(() => publisher.id, { onDelete: "restrict"}),
  coverImageKey: varchar("cover_image_key", { length: 255 })
});

export const bookGenre = pgTable("book_genre", {
  bookId: integer("id_book").notNull().references(() => book.id, { onDelete: "cascade" }),
  genreId: integer("id_genre").notNull().references(() => genre.id, { onDelete: "cascade" })
});

export const bookAuthor = pgTable("book_author", {
  bookId: integer("id_book").notNull().references(() => book.id, { onDelete: "cascade" }),
  authorId: integer("id_author").notNull().references(() => author.id, { onDelete: "cascade" })
});

export const bookCopy = pgTable("book_copy", {
  id: serial("id").primaryKey(),
  status: bookCopyStatusEnum("status").notNull(),
  bookId: integer("id_book").notNull().references(() => book.id, { onDelete: "cascade" }),
  branchId: integer("id_branch").references(() => branch.id)
});

export const user = pgTable("user", {
  id: serial("id_user").primaryKey(),
  role: userRoleEnum("role").notNull(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull()
});

export const reservation = pgTable("reservation", {
  id: serial("id_reservation").primaryKey(),
  fromDate: date("from_date").notNull(),
  toDate: date("to_date").notNull(),
  price: doublePrecision("price").notNull(),
  status: reservationStatusEnum("status").notNull(),
  dateOfReservation: date("date_of_reservation").notNull(),
  validityOfPickUpUntil: date("validity_of_pick_up_until").notNull(),
  userId: integer("id_user").notNull().references(() => user.id),
  bookCopyId: integer("id_book_copy").notNull().references(() => bookCopy.id)
});

export const loan = pgTable("loan", {
  id: serial("id_loan").primaryKey(),
  price: doublePrecision("price").notNull(),
  status: loanStatusEnum("status").notNull(),
  loanDate: date("loan_date").notNull(),
  actualReturnDate: date("actual_return_date"),
  expectedReturnDate: date("expected_return_date").notNull(),
  userId: integer("id_user").notNull().references(() => user.id),
  bookCopyId: integer("id_book_copy").notNull().references(() => bookCopy.id)
});

export const fine = pgTable("fine", {
  id: serial("id_fine").primaryKey(),
  amount: doublePrecision("amount").notNull(),
  description: text("description"),
  status: fineStatusEnum("status").notNull(),
  userId: integer("id_user").notNull().references(() => user.id, { onDelete: "cascade" })
});

export const notification = pgTable("notification", {
  id: serial("id_notification").primaryKey(),
  content: varchar("content", { length: 500 }).notNull(),
  sentAt: date("sent_at").defaultNow().notNull(),
  userId: integer("id_user").notNull().references(() => user.id, { onDelete: "cascade" })
});

export const review = pgTable("review", {
  id: serial("id_review").primaryKey(),
  content: varchar("content", { length: 1000 }).notNull(),
  createdAt: timestamp("created_at").notNull(),
  userId: integer("id_user").notNull().references(() => user.id, { onDelete: "cascade" }),
  bookId: integer("id_book").notNull().references(() => book.id, { onDelete: "cascade" })
});

export const genreRelations = relations(genre, ({ many }) => ({
  bookGenres: many(bookGenre),
}));

export const authorRelations = relations(author, ({ many }) => ({
  bookAuthors: many(bookAuthor),
}));

export const publisherRelations = relations(publisher, ({ many }) => ({
  books: many(book),
}));

export const bookRelations = relations(book, ({ one, many }) => ({
  publisher: one(publisher, {fields: [book.publisherId], references: [publisher.id],}),
  bookAuthors: many(bookAuthor),
  bookGenres: many(bookGenre),
  reviews: many(review),
  bookCopies: many(bookCopy),
}));

export const bookAuthorRelations = relations(bookAuthor, ({ one }) => ({
  book: one(book, {fields: [bookAuthor.bookId], references: [book.id],}),
  author: one(author, {fields: [bookAuthor.authorId], references: [author.id],}),
}));

export const bookGenreRelations = relations(bookGenre, ({ one }) => ({
  book: one(book, {fields: [bookGenre.bookId], references: [book.id],}),
  genre: one(genre, {fields: [bookGenre.genreId], references: [genre.id],}),
}));

export const bookCopyRelations = relations(bookCopy, ({ one, many }) => ({
  book: one(book, { fields: [bookCopy.bookId], references: [book.id] }),
  loans: many(loan),
  reservations: many(reservation),
}));

export const userRelations = relations(user, ({ many }) => ({
  reservations: many(reservation),
  loans: many(loan),
  fines: many(fine),
  notifications: many(notification),
  reviews: many(review),
}));

export const reservationRelations = relations(reservation, ({ one }) => ({
  user: one(user, { fields: [reservation.userId], references: [user.id] }),
  bookCopy: one(bookCopy, { fields: [reservation.bookCopyId], references: [bookCopy.id] }),
}));

export const loanRelations = relations(loan, ({ one }) => ({
  user: one(user, { fields: [loan.userId], references: [user.id] }),
  bookCopy: one(bookCopy, { fields: [loan.bookCopyId], references: [bookCopy.id] }),
}));

export const fineRelations = relations(fine, ({ one }) => ({
  user: one(user, { fields: [fine.userId], references: [user.id] }),
}));

export const notificationRelations = relations(notification, ({ one }) => ({
  user: one(user, { fields: [notification.userId], references: [user.id] }),
}));

export const reviewRelations = relations(review, ({ one }) => ({
  user: one(user, { fields: [review.userId], references: [user.id] }),
  book: one(book, { fields: [review.bookId], references: [book.id] }),
}));

export const librarySetting = pgTable("library_setting", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: varchar("value", { length: 255 }).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
