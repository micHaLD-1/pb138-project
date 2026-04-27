import { eq } from "drizzle-orm";
import { db, user } from "../../db";

import type { RegistrationDTO, LoginDTO } from "./model";
import { ConflictError, UnprocessableError } from "../../errors";
import { UserRole } from "../../enums";
import { sessionStoreManager } from "./session";

export const authService = {

    initializeDefaults: async () => {
        const [existingAdmin] = await db.select().from(user).where(eq(user.role, UserRole.ADMIN));
        if (existingAdmin) {
            console.log("Admin user already exists, skipping creation");
            return;
        }

        const passwordHash = await Bun.password.hash("admin123");
        const [adminUser] = await db.insert(user).values({
            email: "admin@library.com",
            passwordHash,
            firstName: "Admin",
            lastName: "User",
            role: UserRole.ADMIN
        }).returning();

        console.log(`Default admin created: ${adminUser.email} / password: admin123`);
    },

    register: async (data: RegistrationDTO) => {
        const [existing] = await db.select().from(user).where(eq(user.email, data.email));
        if (existing) throw new ConflictError("Email already registered");

        const passwordHash = await Bun.password.hash(data.password);

        const [newUser] = await db.insert(user).values({
            ...data,
            passwordHash,
            role: UserRole.MEMBER
        }).returning();

        return newUser;
    },

    login: async (data: LoginDTO) => {
        const [foundUser] = await db.select().from(user).where(eq(user.email, data.email));
        if (!foundUser) throw new UnprocessableError("Invalid email or password");

        const isPasswordValid = await Bun.password.verify(data.password, foundUser.passwordHash);
        if (!isPasswordValid) throw new UnprocessableError("Invalid email or password");

        return foundUser;
    },

    logout: async (sessionId: string) => {
        sessionStoreManager.delete(sessionId); // toto by mohlo byt kludne aj rovno v index ale clarity
    }
};
