import { createFileRoute } from '@tanstack/react-router'
import NewsletterAdministrationPage from '@/pages/Newsletters'

export const Route = createFileRoute('/_staff/newsletter')({
  component: NewsletterAdministrationPage,
})
