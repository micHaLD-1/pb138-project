import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'

const STAR_COUNT = 5
const PAGE_SIZE = 10

type ReviewDisplayItem = {
	id: number
	bookId: number
	userId: number
	userFirstName: string
	userLastName: string
	createdAt: string | Date
	content: string
	rating: number
}

type ReviewDisplayProps = {
	bookId: number
}

type ReviewsResponse = {
	reviews: ReviewDisplayItem[]
	page: number
	pageSize: number
	total: number
}

async function fetchReviewsByBookId(bookId: number, page: number): Promise<ReviewsResponse> {
	const response = await fetch(`/api/reviews/book/${bookId}?page=${page}&size=${PAGE_SIZE}`, {
		credentials: 'include',
	})

	if (!response.ok) {
		throw new Error('Failed to fetch reviews')
	}

	return response.json() as Promise<ReviewsResponse>
}

function formatCreatedAt(createdAt: string | Date): string {
	const date = createdAt instanceof Date ? createdAt : new Date(createdAt)

	if (Number.isNaN(date.getTime())) {
		return String(createdAt)
	}

	return new Intl.DateTimeFormat('cs-CZ', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	}).format(date)
}

function renderStars(rating: number) {
	const projectedRating = Math.max(0, Math.min(STAR_COUNT, Math.round(rating)))

	return Array.from({ length: STAR_COUNT }, (_, index) => {
		const starValue = index + 1
		const isFilled = starValue <= projectedRating

		return (
			<Star
				key={starValue}
				className={`h-4 w-4 ${isFilled ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
				aria-hidden="true"
			/>
		)
	})
}

export default function ReviewDisplay({ bookId }: ReviewDisplayProps) {
	const [reviews, setReviews] = useState<ReviewDisplayItem[]>([])
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(PAGE_SIZE)
	const [total, setTotal] = useState(0)
	const [isLoading, setIsLoading] = useState(true)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [refreshToken, setRefreshToken] = useState(0)

	useEffect(() => {
		setPage(1)
		setRefreshToken((current) => current + 1)
	}, [bookId])

	useEffect(() => {
		function handleReviewsChanged(event: Event) {
			const customEvent = event as CustomEvent<{ bookId?: number }>

			if (customEvent.detail?.bookId === bookId) {
				setRefreshToken((current) => current + 1)
			}
		}

		window.addEventListener('reviews:changed', handleReviewsChanged)

		return () => {
			window.removeEventListener('reviews:changed', handleReviewsChanged)
		}
	}, [bookId])

	useEffect(() => {
		const controller = new AbortController()

		async function loadReviews() {
			setIsLoading(true)
			setErrorMessage(null)

			try {
				const data = await fetchReviewsByBookId(bookId, page)
				if (controller.signal.aborted) {
					return
				}

				setReviews(data.reviews)
				setTotal(data.total)
				setPageSize(data.pageSize || PAGE_SIZE)
			} catch {
				if (!controller.signal.aborted) {
					setReviews([])
					setTotal(0)
					setErrorMessage('Nepodařilo se načíst recenze.')
				}
			} finally {
				if (!controller.signal.aborted) {
					setIsLoading(false)
				}
			}
		}

		loadReviews()

		return () => controller.abort()
	}, [bookId, page, refreshToken])

	const totalPages = Math.max(1, Math.ceil(total / pageSize))

	if (isLoading) {
		return <p className="text-sm text-muted-foreground">Načítání recenzí...</p>
	}

	if (errorMessage) {
		return <p className="text-sm font-medium text-destructive">{errorMessage}</p>
	}

	if (reviews.length === 0) {
		return <p className="text-sm text-muted-foreground">Zatím nejsou k dispozici žádné recenze.</p>
	}

	return (
		<>
			<div className="grid gap-3">
				{reviews.map((review, index) => {
					return (
						<article
							key={`${review.id}-${index}`}
							className="relative rounded-lg border bg-background p-4 pb-10 shadow-sm"
						>
							<div className="flex flex-wrap items-start justify-between gap-3">
								<div>
									<h3 className="text-base font-semibold text-foreground">
										{review.userFirstName} {review.userLastName}
									</h3>
									<p className="mt-1 text-xs text-muted-foreground">{formatCreatedAt(review.createdAt)}</p>
								</div>

								<div className="flex items-center gap-0.5" aria-label={`Rating ${review.rating} out of ${STAR_COUNT}`}>
									{renderStars(review.rating)}
								</div>
							</div>

							<p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
								{review.content}
							</p>
						</article>
					)
				})}

				{totalPages > 1 && (
					<div className="mt-2 flex items-center justify-center gap-2">
						<button
							type="button"
							disabled={page <= 1}
							className="rounded-md border border-border px-3 py-1.5 text-sm font-medium transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
							onClick={() => setPage((current) => current - 1)}
						>
							Previous
						</button>
						<span className="text-sm text-muted-foreground">
							{page} / {totalPages}
						</span>
						<button
							type="button"
							disabled={page >= totalPages}
							className="rounded-md border border-border px-3 py-1.5 text-sm font-medium transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
							onClick={() => setPage((current) => current + 1)}
						>
							Next
						</button>
					</div>
				)}
			</div>
		</>
	)
}
