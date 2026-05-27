import { eq, and, sql } from "drizzle-orm";

import { db, review } from "../../db";
import { NotFoundError, ConflictError } from "../../errors";
import { mapToReviewDTO, mapToReviewsDTOs } from "./mapper";
import type { ReviewCreationDTO, ReviewUpdateDTO, ReviewDTO, ReviewsDTO } from "./model";

export const reviewsService = {
  findByBookId: async (bookId: number, page: number, pageSize: number): Promise<ReviewsDTO> => {
    const offset = (page - 1) * pageSize;
    const [totalRecords] = await db
      .select({ count: sql<number>`count(*)` })
      .from(review)
      .where(eq(review.bookId, bookId));

    const result = await db.query.review.findMany({
      where: eq(review.bookId, bookId),
      limit: pageSize,
      offset,
      with: {
        user: true
      },
      orderBy: (review, { desc }) => [desc(review.createdAt)]
    });

    return mapToReviewsDTOs(result, Number(totalRecords.count), page, pageSize);
  },

  create: async (userId: number, data: ReviewCreationDTO): Promise<ReviewDTO> => {
    const existing = await db.query.review.findFirst({
      where: and(eq(review.userId, userId), eq(review.bookId, data.bookId))
    });

    if (existing) {
      throw new ConflictError("User has already reviewed this book");
    }

    const [created] = await db
      .insert(review)
      .values({
        userId,
        bookId: data.bookId,
        content: data.content,
        createdAt: new Date()
      })
      .returning();

    const result = await db.query.review.findFirst({
      where: eq(review.id, created.id),
      with: { user: true }
    });

    if (!result) throw new NotFoundError("Review not found after creation");
    return mapToReviewDTO(result);
  },

  update: async (reviewId: number, userId: number, data: ReviewUpdateDTO): Promise<ReviewDTO> => {
    const [existing] = await db
      .select()
      .from(review)
      .where(eq(review.id, reviewId));

    if (!existing) throw new NotFoundError(`Review ${reviewId} not found`);
    if (existing.userId !== userId) {
      throw new ConflictError("Cannot update another user's review");
    }

    const [updated] = await db
      .update(review)
      .set(data)
      .where(eq(review.id, reviewId))
      .returning();

    const result = await db.query.review.findFirst({
      where: eq(review.id, updated.id),
      with: { user: true }
    });

    if (!result) throw new NotFoundError("Review not found after update");
    return mapToReviewDTO(result);
  },

  remove: async (reviewId: number, userId: number): Promise<void> => {
    const [existing] = await db
      .select()
      .from(review)
      .where(eq(review.id, reviewId));

    if (!existing) throw new NotFoundError(`Review ${reviewId} not found`);
    if (existing.userId !== userId) {
      throw new ConflictError("Cannot delete another user's review");
    }

    await db.delete(review).where(eq(review.id, reviewId));
  }
};
