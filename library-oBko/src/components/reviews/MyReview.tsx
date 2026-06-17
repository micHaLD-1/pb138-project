import { useState } from 'react'
import { Star } from 'lucide-react'

import ReviewInput from './ReviewInput'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

const STAR_COUNT = 5

type Review = {
    id: number
    content: string
    rating: number
    createdAt: string
    userId: number
    userFirstName: string
    userLastName: string
}

type MyReviewProps = {
    review: Review
    bookId: number
}

function formatCreatedAt(createdAt: string) {
    return new Intl.DateTimeFormat('cs-CZ', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(new Date(createdAt))
}

function renderStars(rating: number) {
    return Array.from({ length: STAR_COUNT }, (_, index) => (
        <Star
            key={index}
            className={`h-4 w-4 ${
                index + 1 <= rating
                    ? 'fill-primary text-primary'
                    : 'text-muted-foreground'
            }`}
        />
    ))
}

export default function MyReview({
    review,
    bookId,
}: MyReviewProps) {
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function deleteReview() {
        const response = await fetch(
            `/api/reviews/${review.id}`,
            {
                method: 'DELETE',
                credentials: 'include',
            }
        )

        if (!response.ok) {
            let backendMessage = 'Smazání recenze selhalo'

            try {
                const body = (await response.json()) as {
                    message?: string
                }

                if (body.message) {
                    backendMessage = body.message
                }
            } catch {}

            throw new Error(backendMessage)
        }

        window.dispatchEvent(
            new CustomEvent('reviews:changed', {
                detail: { bookId },
            })
        )
    }

    return (
        <>
            <article className="relative rounded-lg border bg-background p-4 pb-10 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h3 className="text-base font-semibold">
                            {review.userFirstName} {review.userLastName}
                        </h3>

                        <p className="mt-1 text-xs text-muted-foreground">
                            {formatCreatedAt(review.createdAt)}
                        </p>
                    </div>

                    <div className="flex items-center gap-0.5">
                        {renderStars(review.rating)}
                    </div>
                </div>

                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                    {review.content}
                </p>

                <button
                    type="button"
                    className="absolute right-18 bottom-3 text-xs font-medium text-muted-foreground transition hover:text-foreground"
                    onClick={() => setIsEditOpen(true)}
                >
                    upravit
                </button>

                <button
                    type="button"
                    className="absolute right-3 bottom-3 text-xs font-medium text-muted-foreground transition hover:text-foreground"
                    onClick={async () => {
                        try {
                            await deleteReview()
                        } catch (error) {
                            setError(
                                (error as Error).message ??
                                    'Smazání recenze selhalo'
                            )
                        }
                    }}
                >
                    smazat
                </button>

                {error && (
                    <p className="mt-2 text-sm text-destructive">
                        {error}
                    </p>
                )}
            </article>

            <Dialog
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
            >
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>
                            Upravit recenzi
                        </DialogTitle>
                    </DialogHeader>

                    <ReviewInput
                        bookId={bookId}
                        reviewId={review.id}
                        initialRating={review.rating}
                        initialContent={review.content}
                        submitLabel="Uložit změny"
                        onSuccess={() => {
                            setIsEditOpen(false)

                            window.dispatchEvent(
                                new CustomEvent(
                                    'reviews:changed',
                                    {
                                        detail: { bookId },
                                    }
                                )
                            )
                        }}
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}