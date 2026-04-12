import { Elysia } from "elysia";

export const authorsModule = new Elysia({ prefix: "/authors" })
  .get("/", () => "List all authors")
  .get("/:id", ({ params: { id } }) => `Get author ${id} with biography and books`);
