import {Elysia, t} from "elysia";
import { cookie } from "@elysiajs/cookie";

import {genreService} from "./service";
import { GenreCreationRequest } from "./model";
import { hasRole } from "../auth/middleware";
import { sessionStoreManager } from "../auth/session";
import { UserRole } from "../../enums";

export const genreModule = new Elysia({ prefix: "/genres" })
  .use(cookie())
  .derive(async ({ cookie }) => {
    const sessionCookie = cookie.sessionId;
    const sessionId = typeof sessionCookie === 'string' ? sessionCookie : sessionCookie?.value;
    
    if (!sessionId || typeof sessionId !== 'string') {
      return { user: null };
    }

    const session = sessionStoreManager.get(sessionId);
    if (!session) {
      return { user: null };
    }

    return {
      user: {
        userId: session.userId,
        role: session.role,
      }
    };
  });

genreModule.get("/", async ({ query: {page, size} }) => {
  return await genreService.findAll(page, size);
}, {
  query: t.Object({page: t.Numeric({ minimum: 1 }), size: t.Numeric({ minimum: 1 })})
});

genreModule.get("/:id", async ({ params: { id } }) => {
  return { genre: await genreService.findById(Number(id)) };
});

genreModule.post("/", async (ctx: any) => {
  hasRole(ctx.user, [UserRole.ADMIN, UserRole.STAFF]);
  ctx.set.status = 201;
  return { genre: await genreService.create(ctx.body) };
}, {
  body: GenreCreationRequest,
});

genreModule.delete("/:id", async (ctx: any) => {
  hasRole(ctx.user, [UserRole.ADMIN, UserRole.STAFF]);
  await genreService.remove(Number(ctx.params.id));
  ctx.set.status = 204;
});
