import { useState, type FormEvent } from 'react'
import { Star } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/context/AuthContext'

const STAR_COUNT = 5
const REVIEW_MAX_LENGTH = 1000

export type ReviewInputData = {
    bookId: number
    email: string
    rating: number
    text: string
}

type ReviewInputProps = {
    bookId: number
    onSubmit?: (data: ReviewInputData) => Promise<void> | void
    className?: string
}

type ReviewErrors = Partial<Record<'rating' | 'text' | 'submit', string>>

export default function ReviewInput({ bookId, onSubmit, className }: ReviewInputProps) {
    const { user, isLoading } = useAuth()
    const [rating, setRating] = useState<number>(0)
    const [text, setText] = useState('')
    const [errors, setErrors] = useState<ReviewErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

    if (isLoading || !user) {
        return null
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsSubmitting(true)
        setErrors({})
        setSubmitStatus('idle')

        const nextErrors: ReviewErrors = {}
        const trimmedText = text.trim()

        if (rating < 1 || rating > STAR_COUNT) {
            nextErrors.rating = 'Vyberte hodnocení'
        }

        if (trimmedText.length < 5) {
            nextErrors.text = 'Text musí mít alespoň 5 znaků'
        } else if (trimmedText.length > REVIEW_MAX_LENGTH) {
            nextErrors.text = 'Text musí mít nejvýše 1000 znaků'
        }

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors)
            setSubmitStatus('error')
            setIsSubmitting(false)
            return
        }

        const payload: ReviewInputData = {
            bookId,
            email: user.email,
            rating,
            text: trimmedText,
        }

        try {
            await onSubmit?.(payload)
            setSubmitStatus('success')
            setRating(0)
            setText('')

            window.setTimeout(() => {
                setSubmitStatus('idle')
            }, 3000)
        } catch (error) {
            setErrors({ submit: (error as Error).message || 'Odeslání recenze selhalo' })
            setSubmitStatus('error')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form className={className ?? 'grid gap-4'} onSubmit={handleSubmit}>
            <FieldSet className="gap-4">
                <Field className="gap-2">
                    <FieldContent className="gap-2">
                        <div role="group" aria-label="Review rating" className="flex items-center gap-1">
                            {Array.from({ length: STAR_COUNT }, (_, index) => {
                                const starValue = index + 1
                                const isFilled = starValue <= rating

                                return (
                                    <button
                                        key={starValue}
                                        type="button"
                                        aria-label={`Ohodnotit ${starValue} hvězdičkami`}
                                        aria-pressed={isFilled}
                                        className="rounded-md p-1 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        onClick={() => setRating(starValue)}
                                    >
                                        <Star
                                            className={`h-6 w-6 ${isFilled ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                                        />
                                    </button>
                                )
                            })}
                        </div>
                        {errors.rating && <p className="text-sm font-medium text-destructive">{errors.rating}</p>}
                    </FieldContent>
                </Field>

                <Field className="gap-2">
                    <FieldContent className="gap-1">
                        <Textarea
                            id={`review-text-${bookId}`}
                            name="text"
                            placeholder="Napište svou recenzi"
                            className="min-h-40 resize-none"
                            rows={5}
                            maxLength={REVIEW_MAX_LENGTH}
                            value={text}
                            onChange={(event) => setText(event.target.value)}
                            aria-invalid={!!errors.text}
                            required
                        />
                        <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
                            <span>{text.length}/{REVIEW_MAX_LENGTH}</span>
                            <span>Maximálně 1000 znaků</span>
                        </div>
                        {errors.text && <p className="text-sm font-medium text-destructive">{errors.text}</p>}
                    </FieldContent>
                </Field>
            </FieldSet>

            <div className="flex flex-wrap items-center gap-3">
                <Button type="submit" disabled={isSubmitting}>
                    {submitStatus === 'success' ? '✓ Odesláno' : 'Odeslat recenzi'}
                </Button>
                {errors.submit && <p className="text-sm font-medium text-destructive">{errors.submit}</p>}
            </div>
        </form>
    )
}