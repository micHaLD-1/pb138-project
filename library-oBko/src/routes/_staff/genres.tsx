import { createFileRoute } from '@tanstack/react-router'
import GenreAdministrationPage from '@/pages/GenreAdministrationPage'

export const Route = createFileRoute('/_staff/genres')({
  component: GenreAdministrationPage,
})
