import { FieldSet } from "@/components/ui/field"

function FooterContactBlock() {
    return (
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
    )
}

export default FooterContactBlock