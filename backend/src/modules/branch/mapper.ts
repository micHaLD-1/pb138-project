import type {BranchDTO, BranchesDTO} from "./model";

import {branch} from "../../db";
type BranchEntity = typeof branch.$inferSelect;

export const mapToBranchDTO = (entity: BranchEntity): BranchDTO => ({
    id: entity.id,
    name: entity.name,
    address: entity.address,
    email: entity.email,
    phone: entity.phone
});

export const mapToBranchesDTOs = (entities: BranchEntity[], total: number, page: number, pageSize: number): BranchesDTO => ({
    branches: entities.map(mapToBranchDTO),
    total: total,
    page: page,
    pageSize: pageSize
});
