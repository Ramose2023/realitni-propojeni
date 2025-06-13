# Analýza požadavků pro aplikaci Realitní Propojení

## Uživatelské role

### Prodávající nemovitostí
- Registrace a přihlášení (email, Google)
- Vytváření inzerátů poptávky s detailním popisem nemovitosti
- Nahrávání fotografií a videí nemovitosti
- Prohlížení nabídek od makléřů
- Porovnávání nabídek makléřů
- Udělování přístupu vybraným makléřům ke kontaktním údajům
- Správa vlastních inzerátů a komunikace

### Realitní makléři
- Registrace a přihlášení (email, Google)
- Vytváření profilu s nabídkou služeb
- Prohlížení dostupných poptávek prodávajících
- Vytváření nabídek na konkrétní poptávky
- Nahrávání videoprezentace pro prodávající
- Správa kreditů pro zobrazení kontaktních údajů
- Přístup ke kontaktním údajům po schválení prodávajícím

## Detailní funkce pro prodávající

### Vytváření inzerátu poptávky
- Popis nemovitosti (textový popis)
- Adresa nemovitosti (ulice, číslo popisné, město, PSČ)
- Parcelní číslo
- Obec
- Katastrální území
- Nahrávání fotografií (multiple upload)
- Nahrávání videa (volitelné)
- Možnost editace a aktualizace inzerátu

### Správa nabídek od makléřů
- Přehledný seznam všech obdržených nabídek
- Detailní zobrazení jednotlivých nabídek
- Porovnání nabídek podle klíčových parametrů
- Možnost udělit přístup ke kontaktním údajům vybraným makléřům
- Historie komunikace s makléři

## Detailní funkce pro makléře

### Vytváření profilu
- Osobní údaje a kontakty
- Popis nabízených služeb
- Reference a hodnocení
- Nahrání videoprezentace

### Vytváření nabídky pro prodávající
- Specifikace provize včetně DPH
- Hrubý odhad prodejní ceny nebo cenové rozpětí
- Seznam služeb zahrnutých v ceně
- Seznam dodatečných služeb za příplatek s cenou:
  - Nafocení
  - Video
  - Dron
  - Home staging
  - Web
  - Forma dražby
  - Klasická inzerce na sreality
- Nahrání videoprezentace pro konkrétního prodávajícího

### Kreditní systém
- Dobíjení kreditů
- Platba za zobrazení kontaktních údajů prodávajících
- Historie transakcí a spotřeby kreditů
- Notifikace o nízkém stavu kreditů

## Datové modely

### Uživatelé
- ID
- Typ uživatele (prodávající/makléř)
- Email
- Heslo (hash)
- Jméno a příjmení
- Telefon
- Datum registrace
- Poslední přihlášení
- Stav účtu (aktivní/neaktivní)

### Nemovitosti (poptávky)
- ID
- ID prodávajícího
- Typ nemovitosti
- Popis
- Adresa (ulice, číslo popisné, město, PSČ)
- Parcelní číslo
- Obec
- Katastrální území
- Seznam fotografií (URL)
- Video (URL, volitelné)
- Datum vytvoření
- Datum poslední aktualizace
- Stav inzerátu (aktivní/neaktivní/prodáno)

### Profily makléřů
- ID (propojeno s ID uživatele)
- Popis služeb
- Reference
- Videoprezentace (URL)
- Průměrné hodnocení
- Počet úspěšných transakcí

### Nabídky makléřů
- ID
- ID makléře
- ID nemovitosti
- Provize (% a částka) včetně DPH
- Odhad prodejní ceny (od-do)
- Seznam služeb v ceně
- Seznam dodatečných služeb s cenou
- Videoprezentace pro prodávajícího (URL)
- Datum vytvoření
- Stav nabídky (čeká na schválení/schváleno/odmítnuto)

### Kredity makléřů
- ID makléře
- Aktuální počet kreditů
- Historie transakcí

### Přístupy ke kontaktům
- ID makléře
- ID nemovitosti
- Datum udělení přístupu
- Stav přístupu (aktivní/neaktivní)

## Integrace

### Supabase
- Autentizace uživatelů (email, Google)
- Ukládání uživatelských dat
- Ukládání dat o nemovitostech
- Ukládání nabídek makléřů
- Správa kreditů a přístupů

### Airtable (volitelně)
- Správa dodatečných dat a metadat
- Reporting a analytika
- Export dat pro marketingové účely

### Platební systém
- Integrace platební brány pro dobíjení kreditů
- Správa transakcí
- Generování faktur

## Bezpečnostní mechanismy
- Zabezpečené přihlašování (email, Google)
- Ochrana osobních údajů prodávajících
- Řízení přístupu ke kontaktním údajům
- Zabezpečení platebních transakcí
- Ochrana proti podvodným aktivitám

## Workflow aplikace

### Prodávající
1. Registrace/přihlášení
2. Vytvoření inzerátu poptávky s detaily nemovitosti
3. Nahrání fotografií a případně videa
4. Čekání na nabídky od makléřů
5. Prohlížení a porovnávání nabídek
6. Výběr preferovaných makléřů a udělení přístupu ke kontaktům
7. Komunikace s vybranými makléři

### Makléř
1. Registrace/přihlášení
2. Vytvoření profilu s nabídkou služeb
3. Dobití kreditů
4. Prohlížení dostupných poptávek
5. Vytváření nabídek na vybrané poptávky
6. Čekání na schválení přístupu ke kontaktům
7. Komunikace s prodávajícími po schválení

## Otevřené otázky k doplnění
1. Jaká je přesná cena za kredit a kolik kreditů stojí zobrazení kontaktních údajů?
2. Jak dlouho zůstávají inzeráty aktivní?
3. Existují nějaké limity pro počet nahrávaných fotografií nebo velikost videa?
4. Jaké konkrétní platební metody by měly být podporovány?
5. Jsou požadovány nějaké specifické reporty nebo analytické funkce?
6. Jaké jsou požadavky na notifikace (email, push, SMS)?
7. Jsou požadovány nějaké funkce pro administrátory systému?
