import { Elysia } from "elysia";

export const booksModule = new Elysia({ prefix: "/books" })
  // Book catalog
  .get("/", () => "List all books - browse, search, filter by title/genre/author")
  .get("/:id", ({ params: { id } }) => `Get book ${id} with details, authors, genres`)
  .post("/", () => "Create new book (staff)")
  .patch("/:id", ({ params: { id } }) => `Update book ${id} (staff)`)
  .delete("/:id", ({ params: { id } }) => `Delete book ${id} (staff)`)

  // Book copies (physical instances)
  .get("/:id/copies", ({ params: { id } }) => `Get all copies of book ${id} with branch/status`)
  .post("/:id/copies", ({ params: { id } }) => `Add new copy of book ${id} (staff)`)
  .patch("/copies/:copyId", ({ params: { copyId } }) => `Update copy ${copyId} status (staff)`)

  // Authors
  .get("/:id/authors", ({ params: { id } }) => `Get authors for book ${id}`)
  .post("/:id/authors", ({ params: { id } }) => `Add author to book ${id} (staff)`)

  // Genres
  .get("/:id/genres", ({ params: { id } }) => `Get genres for book ${id}`)
  .post("/:id/genres", ({ params: { id } }) => `Add genre to book ${id} (staff)`)

  // Reviews
  .get("/:id/reviews", ({ params: { id } }) => `Get reviews for book ${id}`);
