import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field"

const openingHours = [
    "Po 8:00 - 17:00",
    "Ut 8:00 - 17:00",
    "St 8:00 - 19:00",
    "Čt 8:00 - 17:00",
    "Pá 8:00 - 17:00",
    "So 9:00 - 15:00",
    "Ne Zavřeno",
]

function FooterHoursBlock() {
    return (
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
    )
}

export default FooterHoursBlock