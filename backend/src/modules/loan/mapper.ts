import type {LoanDTO, LoansDTO} from "./model";

import {loan} from "../../db";
type LoanEntity = typeof loan.$inferSelect;

export const mapToLoanDTO = (entity: LoanEntity): LoanDTO => ({
    id: entity.id,
    userId: entity.userId,
    bookCopyId: entity.bookCopyId,
    loanDate: entity.loanDate,
    expectedReturnDate: entity.expectedReturnDate,
    actualReturnDate: entity.actualReturnDate,
    price: entity.price
});

export const mapToLaonDTOs = (entities: LoanEntity[], total: number, page: number, pageSize: number): LoansDTO => ({
    loans: entities.map(mapToLoanDTO),
    total: total,
    page: page,
    pageSize: pageSize
});
