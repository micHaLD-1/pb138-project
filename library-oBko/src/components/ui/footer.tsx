import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldContent,
    FieldGroup,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field"
import { InputGroup, InputGroupInput } from "@/components/ui/input-group"
import { Textarea } from "@/components/ui/textarea"
import { footerMessageSchema, type FooterMessageData } from "@/lib/schemas"
import { useAuth } from '@/context/AuthContext'

type FooterMessageErrors = Partial<Record<keyof FooterMessageData, string>>

const openingHours = [
    "Po 8:00 - 17:00",
    "Ut 8:00 - 17:00",
    "St 8:00 - 19:00",
    "Čt 8:00 - 17:00",
    "Pá 8:00 - 17:00",
    "So 9:00 - 15:00",
    "Ne Zavřeno",
]

function Footer() {
    const [footerErrors, setFooterErrors] = useState<FooterMessageErrors>({})
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { user } = useAuth()

    async function handleMessageSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsSubmitting(true)
        setFooterErrors({})
        setSubmitStatus("idle")

        const formData = new FormData(event.currentTarget)
        const data = {
            email: formData.get("email") as string,
            message: formData.get("message") as string,
        }

        const result = footerMessageSchema.safeParse(data)

        if (!result.success) {
            const errors: FooterMessageErrors = {}
            result.error.issues.forEach((error: any) => {
                const field = error.path[0] as keyof FooterMessageData
                errors[field] = error.message
            })
            setFooterErrors(errors)
            setSubmitStatus("error")
            setIsSubmitting(false)
            return
        }

        // Form is valid, proceed with submission
        setSubmitStatus("success")
        // TODO: Add actual message submission logic here

        // Reset form after successful submission
        const form = event.currentTarget
        setTimeout(() => {
            form.reset()
            setFooterErrors({})
            setSubmitStatus("idle")
            setIsSubmitting(false)
        }, 5000)
    }
    return (
        <footer className="w-full border-t border-border bg-background font-sans text-foreground">
            <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6">
                    <section className="w-full rounded-lg border border-border bg-background p-4 md:order-1 md:p-5 lg:order-1">
                        <FieldSet className="gap-3">
                            <FieldLegend className="text-left text-lg font-bold tracking-tight">
                                Otevírací hodiny
                            </FieldLegend>
                            <FieldGroup className="gap-1.5">
                                {openingHours.map((line) => (
                                    <p key={line} className="text-left text-sm text-foreground md:text-[0.98rem]">
                                        {line}
                                    </p>
                                ))}
                            </FieldGroup>
                        </FieldSet>
                    </section>

                    <section className="flex h-full w-full rounded-lg border border-border bg-background p-4 md:order-3 md:col-span-2 md:mx-auto md:max-w-3xl md:p-5 lg:order-2 lg:col-span-1 lg:mx-0 lg:max-w-none">
                        <form className="flex h-full flex-1" onSubmit={handleMessageSubmit}>
                            <FieldSet className="flex h-full gap-4 flex-1">
                                <FieldGroup className="h-full flex-1 gap-4">
                                    <Field className="flex flex-col gap-2">
                                        <FieldContent className="gap-1">
                                            <InputGroup>
                                                <InputGroupInput
                                                    id="footer-email"
                                                    type="email"
                                                    name="email"
                                                    defaultValue={user?.email ?? ''}
                                                    placeholder="vas@email.com"
                                                    autoComplete="email"
                                                    aria-invalid={!!footerErrors.email}
                                                    required
                                                />
                                            </InputGroup>
                                            {footerErrors.email && (
                                                <p className="text-sm font-medium text-destructive">{footerErrors.email}</p>
                                            )}
                                        </FieldContent>
                                    </Field>

                                    <Field className="flex flex-1 flex-col gap-2">
                                        <FieldContent className="flex flex-1 gap-1">
                                            <Textarea
                                                id="footer-message"
                                                name="message"
                                                placeholder="Napište nám zprávu"
                                                className="min-h-40 flex-1 resize-none"
                                                rows={4}
                                                aria-invalid={!!footerErrors.message}
                                                required
                                            />
                                            {footerErrors.message && (
                                                <p className="text-sm font-medium text-destructive">{footerErrors.message}</p>
                                            )}
                                        </FieldContent>
                                    </Field>

                                    <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                                        {submitStatus === "success" ? "✓ Odesláno" : "Odeslat zprávu"}
                                    </Button>
                                    {submitStatus === "error" && (
                                        <p className="text-sm font-medium text-destructive">
                                            Prosím zkontrolujte chyby výše</p>
                                    )}
                                </FieldGroup>
                            </FieldSet>
                        </form>
                    </section>

                    <section className="w-full rounded-lg border border-border bg-background p-4 md:order-2 md:p-5 lg:order-3 lg:col-span-1">
                        <FieldSet className="gap-4">

                            <div className="space-y-3">
                                <div className="overflow-hidden rounded-lg border border-border bg-background">
                                    <div className="aspect-16/10 w-full">
                                        <iframe
                                            title="Google mapa"
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d768.7269978987478!2d16.59746413258698!3d49.20999411510674!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4712946aeffc3a2f%3A0xdef3687440b0daf2!2s602%2000%20Brno-Kr%C3%A1lovo%20Pole%2C%20%C4%8Cesko!5e0!3m2!1ssk!2ssk!4v1777106236261!5m2!1ssk!2ssk"
                                            className="h-full w-full"
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                        />
                                    </div>
                                </div>

                                <div className="rounded-lg border border-border bg-background p-3">
                                    <p className="text-sm text-foreground">email: info@obko.com</p>
                                    <p className="text-sm text-foreground">tel: +420 123 456 789</p>
                                </div>
                            </div>
                        </FieldSet>
                    </section>
                </div>
            </div>
        </footer>
    )
}

export default Footer