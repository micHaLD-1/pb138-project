import { db } from "./index";
import * as schema from "./schema";
import { UserRole, BookCopyStatus } from "../enums";

async function main() {
    console.log("⏳ Inicializace databáze v češtině...");

    const tables = [
        schema.librarySetting,
        schema.bookAuthor,
        schema.bookGenre,
        schema.bookCopy,
        schema.book,
        schema.author,
        schema.genre,
        schema.publisher,
        schema.user,
    ];

    for (const table of tables) {
        await db.delete(table);
    }

    await db.insert(schema.librarySetting).values([
        { key: "fineAmountPerDay", value: "10" }, // 10 Kč za den
        { key: "maxLoanDays", value: "30" },
    ]);

    const genres = await db.insert(schema.genre).values([
        { name: "Klasická literatura" },
        { name: "Sci-Fi" },
        { name: "Fantasy" },
        { name: "Detektivka" },
        { name: "Horor" },
        { name: "Filosofický román" },
        { name: "Drama" },
        { name: "Historický román" }
    ]).returning();

    const getGenre = (name: string) => genres.find(g => g.name === name)!;

    const publishers = await db.insert(schema.publisher).values([
        { name: "Albatros" },
        { name: "Argo" },
        { name: "Odeon" },
        { name: "Host" },
        { name: "Academia" }
    ]).returning();

    const getPub = (name: string) => publishers.find(p => p.name === name)!;

    await db.insert(schema.user).values([
        {
            firstName: "Admin",
            lastName: "Default",
            email: "admin.default@obko.cz",
            role: UserRole.ADMIN,
            passwordHash: "$2y$12$.NkhTbiXPPE7UfImqCH94ufTa6SfvrYVl.HlZ7idIfSPd2De6IVRm"
        },
        {
            firstName: "Employee",
            lastName: "Default",
            email: "employee.default@obko.cz",
            role: UserRole.STAFF,
            passwordHash: "$2y$12$.NkhTbiXPPE7UfImqCH94ufTa6SfvrYVl.HlZ7idIfSPd2De6IVRm"
        },
        {
            firstName: "Member",
            lastName: "Default",
            email: "member.default@obko.cz",
            role: UserRole.MEMBER,
            passwordHash: "$2y$12$.NkhTbiXPPE7UfImqCH94ufTa6SfvrYVl.HlZ7idIfSPd2De6IVRm"
        },
        {
            firstName: "Guest",
            lastName: "Default",
            email: "guest.default@obko.cz",
            role: UserRole.GUEST,
            passwordHash: "$2y$12$.NkhTbiXPPE7UfImqCH94ufTa6SfvrYVl.HlZ7idIfSPd2De6IVRm"
        }
    ]);

    const data = [
        {
            first: "Franz", last: "Kafka",
            books: [
                { title: "Proces", year: 1925, genre: "Filosofický román", desc: "Josef K. je v den svých třicátých narozenin bezdůvodně zatčen." },
                { title: "Proměna", year: 1915, genre: "Klasická literatura", desc: "Řehoř Samsa se jednoho rána probudí jako obří hmyz." }
            ]
        },
        {
            first: "J.R.R.", last: "Tolkien",
            books: [
                { title: "Hobit aneb Cesta tam a zase zpátky", year: 1937, genre: "Fantasy", desc: "Dobrodružství Bilba Pytlíka na cestě k Osamělé hoře." },
                { title: "Pán prstenů: Společenstvo Prstenu", year: 1954, genre: "Fantasy", desc: "Začátek epické pouti za zničením prstenu moci." }
            ]
        },
        {
            first: "George", last: "Orwell",
            books: [
                { title: "1984", year: 1949, genre: "Sci-Fi", desc: "Vize totalitního světa, kde Velký bratr vše vidí." },
                { title: "Farma zvířat", year: 1945, genre: "Klasická literatura", desc: "Alegorický román o revoluci, kterou ovládnou prasata." }
            ]
        },
        {
            first: "J.K.", last: "Rowlingová",
            books: [
                { title: "Harry Potter a Kámen mudrců", year: 1997, genre: "Fantasy", desc: "První rok mladého kouzelníka v Bradavicích." },
                { title: "Harry Potter a Tajemná komnata", year: 1998, genre: "Fantasy", desc: "Harry se vrací do Bradavic a čelí prastaré hrozbě." }
            ]
        },
        {
            first: "Karel", last: "Čapek",
            books: [
                { title: "Válka s mloky", year: 1936, genre: "Sci-Fi", desc: "Satira na fašismus a kolonialismus prostřednictvím inteligentních mloků." },
                { title: "R.U.R.", year: 1920, genre: "Drama", desc: "Divadelní hra, která světu dala slovo 'robot'." }
            ]
        },
        {
            first: "Agatha", last: "Christie",
            books: [
                { title: "Vražda v Orient-expresu", year: 1934, genre: "Detektivka", desc: "Hercule Poirot řeší záhadnou vraždu v luxusním vlaku." },
                { title: "Deset malých černoušků", year: 1939, genre: "Detektivka", desc: "Deset lidí na izolovaném ostrově umírá jeden po druhém." }
            ]
        },
        {
            first: "Ernest", last: "Hemingway",
            books: [
                { title: "Stařec a moře", year: 1952, genre: "Klasická literatura", desc: "Příběh starého rybáře a jeho boje s obrovským marlínem." },
                { title: "Komu zvoní hrana", year: 1940, genre: "Historický román", desc: "Příběh z španělské občanské války." }
            ]
        },
        {
            first: "Fyodor", last: "Dostoevsky",
            books: [
                { title: "Zločin a trest", year: 1866, genre: "Filosofický román", desc: "Psychologické drama o vraždě a svědomí studenta Raskolnikova." },
                { title: "Idiot", year: 1869, genre: "Klasická literatura", desc: "Příběh o knížeti Myškinovi, příliš dobrém člověku pro tento svět." }
            ]
        },
        {
            first: "Arthur Conan", last: "Doyle",
            books: [
                { title: "Studie v šarlatové", year: 1887, genre: "Detektivka", desc: "První setkání Sherlocka Holmese a doktora Watsona." },
                { title: "Pes baskervillský", year: 1902, genre: "Detektivka", desc: "Legendární případ o démonickém psovi na blatech." }
            ]
        },
        {
            first: "Stephen", last: "King",
            books: [
                { title: "To", year: 1986, genre: "Horor", desc: "Parta dětí bojuje s entitou, která se nejčastěji objevuje jako klaun." },
                { title: "Osvícení", year: 1977, genre: "Horor", desc: "Šílenství v izolovaném horském hotelu." }
            ]
        },
        {
            first: "Milan", last: "Kundera",
            books: [
                { title: "Nesnesitelná lehkost bytí", year: 1984, genre: "Filosofický román", desc: "Osudy několika postav po roce 1968 v Československu." },
                { title: "Žert", year: 1967, genre: "Klasická literatura", desc: "Jak jeden vtip může zničit celý lidský život." }
            ]
        },
        {
            first: "Isaac", last: "Asimov",
            books: [
                { title: "Nadace", year: 1951, genre: "Sci-Fi", desc: "Snažení o zachování vědění uprostřed pádu galaktického impéria." },
                { title: "Já, robot", year: 1950, genre: "Sci-Fi", desc: "Sbírka povídek definující tři zákony robotiky." }
            ]
        },
        {
            first: "Antoine de", last: "Saint-Exupéry",
            books: [
                { title: "Malý princ", year: 1943, genre: "Klasická literatura", desc: "Filosofická pohádka pro děti i dospělé." },
                { title: "Noční let", year: 1931, genre: "Klasická literatura", desc: "Příběh o odvaze pilotů v počátcích letectví." }
            ]
        },
        {
            first: "Oscar", last: "Wilde",
            books: [
                { title: "Obraz Doriana Graye", year: 1890, genre: "Klasická literatura", desc: "Mladík zůstává krásný, zatímco jeho portrét stárne a odráží jeho hříchy." },
                { title: "Strašidlo cantervillské", year: 1887, genre: "Klasická literatura", desc: "Humorný příběh o americké rodině a nešťastném duchovi." }
            ]
        },
        {
            first: "Haruki", last: "Murakami",
            books: [
                { title: "Norské dřevo", year: 1987, genre: "Klasická literatura", desc: "Nostalgický příběh o dospívání, lásce a smrti." },
                { title: "Kafka na pobřeží", year: 2002, genre: "Klasická literatura", desc: "Magický realismus o putování patnáctiletého chlapce." }
            ]
        },
        {
            first: "Jane", last: "Austenová",
            books: [
                { title: "Pýcha a předsudek", year: 1813, genre: "Klasická literatura", desc: "Milostné pletky sester Bennetových na anglickém venkově." },
                { title: "Rozum a cit", year: 1811, genre: "Klasická literatura", desc: "Příběh sester Elinor a Marianny Dashwoodových." }
            ]
        },
        {
            first: "Victor", last: "Hugo",
            books: [
                { title: "Bídníci", year: 1862, genre: "Historický román", desc: "Monumentální dílo o trestanci Jeanu Valjeanovi." },
                { title: "Chrám Matky Boží v Paříži", year: 1831, genre: "Historický román", desc: "Tragický příběh o hrbáči Quasimodovi a Esmeraldě." }
            ]
        },
        {
            first: "Douglas", last: "Adams",
            books: [
                { title: "Stopařův průvodce Galaxií", year: 1979, genre: "Sci-Fi", desc: "Nepropadejte panice! Ručník je nejdůležitější věc." },
                { title: "Restaurant na konci vesmíru", year: 1980, genre: "Sci-Fi", desc: "Druhé pokračování bláznivé vesmírné cesty." }
            ]
        },
        {
            first: "Umberto", last: "Eco",
            books: [
                { title: "Jméno růže", year: 1980, genre: "Detektivka", desc: "Středověká detektivka v benediktinském opatství." },
                { title: "Foucaultovo kyvadlo", year: 1988, genre: "Filosofický román", desc: "Komplexní román o spiknutích a templářích." }
            ]
        },
        {
            first: "Bohumil", last: "Hrabal",
            books: [
                { title: "Obsluhoval jsem anglického krále", year: 1971, genre: "Klasická literatura", desc: "Cesta pikolíka k milionáři a zpět." },
                { title: "Ostře sledované vlaky", year: 1965, genre: "Historický román", desc: "Příběh z malé železniční stanice za okupace." }
            ]
        }
    ];

    for (const item of data) {
        const [insertedAuthor] = await db.insert(schema.author).values({
            firstName: item.first,
            lastName: item.last
        }).returning();

        for (const b of item.books) {
            const [insertedBook] = await db.insert(schema.book).values({
                title: b.title,
                yearPublished: b.year,
                language: "Čeština",
                description: b.desc,
                publisherId: getPub(b.year > 2000 ? "Argo" : "Odeon").id
            }).returning();

            await db.insert(schema.bookAuthor).values({ bookId: insertedBook.id, authorId: insertedAuthor.id });
            await db.insert(schema.bookGenre).values({ bookId: insertedBook.id, genreId: getGenre(b.genre).id });

            await db.insert(schema.bookCopy).values([
                { status: BookCopyStatus.AVAILABLE, bookId: insertedBook.id },
                { status: BookCopyStatus.AVAILABLE, bookId: insertedBook.id }
            ]);
        }
    }

    console.log("✅ Databáze byla úspěšně naplněna daty!");
    process.exit(0);
}

main().catch((err) => {
    console.error("❌ Seeding selhal:");
    console.error(err);
    process.exit(1);
});
