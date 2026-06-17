import {Elysia, t} from "elysia";
import { cookie } from "@elysiajs/cookie";

import { UserRole } from "../../enums";
import {genreService} from "./service";
import { hasRole } from "../auth/middleware";
import { GenreCreationRequest } from "./model";
import { sessionStoreManager } from "../auth/session";

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

genreModule.post("/", async ({ body, set, user }) => {
  hasRole(user, [UserRole.ADMIN, UserRole.STAFF]);
  set.status = 201;
  return { genre: await genreService.create(body) };
}, {
  body: GenreCreationRequest,
});

genreModule.delete("/:id", async ({ params: { id }, set, user }) => {
  hasRole(user, [UserRole.ADMIN, UserRole.STAFF]);
  await genreService.remove(Number(id));
  set.status = 204;
});
