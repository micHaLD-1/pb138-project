import { createFileRoute } from '@tanstack/react-router'
import NewsLetter from '@/pages/NewsLetter'

export const Route = createFileRoute('/_staff/newsletter')({
  component: NewsLetter,
})
