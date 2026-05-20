import { Elysia, t } from "elysia";
import { cookie } from "@elysiajs/cookie";

import { authorService } from "./service";
import {AuthorCreationRequest, AuthorUpdateRequest} from "./model";
import { hasRole } from "../auth/middleware";
import { sessionStoreManager } from "../auth/session";
import { UserRole } from "../../enums";

export const authorModule = new Elysia({ prefix: "/authors" })
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
