import { createFileRoute } from '@tanstack/react-router'
import MyReservations from '@/pages/MyReservations'

export const Route = createFileRoute('/_protected/my-reservations')({
  component: MyReservations,
})
