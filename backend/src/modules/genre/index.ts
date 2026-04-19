import {Elysia, t} from "elysia";

import {genreService} from "./service";
import { GenreCreationRequest } from "./model";

export const genreModule = new Elysia({ prefix: "/genres" });

genreModule.get("/", async ({ query: { page, pageSize } } ) => {
  return await genreService.findAll(page, pageSize);
}, {
  query: t.Object({page: t.Numeric({ minimum: 1 }), pageSize: t.Numeric({ minimum: 1 })})
});

genreModule.get("/:id", async ({ params: { id } }) => {
  return await genreService.findById(Number(id));
});

genreModule.post("/", async ({ body, set }) => {
  set.status = 201;
  return await genreService.create(body);
}, {
  body: GenreCreationRequest,
});

genreModule.delete("/:id", async ({ params: { id }, set }) => {
  await genreService.remove(Number(id));
  set.status = 204;
});
