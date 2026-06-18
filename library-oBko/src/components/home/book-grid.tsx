import { useState } from "react"
import { useSearch } from "@tanstack/react-router"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel"
import BookCard from "./book-card"
import FilterPanel, { type ActiveFilters } from "./filter-panel"
import { Button } from "@/components/ui/button"
import { useGetBooks } from "@/gen/hooks/useGetBooks"

export type Book = {
  id: string
  title: string
  author: string
  genre: string
  description: string
}

const PAGE_SIZE = 8

const DEFAULT_FILTERS: ActiveFilters = { genreId: null, authorId: null }

function mapBook(b: { id?: number; title?: string; authors?: string[]; genres?: string[]; description?: string }): Book {
  return {
    id: String(b.id),
    title: b.title ?? "",
    author: (b.authors ?? []).join(", "),
    genre: (b.genres ?? []).join(", "),
    description: b.description ?? "",
  }
}

export default function BookGrid() {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<ActiveFilters>(DEFAULT_FILTERS)

  const { search = '' } = useSearch({ from: '/' })

  const featuredQuery = useGetBooks({ page: 1, size: PAGE_SIZE })
  const featuredBooks: Book[] = (featuredQuery.data?.books ?? []).map(mapBook)

  const listParams: Record<string, string | number> = { page, size: PAGE_SIZE }
  if (search) listParams.search = search
  if (filters.genreId) listParams.genreId = filters.genreId
  if (filters.authorId) listParams.authorId = filters.authorId

  const listQuery = useGetBooks(listParams as { page: number; size: number })
  const books: Book[] = (listQuery.data?.books ?? []).map(mapBook)
  const total = listQuery.data?.total ?? 0
  const loading = listQuery.isPending
  const error = listQuery.isError ? "Failed to fetch books" : null

  const handleFilterChange = (newFilters: ActiveFilters) => {
    setPage(1)
    setFilters(newFilters)
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="w-full px-4 py-6 md:px-8">

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

      <FilterPanel onFilterChange={handleFilterChange} />

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
