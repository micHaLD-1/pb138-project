import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel"
import BookCard from "./book-card"
import FilterPanel, { type ActiveFilters } from "./filter-panel"
import { Button } from "@/components/ui/button"

export type Book = {
  id: string
  title: string
  author: string
  genre: string
  description: string
}

const PAGE_SIZE = 8

const DEFAULT_FILTERS: ActiveFilters = { genreId: null, authorId: null }

export default function BookGrid() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState<ActiveFilters>(DEFAULT_FILTERS)

  // Featured books — fetched once on mount, never affected by filters
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([])
  useEffect(() => {
    fetch(`/api/books?page=1&size=${PAGE_SIZE}`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setFeaturedBooks(data.books.map((b: any) => ({
          id: String(b.id),
          title: b.title,
          author: b.authors.join(", "),
          genre: b.genres.join(", "),
          description: b.description,
        })))
      })
      .catch(() => {})
  }, [])

  // Read search term from the URL (?search=...) set by the header search bar
  const [searchParams] = useSearchParams()
  const search = searchParams.get("search") ?? ""



  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true)
      try {
        // Build URL — only append params that are actually set
        const params = new URLSearchParams({
          page: String(page),
          size: String(PAGE_SIZE),
        })
        if (search)           params.set("search",   search)
        if (filters.genreId)  params.set("genreId",  String(filters.genreId))
        if (filters.authorId) params.set("authorId", String(filters.authorId))

        const res = await fetch(`/api/books?${params}`, { credentials: "include" })
        if (!res.ok) throw new Error("Failed to fetch books")
        const data = await res.json()

        const mapped: Book[] = data.books.map((b: any) => ({
          id: String(b.id),
          title: b.title,
          author: b.authors.join(", "),
          genre: b.genres.join(", "),
          description: b.description,
        }))

        setBooks(mapped)
        setTotal(data.total)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [page, filters, search])

  // When genre/author filters change, jump back to page 1
  const handleFilterChange = (newFilters: ActiveFilters) => {
    setPage(1)
    setFilters(newFilters)
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="w-full px-4 py-6 md:px-8">

      {/* Featured books carousel — always unfiltered */}
      {featuredBooks.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-lg font-semibold">Oblíbené knihy</h2>
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {featuredBooks.map((book) => (
                <CarouselItem key={book.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <BookCard book={book} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}

      {/* Filter panel */}
      <FilterPanel onFilterChange={handleFilterChange} />

      {/* All books grid */}
      {loading && <p className="p-6 text-muted-foreground">Loading books…</p>}
      {error && <p className="p-6 text-destructive">{error}</p>}
      {!loading && !error && books.length === 0 && (
        <p className="p-6 text-muted-foreground">Žádné knihy neodpovídají filtru.</p>
      )}
      {!loading && !error && books.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-10">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">{page} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
