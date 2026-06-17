import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Star } from 'lucide-react'
import fallbackImage from '@/assets/hero.png'
import wishlistIcon from '@/assets/Subtract.png'
import { useWishlist } from '@/context/WishlistContext'
import ReviewSection from '@/components/reviews/ReviewSection'
import ReviewDisplay from '../components/reviews/ReviewDisplay'
import ReservationDialog from '@/components/book/ReservationDialog'
import { mockReviews } from '@/lib/mock-reviews'

const STAR_COUNT = 5

type BookDetail = {
    id: number
    title: string
    language: string
    publisherName: string
    yearPublished: number
    description: string
    genres: string[]
    authors: string[]
    availableCopies: number
    totalCopies: number
}

type LoadState = 'loading' | 'ready' | 'not-found'

function formatAvailability(available: number, total: number): string {
    return `${available} / ${total}`
}

export default function BookDetail() {
    const { id } = useParams<{ id: string }>()
    const [loadState, setLoadState] = useState<LoadState>('loading')
    const [book, setBook] = useState<BookDetail | null>(null)
    const [imageFailed, setImageFailed] = useState(false)

    const { addToWishlist } = useWishlist()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        if (!id) {
            setLoadState('not-found')
            return
        }

        setLoadState('loading')
        setImageFailed(false)

        fetch(`/api/books/${id}`, { credentials: 'include' })
            .then((res) => {
                if (res.status === 404) {
                    setLoadState('not-found')
                    return null
                }
                if (!res.ok) throw new Error('Failed to fetch book')
                return res.json()
            })
            .then((data) => {
                if (!data) return
                setBook(data)
                setLoadState('ready')
            })
            .catch(() => setLoadState('not-found'))
    }, [id])

    if (loadState === 'loading') {
        return (
            <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="rounded-xl border bg-card p-8 shadow-sm">
                    <p className="text-muted-foreground">Loading book details...</p>
                </div>
            </section>
        )
    }

    if (loadState === 'not-found' || !book) {
        return (
            <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="rounded-xl border bg-card p-8 shadow-sm">
                    <h1 className="text-2xl font-extrabold">Book Not Found</h1>
                    <p className="mt-3 text-muted-foreground">
                        We could not find the requested book.
                    </p>
                </div>
            </section>
        )
    }

    const coverUrl = `/api/books/${book.id}/cover`
    const projectedRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length

    return (
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid gap-6 md:min-h-105 md:grid-cols-[minmax(280px,1fr)_minmax(320px,1fr)] md:grid-rows-[auto_auto] md:items-stretch">
                <article className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <div className="h-full min-h-0 w-full bg-muted">
                        <img
                            src={imageFailed ? fallbackImage : coverUrl}
                            alt={`Book cover for ${book.title}`}
                            className="h-full w-full object-cover"
                            onError={() => setImageFailed(true)}
                        />
                    </div>
                </article>

                <div className="grid gap-5">
                    <section className="rounded-xl border bg-card p-5 shadow-sm">
                        <div className="mt-4 flex flex-col gap-4">
                            <div className="flex flex-wrap items-center gap-4">
                                <div
                                    role="img"
                                    aria-label={`Book rating ${projectedRating.toFixed(1)} out of ${STAR_COUNT}`}
                                    className="flex items-center gap-1"
                                >
                                    {Array.from({ length: STAR_COUNT }, (_, index) => {
                                        const starValue = index + 1
                                        const isFilled = starValue <= Math.round(projectedRating)

                                        return (
                                            <span key={starValue} className="rounded-md p-1">
                                                <Star
                                                    className={`h-6 w-6 ${isFilled ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <ReservationDialog
                                    bookId={book.id}
                                    bookTitle={book.title}
                                    availableCopies={book.availableCopies}
                                />

                                <button
                                    type="button"
                                    aria-label="Add to wishlist"
                                    className={`rounded-md border border-border p-2 transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring `}
                                    onClick={() => {
                                        addToWishlist(book as any)
                                    }}
                                >
                                    <img src={wishlistIcon} alt="" className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-xl border bg-card p-5 shadow-sm">
                        <h2 className="mb-5 text-3xl font-extrabold leading-tight">{book.title}</h2>

                        <div className="flex items-baseline gap-2">
                            <p className="text-md uppercase tracking-wide text-muted-foreground">Žánr:</p>
                            <p className="text-md">{book.genres.join(', ')}</p>
                        </div>

                        <div className="mt-4 flex items-baseline gap-2">
                            <p className="text-md uppercase tracking-wide text-muted-foreground">Autor:</p>
                            <p className="text-md font-bold">{book.authors.join(', ')}</p>
                        </div>

                        <div className="mt-4 flex items-baseline gap-2">
                            <p className="text-md uppercase tracking-wide text-muted-foreground">Vydavatel:</p>
                            <p className="text-md">{book.publisherName}</p>
                        </div>

                        <div className="mt-4 flex items-baseline gap-2">
                            <p className="text-md uppercase tracking-wide text-muted-foreground">Rok vydání:</p>
                            <p className="text-md">{book.yearPublished}</p>
                        </div>

                        <div className="mt-4 flex items-baseline gap-2">
                            <p className="text-md uppercase tracking-wide text-muted-foreground">Jazyk:</p>
                            <p className="text-md">{book.language}</p>
                        </div>

                        <div className="mt-4 flex items-baseline gap-2">
                            <p className="text-md uppercase tracking-wide text-muted-foreground">Dostupnost:</p>
                            <p className="text-md">
                                {formatAvailability(book.availableCopies, book.totalCopies)} kopií
                            </p>
                        </div>
                    </section>
                </div>
            </div>

            <section className="rounded-xl border bg-card p-5 shadow-sm">
                <h2 className="text-xl font-extrabold">Popis</h2>
                <div className="mt-3 max-h-80 overflow-auto pr-1">
                    <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                        {book.description}
                    </p>
                </div>
            </section>

            <section className="rounded-xl border bg-card p-5 shadow-sm">
                <h2 className="text-xl font-extrabold">Recenze</h2>

                <ReviewSection bookId={book.id} />

                <div className="mt-3 max-h-80 overflow-auto pr-1">
                    <ReviewDisplay bookId={book.id} />
                </div>
            </section>
        </section>
    )
}
