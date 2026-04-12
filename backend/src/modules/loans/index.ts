import { Elysia } from "elysia";

export const loansModule = new Elysia({ prefix: "/loans" })
  // User endpoints
  .get("/my", () => "My current loans with book copy details")
  .get("/history", () => "My loan history")
  .post("/:id/extend", ({ params: { id } }) => `Extend loan ${id} due date`)
  .get("/due", () => "Get upcoming due dates")

  // Staff endpoints
  .post("/", () => "Create loan - checkout book copy (staff)")
  .patch("/:id/return", ({ params: { id } }) => `Mark loan ${id} as returned (staff)`);
