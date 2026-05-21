import { useEffect, useState } from "react"
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"

type Genre = { id: number; name: string }
type Author = { id: number; name: string }

export type ActiveFilters = {
  genreId: number | null
  authorId: number | null
}

type Props = {
  onFilterChange: (filters: ActiveFilters) => void
}

export default function FilterPanel({ onFilterChange }: Props) {
  const [genres, setGenres] = useState<Genre[]>([])
  const [authors, setAuthors] = useState<Author[]>([])

  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null)
  const [selectedAuthorId, setSelectedAuthorId] = useState<number | null>(null)

  // Fetch all genres and authors once on mount
  useEffect(() => {
    fetch("/api/genres?page=1&size=200")
      .then((r) => r.json())
      .then((data) => setGenres(data.genres ?? []))
      .catch(() => {})

    fetch("/api/authors?page=1&size=200")
      .then((r) => r.json())
      .then((data) => setAuthors(data.authors ?? []))
      .catch(() => {})
  }, [])

  const handleFilter = () => {
    onFilterChange({ genreId: selectedGenreId, authorId: selectedAuthorId })
  }

  const handleReset = () => {
    setSelectedGenreId(null)
    setSelectedAuthorId(null)
    onFilterChange({ genreId: null, authorId: null })
  }

  const hasActiveFilter = selectedGenreId !== null || selectedAuthorId !== null

  return (
    <div className="w-full flex flex-col gap-4 md:flex-row md:items-center md:justify-center my-6">

      {/* Author filter drawer */}
      <Drawer direction="left">
        <DrawerTrigger asChild>
          <Button variant="outline">
            {selectedAuthorId
              ? `Autor: ${authors.find((a) => a.id === selectedAuthorId)?.name ?? "?"}`
              : "Filtruj autory"}
          </Button>
        </DrawerTrigger>

        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Autoři</DrawerTitle>
          </DrawerHeader>

          <div className="p-4 flex flex-col gap-2 overflow-y-auto">
            {/* "Any" option to clear selection */}
            <button
              className={`text-left px-2 py-1 rounded hover:bg-muted ${selectedAuthorId === null ? "font-semibold text-primary" : ""}`}
              onClick={() => setSelectedAuthorId(null)}
            >
              Všichni autoři
            </button>
            {authors.map((author) => (
              <button
                key={author.id}
                className={`text-left px-2 py-1 rounded hover:bg-muted ${selectedAuthorId === author.id ? "font-semibold text-primary" : ""}`}
                onClick={() => setSelectedAuthorId(author.id)}
              >
                {author.name}
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>

      {/* Apply button */}
      <Button
        className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-10"
        onClick={handleFilter}
      >
        Filtruj
      </Button>

      {/* Reset button — only shown when a filter is active */}
      {hasActiveFilter && (
        <Button variant="ghost" onClick={handleReset}>
          Zrušit filtry
        </Button>
      )}

      {/* Genre filter drawer */}
      <Drawer direction="right">
        <DrawerTrigger asChild>
          <Button variant="outline">
            {selectedGenreId
              ? `Žánr: ${genres.find((g) => g.id === selectedGenreId)?.name ?? "?"}`
              : "Filtruj žánry"}
          </Button>
        </DrawerTrigger>

        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Žánry</DrawerTitle>
          </DrawerHeader>

          <div className="p-4 flex flex-col gap-2 overflow-y-auto">
            {/* "Any" option to clear selection */}
            <button
              className={`text-left px-2 py-1 rounded hover:bg-muted ${selectedGenreId === null ? "font-semibold text-primary" : ""}`}
              onClick={() => setSelectedGenreId(null)}
            >
              Všechny žánry
            </button>
            {genres.map((genre) => (
              <button
                key={genre.id}
                className={`text-left px-2 py-1 rounded hover:bg-muted ${selectedGenreId === genre.id ? "font-semibold text-primary" : ""}`}
                onClick={() => setSelectedGenreId(genre.id)}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>

    </div>
  )
}
