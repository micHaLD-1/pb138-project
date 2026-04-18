import { eq, sql } from "drizzle-orm";

import { NotFoundError } from "../../errors";
import { db } from "../../db";

import {mapToGenreDTO, mapToGenresDTO} from "./mapper";
import type { GenreCreationDTO, GenreDTO, GenresDTO } from "./model";

export const genreService = {

    findAll: async (page: number, pageSize: number): Promise<void> => {

    },

    findById: async (id: number): Promise<void> => {

    },

    create: async (data: GenreCreationDTO) => {

    },

    remove: async (id: number): Promise<void> => {

    }
};
