import { Filter } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel"
import BookCard from "./book-card"
import FilterPanel from "./filter-panel"
import { useState } from "react"

export type Book = {
  id: string
  title: string
  author: string
  genre: string
  image: string
  description: string
}


const allBooks: Book[] = [
  {
    id: "1",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    image: "https://covers.openlibrary.org/b/id/6979861-L.jpg",
    description:
      "A classic fantasy adventure following Bilbo Baggins, a reluctant hobbit who is swept into an epic journey with a group of dwarves to reclaim their homeland from the dragon Smaug. Along the way, Bilbo discovers courage, wit, and a mysterious ring that will change the fate of Middle-earth forever.",
  },
  {
    id: "2",
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian",
    image: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
    description:
      "A haunting dystopian novel set in a totalitarian society ruled by Big Brother. It follows Winston Smith, a man who begins to question the regime’s oppressive control, surveillance, and manipulation of truth. A powerful warning about censorship, propaganda, and loss of individuality.",
  },
  {
    id: "3",
    title: "Dune",
    author: "Frank Herbert",
    genre: "Sci-Fi",
    image: "https://covers.openlibrary.org/b/id/8101356-L.jpg",
    description:
      "An epic science fiction saga set on the desert planet Arrakis, the only source of the universe’s most valuable substance, spice. Paul Atreides becomes entangled in politics, prophecy, and war as he rises to become a messianic figure in a complex interstellar struggle.",
  },
  {
    id: "4",
    title: "Harry Potter",
    author: "J.K. Rowling",
    genre: "Fantasy",
    image: "https://covers.openlibrary.org/b/id/7984916-L.jpg",
    description:
      "The story of a young boy who discovers he is a wizard and attends Hogwarts School of Witchcraft and Wizardry. As Harry grows, he learns about friendship, magic, and his destiny to confront the dark wizard Voldemort who threatens the magical world.",
  },

  // duplicates (kept as you had them)
  {
    id: "5",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    image: "https://covers.openlibrary.org/b/id/6979861-L.jpg",
    description:
      "A classic fantasy adventure following Bilbo Baggins, a reluctant hobbit who is swept into an epic journey with a group of dwarves to reclaim their homeland from the dragon Smaug.",
  },
  {
    id: "6",
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian",
    image: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
    description:
      "A dystopian vision of a future where surveillance and propaganda control every aspect of life, and individuality is considered a threat to the state.",
  },
  {
    id: "7",
    title: "Dune",
    author: "Frank Herbert",
    genre: "Sci-Fi",
    image: "https://covers.openlibrary.org/b/id/8101356-L.jpg",
    description:
      "A political and spiritual science fiction epic about power, prophecy, and survival on the desert planet Arrakis.",
  },
  {
    id: "8",
    title: "Harry Potter",
    author: "J.K. Rowling",
    genre: "Fantasy",
    image: "https://covers.openlibrary.org/b/id/7984916-L.jpg",
    description:
      "A coming-of-age magical story about friendship, courage, and the battle between good and evil in the wizarding world.",
  },
]

export default function BookGrid() {
  const [books, setBooks] = useState(allBooks);
  return (
    <div className="w-full px-4 py-6 md:px-8">
        <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
                {allBooks.map((book) => (
                <CarouselItem key={book.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <BookCard book={book} />
                </CarouselItem>
                ))}
            </CarouselContent>

            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
        <FilterPanel 
            authors={["J.R.R. Tolkien", "George Orwell", "Frank Herbert", "J.K. Rowling"]}
            genres={["Fantasy", "Sci-Fi", "Dystopian"]}
            allBooks={allBooks}
            setFilteredBooks={setBooks}
        />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-10">
        {books.map((book) => (
          <BookCard book={book} />
        ))}
      </div>
    </div>
  )
}