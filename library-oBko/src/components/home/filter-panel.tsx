import { useState } from "react"
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { useGetGenres } from "@/gen/hooks/useGetGenres"
import { useGetAuthors } from "@/gen/hooks/useGetAuthors"

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
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null)
  const [selectedAuthorId, setSelectedAuthorId] = useState<number | null>(null)

  const genresQuery = useGetGenres({ page: 1, size: 100 })
  const authorsQuery = useGetAuthors({ page: 1, size: 100 })

  const genres: Genre[] = (genresQuery.data?.genres ?? []).map((g) => ({ id: g.id ?? 0, name: g.name ?? "" }))
  const authors: Author[] = (authorsQuery.data?.authors ?? []).map((a) => ({ id: a.id ?? 0, name: a.name ?? "" }))

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

      <Button
        className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-10"
        onClick={handleFilter}
      >
        Filtruj
      </Button>

      {hasActiveFilter && (
        <Button variant="ghost" onClick={handleReset}>
          Zrušit filtry
        </Button>
      )}

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
