import { createFileRoute } from '@tanstack/react-router'
import FeedbackAdministrationPage from '@/pages/Feedbacks'

export const Route = createFileRoute('/_staff/feedbacks')({
  component: FeedbackAdministrationPage,
})
