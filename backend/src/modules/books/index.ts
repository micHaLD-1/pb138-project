import { Elysia } from "elysia";

export const booksModule = new Elysia({ prefix: "/books" })
  .get("/", () => "List all books - browse, search, filter")
  .get("/:id", ({ params: { id } }) => `Get book ${id} with details`)
  .get("/:id/availability", ({ params: { id } }) => `Check availability for book ${id}`)
  .get("/:id/reviews", ({ params: { id } }) => `Get reviews for book ${id}`);
