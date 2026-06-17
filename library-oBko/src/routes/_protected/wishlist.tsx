import { createFileRoute } from '@tanstack/react-router'
import Wishlist from '@/pages/Wishlist'

export const Route = createFileRoute('/_protected/wishlist')({
  component: Wishlist,
})
