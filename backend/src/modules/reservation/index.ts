import {Elysia, t} from "elysia";

import {reservationService} from "./service";
import {ReservationCreationRequest, ReservationUpdateRequest} from "./model";

export const reservationModule = new Elysia({ prefix: "/reservations" });

// TODO - response
reservationModule.get("/", async ({ query: { page, pageSize } } ) => {
 await reservationService.findAll(page, pageSize);
}, {
  query: t.Object({page: t.Numeric({ minimum: 1 }), pageSize: t.Numeric({ minimum: 1 })})
});

// TODO - response
reservationModule.get("/:id", async ({ params: { id } }) => {
  await reservationService.findById(Number(id));
});

// TODO - response
reservationModule.post("/", async ({ body, set }) => {
  await reservationService.create(body);
  set.status = 201;
}, {
  body: ReservationCreationRequest,
});

reservationModule.put("/:id", async ({ params: { id }, body, set }) => {
  await reservationService.update(Number(id), body);
  set.status = 204;
}, {
  body: ReservationUpdateRequest,
});

// Moja teoria - pri reservation uvidi zamestnanec button CANCEL, ked klikne, tak sa oznaci reservation ako CANCELED a zneaktivny sa
reservationModule.put("/:id/cancel", async ({ params: { id }, set }) => {
  await reservationService.cancel(Number(id));
  set.status = 204;
});
