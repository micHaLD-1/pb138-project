import { Elysia } from "elysia";
import { CreateReservationSchema, NotifySchema } from "./model";

export const reservationsModule = new Elysia({ prefix: "/reservations" });

reservationsModule.get("/my", () => {
  return { data: [] };
});

reservationsModule.post("/", ({ body }) => {
  return { data: { id: 0, userId: body.userId, bookCopyId: body.bookCopyId, fromDate: body.fromDate, toDate: body.toDate, price: body.price ?? null } };
}, {
  body: CreateReservationSchema,
});

reservationsModule.delete("/:id", ({ params: { id } }) => {
  return { message: `Reservation ${id} cancelled` };
});

reservationsModule.post("/notify", ({ body }) => {
  return { message: "Notification request registered" };
}, {
  body: NotifySchema,
});

// Staff endpoints
reservationsModule.get("/", () => {
  return { data: [] };
});

reservationsModule.delete("/staff/:id", ({ params: { id } }) => {
  return { message: `Reservation ${id} cancelled by staff` };
});
