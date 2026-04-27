import type { Book } from '@/lib/schemas'

const bookList: Book[] = [
  {
    id: 'the-little-prince',
    name: 'The Little Prince',
    author: 'Antoine de Saint-Exupery',
    description:
      'A poetic and philosophical novella about friendship, love, and loss. Through encounters on distant planets, the Little Prince reveals how adults often lose sight of what truly matters. The story invites readers to look beyond appearances and value empathy, curiosity, and human connection.',
    totalCopies: 12,
    availableCopies: 5,
    rating: 4.2,
    genre: 'Fable',
    imageUrl:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'moby-dick',
    name: 'Moby-Dick',
    author: 'Herman Melville',
    description:
      'A seafaring epic that follows Captain Ahab and his obsessive pursuit of the white whale. The novel blends adventure, symbolism, and reflections on fate, revenge, and humanity.',
    totalCopies: 8,
    availableCopies: 2,
    rating: 3.8,
    genre: 'Classic',
    imageUrl:
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=900&q=80',
  },
]

export const mockBooksById: Record<string, Book> = bookList.reduce<Record<string, Book>>(
  (acc, book) => {
    acc[book.id] = book
    return acc
  },
  {},
)
