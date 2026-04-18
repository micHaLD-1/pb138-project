import { Elysia } from "elysia";
import { LoanCreationRequest } from "./model";

export const loansModule = new Elysia({ prefix: "/loans" });

// User endpoints
loansModule.get("/my", () => {
  return { data: [] };
});

loansModule.get("/history", () => {
  return { data: [] };
});

loansModule.get("/due", () => {
  return { data: [] };
});

loansModule.post("/:id/extend", ({ params: { id } }) => {
  return { data: { id: Number(id), userId: 0, bookCopyId: 0, loanDate: "", dueDate: "", returnDate: null, price: null } };
});

// Staff endpoints
loansModule.post("/", ({ body }) => {
  return { data: { id: 0, userId: body.userId, bookCopyId: body.bookCopyId, loanDate: body.loanDate, dueDate: body.dueDate, returnDate: null, price: body.price ?? null } };
}, {
  body: LoanCreationRequest,
});

loansModule.patch("/:id/return", ({ params: { id } }) => {
  return { data: { id: Number(id), userId: 0, bookCopyId: 0, loanDate: "", dueDate: "", returnDate: new Date().toISOString(), price: null } };
});
