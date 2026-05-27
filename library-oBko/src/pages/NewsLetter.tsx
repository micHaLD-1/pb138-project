import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
	Field,
	FieldContent,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

type NewsletterErrors = {
	audience?: string
	message?: string
}

export default function NewsLetter() {
	const [audience, setAudience] = useState({ users: false, staff: false })
	const [message, setMessage] = useState("")
	const [errors, setErrors] = useState<NewsletterErrors>({})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setErrors({})
		setSubmitStatus("idle")
		setIsSubmitting(true)

		const nextErrors: NewsletterErrors = {}
		if (!audience.users && !audience.staff) {
			nextErrors.audience = "Vyberte alespon jednu skupinu"
		}

		if (message.trim().length < 5) {
			nextErrors.message = "Zprava musi mit alespon 5 znaku"
		}

		if (Object.keys(nextErrors).length > 0) {
			setErrors(nextErrors)
			setSubmitStatus("error")
			setIsSubmitting(false)
			return
		}

		setSubmitStatus("success")

		// TODO: Add actual newsletter submission logic here

		setTimeout(() => {
			setAudience({ users: false, staff: false })
			setMessage("")
			setErrors({})
			setSubmitStatus("idle")
			setIsSubmitting(false)
		}, 4000)
	}

	return (
		<div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
			<h1 className="mb-2 text-3xl font-extrabold">Newsletter</h1>

			<form className="rounded-xl border bg-card p-6 shadow-sm" onSubmit={handleSubmit}>
				<FieldSet className="gap-6">
					<FieldGroup className="gap-2">
						<div data-slot="checkbox-group" className="flex flex-col gap-3">
							<Field orientation="horizontal" className="items-center gap-3">
								<Checkbox
									id="newsletter-users"
									checked={audience.users}
									onCheckedChange={(checked) =>
										setAudience((prev) => ({
											...prev,
											users: checked === true,
										}))
									}
								/>
								<FieldLabel htmlFor="newsletter-users">Uživatelům</FieldLabel>
							</Field>
							<Field orientation="horizontal" className="items-center gap-3">
								<Checkbox
									id="newsletter-staff"
									checked={audience.staff}
									onCheckedChange={(checked) =>
										setAudience((prev) => ({
											...prev,
											staff: checked === true,
										}))
									}
								/>
								<FieldLabel htmlFor="newsletter-staff">Zamestnancům</FieldLabel>
							</Field>
						</div>
						{errors.audience && (
							<p className="text-sm font-medium text-destructive">{errors.audience}</p>
						)}
					</FieldGroup>

					<Field className="gap-2">
						<FieldContent className="gap-1">
							<Textarea
								id="newsletter-message"
								name="message"
								placeholder="Napiste text newsletteru"
								className="min-h-40 resize-none"
								rows={6}
								value={message}
								onChange={(event) => setMessage(event.target.value)}
								aria-invalid={!!errors.message}
								required
							/>
							{errors.message && (
								<p className="text-sm font-medium text-destructive">{errors.message}</p>
							)}
						</FieldContent>
					</Field>

					<div className="flex flex-wrap items-center gap-3">
						<Button type="submit" disabled={isSubmitting}>
							{submitStatus === "success" ? "✓ Odeslano" : "Odeslat newsletter"}
						</Button>
						{submitStatus === "error" && (
							<p className="text-sm font-medium text-destructive">
								Prosim zkontrolujte chyby vyse
							</p>
						)}
					</div>
				</FieldSet>
			</form>
		</div>
	)
}
