import { createFileRoute } from '@tanstack/react-router'
import ReviewAdministrationPage from '@/pages/ReviewAdministration'

export const Route = createFileRoute('/_staff/reviews')({
  component: ReviewAdministrationPage,
})