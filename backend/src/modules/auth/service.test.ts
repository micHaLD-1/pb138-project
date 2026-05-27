import { describe, test, expect, mock, beforeEach } from "bun:test";

import { db } from "../../db";
import { UserRole } from "../../enums";
import { authService } from "./service";
import { sessionStoreManager } from "./session";
import { ConflictError, UnprocessableError } from "../../errors";

const mockDb = {
    select: mock(),
    insert: mock(),
    update: mock()
};

mock.module("../../db", () => ({
    db: mockDb,
    user: { id: "id", role: "role", email: "email", passwordHash: "passwordHash" }
}));

mock.module("./session", () => ({
    sessionStoreManager: {
        delete: mock()
    }
}));

const setupSelectMock = (returnValues: any[]) => {
    const whereMock = mock().mockResolvedValue(returnValues);
    const fromMock = mock().mockImplementation(() => {
        const promise = Promise.resolve(returnValues) as any;
        promise.where = whereMock;
        return promise;
    });
    (db.select as any).mockReturnValue({ from: fromMock });
    return { fromMock, whereMock };
};

const setupInsertMock = (returnValues: any[]) => {
    const returningMock = mock().mockResolvedValue(returnValues);
    const valuesMock = mock().mockReturnValue({ returning: returningMock });
    (db.insert as any).mockReturnValue({ values: valuesMock });
    return valuesMock;
};

const setupUpdateMock = (returnValues: any[]) => {
    const returningMock = mock().mockResolvedValue(returnValues);
    const whereMock = mock().mockReturnValue({ returning: returningMock });
    const setMock = mock().mockReturnValue({ where: whereMock });
    (db.update as any).mockReturnValue({ set: setMock });
    return { returningMock, whereMock, setMock };
};

describe("Auth Service", () => {

    beforeEach(() => {
        (db.select as any).mockClear();
        (db.insert as any).mockClear();
        (db.update as any).mockClear();
        (sessionStoreManager.delete as any).mockClear();
    });

    describe("initializeDefaults()", () => {

        test("should resolve successfully", async () => {
            await expect(authService.initializeDefaults()).resolves.toBeUndefined();
        });
    });

    describe("register()", () => {

        const registrationData = {
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
            password: "password123",
            phone: "123456789"
        };

        test("should throw ConflictError if email is already registered", async () => {
            setupSelectMock([{ id: 1, email: "john@example.com" }]);

            expect(authService.register(registrationData)).rejects.toThrow(ConflictError);
            expect(db.insert).not.toHaveBeenCalled();
        });

        test("should successfully register member and hash password", async () => {
            setupSelectMock([]);
            setupInsertMock([{ id: 2, ...registrationData, role: UserRole.MEMBER }]);

            const result = await authService.register(registrationData);

            expect(result.id).toBe(2);
            expect(db.insert).toHaveBeenCalledTimes(1);
        });
    });

    describe("login()", () => {

        test("should throw UnprocessableError if email is not found", async () => {
            setupSelectMock([]);
            expect(authService.login({ email: "wrong@email.com", password: "pwd" })).rejects.toThrow(UnprocessableError);
        });

        test("should throw UnprocessableError if password does not match hash", async () => {
            const passwordHash = await Bun.password.hash("correct-password");
            setupSelectMock([{ id: 1, email: "john@example.com", passwordHash }]);

            expect(authService.login({ email: "john@example.com", password: "wrong-password" })).rejects.toThrow(UnprocessableError);
        });

        test("should successfully log in with correct credentials", async () => {
            const passwordHash = await Bun.password.hash("correct-password");
            setupSelectMock([{ id: 1, email: "john@example.com", passwordHash }]);

            const result = await authService.login({ email: "john@example.com", password: "correct-password" });

            expect(result.id).toBe(1);
            expect(result.email).toBe("john@example.com");
        });
    });

    describe("updateProfile()", () => {

        const profileData = { firstName: "Jane", lastName: "Smith" };

        test("should successfully update profile", async () => {
            setupUpdateMock([{ id: 1, firstName: "Jane", lastName: "Smith" }]);

            const result = await authService.updateProfile(1, profileData);

            expect(result.id).toBe(1);
            expect(db.update).toHaveBeenCalledTimes(1);
        });

        test("should throw error if user to update does not exist", async () => {
            setupUpdateMock([]); // returning empty array

            expect(authService.updateProfile(999, profileData)).rejects.toThrow("User not found");
        });
    });

    describe("logout()", () => {

        test("should call session store manager to delete session", async () => {
            await authService.logout("test-session-id");
            expect(sessionStoreManager.delete).toHaveBeenCalledWith("test-session-id");
        });
    });
});
