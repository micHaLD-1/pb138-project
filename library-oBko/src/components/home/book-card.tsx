import { Card, CardContent } from "@/components/ui/card"
import { Link } from "react-router-dom"

type Book = {
  id: string
  title: string
  author: string
  genre: string
  description: string
}

type BookCardProps = {
  book: Book
}

const images = ["https://covers.openlibrary.org/b/id/7984916-L.jpg",
  "https://covers.openlibrary.org/b/id/8101356-L.jpg",
  "https://covers.openlibrary.org/b/id/7222246-L.jpg",
  "https://covers.openlibrary.org/b/id/6979861-L.jpg",
  "https://covers.openlibrary.org/b/id/7984916-L.jpg",
]

export default function BookCard({ book }: BookCardProps) {
  return (
    <Link to={`/books/${book.id}`}>
    <Card className="overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      <CardContent className="p-0">
        <div className="aspect-[3/4] overflow-hidden">
        {/* TODO: when we have pictures, put book.id instead of 1*/}
         <img src={`/api/books/${book.id}/cover`} alt={book.title}
            className="block h-full w-full object-cover" />

        </div>

        <div className="p-3 w-full h-full">
          <h1 className="text-lg font-semibold text-card-foreground">
            {book.title} - {book.author}
          </h1>

          <span className="mt-1 inline-block text-xs text-card-foreground">
            {book.genre}
          </span>

          <p className="mt-2 text-xs text-muted-foreground leading-snug line-clamp-3 font-medium">
            {book.description}
          </p>
        </div>
      </CardContent>
    </Card>
    </Link>
  )
}