## Non-Functional Requirements

# Výkon a odozva systému
1. Systém by mal načítať hlavnú stránku do 3 sekúnd.
2. Prihlásenie používateľa by malo prebehnúť do 2 sekúnd.
3. Zobrazenie detailu knihy by malo byť dostupné do 2 sekúnd.
4. Systém by mal zvládnuť súčasnú prácu aspoň 20 používateľov naraz bez výrazného spomalenia.
5. Vyhľadanie kníh a filtrovanie výsledkov by malo trvať maximálne 2 sekundy pri štandardnom počte záznamov.
6. Operácie ako rezervácia knihy, zrušenie rezervácie alebo predĺženie výpožičky by mali byť potvrdené do 3 sekúnd.

# Bezpečnosť
1. Každý používateľ sa musí do systému prihlasovať pomocou e-mailu a hesla.
2. Heslá používateľov nesmú byť uložené v čitateľnej podobe, ale iba v šifrovanej forme.
3. Každý používateľ môže pristupovať iba k svojim vlastným údajom, výpožičkám, rezerváciám a pokutám.
4. Systém musí rozlišovať všetky používateľské roly.
5. Admin má prístup k správe pravidiel a obsahu webu.
6. Zamestnanec môže pristupovať iba k funkciám určeným pre zamestnanca.
7. Formuláre musia byť ošetrené proti bežným vstupným chybám a nebezpečným vstupom.
8. Po odhlásení používateľa nesmie byť možné dostať sa späť do účtu pomocou tlačidla „späť“ bez opätovného prihlásenia.

# Použiteľnosť a prístupnosť
1. Používateľské rozhranie musí byť jednoduché a prehľadné.
2. Navigácia na webe musí byť konzistentná na všetkých stránkach.
3. Formuláre musia obsahovať jasné označenia polí a chybové hlásenia.
4. Systém by mal byť použiteľný aj na mobilných zariadeniach a tabletoch.
5. Používateľ musí pri dôležitých akciách dostať jednoznačnú spätnú väzbu, napríklad „Rezervácia bola úspešne vytvorená“.

# Údržba a rozšíriteľnosť
1. Kód aplikácie musí byť prehľadne štruktúrovaný a rozdelený na logické časti.
2. Systém by mal byť navrhnutý tak, aby bolo možné neskôr doplniť nové funkcie.
3. Databázový model musí byť navrhnutý tak, aby bolo možné pridávať ďalšie entity.
4. Zdrojový kód musí obsahovať základné komentáre pri zložitejších častiach.

# Kvalita dát
1. E-mail používateľa musí mať správny formát.
2. Dátum vrátenia knihy musí byť vždy uložený v správnom formáte.
3. Systém musí kontrolovať povinné polia pri registrácii, rezervácii a kontaktnom formulári.
4. Pri zadávaní hodnotenia knihy musí byť povolený len určený rozsah, napríklad 1 až 5 hviezdičiek.

# Notifikácie a komunikácia
1. Systém má používateľa upozorniť na blížiaci sa termín vrátenia knihy.
2. Systém má používateľovi odoslať notifikáciu pri úspešnej rezervácii knihy.
3. Ak sa požičaná alebo rezervovaná kniha stane dostupnou, systém má vedieť odoslať upozornenie používateľovi.
4. V prípade nedostupnosti služby odosielania notifikácií nesmie dôjsť k pádu celej aplikácie.

# Administrácia a správa systému
1. Admin a zamestnanec musia mať prístup do oddelenej časti systému podľa svojej roly.
2. Zmeny vykonané adminom v pravidlách systému sa musia prejaviť bez potreby zásahu do zdrojového kódu.
3. Zamestnanec musí mať možnosť jednoducho meniť stav knihy, napríklad dostupná, požičaná, rezervovaná.
