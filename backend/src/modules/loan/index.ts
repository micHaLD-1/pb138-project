import {Elysia, t} from "elysia";

import {loanService} from "./service";
import {LoanCreationRequest, LoanUpdateRequest} from "./model";

export const loanModule = new Elysia({ prefix: "/loans" });

// TODO - response
loanModule.get("/", async ({ query: { page, pageSize } } ) => {
  await loanService.findAll(page, pageSize);
}, {
  query: t.Object({page: t.Numeric({ minimum: 1 }), pageSize: t.Numeric({ minimum: 1 })})
});

// TODO - response
loanModule.get("/:id", async ({ params: { id } }) => {
 await loanService.findById(Number(id));
});

// TODO - response
loanModule.post("/", async ({ body, set }) => {
  await loanService.create(body);
  set.status = 201;
}, {
  body: LoanCreationRequest,
});

loanModule.put("/:id", async ({ params: { id }, body, set }) => {
  await loanService.update(Number(id), body);
  set.status = 204;
}, {
  body: LoanUpdateRequest,
});

// Moja teoria - pri loane uvidi zamestnanec button RETURN, ked klikne, tak sa oznaci loan ako RETURNED a dá sa tam aktualny datum
loanModule.put("/:id/return", async ({ params: { id }, set }) => {
  await loanService.return(Number(id));
  set.status = 204;
});

// Moja teoria - pri loane uvidi zamestnanec button REVERT, ked klikne, tak sa oznaci loan ako PENDING a zmaže sa datum
loanModule.put("/:id/revert", async ({ params: { id }, set }) => {
  await loanService.revert(Number(id));
  set.status = 204;
});

// Moja teoria - pri loane uvidi zamestnanec button CANCEL, ked klikne, tak sa oznaci loan ako CANCELED a zneaktivny sa
loanModule.put("/:id/cancel", async ({ params: { id }, set }) => {
  await loanService.cancel(Number(id));
  set.status = 204;
});
