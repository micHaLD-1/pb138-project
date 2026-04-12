import { Elysia } from "elysia";

export const reservationsModule = new Elysia({ prefix: "/reservations" })
  .get("/my", () => "My reservations")
  .post("/", () => "Create reservation")
  .delete("/:id", ({ params: { id } }) => `Cancel reservation ${id}`)
  .post("/notify", () => "Request notification when book available");
