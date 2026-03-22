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
Compare the cost of importing vs. buying Canadian. See applicable tariff rates and estimated landed-cost breakdowns. Know when domestic sourcing is already price-competitive after duties.

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

### Search Parameters (`/api/suppliers`)

| Parameter | Type | Description |
|-----------|------|-------------|
| `supplier_id` | string | Exact supplier ID lookup for deep-linking or focused views |
| `query` | string | Free-text search across name, sector, NAICS, tags |
| `province` | string | 2-letter province code (ON, BC, AB, QC, etc.) |
| `city` | string | City name (substring match) |
| `capacity` | string | "Small", "Medium", or "Large" |
| `has_geocode` | boolean | Only return suppliers with lat/lon |
| `limit` | integer | Max results (default: 20, max: 500) |
| `offset` | integer | Pagination offset |

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

By default, the app will use the bundled `data/odbus-subset.sqlite` file locally when it is available, which exposes the full 50K-row subset through the API. The checked-in JSON files under `src/data/` are a deployment-friendly fallback snapshot.

### Using the Full Database (446K suppliers)

The repo includes a 50K supplier subset. To use the full 446K dataset:

1. Download the full database from [Statistics Canada ODBus](https://www.statcan.gc.ca/en/lode/databases/odbus) or use the processed version from the `opendatabase-canada` pipeline
2. Set the `DATABASE_PATH` environment variable:

```bash
DATABASE_PATH=/path/to/odbus_supplier_directory.sqlite npm run dev
```

### Refreshing the JSON Fallback Snapshot

If you want to regenerate the deployment-friendly JSON fallback:

```bash
npm run export:data
```

This exports a 10K supplier snapshot by default. To export all rows from the configured SQLite database:

```bash
EXPORT_SUPPLIERS_LIMIT=all npm run export:data
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
