import { Elysia } from "elysia";
import { CreateGenreSchema } from "./model";

export const genresModule = new Elysia({ prefix: "/genres" });

genresModule.get("/", () => {
  return { data: [] };
});

genresModule.get("/:id", ({ params: { id } }) => {
  return { data: { id: Number(id), name: "" } };
});

genresModule.post("/", ({ body }) => {
  return { data: { id: 0, name: body.name } };
}, {
  body: CreateGenreSchema,
});

genresModule.delete("/:id", ({ params: { id } }) => {
  return { message: `Genre ${id} deleted` };
});
