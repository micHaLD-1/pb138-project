import { createFileRoute } from '@tanstack/react-router'
import ReservationAdministrationPage from '@/pages/ReservationAdministrationPage'

export const Route = createFileRoute('/_staff/reservations')({
  component: ReservationAdministrationPage,
})
