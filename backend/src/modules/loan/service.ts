import { eq, sql } from "drizzle-orm";

import { NotFoundError } from "../../errors";
import { db } from "../../db";

import {mapToLoanDTO, mapToLaonDTOs} from "./mapper";
import type { LoanCreationDTO, LoanUpdateDTO, LoanDTO, LoansDTO } from "./model";

export const loanService = {

    findAll: async (page: number, pageSize: number): Promise<void> => {

    },

    findById: async (id: number): Promise<void> => {

    },

    create: async (data: LoanCreationDTO) => {

    },

    update: async (id: number, data: LoanUpdateDTO) => {

    },

    return: async (id: number): Promise<void> => {

    },

    revert: async (id: number): Promise<void> => {

    },

    cancel: async (id: number): Promise<void> => {

    }
};
