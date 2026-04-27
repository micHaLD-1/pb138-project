import { Elysia } from "elysia";
import { cookie } from "@elysiajs/cookie";
import { LoginRequest, RegistrationRequest, type LoginDTO, type RegistrationDTO } from "./model";
import { authService } from "./service";
import { sessionStoreManager } from "./session";
import { UserRole } from "../../enums";

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
        httpOnly: true, // cookie nemoze citat JavaScript
        secure: false, // funguje aj na HTTP (nie len HTTPS)
        sameSite: 'lax', // posle sa len na rovnaku stranku
        maxAge: 24 * 60 * 60, // sekundy
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
        await authService.logout(sessionId); // zmaze session z pamate
        cookie.sessionId.remove(); // vymaze cookie z browsera
    }
    return { message: "Logged out" };
});
