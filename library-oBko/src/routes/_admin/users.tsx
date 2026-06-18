import { createFileRoute } from '@tanstack/react-router'
import UserAdministrationPage from '@/pages/UserAdministrationPage'

export const Route = createFileRoute('/_admin/users')({
  component: UserAdministrationPage,
})
