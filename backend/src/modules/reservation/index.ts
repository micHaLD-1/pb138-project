import {Elysia, t} from "elysia";
import {cookie} from "@elysiajs/cookie";

import {reservationService} from "./service";
import {ReservationCreationRequest, ReservationUpdateRequest} from "./model";
import {isAuthenticated, hasRole} from "../auth/middleware";
import {UserRole} from "../../enums";
import {sessionStoreManager} from "../auth/session";
import {ForbiddenError} from "../../errors";

export const reservationModule = new Elysia({ prefix: "/reservations" })
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

reservationModule.get("/", async ({ query: { page, pageSize }, user } ) => {
  hasRole(user, [UserRole.ADMIN, UserRole.STAFF]);
  return await reservationService.findAll(page, pageSize);
}, {
  query: t.Object({page: t.Numeric({ minimum: 1 }), pageSize: t.Numeric({ minimum: 1, maximum: 100 })})
});

reservationModule.get("/me", async ({ query: { page, pageSize }, user }) => {
  isAuthenticated(user);
  return await reservationService.findByUserId(user!.userId, page, pageSize);
}, {
  query: t.Object({page: t.Numeric({ minimum: 1 }), pageSize: t.Numeric({ minimum: 1, maximum: 100 })})
});

reservationModule.get("/:id", async ({ params: { id }, user }) => {
  hasRole(user, [UserRole.ADMIN, UserRole.STAFF]);
  return await reservationService.findById(Number(id));
});

reservationModule.post("/", async ({ body, set, user }) => {
  isAuthenticated(user);
  const result = await reservationService.create(body, user!.userId);
  set.status = 201;
  return result;
}, {
  body: ReservationCreationRequest,
});

reservationModule.put("/:id", async ({ params: { id }, body, set, user }) => {
  hasRole(user, [UserRole.ADMIN, UserRole.STAFF]);
  await reservationService.update(Number(id), body);
  set.status = 204;
}, {
  body: ReservationUpdateRequest,
});

reservationModule.put("/:id/cancel", async ({ params: { id }, set, user }) => {
  isAuthenticated(user);

  if (user!.role !== UserRole.ADMIN && user!.role !== UserRole.STAFF) {
    const reservation = await reservationService.findById(Number(id));
    if (reservation.userId !== user!.userId) {
      throw new ForbiddenError("Forbidden: you can only cancel your own reservations");
    }
  }

  await reservationService.cancel(Number(id));
  set.status = 204;
});