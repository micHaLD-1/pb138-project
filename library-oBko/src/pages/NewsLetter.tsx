import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Field,
	FieldContent,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

type NewsletterCreationDTO = {
	subject: string
	text: string
	recipientUserIds?: number[]
}

type NewsletterDTO = {
	id: number
	employeeId: number
	employeeName: string
	createdAt: string
	subject: string
	text: string
	recipientCount: number
}

type SendCampaignDTO = {
	message: string
	campaignId?: number
}

type NewsletterErrors = {
	audience?: string
	subject?: string
	message?: string
	submit?: string
}

export default function NewsLetter() {
	const [audience, setAudience] = useState({ users: false, staff: false })
	const [subject, setSubject] = useState("")
	const [message, setMessage] = useState("")
	const [errors, setErrors] = useState<NewsletterErrors>({})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		// Validation
		const newErrors: NewsletterErrors = {}
		if (!audience.users && !audience.staff) {
			newErrors.audience = "Vyberte alespoň jednu skupinu příjemců"
		}
		if (!subject.trim()) {
			newErrors.subject = "Předmět je povinný"
		}
		if (!message.trim()) {
			newErrors.message = "Text newsletteru je povinný"
		}
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors)
			return
		}

		setErrors({})
		setIsSubmitting(true)
		setSubmitStatus("idle")

		try {
			// Build payload — pass recipientUserIds only if you have concrete IDs to filter by.
			// If both checkboxes are checked (or you have no ID lists), omit the field
			// so the backend defaults to all users.
			const payload: NewsletterCreationDTO = {
				subject: subject.trim(),
				text: message.trim(),
			}

			// Step 1: create the newsletter record + store recipients
			const created: NewsletterDTO = await fetch("/api/newsletter", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			}).then(async (res) => {
				if (!res.ok) {
					const err = await res.json().catch(() => ({}))
					throw new Error(err?.message ?? `Chyba serveru (${res.status})`)
				}
				return res.json()
			})

			// Step 2: trigger Brevo campaign send
			const campaign: SendCampaignDTO = await fetch(`/api/newsletter/${created.id}/send`, {
				method: "POST",
			}).then(async (res) => {
				if (!res.ok) {
					const err = await res.json().catch(() => ({}))
					throw new Error(err?.message ?? `Chyba při odesílání kampaně (${res.status})`)
				}
				return res.json()
			})

			console.log("Campaign sent, id:", campaign.campaignId)
			setSubmitStatus("success")
			setSubject("")
			setMessage("")
			setAudience({ users: false, staff: false })
		} catch (err) {
			setSubmitStatus("error")
			setErrors({
				submit: err instanceof Error ? err.message : "Neočekávaná chyba, zkuste to znovu",
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
			<h1 className="mb-2 text-3xl font-extrabold">Newsletter</h1>

			<form className="rounded-xl border bg-card p-6 shadow-sm" onSubmit={handleSubmit}>
				<FieldSet className="gap-6">

					{/* Audience */}
					<FieldGroup className="gap-2">
						<div data-slot="checkbox-group" className="flex flex-col gap-3">
							<Field orientation="horizontal" className="items-center gap-3">
								<Checkbox
									id="newsletter-users"
									checked={audience.users}
									onCheckedChange={(checked) =>
										setAudience((prev) => ({ ...prev, users: checked === true }))
									}
								/>
								<FieldLabel htmlFor="newsletter-users">Uživatelům</FieldLabel>
							</Field>
							<Field orientation="horizontal" className="items-center gap-3">
								<Checkbox
									id="newsletter-staff"
									checked={audience.staff}
									onCheckedChange={(checked) =>
										setAudience((prev) => ({ ...prev, staff: checked === true }))
									}
								/>
								<FieldLabel htmlFor="newsletter-staff">Zamestnancům</FieldLabel>
							</Field>
						</div>
						{errors.audience && (
							<p className="text-sm font-medium text-destructive">{errors.audience}</p>
						)}
					</FieldGroup>

					{/* Subject */}
					<Field className="gap-2">
						<FieldLabel htmlFor="newsletter-subject">Predmet</FieldLabel>
						<FieldContent className="gap-1">
							<Input
								id="newsletter-subject"
								name="subject"
								placeholder="Nadpis emailu"
								maxLength={255}
								value={subject}
								onChange={(e) => setSubject(e.target.value)}
								aria-invalid={!!errors.subject}
							/>
							{errors.subject && (
								<p className="text-sm font-medium text-destructive">{errors.subject}</p>
							)}
						</FieldContent>
					</Field>

					{/* Message */}
					<Field className="gap-2">
						<FieldContent className="gap-1">
							<Textarea
								id="newsletter-message"
								name="message"
								placeholder="Napiste text newsletteru"
								className="min-h-40 resize-none"
								rows={6}
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								aria-invalid={!!errors.message}
								required
							/>
							{errors.message && (
								<p className="text-sm font-medium text-destructive">{errors.message}</p>
							)}
						</FieldContent>
					</Field>

					{/* Submit row */}
					<div className="flex flex-wrap items-center gap-3">
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting
								? "Odesílání…"
								: submitStatus === "success"
									? "✓ Odeslano"
									: "Odeslat newsletter"}
						</Button>
						{submitStatus === "error" && !errors.submit && (
							<p className="text-sm font-medium text-destructive">
								Prosim zkontrolujte chyby vyse
							</p>
						)}
						{errors.submit && (
							<p className="text-sm font-medium text-destructive">{errors.submit}</p>
						)}
					</div>

				</FieldSet>
			</form>
		</div>
	)
}