import { useEffect, useState } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel"
import BookCard from "./book-card"
import FilterPanel from "./filter-panel"
import { Button } from "@/components/ui/button"

export type Book = {
  id: string
  title: string
  author: string
  genre: string
  description: string
}

const PAGE_SIZE = 8


export default function BookGrid() {
  const [allBooks, setAllBooks] = useState<Book[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  // TODO: replace with real API call for liked/featured books
  const mockFeaturedBooks: Book[] = allBooks;

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/books?page=${page}&size=${PAGE_SIZE}`, { credentials: "include" })
        if (!res.ok) throw new Error("Failed to fetch books")
        const data = await res.json()

        const mapped: Book[] = data.books.map((b: any) => ({
          id: String(b.id),
          title: b.title,
          author: b.authors.join(", "),
          genre: b.genres.join(", "),
          description: b.description,
        }))

        setAllBooks(mapped)
        setBooks(mapped)
        setTotal(data.total)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [page])

  const authors = [...new Set(allBooks.map((b) => b.author))]
  const genres = [...new Set(allBooks.map((b) => b.genre))]
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="w-full px-4 py-6 md:px-8">

      {/* Liked / featured books carousel — TODO: connect to real API */}
      {mockFeaturedBooks.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-lg font-semibold">Oblíbené knihy</h2>
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {mockFeaturedBooks.map((book) => (
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
      <FilterPanel
        authors={authors}
        genres={genres}
        allBooks={allBooks}
        setFilteredBooks={setBooks}
      />

      {/* All books grid */}
      {loading && <p className="p-6 text-muted-foreground">Loading books…</p>}
      {error && <p className="p-6 text-destructive">{error}</p>}
      {!loading && !error && (
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