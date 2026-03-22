# SourceLocal

**Find who makes it near you — before you look abroad.**

SourceLocal helps Canadian businesses discover, evaluate, and connect with domestic suppliers. It replaces the default reflex of sourcing internationally with a fast, data-driven path to buying Canadian.

**Live Demo:** [cursorhackathon-canada-frontend.vercel.app](https://cursorhackathon-canada-frontend-dlkt1oqnb.vercel.app)

---

## The Problem

Canadian SMBs default to international suppliers — not because domestic options don't exist, but because they're **invisible**. Supplier data is fragmented across provincial business registries, Industry Canada databases, trade association directories, and municipal economic development portals.

This causes:

- **Economic leakage** — money flows out of Canada for goods produced domestically
- **Resilience risk** — over-reliance on foreign suppliers exposes businesses to tariff shocks and border disruptions (e.g., 2025 US tariff escalations)
- **Missed policy alignment** — federal and provincial "buy Canadian" procurement preferences exist but are hard to operationalize

## The Solution

SourceLocal aggregates data from Statistics Canada's [Open Database of Businesses (ODBus)](https://www.statcan.gc.ca/en/lode/databases/odbus) — **50,000+ verified Canadian businesses** across all provinces — into a single searchable platform with:

- Full-text search across business names, sectors, NAICS codes, and descriptions
- Province, capacity, and geocode filtering
- Interactive map visualization
- Canadian content confidence scoring
- Tariff & landed-cost comparison context
- Bilingual support (English + French)

---

## Features

### Intelligent Search
Search 50,000+ Canadian suppliers by product, material, or service. Filter by province, capacity tier (Small/Medium/Large), and more. Results show Canadian content confidence scores, NAICS industry classifications, and data source provenance.

### Interactive Map
Visualize supplier locations across Canada on an interactive Leaflet map. Color-coded markers indicate Canadian content confidence. Filter by province and search query. Click markers for supplier details.

### Supplier Profiles
Detailed supplier pages showing business information, industry classification (NAICS), location & contact details, employee data, licensing information, and data source attribution.

### Tariff & Landed-Cost Context
Compare the cost of importing vs. buying Canadian. The current implementation now uses:

- **CBSA tariff schedule data** for tariff-item lookup and treatment-aware rates
- **Bank of Canada FX** for invoice-currency conversion to CAD
- **manual freight inputs** by default
- a **FedEx parcel quote adapter scaffold** for credentialed parcel rating
- **supplier discovery / RFQ mode** instead of pretending to have a live domestic catalog price feed

### Shortlist Management
Save suppliers to named shortlists. Export to CSV for internal procurement workflows. Share shortlists with team members.

### Bilingual (EN/FR)
Full English and French support with URL-based locale routing (`/en/...` and `/fr/...`).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Maps | [Leaflet](https://leafletjs.com/) + [React Leaflet](https://react-leaflet.js.org/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Database | SQLite via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) |
| Data Source | [Statistics Canada ODBus](https://www.statcan.gc.ca/en/lode/databases/odbus) |
| Hosting | [Vercel](https://vercel.com/) |

---

## Architecture

```
src/
├── app/
│   ├── api/                    # Backend API routes
│   │   ├── health/route.ts     # GET /api/health
│   │   ├── stats/route.ts      # GET /api/stats
│   │   ├── suppliers/
│   │   │   ├── route.ts        # GET /api/suppliers?query=...&province=...
│   │   │   └── [id]/route.ts   # GET /api/suppliers/:id
│   │   └── sources/route.ts    # GET /api/sources
│   ├── en/                     # English pages
│   │   ├── page.tsx            # Landing page
│   │   ├── search/page.tsx     # Search & results
│   │   ├── map/page.tsx        # Interactive map
│   │   ├── tariffs/page.tsx    # Tariff comparison
│   │   ├── shortlists/page.tsx # Shortlist management
│   │   └── suppliers/[id]/     # Supplier detail
│   └── fr/                     # French pages (same structure)
├── components/
│   ├── layout/                 # Header, Footer
│   ├── ui/                     # CanadianContentBadge, CapacityBadge, CertBadge
│   ├── map/                    # MapView, MapPage
│   ├── search/                 # SearchPageContent
│   ├── tariffs/                # TariffsPageContent
│   └── shortlists/             # ShortlistsPage
├── lib/
│   ├── api.ts                  # Frontend API client
│   ├── db.ts                   # SQLite database access layer
│   └── i18n.ts                 # Internationalization (EN/FR dictionaries)
├── hooks/
│   └── useLocale.ts            # Locale detection hook
├── types/
│   └── supplier.ts             # TypeScript interfaces
└── data/
    └── mock-suppliers.ts       # Mock data for tariffs & shortlists

data/
└── odbus-subset.sqlite         # 50K supplier subset (35MB)
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check with supplier count |
| `GET` | `/api/stats` | Database statistics and top providers |
| `GET` | `/api/suppliers` | Search suppliers with filters |
| `GET` | `/api/suppliers/:id` | Supplier detail by ID |
| `GET` | `/api/sources` | Data source catalogue |
| `GET` | `/api/tariffs/lookup` | Resolve HS input to CBSA tariff-item candidates |
| `POST` | `/api/tariffs/estimate` | Calculate imported landed-cost estimate |
| `GET` | `/api/freight/fedex/health` | FedEx config/auth smoke test |
| `POST` | `/api/freight/fedex/quote-test` | Dev-only FedEx parcel quote test |

### Search Parameters (`/api/suppliers`)

| Parameter | Type | Description |
|-----------|------|-------------|
| `query` | string | Free-text search across name, sector, NAICS, tags |
| `province` | string | 2-letter province code (ON, BC, AB, QC, etc.) |
| `city` | string | City name (substring match) |
| `capacity` | string | "Small", "Medium", or "Large" |
| `has_geocode` | boolean | Only return suppliers with lat/lon |
| `limit` | integer | Max results (default: 20, max: 500) |
| `offset` | integer | Pagination offset |

### Map Deep-Link Parameters (`/en/map`, `/fr/map`)

| Parameter | Type | Description |
|-----------|------|-------------|
| `supplier_id` | string | Focus the map on an exact supplier-only view |
| `selected` | string | Persist the currently selected supplier while keeping the broader result set |
| `query` | string | Persist the current free-text filter |
| `province` | string | Persist the current province filter |
| `view` | string | `"pins"` or `"heatmap"` |

### Tariff Calculator Deep-Link Parameters (`/en/tariffs`, `/fr/tariffs`)

| Parameter | Type | Description |
|-----------|------|-------------|
| `product` | string | Persist the current product description |
| `origin` | string | ISO-like origin selector (`CN`, `US`, `MX`, `EU`, etc.) |
| `hs` | string | Persist the current HS / tariff code input |
| `invoice_value` | string | Persist the current invoice amount |
| `currency` | string | Persist the invoice currency |
| `mode` | string | Shipment mode (`manual`, `parcel`, `freight`) |
| `freight_cad` | string | Persist manual freight input |
| `claim_preference` | boolean | Persist preferential-treatment toggle |
| `estimate` | boolean | Re-run the tariff estimate on refresh / shared links |

### Tariff API Localization

- `GET /api/tariffs/lookup` accepts `locale=en|fr`
- `POST /api/tariffs/estimate` accepts `locale` in the JSON body
- localized responses cover validation errors, estimate warnings/notes, and freight source labels

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install & Run

```bash
git clone https://github.com/The-All-Father-Odin/Cursor-Hackathon.git
cd Cursor-Hackathon
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Tariff / Freight Environment

Copy the example environment file if you want to exercise the tariff and parcel quote stack:

```bash
cp .env.example .env.local
```

Important variables:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public site origin used for canonical metadata, robots, and sitemap generation |
| `CBSA_TARIFF_YEAR` | Controls which CBSA tariff year the importer / resolver targets |
| `FEDEX_CLIENT_ID` | FedEx OAuth client ID |
| `FEDEX_CLIENT_SECRET` | FedEx OAuth client secret |
| `FEDEX_ACCOUNT_NUMBER` | FedEx account number used for rate requests |
| `FEDEX_AUTH_URL` | Optional FedEx OAuth override |
| `FEDEX_RATE_URL` | Optional FedEx rate endpoint override |
| `FEDEX_QUOTE_TEST_ENABLED` | Optional override to allow quote-test route outside local dev |

### Generate a Local CBSA Snapshot

The tariff resolver prefers a local CBSA snapshot when one exists:

```bash
npm run tariffs:import
```

This writes:

```bash
src/data/tariffs/cbsa-tariff-snapshot-2026.json
```

You can also limit the import to specific chapters while iterating:

```bash
npm run tariffs:import -- --chapters=73,84
```

### FedEx Connectivity Smoke Test

Once FedEx credentials are configured, you can verify server-side readiness without exposing secrets:

```bash
GET /api/freight/fedex/health
GET /api/freight/fedex/health?probe=auth
```

- the base route checks whether required env vars are present
- `?probe=auth` performs a FedEx OAuth token probe only
- it does **not** submit a shipment quote

### FedEx Quote Test (development only)

Once FedEx credentials are configured, you can run a development-only quote test route:

```bash
POST /api/freight/fedex/quote-test
```

Example JSON body:

```json
{
  "originCountry": "US",
  "originPostalCode": "10001",
  "destinationCountry": "CA",
  "destinationPostalCode": "V6B1A1",
  "parcelWeightKg": 2.5,
  "parcelLengthCm": 30,
  "parcelWidthCm": 20,
  "parcelHeightCm": 10
}
```

Safety behavior:

- blocked in production by default
- enabled automatically in local development
- can be explicitly enabled with `FEDEX_QUOTE_TEST_ENABLED=true`
- returns only the parsed quote result (never OAuth tokens)

### Using the Full Database (446K suppliers)

The repo includes a 50K supplier subset. To use the full 446K dataset:

1. Download the full database from [Statistics Canada ODBus](https://www.statcan.gc.ca/en/lode/databases/odbus) or use the processed version from the `opendatabase-canada` pipeline
2. Set the `DATABASE_PATH` environment variable:

```bash
DATABASE_PATH=/path/to/odbus_supplier_directory.sqlite npm run dev
```

---

## Data Source

All supplier data comes from **Statistics Canada's Open Database of Businesses (ODBus)** — a compilation of 69 municipal and provincial open data sources covering 446,573 Canadian businesses.

The deployed subset includes 50,000 suppliers (30,000 with geocodes) across all covered provinces: Ontario, British Columbia, Alberta, New Brunswick, Northwest Territories, and Nunavut.

**Data fields include:** business name, city, province, address, postal code, latitude/longitude, NAICS industry codes, employee count bands, capacity tier, business status, licensing information, and data source attribution.

---

## Canadian Content Confidence Score

Each supplier receives a 0-100 confidence score derived from:

| Signal | Points |
|--------|--------|
| Registered in Canadian business registry | +25 |
| Canadian address confirmed | +25 |
| Active business status | +10 |
| Found in multiple datasets | +10 |
| Industry classified (NAICS) | +10 |
| Employee data available | +10 |
| Location verified (geocoded) | +10 |

---

## Target Users

- **Canadian SMB Procurement Managers** — companies with 5-500 employees making regular purchasing decisions
- **Government Procurement Officers** — federal, provincial, and municipal buyers with Canadian-content requirements
- **Economic Development Agencies** — promoting local business-to-business connections

---

## Team

Built at the Cursor Hackathon Canada 2026.

---

## License

MIT
