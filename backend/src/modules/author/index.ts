import { Elysia, t } from "elysia";

import { authorService } from "./service";
import {AuthorCreationRequest, AuthorUpdateRequest} from "./model";

export const authorModule = new Elysia({ prefix: "/authors" });

authorModule.get("/", async ({ query: {page, size} }) => {
  return await authorService.findAll(page, size);
}, {
  query: t.Object({page: t.Numeric({ minimum: 1 }), size: t.Numeric({ minimum: 1 })})
});

authorModule.get("/:id", async ({ params: { id } }) => {
  return { author: await authorService.findById(Number(id)) };
});

authorModule.post("/", async ({ body, set }) => {
  set.status = 201;
  return { author: await authorService.create(body) };
}, {
  body: AuthorCreationRequest,
});

authorModule.put("/:id", async ({ params: { id }, body, set }) => {
  await authorService.update(Number(id), body);
  set.status = 204;
}, {
  body: AuthorUpdateRequest,
});

authorModule.delete("/:id", async ({ params: { id }, set }) => {
  await authorService.remove(Number(id));
  set.status = 204;
});
