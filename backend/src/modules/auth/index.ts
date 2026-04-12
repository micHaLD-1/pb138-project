import { Elysia } from "elysia";

export const authModule = new Elysia({ prefix: "/auth" })
  .post("/register", () => "Register endpoint")
  .post("/login", () => "Login endpoint")
  .post("/logout", () => "Logout endpoint");
