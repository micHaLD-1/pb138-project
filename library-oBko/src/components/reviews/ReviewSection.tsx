import { useEffect, useState } from 'react'

import ReviewInput from './ReviewInput'
import MyReview from './MyReview'

type Review = {
    id: number
    content: string
    rating: number
    createdAt: string
    userId: number
    userFirstName: string
    userLastName: string
}

type ReviewSectionProps = {
    bookId: number
}

type MyReviewResponse = {
    review: Review | null
}

export default function ReviewSection({
    bookId,
}: ReviewSectionProps) {
    const [review, setReview] = useState<Review | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [refreshToken, setRefreshToken] = useState(0)

    useEffect(() => {
        function handleReviewChanged(event: Event) {
            const customEvent = event as CustomEvent<{ bookId?: number }>

            if (customEvent.detail?.bookId === bookId) {
                setRefreshToken((current) => current + 1)
            }
        }

        window.addEventListener('reviews:changed', handleReviewChanged)

        return () => {
            window.removeEventListener(
                'reviews:changed',
                handleReviewChanged
            )
        }
    }, [bookId])

    useEffect(() => {
        const controller = new AbortController()

        async function loadMyReview() {
            setIsLoading(true)
            setError(null)

            try {
                const response = await fetch(
                    `/api/reviews/me?bookId=${bookId}`,
                    {
                        credentials: 'include',
                        signal: controller.signal,
                    }
                )

                if (!response.ok) {
                    throw new Error()
                }

                const data =
                    (await response.json()) as MyReviewResponse

                setReview(data.review)
            } catch {
                if (!controller.signal.aborted) {
                    setError('Nepodařilo se načíst vaši recenzi.')
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false)
                }
            }
        }

        loadMyReview()

        return () => controller.abort()
    }, [bookId, refreshToken])

    if (isLoading) {
        return (
            <p className="text-sm text-muted-foreground">
                Načítání...
            </p>
        )
    }

    if (error) {
        return (
            <p className="text-sm text-destructive">
                {error}
            </p>
        )
    }

    return review ? (
        <MyReview
            review={review}
            bookId={bookId}
        />
    ) : (
        <ReviewInput bookId={bookId} />
    )
}