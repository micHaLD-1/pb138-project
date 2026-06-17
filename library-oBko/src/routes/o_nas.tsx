import { createFileRoute } from '@tanstack/react-router'
import AboutUs from '@/pages/AboutUs'

export const Route = createFileRoute('/o_nas')({
  component: AboutUs,
})
