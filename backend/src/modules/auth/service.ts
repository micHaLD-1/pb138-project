import { eq } from "drizzle-orm";
import { db, user } from "../../db";

import type { RegistrationDTO, LoginDTO } from "./model";
import { ConflictError, UnprocessableError } from "../../errors";
import { UserRole } from "../../enums";
import { sessionStoreManager } from "./session";

export const authService = {

    initializeDefaults: async () => {
        return;
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

    updateProfile: async (userId: number, data: { firstName: string; lastName: string }) => {
        const [updated] = await db
            .update(user)
            .set({ firstName: data.firstName, lastName: data.lastName })
            .where(eq(user.id, userId))
            .returning();

        if (!updated) throw new Error("User not found");
        return updated;
    },

    logout: async (sessionId: string) => {
        sessionStoreManager.delete(sessionId);
    }
};
