import { Elysia } from "elysia";
import {
  CreateAuthorSchema,
  CreateBranchSchema,
  CreateCopySchema,
  CreateGenreSchema,
  CreatePublisherSchema,
  SendNewsletterSchema,
  SendNotificationSchema,
  UpdateAuthorSchema,
  UpdateBranchSchema,
  UpdateCopyStatusSchema,
  UpdateFineSchema,
} from "./model";

export const staffModule = new Elysia({ prefix: "/staff" });

staffModule.post("/copies", ({ body }) => {
  return { data: { id: 0, bookId: body.bookId, branchId: body.branchId, status: "available" } };
}, {
  body: CreateCopySchema,
});

staffModule.patch("/copies/:id", ({ params: { id }, body }) => {
  return { data: { id: Number(id), bookId: 0, branchId: 0, status: body.status } };
}, {
  body: UpdateCopyStatusSchema,
});

staffModule.delete("/copies/:id", ({ params: { id } }) => {
  return { message: `Copy ${id} removed` };
});

// Branch management
staffModule.get("/branches", () => {
  return { data: [] };
});

staffModule.post("/branches", ({ body }) => {
  return { data: { id: 0, name: body.name, address: body.address ?? null, contact: body.contact ?? null } };
}, {
  body: CreateBranchSchema,
});

staffModule.patch("/branches/:id", ({ params: { id }, body }) => {
  return { data: { id: Number(id), name: body.name ?? "", address: body.address ?? null, contact: body.contact ?? null } };
}, {
  body: UpdateBranchSchema,
});

// Author management
staffModule.get("/authors", () => {
  return { data: [] };
});

staffModule.post("/authors", ({ body }) => {
  return { data: { id: 0, name: body.name } };
}, {
  body: CreateAuthorSchema,
});

staffModule.patch("/authors/:id", ({ params: { id }, body }) => {
  return { data: { id: Number(id), name: body.name } };
}, {
  body: UpdateAuthorSchema,
});

// Genre management
staffModule.get("/genres", () => {
  return { data: [] };
});

staffModule.post("/genres", ({ body }) => {
  return { data: { id: 0, name: body.name } };
}, {
  body: CreateGenreSchema,
});

// Publisher management
staffModule.get("/publishers", () => {
  return { data: [] };
});

staffModule.post("/publishers", ({ body }) => {
  return { data: { id: 0, name: body.name } };
}, {
  body: CreatePublisherSchema,
});

// Reservation management
staffModule.delete("/reservations/:id", ({ params: { id } }) => {
  return { message: `Reservation ${id} cancelled` };
});

// Fine management
staffModule.patch("/fines/:id", ({ params: { id }, body }) => {
  return { data: { id: Number(id), userId: 0, amount: body.amount, description: body.description ?? null, status: body.status } };
}, {
  body: UpdateFineSchema,
});

// Notifications
staffModule.post("/notifications", ({ body }) => {
  return { message: `Notification sent to user ${body.userId}` };
}, {
  body: SendNotificationSchema,
});

staffModule.post("/newsletter", ({ body }) => {
  return { message: "Newsletter sent" };
}, {
  body: SendNewsletterSchema,
});

// Statistics
staffModule.get("/stats", () => {
  return { data: {} };
});

staffModule.get("/stats/books", () => {
  return { data: {} };
});

staffModule.get("/stats/loans", () => {
  return { data: {} };
});
