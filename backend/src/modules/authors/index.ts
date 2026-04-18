import { Elysia } from "elysia";
import { authorsService } from "./service";
import {AuthorCreationRequest, AuthorUpdateRequest} from "./model";

export const authorsModule = new Elysia({ prefix: "/authors" });

authorsModule.get("/", async () => {
  return { authors: await authorsService.findAll() };
});

authorsModule.get("/:id", async ({ params: { id } }) => {
  return { author: await authorsService.findById(Number(id)) };
});

authorsModule.post("/", async ({ body, set }) => {
  set.status = 201;
  return { author: await authorsService.create(body) };
}, {
  body: AuthorCreationRequest,
});

authorsModule.put("/:id", async ({ params: { id }, body, set }) => {
  await authorsService.update(Number(id), body);
  set.status = 204;
}, {
  body: AuthorUpdateRequest,
});

authorsModule.delete("/:id", async ({ params: { id }, set }) => {
  await authorsService.remove(Number(id));
  set.status = 204;
});
