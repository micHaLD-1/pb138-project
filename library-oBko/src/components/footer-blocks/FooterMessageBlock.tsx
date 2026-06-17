import { useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import {
    Field,
    FieldContent,
    FieldGroup,
    FieldSet,
} from "@/components/ui/field"
import { InputGroup, InputGroupInput } from "@/components/ui/input-group"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/context/AuthContext"
import { footerMessageSchema, type FooterMessageData } from "@/lib/schemas"

type FooterMessageErrors = Partial<Record<keyof FooterMessageData, string>>

function FooterMessageBlock() {
    const [footerErrors, setFooterErrors] = useState<FooterMessageErrors>({})
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { user } = useAuth()

    async function handleMessageSubmit(event: FormEvent<HTMLFormElement>) {
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

        setSubmitStatus("success")

        const form = event.currentTarget
        setTimeout(() => {
            form.reset()
            setFooterErrors({})
            setSubmitStatus("idle")
            setIsSubmitting(false)
        }, 5000)
    }

    return (
        <section className="flex h-full w-full rounded-lg border border-border bg-background p-4 md:order-3 md:col-span-2 md:mx-auto md:max-w-3xl md:p-5 lg:order-2 lg:col-span-1 lg:mx-0 lg:max-w-none">
            <form className="flex h-full flex-1" onSubmit={handleMessageSubmit}>
                <FieldSet className="flex h-full flex-1 gap-4">
                    <FieldGroup className="h-full flex-1 gap-4">
                        <Field className="flex flex-col gap-2">
                            <FieldContent className="gap-1">
                                <InputGroup>
                                    <InputGroupInput
                                        id="footer-email"
                                        type="email"
                                        name="email"
                                        defaultValue={user?.email ?? ""}
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
                                Prosím zkontrolujte chyby výše
                            </p>
                        )}
                    </FieldGroup>
                </FieldSet>
            </form>
        </section>
    )
}

export default FooterMessageBlock