import FooterContactBlock from "@/components/footer-blocks/FooterContactBlock"
import FooterHoursBlock from "@/components/footer-blocks/FooterHoursBlock"
import FooterMessageBlock from "@/components/footer-blocks/FooterMessageBlock"

function Footer() {
    return (
        <footer className="w-full border-t border-border bg-background font-sans text-foreground">
            <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6">
                    <FooterHoursBlock />
                    <FooterMessageBlock />
                    <FooterContactBlock />
                </div>
            </div>
        </footer>
    )
}

export default Footer