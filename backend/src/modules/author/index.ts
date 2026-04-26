import { Elysia, t } from "elysia";

import { authorService } from "./service";
import {AuthorCreationRequest, AuthorUpdateRequest} from "./model";
import { authMiddleware, hasRole } from "../auth/middleware";
import { UserRole } from "../../enums";

export const authorModule = new Elysia({ prefix: "/authors" })
  .use(authMiddleware);

authorModule.get("/", async ({ query: {page, size} }) => {
  return await authorService.findAll(page, size);
}, {
  query: t.Object({page: t.Numeric({ minimum: 1 }), size: t.Numeric({ minimum: 1 })})
});

authorModule.get("/:id", async ({ params: { id } }) => {
  return { author: await authorService.findById(Number(id)) };
});

authorModule.post("/", async (ctx: any) => {
  hasRole(ctx.user, [UserRole.ADMIN, UserRole.STAFF]);
  ctx.set.status = 201;
  return { author: await authorService.create(ctx.body) };
}, {
  body: AuthorCreationRequest,
});

authorModule.put("/:id", async (ctx: any) => {
  hasRole(ctx.user, [UserRole.ADMIN, UserRole.STAFF]);
  await authorService.update(Number(ctx.params.id), ctx.body);
  ctx.set.status = 204;
}, {
  body: AuthorUpdateRequest,
});

authorModule.delete("/:id", async (ctx: any) => {
  hasRole(ctx.user, [UserRole.ADMIN, UserRole.STAFF]);
  await authorService.remove(Number(ctx.params.id));
  ctx.set.status = 204;
});
