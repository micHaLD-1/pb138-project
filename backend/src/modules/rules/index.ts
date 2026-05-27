import { Elysia, t } from "elysia";
import { cookie } from "@elysiajs/cookie";

import { UserRole } from "../../enums";
import { hasRole } from "../auth/middleware";

import { rulesService } from "./service";
import { RulesUpdateRequest } from "./model";
import { sessionStoreManager } from "../auth/session";

export const rulesModule = new Elysia({ prefix: "/rules" })
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

rulesModule.get("/", async () => {
  return await rulesService.getAll();
});

rulesModule.put("/", async (ctx: any) => {
  hasRole(ctx.user, [UserRole.ADMIN]);
  ctx.set.status = 200;
  return await rulesService.update(ctx.body, ctx.user.role);
}, {
  body: RulesUpdateRequest
});
