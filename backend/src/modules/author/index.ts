import { Elysia, t } from "elysia";
import { cookie } from "@elysiajs/cookie";

import { UserRole } from "../../enums";
import { authorService } from "./service";
import { hasRole } from "../auth/middleware";
import { sessionStoreManager } from "../auth/session";
import {AuthorCreationRequest, AuthorUpdateRequest} from "./model";

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

authorModule.get("/", async ({ query: {page, size, name} }) => {
  return await authorService.findAll(page, size, name);
}, {
    query: t.Object({
        page: t.Numeric({ minimum: 1 }),
        size: t.Numeric({ minimum: 1, maximum: 100 }),
        name: t.Optional(t.String({minLength: 3}))
    })
});

authorModule.get("/:id", async ({ params: { id } }) => {
  return { author: await authorService.findById(Number(id)) };
});

authorModule.post("/", async ({ body, set, user }) => {
  hasRole(user, [UserRole.ADMIN, UserRole.STAFF]);
  set.status = 201;
  return { author: await authorService.create(body) };
}, {
  body: AuthorCreationRequest,
});

authorModule.put("/:id", async ({ params: { id }, body, set, user }) => {
  hasRole(user, [UserRole.ADMIN, UserRole.STAFF]);
  await authorService.update(Number(id), body);
  set.status = 204;
}, {
  body: AuthorUpdateRequest,
});

authorModule.delete("/:id", async ({ params: { id }, set, user }) => {
  hasRole(user, [UserRole.ADMIN, UserRole.STAFF]);
  await authorService.remove(Number(id));
  set.status = 204;
});
