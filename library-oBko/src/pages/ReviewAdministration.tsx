import { useEffect, useState } from "react"
import { useNavigate } from '@tanstack/react-router'
import { Search, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// ── Types ─────────────────────────────────────────────────────────────────────

type BookDTO = {
  id: number
  title: string
  language: string
  publisherId: number
  publisherName: string
  yearPublished: number
  description: string
  authors: string[]
  genres: string[]
  availableCopies: number
  totalCopies: number
}

// ── API helpers ───────────────────────────────────────────────────────────────

const BASE = "/api"

async function fetchBooks(
  page: number,
  size: number
): Promise<{ books: BookDTO[]; total: number }> {
  const res = await fetch(`${BASE}/books?page=${page}&size=${size}`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("Failed to fetch books")
  const data = await res.json()
  return { books: data.books, total: data.total }
}

// ── Main page ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 20

export default function ReviewAdministrationPage() {
  const navigate = useNavigate()

  const [books, setBooks] = useState<BookDTO[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchBooks(page, PAGE_SIZE)
      setBooks(data.books)
      setTotal(data.total)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [page])

  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.authors.some((a) => a.toLowerCase().includes(search.toLowerCase()))
  )

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-extrabold">Reviews</h1>

      {/* toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search books or authors…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {loading && <p className="p-6 text-muted-foreground">Loading…</p>}
        {error && <p className="p-6 text-destructive">{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <p className="p-6 text-muted-foreground">No books found.</p>
        )}
        {!loading && !error && filtered.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Authors</th>
                <th className="px-5 py-3">Year</th>
                <th className="px-5 py-3 text-right">Reviews</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((book, i) => (
                <tr
                  key={book.id}
                  className={`border-b last:border-0 transition-colors hover:bg-muted/30 ${i % 2 === 0 ? "" : "bg-muted/10"}`}
                >
                  <td className="px-5 py-3 text-muted-foreground">{book.id}</td>
                  <td className="px-5 py-3 font-medium">{book.title}</td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {book.authors.join(", ")}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {book.yearPublished}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate({ to: `/_staff/reviews/${book.id}` })}
                    >
                      <ChevronRight className="h-4 w-4" />
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
    </div>
  )
}