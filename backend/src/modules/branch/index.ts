import {Elysia, t} from "elysia";

import {branchService} from "./service";
import {BranchCreationRequest, BranchUpdateRequest} from "./model";

export const branchModule = new Elysia({ prefix: "/branches" });

// TODO - response
branchModule.get("/", async ({ query: { page, pageSize } } ) => {
  await branchService.findAll(page, pageSize);
}, {
  query: t.Object({page: t.Numeric({ minimum: 1 }), pageSize: t.Numeric({ minimum: 1 })})
});

// TODO - response
branchModule.get("/:id", async ({ params: { id } }) => {
  await branchService.findById(Number(id));
});

// TODO - response
branchModule.post("/", async ({ body, set}) => {
  await branchService.create(body);
  set.status = 201;
}, {
  body: BranchCreationRequest,
});

branchModule.put("/:id", async ({ params: { id }, body, set }) => {
  await branchService.update(Number(id), body);
  set.status = 204;
}, {
  body: BranchUpdateRequest,
});

branchModule.delete("/:id", async ({ params: { id }, set }) => {
  await branchService.remove(Number(id));
  set.status = 204;
});
