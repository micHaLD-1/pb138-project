import { useState } from "react"
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"

type Props = {
  authors: string[]
  genres: string[]
  onAuthorSelect?: (author: string) => void
  onGenreSelect?: (genre: string) => void
  onSearch?: (value: string) => void
}

export default function FilterPanel({
  authors,
  genres,
  onAuthorSelect,
  onGenreSelect,
  onSearch,
}: Props) {
  const [search, setSearch] = useState("")
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([])

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
        prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    )
 }

 const toggleAuthor = (author: string) => {
    setSelectedAuthors((prev) =>
        prev.includes(author)
        ? prev.filter((a) => a !== author)
        : [...prev, author]
    )
 }

  return (
    <div className="w-full flex flex-col gap-4 md:flex-row md:items-center md:justify-center my-6">

      <Drawer direction="left">
        <DrawerTrigger asChild>
          <Button variant="outline">Filtruj autory</Button>
        </DrawerTrigger>

        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Autoři</DrawerTitle>
          </DrawerHeader>

          <div className="p-4 flex flex-col gap-2">
            {authors.map((author) => {
                const isSelected = selectedAuthors.includes(author)
                return (
                    <div key={author} className="flex items-center space-x-2">
                        <Checkbox
                        id={author}
                        checked={isSelected}
                        onCheckedChange={() => toggleAuthor(author)}
                        />
                        <Label htmlFor={author} className="cursor-pointer">
                        {author}
                        </Label>
                    </div>
                )
                })}
          </div>
        </DrawerContent>
      </Drawer>

      <Button className="rounded-lg bg-primary text-primary-foreground hover:bg-primary mx-15 px-14">
        Filtruj
      </Button>



      <Drawer direction="right">
        <DrawerTrigger asChild>
          <Button variant="outline">Filtruj žánry</Button>
        </DrawerTrigger>

        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Žánry</DrawerTitle>
          </DrawerHeader>

          <div className="p-4 flex flex-col gap-2">
            {genres.map((genre) => {
                const isSelected = selectedGenres.includes(genre)
                return (
                    <div key={genre} className="flex items-center space-x-2">
                        <Checkbox
                        id={genre}
                        checked={isSelected}
                        onCheckedChange={() => toggleGenre(genre)}
                        />
                        <Label htmlFor={genre} className="cursor-pointer">
                        {genre}
                        </Label>
                    </div>
                )
            })}
          </div>
        </DrawerContent>
      </Drawer>

    </div>
  )
}