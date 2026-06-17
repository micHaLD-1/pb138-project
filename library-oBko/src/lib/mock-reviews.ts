export type MockReview = {
    name: string
    surname: string
    userId: number
    bookId: number
    rating: number
    createdAt: string
    content: string
}

export const mockReviews: MockReview[] = [
    {
        name: 'Anna',
        surname: 'Novotna',
        userId: 1,
        bookId: 12,
        rating: 5,
        createdAt: '2026-05-29',
        content: 'Velmi poutava kniha s citlivym vypravnim. Postavy pusobi prirozene a text se cte lehce.',
    },
    {
        name: 'Petr',
        surname: 'Svoboda',
        userId: 2,
        bookId: 12,
        rating: 4,
        createdAt: '2026-05-24',
        content: 'Pribeh ma silnou atmosferu a dobre tempo. Nektere pasaze jsou pomalejsi, ale celkove funguje skvele.',
    },
    {
        name: 'Lucie',
        surname: 'Dvorakova',
        userId: 3,
        bookId: 12,
        rating: 5,
        createdAt: '2026-05-18',
        content: 'Hodnoceni plne zaslouzene. Zaujalo me zpracovani tematu i styl psani, ktery je cisty a zapamatovatelny.',
    },
    {
        name: 'Jakub',
        surname: 'Prochazka',
        userId: 4,
        bookId: 12,
        rating: 3,
        createdAt: '2026-05-11',
        content: 'Dobry zaklad s nekolika silnymi momenty, ale misty by pomohlo kratsi a soustredenejsi vypraveni.',
    },
    {
        name: 'Eva',
        surname: 'Kralova',
        userId: 5,
        bookId: 12,
        rating: 4,
        createdAt: '2026-05-06',
        content: 'Prijemne prekvapeni. Doplnuje to presne to, co od podobne knihy cekam, a nic navic nerusi.',
    },
]