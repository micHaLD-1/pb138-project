import { eq, sql } from "drizzle-orm";

import { NotFoundError } from "../../errors";
import { db } from "../../db";

import {mapToBranchDTO, mapToBranchesDTOs} from "./mapper";
import type { BranchCreationDTO, BranchUpdateDTO, BranchDTO, BranchesDTO } from "./model";

export const branchService = {

    findAll: async (page: number, pageSize: number): Promise<void> => {

    },

    findById: async (id: number): Promise<void> => {

    },

    create: async (data: BranchCreationDTO) => {

    },

    update: async (id: number, data: BranchUpdateDTO) => {

    },

    remove: async (id: number): Promise<void> => {

    }
};
