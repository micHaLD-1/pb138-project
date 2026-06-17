import { createFileRoute } from '@tanstack/react-router'
import AuthorAdministrationPage from '@/pages/AuthorAdministrationPage'

export const Route = createFileRoute('/_staff/authors')({
  component: AuthorAdministrationPage,
})
