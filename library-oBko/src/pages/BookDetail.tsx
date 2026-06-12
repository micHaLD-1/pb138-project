import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Star } from 'lucide-react'
import fallbackImage from '@/assets/hero.png'
import wishlistIcon from '@/assets/Subtract.png'
// TODO: Replace WishlistContext with backend API calls
import { useWishlist } from '@/context/WishlistContext'
import { Button } from '@/components/ui/button'
import ReviewInput, { type ReviewInputData } from '@/components/reviews/ReviewInput'
import ReservationDialog from '@/components/book/ReservationDialog'

const STAR_COUNT = 5
const PAGE_SIZE = 10

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
    const [selectedRating, setSelectedRating] = useState<number | null>(null)
    const [page, setPage] = useState(1)
    const [total] = useState(0)

    const [activePop, setActivePop] = useState<string | null>(null)
    const [submittedReviews, setSubmittedReviews] = useState<ReviewInputData[]>([])

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

    const triggerPop = (controlId: string) => {
        setActivePop(controlId)
        window.setTimeout(() => {
            setActivePop((current) => (current === controlId ? null : current))
        }, 220)
    }

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

    const uiRating = selectedRating ?? 0
    const coverUrl = `/api/books/${book.id}/cover`

    const totalPages = Math.ceil(total / PAGE_SIZE)

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
                                    role="group"
                                    aria-label="Book rating"
                                    className="flex items-center gap-1"
                                >
                                    {Array.from({ length: STAR_COUNT }, (_, index) => {
                                        const starValue = index + 1
                                        const isFilled = starValue <= Math.round(uiRating)
                                        const popClass = activePop === `star-${starValue}`
                                            ? 'animate-[bounce_220ms_ease-out_1]'
                                            : ''

                                        return (
                                            <button
                                                key={starValue}
                                                type="button"
                                                aria-label={`Set rating to ${starValue} star${starValue > 1 ? 's' : ''}`}
                                                className={`rounded-md p-1 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${popClass}`}
                                                onClick={() => {
                                                    setSelectedRating(starValue)
                                                    triggerPop(`star-${starValue}`)
                                                }}
                                            >
                                                <Star
                                                    className={`h-6 w-6 ${isFilled ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                                                />
                                            </button>
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
                                    className={`rounded-md border border-border p-2 transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${activePop === 'wishlist' ? 'animate-[bounce_220ms_ease-out_1]' : ''}`}
                                    onClick={() => {
                                        addToWishlist(book as any)
                                        triggerPop('wishlist')
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
                <div className="mt-3 max-h-80 overflow-auto pr-1">
                    <ReviewInput
                        bookId={book.id}
                        onSubmit={(review) => {
                            setSubmittedReviews((current) => [review, ...current].slice(0, 3))
                        }}
                    />

                    {submittedReviews.length > 0 && (
                        <div className="mt-4 grid gap-3">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                Nedávno odeslané recenze
                            </h3>
                            {submittedReviews.map((review, index) => (
                                <article key={`${review.email}-${index}`} className="rounded-lg border bg-background p-3 shadow-sm">
                                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                                        <p className="font-medium">{review.email}</p>
                                        <p className="text-muted-foreground">{review.rating} / {STAR_COUNT}</p>
                                    </div>
                                    <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                                        {review.text}
                                    </p>
                                </article>
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
            </section>
        </section>
    )
}
