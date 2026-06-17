import { Elysia, t } from "elysia";
import { cookie } from "@elysiajs/cookie";

import { UserRole } from "../../enums";
import { hasRole } from "../auth/middleware";
import { publisherService } from "./service";
import { sessionStoreManager } from "../auth/session";
import { PublisherCreationRequest, PublisherUpdateRequest } from "./model";

export const publisherModule = new Elysia({ prefix: "/publishers" })
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

publisherModule.get("/", async ({ query: { page, size } }) => {
    return await publisherService.findAll(page, size);
}, {
    query: t.Object({ page: t.Numeric({ minimum: 1 }), size: t.Numeric({ minimum: 1, maximum: 100 }) })
});

publisherModule.get("/:id", async ({ params: { id } }) => {
    return { publisher: await publisherService.findById(Number(id)) };
});

publisherModule.post("/", async ({ body, set, user }) => {
    hasRole(user, [UserRole.ADMIN, UserRole.STAFF]);
    set.status = 201;
    return { publisher: await publisherService.create(body) };
}, {
    body: PublisherCreationRequest
});

publisherModule.put("/:id", async ({ params: { id }, body, set, user }) => {
    hasRole(user, [UserRole.ADMIN, UserRole.STAFF]);
    await publisherService.update(Number(id), body);
    set.status = 204;
}, {
    body: PublisherUpdateRequest
});

publisherModule.delete("/:id", async ({ params: { id }, set, user }) => {
    hasRole(user, [UserRole.ADMIN, UserRole.STAFF]);
    await publisherService.remove(Number(id));
    set.status = 204;
});
