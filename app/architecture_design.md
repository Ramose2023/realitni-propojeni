# Návrh architektury aplikace Realitní Propojení

## Databázová struktura

### Tabulky v Supabase

#### users
- `id` (UUID, PK) - primární klíč
- `email` (string) - email uživatele
- `user_type` (enum) - typ uživatele (seller/agent)
- `full_name` (string) - jméno a příjmení
- `phone` (string) - telefonní číslo
- `created_at` (timestamp) - datum registrace
- `last_login` (timestamp) - poslední přihlášení
- `status` (enum) - stav účtu (active/inactive)
- `auth_provider` (enum) - poskytovatel autentizace (email/google)

#### seller_profiles
- `id` (UUID, PK) - primární klíč
- `user_id` (UUID, FK) - reference na users.id
- `address` (string) - adresa prodávajícího
- `city` (string) - město
- `postal_code` (string) - PSČ
- `created_at` (timestamp) - datum vytvoření profilu
- `updated_at` (timestamp) - datum aktualizace profilu

#### agent_profiles
- `id` (UUID, PK) - primární klíč
- `user_id` (UUID, FK) - reference na users.id
- `description` (text) - popis služeb
- `references` (text) - reference
- `video_presentation_url` (string) - URL videoprezentace
- `average_rating` (float) - průměrné hodnocení
- `successful_transactions` (integer) - počet úspěšných transakcí
- `created_at` (timestamp) - datum vytvoření profilu
- `updated_at` (timestamp) - datum aktualizace profilu

#### properties
- `id` (UUID, PK) - primární klíč
- `seller_id` (UUID, FK) - reference na users.id
- `property_type` (enum) - typ nemovitosti
- `description` (text) - popis nemovitosti
- `street` (string) - ulice
- `house_number` (string) - číslo popisné
- `city` (string) - město
- `postal_code` (string) - PSČ
- `parcel_number` (string) - parcelní číslo
- `municipality` (string) - obec
- `cadastral_area` (string) - katastrální území
- `created_at` (timestamp) - datum vytvoření
- `updated_at` (timestamp) - datum aktualizace
- `status` (enum) - stav inzerátu (active/inactive/sold)

#### property_media
- `id` (UUID, PK) - primární klíč
- `property_id` (UUID, FK) - reference na properties.id
- `media_type` (enum) - typ média (photo/video)
- `url` (string) - URL média
- `order` (integer) - pořadí média
- `created_at` (timestamp) - datum nahrání

#### agent_offers
- `id` (UUID, PK) - primární klíč
- `agent_id` (UUID, FK) - reference na users.id
- `property_id` (UUID, FK) - reference na properties.id
- `commission_percentage` (float) - provize v procentech
- `commission_amount` (integer) - provize v Kč
- `price_estimate_min` (integer) - minimální odhad ceny
- `price_estimate_max` (integer) - maximální odhad ceny
- `included_services` (jsonb) - služby v ceně
- `additional_services` (jsonb) - dodatečné služby s cenou
- `video_presentation_url` (string) - URL videoprezentace pro prodávajícího
- `created_at` (timestamp) - datum vytvoření
- `status` (enum) - stav nabídky (pending/approved/rejected)

#### agent_credits
- `id` (UUID, PK) - primární klíč
- `agent_id` (UUID, FK) - reference na users.id
- `balance` (integer) - aktuální počet kreditů
- `updated_at` (timestamp) - datum poslední aktualizace

#### credit_transactions
- `id` (UUID, PK) - primární klíč
- `agent_id` (UUID, FK) - reference na users.id
- `amount` (integer) - počet kreditů
- `transaction_type` (enum) - typ transakce (purchase/usage)
- `description` (string) - popis transakce
- `payment_id` (string) - ID platby (pro nákup kreditů)
- `created_at` (timestamp) - datum transakce

#### contact_access
- `id` (UUID, PK) - primární klíč
- `agent_id` (UUID, FK) - reference na users.id
- `property_id` (UUID, FK) - reference na properties.id
- `granted_at` (timestamp) - datum udělení přístupu
- `status` (enum) - stav přístupu (active/inactive)
- `credit_transaction_id` (UUID, FK) - reference na credit_transactions.id

### Airtable (volitelně)

#### Reporting
- Statistiky využití aplikace
- Přehledy transakcí
- Analytika uživatelského chování

#### Marketing
- Exporty dat pro marketingové účely
- Segmentace uživatelů

## API Endpointy

### Autentizace
- `POST /api/auth/register` - registrace nového uživatele
- `POST /api/auth/login` - přihlášení uživatele
- `POST /api/auth/google` - přihlášení přes Google
- `POST /api/auth/logout` - odhlášení uživatele
- `GET /api/auth/me` - získání informací o přihlášeném uživateli

### Uživatelé
- `GET /api/users/profile` - získání profilu uživatele
- `PUT /api/users/profile` - aktualizace profilu uživatele

### Prodávající
- `POST /api/seller/properties` - vytvoření nového inzerátu
- `GET /api/seller/properties` - získání seznamu vlastních inzerátů
- `GET /api/seller/properties/:id` - získání detailu inzerátu
- `PUT /api/seller/properties/:id` - aktualizace inzerátu
- `DELETE /api/seller/properties/:id` - smazání inzerátu
- `GET /api/seller/properties/:id/offers` - získání nabídek na inzerát
- `POST /api/seller/properties/:id/media` - nahrání média k inzerátu
- `DELETE /api/seller/properties/:id/media/:mediaId` - smazání média
- `POST /api/seller/grant-access/:offerId` - udělení přístupu ke kontaktům

### Makléři
- `GET /api/agent/profile` - získání profilu makléře
- `PUT /api/agent/profile` - aktualizace profilu makléře
- `GET /api/agent/properties` - získání seznamu dostupných inzerátů
- `GET /api/agent/properties/:id` - získání detailu inzerátu
- `POST /api/agent/offers` - vytvoření nabídky
- `GET /api/agent/offers` - získání seznamu vlastních nabídek
- `GET /api/agent/offers/:id` - získání detailu nabídky
- `PUT /api/agent/offers/:id` - aktualizace nabídky
- `DELETE /api/agent/offers/:id` - smazání nabídky
- `GET /api/agent/credits` - získání stavu kreditů
- `POST /api/agent/credits/purchase` - nákup kreditů
- `GET /api/agent/credits/transactions` - historie transakcí
- `POST /api/agent/access/:propertyId` - žádost o přístup ke kontaktům

### Média
- `POST /api/media/upload` - nahrání média (foto/video)
- `DELETE /api/media/:id` - smazání média

### Platby
- `POST /api/payments/create` - vytvoření platby
- `GET /api/payments/:id` - získání stavu platby
- `POST /api/payments/webhook` - webhook pro platební bránu

## Integrace

### Supabase
- Autentizace uživatelů
- Ukládání a správa dat
- Realtime aktualizace pro notifikace

```javascript
// Příklad inicializace Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
```

### Platební brána
- Integrace s platební bránou pro nákup kreditů
- Zpracování plateb
- Generování faktur

```javascript
// Příklad integrace platební brány
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY)

// Vytvoření platby
const handlePayment = async (amount) => {
  const stripe = await stripePromise
  const response = await fetch('/api/payments/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  })
  const session = await response.json()
  await stripe.redirectToCheckout({ sessionId: session.id })
}
```

## Struktura UI

### Společné komponenty
- Navigační lišta
- Footer
- Modální okna
- Formulářové komponenty
- Notifikace
- Nahrávání souborů
- Platební formuláře

### Stránky pro prodávající
- Registrace/přihlášení
- Dashboard
- Vytvoření inzerátu
- Detail inzerátu
- Seznam inzerátů
- Seznam nabídek
- Detail nabídky
- Porovnání nabídek
- Nastavení profilu

### Stránky pro makléře
- Registrace/přihlášení
- Dashboard
- Profil
- Seznam dostupných inzerátů
- Detail inzerátu
- Vytvoření nabídky
- Seznam vlastních nabídek
- Správa kreditů
- Historie transakcí
- Nastavení profilu

## Bezpečnostní mechanismy

### Autentizace a autorizace
- JWT tokeny pro autentizaci
- Role-based access control (RBAC)
- Ochrana API endpointů

### Ochrana dat
- Šifrování citlivých údajů
- Omezený přístup ke kontaktním údajům
- Validace vstupů

### Platební bezpečnost
- Integrace s bezpečnou platební bránou
- Šifrování platebních údajů
- Audit transakcí

## Workflow aplikace

### Registrace a přihlášení
1. Uživatel se registruje (email/Google)
2. Uživatel vybere typ účtu (prodávající/makléř)
3. Uživatel vyplní základní profil
4. Uživatel je přesměrován na dashboard

### Workflow prodávajícího
1. Prodávající vytvoří inzerát
2. Prodávající nahraje fotografie/video
3. Inzerát je publikován
4. Prodávající obdrží nabídky od makléřů
5. Prodávající porovná nabídky
6. Prodávající udělí přístup vybraným makléřům
7. Prodávající komunikuje s vybranými makléři

### Workflow makléře
1. Makléř vytvoří profil
2. Makléř dobije kredity
3. Makléř prohlíží dostupné inzeráty
4. Makléř vytvoří nabídku na vybraný inzerát
5. Makléř čeká na schválení přístupu
6. Po schválení makléř získá přístup ke kontaktům
7. Makléř komunikuje s prodávajícím

## Technologický stack

### Backend
- Flask (Python)
- Supabase (PostgreSQL)
- Airtable API (volitelně)

### Frontend
- React.js
- Tailwind CSS
- Supabase Client
- React Router
- React Hook Form
- Axios

### Deployment
- Docker
- Nginx
- SSL/TLS

## Monitorování a analýza
- Logování aktivit
- Sledování výkonu
- Analýza uživatelského chování
- Reporty a statistiky

## Škálovatelnost
- Horizontální škálování backend služeb
- Cachování často používaných dat
- Optimalizace databázových dotazů
- CDN pro statické soubory a média
