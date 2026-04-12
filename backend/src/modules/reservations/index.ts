import { Elysia } from "elysia";

export const reservationsModule = new Elysia({ prefix: "/reservations" })
  // User endpoints
  .get("/my", () => "My reservations with book copy details")
  .post("/", () => "Create reservation for a book copy")
  .delete("/:id", ({ params: { id } }) => `Cancel reservation ${id}`)

  // Staff endpoints
  .get("/", () => "List all reservations (staff)")
  .delete("/staff/:id", ({ params: { id } }) => `Cancel reservation ${id} for user (staff)`)

  // Notifications
  .post("/notify", () => "Request notification when book available");
