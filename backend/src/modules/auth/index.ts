import { Elysia } from "elysia";
import { eq } from "drizzle-orm";
import { cookie } from "@elysiajs/cookie";

import { UserRole } from "../../enums";
import { authService } from "./service";
import { sessionStoreManager } from "./session";
import { db, user as userTable } from "../../db";
import { LoginRequest, RegistrationRequest, UpdateProfileRequest, type LoginDTO, type RegistrationDTO, type UpdateProfileDTO } from "./model";

export const authModule = new Elysia({ prefix: "/auth" })
    .use(cookie());

authModule.post("/register", async ({ body, set }: { body: RegistrationDTO; set: any }) => {
    const user = await authService.register(body);
    set.status = 201;
    return { message: "User registered", userId: user.id };
}, {
    body: RegistrationRequest,
});

authModule.post("/login", async ({ body, cookie, set }: { body: LoginDTO; cookie: any; set: any }) => {
    const user = await authService.login(body);
    const sessionId = sessionStoreManager.create(user.id, user.role as UserRole);

    cookie.sessionId.set({
        value: sessionId,
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60,
    });

    return {
        data: {
            userId: user.id,
            role: user.role,
        }
    };
}, {
    body: LoginRequest,
});

authModule.post("/logout", async ({ cookie, set }: { cookie: any; set: any }) => {
    const sessionId = cookie.sessionId;
    if (sessionId) {
        await authService.logout(sessionId);
        cookie.sessionId.remove();
    }
    return { message: "Logged out" };
});

authModule.put("/me", async ({ body, cookie, set }: { body: UpdateProfileDTO; cookie: any; set: any }) => {
    const sessionCookie = cookie.sessionId;
    const sessionId = typeof sessionCookie === 'string' ? sessionCookie : sessionCookie?.value;

    if (!sessionId) {
        set.status = 401;
        return { message: "Unauthorized" };
    }

    const session = sessionStoreManager.get(sessionId);
    if (!session) {
        set.status = 401;
        return { message: "Unauthorized" };
    }

    const updated = await authService.updateProfile(session.userId, body);
    return {
        id: updated.id,
        role: updated.role,
        firstName: updated.firstName,
        lastName: updated.lastName,
        email: updated.email,
    };
}, {
    body: UpdateProfileRequest,
});

authModule.get("/me", async ({ cookie, set }: { cookie: any; set: any }) => {
    const sessionCookie = cookie.sessionId;
    const sessionId = typeof sessionCookie === 'string' ? sessionCookie : sessionCookie?.value;

    if (!sessionId) {
        set.status = 401;
        return { message: "Unauthorized" };
    }

    const session = sessionStoreManager.get(sessionId);
    if (!session) {
        set.status = 401;
        return { message: "Unauthorized" };
    }

    const [found] = await db.select().from(userTable).where(eq(userTable.id, session.userId));
    if (!found) {
        set.status = 404;
        return { message: "User not found" };
    }

    return {
        id: found.id,
        role: found.role,
        firstName: found.firstName,
        lastName: found.lastName,
        email: found.email,
    };
});
