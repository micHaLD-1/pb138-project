import { Card, CardContent } from "@/components/ui/card"

type Book = {
  id: string
  title: string
  author: string
  genre: string
  image: string
  description: string
}

type BookCardProps = {
  book: Book
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Card className="overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      <CardContent className="p-0">
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={book.image}
            alt={book.title}
            className="block h-full w-full object-cover"
          />
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
  )
}