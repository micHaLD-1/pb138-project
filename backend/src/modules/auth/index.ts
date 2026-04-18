import { Elysia } from "elysia";
import { LoginRequest, RegistrationRequest } from "./model";

export const authModule = new Elysia({ prefix: "/auth" });

authModule.post("/register", ({ body }) => {
  return { message: "User registered" };
}, {
  body: RegistrationRequest,
});

authModule.post("/login", ({ body }) => {
  return { data: { token: "", userId: 0, role: "member" } };
}, {
  body: LoginRequest,
});

authModule.post("/logout", () => {
  return { message: "Logged out" };
});
