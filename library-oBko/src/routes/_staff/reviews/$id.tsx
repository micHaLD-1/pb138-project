import { createFileRoute } from '@tanstack/react-router'
import BookReviewsPage from '@/pages/BookReviewPage'

export const Route = createFileRoute('/_staff/reviews/$id')({
  component: BookReviewsPage,
})

