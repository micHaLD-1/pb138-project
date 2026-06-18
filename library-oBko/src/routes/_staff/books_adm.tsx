import { createFileRoute } from '@tanstack/react-router'
import BookAdministrationPage from '@/pages/BookAdministrationPage'

export const Route = createFileRoute('/_staff/books_adm')({
  component: BookAdministrationPage,
})
