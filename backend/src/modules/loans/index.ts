import { Elysia } from "elysia";

export const loansModule = new Elysia({ prefix: "/loans" })
  .get("/my", () => "My current loans")
  .get("/history", () => "My loan history")
  .post("/:id/extend", ({ params: { id } }) => `Extend loan ${id}`)
  .get("/due-dates", () => "Get due dates and notifications");
