import { eq, sql } from "drizzle-orm";

import { NotFoundError, ConflictError } from "../../errors";
import { db, loan, bookCopy } from "../../db";
import { LoanStatus, BookCopyStatus } from "../../enums";

import {mapToLoanDTO, mapToLaonDTOs} from "./mapper";
import type { LoanCreationDTO, LoanUpdateDTO, LoanDTO, LoansDTO } from "./model";

export const loanService = {

    findAll: async (page: number, pageSize: number): Promise<LoansDTO> => {
        const offset = (page - 1) * pageSize;
        const [totalRecords] = await db.select({ count: sql<number>`count(*)` }).from(loan);
        const result = await db.query.loan.findMany({
            limit: pageSize,
            offset,
            with: { user: true, bookCopy: true }
        });
        return mapToLaonDTOs(result, Number(totalRecords.count), page, pageSize);
    },

    findById: async (id: number): Promise<LoanDTO> => {
        const [found] = await db.select().from(loan).where(eq(loan.id, id));
        if (!found) throw new NotFoundError(`Loan ${id} not found`);
        return mapToLoanDTO(found);
    },

    create: async (data: LoanCreationDTO): Promise<LoanDTO> => {
        return await db.transaction(async (tx) => {
            const [bookCopyRecord] = await tx
                .select()
                .from(bookCopy)
                .where(eq(bookCopy.id, data.bookCopyId));

            if (!bookCopyRecord) {
                throw new NotFoundError(`Book copy ${data.bookCopyId} not found`);
            }

            if (bookCopyRecord.status !== BookCopyStatus.AVAILABLE) {
                throw new ConflictError(`Book copy ${data.bookCopyId} is not available for loan`);
            }

            await tx
                .update(bookCopy)
                .set({ status: BookCopyStatus.BORROWED })
                .where(eq(bookCopy.id, data.bookCopyId));

            const { actualReturnDate, ...loanData } = data;
            const [created] = await tx
                .insert(loan)
                .values({
                    ...loanData,
                    status: LoanStatus.ACTIVE,
                    actualReturnDate: null
                })
                .returning();

            return mapToLoanDTO(created);
        });
    },

    update: async (id: number, data: LoanUpdateDTO): Promise<void> => {
        const [existing] = await db.select().from(loan).where(eq(loan.id, id));
        if (!existing) throw new NotFoundError(`Loan ${id} not found`);

        if (existing.status !== LoanStatus.ACTIVE) {
            throw new ConflictError(`Cannot update loan ${id} with status ${existing.status}`);
        }

        const [updated] = await db
            .update(loan)
            .set(data)
            .where(eq(loan.id, id))
            .returning();

        if (!updated) throw new NotFoundError(`Loan ${id} not found`);
    },

    return: async (id: number): Promise<void> => {
        const [existing] = await db.select().from(loan).where(eq(loan.id, id));
        if (!existing) throw new NotFoundError(`Loan ${id} not found`);

        if (existing.status !== LoanStatus.ACTIVE) {
            throw new ConflictError(`Cannot return loan ${id} with status ${existing.status}`);
        }

        const today = new Date();
        const expectedReturnDate = new Date(existing.expectedReturnDate);
        const isLate = today > expectedReturnDate;

        await db.transaction(async (tx) => {
            await tx
                .update(loan)
                .set({
                    status: isLate ? LoanStatus.RETURNED_LATE : LoanStatus.RETURNED,
                    actualReturnDate: today.toISOString().split("T")[0]
                })
                .where(eq(loan.id, id));

            await tx
                .update(bookCopy)
                .set({ status: BookCopyStatus.AVAILABLE })
                .where(eq(bookCopy.id, existing.bookCopyId));
        });
    },

    revert: async (id: number): Promise<void> => {
        const [existing] = await db.select().from(loan).where(eq(loan.id, id));
        if (!existing) throw new NotFoundError(`Loan ${id} not found`);

        if (existing.status !== LoanStatus.RETURNED && existing.status !== LoanStatus.RETURNED_LATE) {
            throw new ConflictError(`Cannot revert loan ${id} with status ${existing.status}`);
        }

        await db.transaction(async (tx) => {
            await tx
                .update(loan)
                .set({
                    status: LoanStatus.ACTIVE,
                    actualReturnDate: null
                })
                .where(eq(loan.id, id));

            await tx
                .update(bookCopy)
                .set({ status: BookCopyStatus.BORROWED })
                .where(eq(bookCopy.id, existing.bookCopyId));
        });
    },

    cancel: async (id: number): Promise<void> => {
        const [existing] = await db.select().from(loan).where(eq(loan.id, id));
        if (!existing) throw new NotFoundError(`Loan ${id} not found`);

        if (existing.status !== LoanStatus.ACTIVE) {
            throw new ConflictError(`Cannot cancel loan ${id} with status ${existing.status}`);
        }

        await db.transaction(async (tx) => {
            await tx
                .update(loan)
                .set({ status: LoanStatus.CANCELED })
                .where(eq(loan.id, id));

            await tx
                .update(bookCopy)
                .set({ status: BookCopyStatus.AVAILABLE })
                .where(eq(bookCopy.id, existing.bookCopyId));
        });
    }
};
