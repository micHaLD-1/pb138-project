import { describe, test, expect, mock, beforeEach } from "bun:test";

import { db } from "../../db";
import { UserRole } from "../../enums";
import { rulesService } from "./service";
import { ForbiddenError } from "../../errors";

const mockDb = {
    insert: mock(),
    query: { librarySetting: { findFirst: mock(), findMany: mock() } }
};

mock.module("../../db", () => ({
    db: mockDb,
    librarySetting: { key: "key" }
}));

mock.module("drizzle-orm", () => ({
    eq: mock()
}));

describe("Rules Service", () => {

    beforeEach(() => {
        (db.insert as any).mockClear();
        (db.query.librarySetting.findFirst as any).mockClear();
        (db.query.librarySetting.findMany as any).mockClear();
    });

    describe("initializeDefaults()", () => {

        test("should insert defaults if they do not exist", async () => {
            (db.query.librarySetting.findFirst as any).mockResolvedValue(null);

            const valuesMock = mock().mockResolvedValue(undefined);
            (db.insert as any).mockReturnValue({ values: valuesMock });

            await rulesService.initializeDefaults();

            expect(db.insert).toHaveBeenCalledTimes(3);
        });

        test("should not insert defaults if they already exist", async () => {
            (db.query.librarySetting.findFirst as any).mockResolvedValue({ key: "someKey", value: "someValue" });

            await rulesService.initializeDefaults();
            expect(db.insert).not.toHaveBeenCalled();
        });
    });

    describe("getAll()", () => {

        test("should return default values if DB is empty", async () => {
            (db.query.librarySetting.findMany as any).mockResolvedValue([]);

            const result = await rulesService.getAll();

            expect(result.fineAmountPerDay).toBe(50);
            expect(result.maxBooksPerUser).toBe(5);
            expect(result.gracePeriodDays).toBe(7);
        });

        test("should return values from DB if available", async () => {
            (db.query.librarySetting.findMany as any).mockResolvedValue([
                { key: "fineAmountPerDay", value: "100", updatedAt: new Date("2024-01-01") },
                { key: "maxBooksPerUser", value: "10", updatedAt: new Date("2024-01-02") }
            ]);

            const result = await rulesService.getAll();

            expect(result.fineAmountPerDay).toBe(100);
            expect(result.maxBooksPerUser).toBe(10);
            expect(result.gracePeriodDays).toBe(7);
        });
    });

    describe("update()", () => {

        const setupUpsertMock = () => {
            const onConflictDoUpdateMock = mock().mockResolvedValue(undefined);
            const valuesMock = mock().mockReturnValue({ onConflictDoUpdate: onConflictDoUpdateMock });
            (db.insert as any).mockReturnValue({ values: valuesMock });
        };

        test("should throw ForbiddenError if non-admin tries to update maxBooksPerUser", async () => {
            expect(rulesService.update({ maxBooksPerUser: 10 }, UserRole.MEMBER)).rejects.toThrow(ForbiddenError);
        });

        test("should throw ForbiddenError if non-admin tries to update gracePeriodDays", async () => {
            expect(rulesService.update({ gracePeriodDays: 14 }, UserRole.STAFF)).rejects.toThrow(ForbiddenError);
        });

        test("should allow STAFF to update fineAmountPerDay", async () => {
            setupUpsertMock();
            (db.query.librarySetting.findMany as any).mockResolvedValue([]); // Mock for getAll() call at the end

            await rulesService.update({ fineAmountPerDay: 60 }, UserRole.STAFF);
            expect(db.insert).toHaveBeenCalledTimes(1);
        });

        test("should allow ADMIN to update all fields", async () => {
            setupUpsertMock();
            (db.query.librarySetting.findMany as any).mockResolvedValue([]);

            await rulesService.update({ fineAmountPerDay: 60, maxBooksPerUser: 10, gracePeriodDays: 14 }, UserRole.ADMIN);

            expect(db.insert).toHaveBeenCalledTimes(3);
        });
    });
});
