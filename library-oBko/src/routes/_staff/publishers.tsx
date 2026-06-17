import { createFileRoute } from '@tanstack/react-router'
import PublisherAdministrationPage from '@/pages/PublisherAdministrationPage'

export const Route = createFileRoute('/_staff/publishers')({
  component: PublisherAdministrationPage,
})
