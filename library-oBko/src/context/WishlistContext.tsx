import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Book } from '@/lib/schemas'

type WishlistContextValue = {
  wishlist: Book[]
  reservations: Book[]
  addToWishlist: (book: Book) => void
  removeFromWishlist: (id: string) => void
  addToReservations: (book: Book) => void
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined)

const WISHLIST_KEY = 'oBko.wishlist.v1'
const RESERVATIONS_KEY = 'oBko.reservations.v1'

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Book[]>([])
  const [reservations, setReservations] = useState<Book[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(WISHLIST_KEY)
      if (raw) setWishlist(JSON.parse(raw))
    } catch {
      /* ignore */
    }
    try {
      const rawR = localStorage.getItem(RESERVATIONS_KEY)
      if (rawR) setReservations(JSON.parse(rawR))
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist))
    } catch {
      /* ignore */
    }
  }, [wishlist])

  useEffect(() => {
    try {
      localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations))
    } catch {
      /* ignore */
    }
  }, [reservations])

  const addToWishlist = (book: Book) => {
    setWishlist((prev) => {
      if (prev.find((b) => b.id === book.id)) return prev
      return [...prev, book]
    })
  }

  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((b) => b.id !== id))
  }

  const addToReservations = (book: Book) => {
    setReservations((prev) => {
      if (prev.find((b) => b.id === book.id)) return prev
      return [...prev, book]
    })
    // Remove from wishlist when reserving
    removeFromWishlist(book.id)
  }

  return (
    <WishlistContext.Provider value={{ wishlist, reservations, addToWishlist, removeFromWishlist, addToReservations }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}

export default WishlistProvider
