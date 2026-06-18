import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import HomePage from '@/pages/Homepage'

const searchSchema = z.object({
  search: z.string().optional(),
})

export const Route = createFileRoute('/')({
  validateSearch: searchSchema,
  component: HomePage,
})
