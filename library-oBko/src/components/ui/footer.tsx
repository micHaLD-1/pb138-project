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

const openingHours = [
    "Po 8:00 - 17:00",
    "Ut 8:00 - 17:00",
    "St 8:00 - 19:00",
    "Št 8:00 - 17:00",
    "Pi 8:00 - 17:00",
    "So 9:00 - 15:00",
    "Ne Zatvorené",
]

type FooterProps = {
    userEmail?: string
}

function Footer({ userEmail = "" }: FooterProps) {
    return (
        <footer className="w-full border-t border-border bg-background font-sans text-foreground">
            <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6">
                    <section className="w-full rounded-lg border border-border bg-background p-4 md:order-1 md:p-5 lg:order-1">
                        <FieldSet className="gap-3">
                            <FieldLegend className="text-left text-lg font-bold tracking-tight">
                                Otváracie hodiny
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
                        <FieldSet className="flex h-full flex-1 gap-4">
                            <FieldGroup className="h-full flex-1 gap-4">
                                <Field className="flex flex-col gap-2">
                                    <FieldContent className="gap-1">
                                        <InputGroup>
                                            <InputGroupInput
                                                id="footer-email"
                                                type="email"
                                                name="email"
                                                defaultValue={userEmail}
                                                placeholder="vas@email.com"
                                                autoComplete="email"
                                            />
                                        </InputGroup>
                                    </FieldContent>
                                </Field>

                                <Field className="flex flex-1 flex-col gap-2">
                                    <FieldContent className="flex flex-1 gap-1">
                                        <Textarea
                                            id="footer-message"
                                            name="message"
                                            placeholder="Napíšte nám správu"
                                            className="min-h-40 flex-1 resize-none"
                                            rows={4}
                                        />
                                    </FieldContent>
                                </Field>

                                <Button type="button" className="w-full sm:w-auto">
                                    Odoslať správu
                                </Button>
                            </FieldGroup>
                        </FieldSet>
                    </section>

                    <section className="w-full rounded-lg border border-border bg-background p-4 md:order-2 md:p-5 lg:order-3 lg:col-span-1">
                        <FieldSet className="gap-4">

                            <div className="space-y-3">
                                <div className="overflow-hidden rounded-lg border border-border bg-background">
                                    <div className="aspect-16/10 w-full">
                                        <iframe
                                            title="Google mapa"
                                            src="https://maps.google.com/maps?q=Brno&t=&z=13&ie=UTF8&iwloc=&output=embed"
                                            className="h-full w-full"
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                        />
                                    </div>
                                </div>

                                <div className="rounded-lg border border-border bg-background p-3">
                                    <p className="text-sm text-foreground">email: info@obko.com</p>
                                    <p className="text-sm text-foreground">phone: +420 123 456 789</p>
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