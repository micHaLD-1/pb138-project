import { Elysia } from "elysia";

export const branchesModule = new Elysia({ prefix: "/branches" })
  .get("/", () => "List all library branches with addresses")
  .get("/:id", ({ params: { id } }) => `Get branch ${id} details and available copies`);
