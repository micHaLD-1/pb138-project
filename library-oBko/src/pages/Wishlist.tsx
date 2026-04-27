import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, X } from 'lucide-react'
// TODO: Replace WishlistContext with backend API calls
import { useWishlist } from '@/context/WishlistContext'

function truncate(text: string, n = 100) {
  if (text.length <= n) return text
  return text.slice(0, n).trimEnd() + '…'
}

export default function Wishlist() {
  // TODO: Replace with backend API calls for wishlist management
  const { wishlist, removeFromWishlist, addToReservations } = useWishlist()

  const list = useMemo(() => wishlist, [wishlist])

  if (list.length === 0) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
          <h1 className="text-2xl font-extrabold">Your wishlist is empty</h1>
          <p className="mt-3 text-muted-foreground">Add books from a book detail page.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-extrabold">Wishlist</h1>
      <div className="flex flex-col gap-4">
        {list.map((book) => (
          <div key={book.id} className="relative rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">
                  <Link to={`/books/${book.id}`} className="hover:underline">{book.name}</Link>
                  <span className="ml-2 text-sm font-medium text-muted-foreground">- {book.author}</span>
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">{truncate(book.description, 100)}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={`Reserve ${book.name}`}
                  className="rounded-md bg-transparent p-1.5 hover:bg-accent"
                  onClick={() => addToReservations(book)}
                >
                  <Plus className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  aria-label={`Remove ${book.name} from wishlist`}
                  className="rounded-md bg-transparent p-1.5 text-destructive hover:bg-accent"
                  onClick={() => removeFromWishlist(book.id)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mt-4">
              {book.availableCopies > 0 ? (
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">Dostupné</span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">Nedostupné</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
