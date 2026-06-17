import { Star } from 'lucide-react'

const STAR_COUNT = 5

export type ReviewDisplayItem = {
	name: string
	surname: string
	userId?: number
	bookId?: number
	rating: number
	createdAt: string | Date
	content: string
}

type ReviewDisplayProps = {
	reviews: ReviewDisplayItem[]
	className?: string
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
	return Array.from({ length: STAR_COUNT }, (_, index) => {
		const starValue = index + 1
		const isFilled = starValue <= rating

		return (
			<Star
				key={starValue}
				className={`h-4 w-4 ${isFilled ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
				aria-hidden="true"
			/>
		)
	})
}

export default function ReviewDisplay({ reviews, className }: ReviewDisplayProps) {
	if (reviews.length === 0) {
		return <p className={className ?? 'text-sm text-muted-foreground'}>Zatím nejsou k dispozici žádné recenze.</p>
	}

	return (
		<div className={className ?? 'grid gap-3'}>
			{reviews.map((review, index) => (
				<article key={`${review.name}-${review.surname}-${review.createdAt}-${index}`} className="rounded-lg border bg-background p-4 shadow-sm">
					<div className="flex flex-wrap items-start justify-between gap-3">
						<div>
							<h3 className="text-base font-semibold text-foreground">
								{review.name} {review.surname}
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
			))}
		</div>
	)
}
