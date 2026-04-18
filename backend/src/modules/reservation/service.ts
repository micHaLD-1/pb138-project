import { eq, sql } from "drizzle-orm";

import { NotFoundError } from "../../errors";
import { db } from "../../db";

import {mapToReservationDTO, mapToReservationsDTO} from "./mapper";
import type { ReservationCreationDTO, ReservationUpdateDTO, ReservationDTO, ReservationsDTO } from "./model";

export const reservationService = {

    findAll: async (page: number, pageSize: number): Promise<void> => {

    },

    findById: async (id: number): Promise<void> => {

    },

    create: async (data: ReservationCreationDTO) => {

    },

    update: async (id: number, data: ReservationUpdateDTO) => {

    },

    cancel: async (id: number): Promise<void> => {

    }
};
