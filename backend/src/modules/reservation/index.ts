import {Elysia, t} from "elysia";

import {reservationService} from "./service";
import {ReservationCreationRequest, ReservationUpdateRequest} from "./model";

export const reservationModule = new Elysia({ prefix: "/reservations" });

reservationModule.get("/", async ({ query: { page, pageSize } } ) => {
  return await reservationService.findAll(page, pageSize);
}, {
  query: t.Object({page: t.Numeric({ minimum: 1 }), pageSize: t.Numeric({ minimum: 1, maximum: 100 })})
});

reservationModule.get("/:id", async ({ params: { id } }) => {
  return await reservationService.findById(Number(id));
});

reservationModule.post("/", async ({ body, set }) => {
  const result = await reservationService.create(body);
  set.status = 201;
  return result;
}, {
  body: ReservationCreationRequest,
});

reservationModule.put("/:id", async ({ params: { id }, body, set }) => {
  await reservationService.update(Number(id), body);
  set.status = 204;
}, {
  body: ReservationUpdateRequest,
});

reservationModule.put("/:id/cancel", async ({ params: { id }, set }) => {
  await reservationService.cancel(Number(id));
  set.status = 204;
});
