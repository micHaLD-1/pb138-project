import { Elysia } from "elysia";
import { LoginSchema, RegisterSchema } from "./model";

export const authModule = new Elysia({ prefix: "/auth" });

authModule.post("/register", ({ body }) => {
  return { message: "User registered" };
}, {
  body: RegisterSchema,
});

authModule.post("/login", ({ body }) => {
  return { data: { token: "", userId: 0, role: "member" } };
}, {
  body: LoginSchema,
});

authModule.post("/logout", () => {
  return { message: "Logged out" };
});
