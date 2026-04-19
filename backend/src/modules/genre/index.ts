import {Elysia, t} from "elysia";

import {genreService} from "./service";
import { GenreCreationRequest } from "./model";

export const genreModule = new Elysia({ prefix: "/genres" });

genreModule.get("/", async ({ query: {page, size} }) => {
  return await genreService.findAll(page, size);
}, {
  query: t.Object({page: t.Numeric({ minimum: 1 }), size: t.Numeric({ minimum: 1 })})
});

genreModule.get("/:id", async ({ params: { id } }) => {
  return { genre: await genreService.findById(Number(id)) };
});

genreModule.post("/", async ({ body, set }) => {
  set.status = 201;
  return { genre: await genreService.create(body) };
}, {
  body: GenreCreationRequest,
});

genreModule.delete("/:id", async ({ params: { id }, set }) => {
  await genreService.remove(Number(id));
  set.status = 204;
});
