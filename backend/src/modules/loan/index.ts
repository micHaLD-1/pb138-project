import {Elysia, t} from "elysia";

import {loanService} from "./service";
import {LoanCreationRequest, LoanUpdateRequest} from "./model";

export const loanModule = new Elysia({ prefix: "/loans" });

loanModule.get("/", async ({ query: {page, size} }) => {
  return await loanService.findAll(page, size);
}, {
  query: t.Object({page: t.Numeric({ minimum: 1 }), size: t.Numeric({ minimum: 1 })})
});

loanModule.get("/:id", async ({ params: { id } }) => {
  return { loan: await loanService.findById(Number(id)) };
});

loanModule.post("/", async ({ body, set }) => {
  set.status = 201;
  return { loan: await loanService.create(body) };
}, {
  body: LoanCreationRequest,
});

loanModule.put("/:id", async ({ params: { id }, body, set }) => {
  await loanService.update(Number(id), body);
  set.status = 204;
}, {
  body: LoanUpdateRequest,
});

loanModule.put("/:id/return", async ({ params: { id }, set }) => {
  await loanService.return(Number(id));
  set.status = 204;
});

loanModule.put("/:id/revert", async ({ params: { id }, set }) => {
  await loanService.revert(Number(id));
  set.status = 204;
});

loanModule.put("/:id/cancel", async ({ params: { id }, set }) => {
  await loanService.cancel(Number(id));
  set.status = 204;
});
