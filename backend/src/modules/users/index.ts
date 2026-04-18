import { Elysia } from "elysia";
import { ChangePasswordSchema, CreateReviewSchema, UpdateProfileSchema } from "./model";

export const usersModule = new Elysia({ prefix: "/users" });

usersModule.get("/me", () => {
  return { data: { id: 0, name: "", email: "", role: "member", contact: null } };
});

usersModule.patch("/me", ({ body }) => {
  return { data: { id: 0, name: body.name ?? "", email: body.email ?? "", role: "member", contact: body.contact ?? null } };
}, {
  body: UpdateProfileSchema,
});

usersModule.patch("/me/password", ({ body }) => {
  return { message: "Password changed" };
}, {
  body: ChangePasswordSchema,
});

usersModule.get("/me/fines", () => {
  return { data: [] };
});

usersModule.post("/me/fines/:id/pay", ({ params: { id } }) => {
  return { data: { id: Number(id), userId: 0, amount: 0, description: null, status: "paid" } };
});

usersModule.get("/me/reviews", () => {
  return { data: [] };
});

usersModule.post("/me/reviews", ({ body }) => {
  return { data: { id: 0, userId: 0, bookId: body.bookId, text: body.text ?? null, rating: body.rating, createdAt: new Date().toISOString() } };
}, {
  body: CreateReviewSchema,
});

usersModule.get("/me/notifications", () => {
  return { data: [] };
});
