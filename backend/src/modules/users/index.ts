import { Elysia } from "elysia";

export const usersModule = new Elysia({ prefix: "/users" })
  .get("/me", () => "Get my profile")
  .patch("/me", () => "Update my profile")
  .get("/me/fines", () => "My fines")
  .post("/me/fines/:id/pay", ({ params: { id } }) => `Pay fine ${id} online`)
  .get("/me/wishlist", () => "My wishlist")
  .post("/me/wishlist", () => "Add to wishlist");
