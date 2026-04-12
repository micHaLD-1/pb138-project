import { Elysia } from "elysia";

export const usersModule = new Elysia({ prefix: "/users" })
  // Profile management
  .get("/me", () => "Get my profile (name, email, contact)")
  .patch("/me", () => "Update my profile")
  .patch("/me/password", () => "Change password")

  // Fines
  .get("/me/fines", () => "My fines")
  .post("/me/fines/:id/pay", ({ params: { id } }) => `Pay fine ${id} online`)

  // Reviews
  .get("/me/reviews", () => "My reviews")
  .post("/me/reviews", () => "Write review for a book")

  // Notifications
  .get("/me/notifications", () => "My notifications");
