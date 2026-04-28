import { eq } from "drizzle-orm";

import { db, librarySetting } from "../../db";
import { ForbiddenError } from "../../errors";
import { UserRole } from "../../enums";

import type { RulesUpdateDTO, RulesDTO } from "./model";

const SETTING_KEYS = {
  FINE_AMOUNT: "fineAmountPerDay",
  MAX_BOOKS: "maxBooksPerUser",
  GRACE_PERIOD: "gracePeriodDays"
} as const;

const DEFAULTS = {
  [SETTING_KEYS.FINE_AMOUNT]: "50",
  [SETTING_KEYS.MAX_BOOKS]: "5",
  [SETTING_KEYS.GRACE_PERIOD]: "7"
};

export const rulesService = {
  initializeDefaults: async (): Promise<void> => {
    for (const [key, value] of Object.entries(DEFAULTS)) {
      const existing = await db.query.librarySetting.findFirst({
        where: eq(librarySetting.key, key)
      });
      if (!existing) {
        await db.insert(librarySetting).values({ key, value });
      }
    }
  },

  getAll: async (): Promise<RulesDTO> => {
    const settings = await db.query.librarySetting.findMany();
    
    const getValue = (key: string): number => {
      const setting = settings.find(s => s.key === key);
      return setting ? parseInt(setting.value, 10) : parseInt(DEFAULTS[key as keyof typeof DEFAULTS], 10);
    };

    const getUpdatedAt = (): string => {
      const timestamps = settings.map(s => s.updatedAt).filter(Boolean);
      if (timestamps.length === 0) return new Date().toISOString();
      return new Date(Math.max(...timestamps.map(d => new Date(d).getTime()))).toISOString();
    };

    return {
      fineAmountPerDay: getValue(SETTING_KEYS.FINE_AMOUNT),
      maxBooksPerUser: getValue(SETTING_KEYS.MAX_BOOKS),
      gracePeriodDays: getValue(SETTING_KEYS.GRACE_PERIOD),
      updatedAt: getUpdatedAt()
    };
  },

  update: async (data: RulesUpdateDTO, userRole: UserRole): Promise<RulesDTO> => {
    const adminOnlyFields = ["maxBooksPerUser", "gracePeriodDays"] as const;
    
    for (const field of adminOnlyFields) {
      if (data[field as keyof RulesUpdateDTO] !== undefined && userRole !== UserRole.ADMIN) {
        throw new ForbiddenError(`Only admin can update ${field}`);
      }
    }

    const updates: { key: string; value: string }[] = [];
    
    if (data.fineAmountPerDay !== undefined) {
      updates.push({ key: SETTING_KEYS.FINE_AMOUNT, value: data.fineAmountPerDay.toString() });
    }
    if (data.maxBooksPerUser !== undefined) {
      updates.push({ key: SETTING_KEYS.MAX_BOOKS, value: data.maxBooksPerUser.toString() });
    }
    if (data.gracePeriodDays !== undefined) {
      updates.push({ key: SETTING_KEYS.GRACE_PERIOD, value: data.gracePeriodDays.toString() });
    }

    for (const { key, value } of updates) {
      await db
        .insert(librarySetting)
        .values({ key, value, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: librarySetting.key,
          set: { value, updatedAt: new Date() }
        });
    }

    return rulesService.getAll();
  }
};
