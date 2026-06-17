import type { ReviewDTO, ReviewsDTO } from "./model";

type ReviewWithUser = {
  id: number;
  content: string;
  rating: number;
  createdAt: Date;
  userId: number;
  user: {
    firstName: string;
    lastName: string;
  };
};

export const mapToReviewDTO = (entity: ReviewWithUser): ReviewDTO => ({
  id: entity.id,
  content: entity.content,
  rating: entity.rating,
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
