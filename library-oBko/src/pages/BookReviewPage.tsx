import { useEffect, useState } from "react"
import { useNavigate, useParams } from '@tanstack/react-router'
import { ChevronLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"

// ── Types ─────────────────────────────────────────────────────────────────────

type ReviewDTO = {
  id: number
  content: string
  createdAt: string
  userId: number
  userFirstName: string
  userLastName: string
}

// ── API helpers ───────────────────────────────────────────────────────────────

const BASE = "/api"

async function fetchReviewsByBook(
  bookId: number,
  page: number,
  size: number
): Promise<{ reviews: ReviewDTO[]; total: number }> {
  const res = await fetch(
    `${BASE}/books/${bookId}/reviews?page=${page}&size=${size}`,
    { credentials: "include" }
  )
  if (!res.ok) throw new Error("Failed to fetch reviews")
  const data = await res.json()
  return { reviews: data.reviews, total: data.total }
}

async function fetchBookTitle(bookId: number): Promise<string> {
  const res = await fetch(`${BASE}/books/${bookId}`, { credentials: "include" })
  if (!res.ok) return `Book #${bookId}`
  const data = await res.json()
  return data.title ?? `Book #${bookId}`
}

async function deleteReview(reviewId: number): Promise<void> {
  const res = await fetch(`${BASE}/reviews/${reviewId}`, {
    method: "DELETE",
    credentials: "include",
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message ?? "Failed to delete review")
  }
}

// ── Main page ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 20

export default function BookReviewsPage() {
  const { id } = useParams({
    from: '/_staff/reviews/$id',
  })
  const bookId = Number(id)
  const navigate = useNavigate()

  const [bookTitle, setBookTitle] = useState<string>(`Book #${bookId}`)
  const [reviews, setReviews] = useState<ReviewDTO[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [deleteTarget, setDeleteTarget] = useState<ReviewDTO | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchReviewsByBook(bookId, page, PAGE_SIZE)
      setReviews(data.reviews)
      setTotal(data.total)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookTitle(bookId).then(setBookTitle)
  }, [bookId])

  useEffect(() => {
    load()
  }, [bookId, page])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    setDeleteError(null)
    try {
      await deleteReview(deleteTarget.id)
      setDeleteTarget(null)
      load()
    } catch (e: any) {
      setDeleteError(e.message)
    } finally {
      setDeleteLoading(false)
    }
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* header */}
      <div className="mb-6 flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate({ to: ".." })}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Reviews
          </p>
          <h1 className="text-3xl font-extrabold leading-tight">{bookTitle}</h1>
        </div>
      </div>

      {/* table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {loading && <p className="p-6 text-muted-foreground">Loading…</p>}
        {error && <p className="p-6 text-destructive">{error}</p>}
        {!loading && !error && reviews.length === 0 && (
          <p className="p-6 text-muted-foreground">No reviews for this book yet.</p>
        )}
        {!loading && !error && reviews.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">Reviewer</th>
                <th className="px-5 py-3">Content</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review, i) => (
                <tr
                  key={review.id}
                  className={`border-b last:border-0 transition-colors hover:bg-muted/30 ${i % 2 === 0 ? "" : "bg-muted/10"}`}
                >
                  <td className="px-5 py-3 font-medium whitespace-nowrap">
                    {review.userFirstName} {review.userLastName}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground max-w-md">
                    <span className="block truncate" title={review.content}>
                      {review.content}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground whitespace-nowrap">
                    {formatDate(review.createdAt)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setDeleteError(null)
                        setDeleteTarget(review)
                      }}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-end gap-2 text-sm">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* delete confirmation modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="relative w-full max-w-sm rounded-xl border bg-card p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-2 text-lg font-bold">Delete review</h2>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete the review by{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget.userFirstName} {deleteTarget.userLastName}
              </span>
              ? This cannot be undone.
            </p>
            {deleteError && (
              <p className="mt-3 text-sm text-destructive">{deleteError}</p>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteTarget(null)}
                disabled={deleteLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting…" : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}