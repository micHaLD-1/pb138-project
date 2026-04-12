import { Elysia } from "elysia";

export const genresModule = new Elysia({ prefix: "/genres" })
  .get("/", () => "List all genres")
  .get("/:id", ({ params: { id } }) => `Get genre ${id} and books in this genre`);
