import { review, user } from "../../db";
import type { ReviewDTO, ReviewsDTO } from "./model";

type UserEntity = typeof user.$inferSelect;
type ReviewEntity = typeof review.$inferSelect;

interface ReviewWithUser extends ReviewEntity {
  user: UserEntity;
}

export const mapToReviewDTO = (entity: ReviewWithUser): ReviewDTO => ({
  id: entity.id,
  content: entity.content,
  createdAt: entity.createdAt.toISOString(),
  userId: entity.userId,
  userFirstName: entity.user.firstName,
  userLastName: entity.user.lastName
});

export const mapToReviewsDTOs = (
  entities: ReviewWithUser[],
  total: number,
  page: number,
  pageSize: number
): ReviewsDTO => ({
  reviews: entities.map(mapToReviewDTO),
  total,
  page,
  pageSize
});
