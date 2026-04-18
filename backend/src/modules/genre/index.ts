import {Elysia, t} from "elysia";

import {genreService} from "./service";
import { GenreCreationRequest } from "./model";

export const genreModule = new Elysia({ prefix: "/genres" });

// TODO - response
genreModule.get("/", async ({ query: { page, pageSize } } ) => {
  await genreService.findAll(page, pageSize);
}, {
  query: t.Object({page: t.Numeric({ minimum: 1 }), pageSize: t.Numeric({ minimum: 1 })})
});

// TODO - response
genreModule.get("/:id", async ({ params: { id } }) => {
  await genreService.findById(Number(id))
});

// TODO - response
genreModule.post("/", async ({ body, set }) => {
  await genreService.create(body);
  set.status = 201;
}, {
  body: GenreCreationRequest,
});

genreModule.delete("/:id", async ({ params: { id }, set }) => {
  await genreService.remove(Number(id));
  set.status = 204;
});
