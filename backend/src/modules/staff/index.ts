import { Elysia } from "elysia";

export const staffModule = new Elysia({ prefix: "/staff" })
  .post("/books", () => "Add new book")
  .delete("/reservations/:id", ({ params: { id } }) => `Cancel reservation ${id} for user`)
  .patch("/books/:id/status", ({ params: { id } }) => `Mark book ${id} as lost/damaged`)
  .get("/stats", () => "All statistics")
  .get("/waiting-lists", () => "View waiting lists")
  .patch("/fines/:id", ({ params: { id } }) => `Update fine ${id}`)
  .post("/notifications", () => "Send notification to user")
  .post("/newsletter", () => "Send newsletter");
