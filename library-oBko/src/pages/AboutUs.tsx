function AboutUs() {
  const libraryImageUrl =
    'https://cf.bstatic.com/xdata/images/hotel/max1024x768/596310056.webp?k=71f0d7388f98475a2f1365659a02bdb58535f18bf9e819f31500a82931a27a2e&o='

  const aboutText = `Knižnica oBko je komunitný priestor pre všetkých, ktorí veria v silu príbehov, poznania a stretávania. Sídlime v brnianskej mestskej časti Královo Pole, kde vytvárame otvorené a priateľské miesto pre deti, študentov, rodiny aj seniorov.

Naša história siaha až do roku 1870, keď knižnicu založil Arnošt I. Veľký s víziou sprístupniť vzdelanie a literatúru širokej verejnosti. Od svojho vzniku prešla knižnica dlhým vývojom – od tradičnej inštitúcie slúžiacej najmä na požičiavanie kníh až po moderné komunitné centrum, ktoré reaguje na potreby súčasnej spoločnosti. Napriek meniacim sa časom si zachovávame pôvodnú myšlienku: byť miestom otvoreným pre všetkých.

Našim cieľom je byť viac než len knižnicou. Okrem bohatej ponuky kníh pre všetky vekové kategórie ponúkame priestor na oddych, štúdium aj inšpiráciu. Organizujeme podujatia pre verejnosť – od diskusií a workshopov až po komunitné stretnutia, ktoré prepájajú ľudí a podporujú celoživotné vzdelávanie.

Zakladáme si na individuálnom prístupe, dostupnosti a inkluzívnosti. Spolupracujeme so školami, rodinami aj miestnou komunitou a vytvárame prostredie, kde sa každý môže cítiť vítaný. Veríme, že knižnica má byť živým miestom – priestorom, kde sa nielen číta, ale aj stretáva, tvorí a objavuje.

oBko je miesto, kde knihy spájajú ľudí.`

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-xl border bg-card p-6 shadow-sm sm:p-8">
        <h1 className="mb-3 text-xl">O nás </h1>
        <div className="flex flex-col gap-6">
          <div>
            <img
              src={libraryImageUrl}
              alt="Library"
              className="w-80 rounded-lg shadow-md float-right ml-6 mb-4"
            />
            <div className="whitespace-pre-line text-foreground leading-relaxed">
              {aboutText}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutUs
