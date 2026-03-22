# SourceLocal — Pitch Deck

---

## Slide 1: Title

### SourceLocal
**Find who makes it near you — before you look abroad.**

A web app that helps Canadian businesses discover domestic suppliers, replacing the default reflex of importing with a data-driven path to buying Canadian.

**Team:** Andy Ding | Shiyam Khetawat | drftkng | Ramtin Lahooti

**Hackathon Theme:** Build Canada — Supply Chain Self-Reliance

---

## Slide 2: The Problem

### Canadian businesses can't find Canadian suppliers.

- **$67B+ in annual imports** from the US and China for goods that ARE made in Canada
- Supplier data is **fragmented** across 69+ municipal/provincial registries, Industry Canada databases, and trade directories
- **No single tool** lets a buyer search by product and get a ranked list of verified Canadian suppliers
- Result: Money flows out. Supply chains break. "Buy Canadian" stays a slogan, not a strategy.

> *"It's not that Canadian suppliers don't exist — it's that they're invisible."*

**Real-world trigger:** 2025 US tariff escalations exposed how dependent Canadian SMBs are on cross-border supply chains.

---

## Slide 3: The Solution

### SourceLocal — Canada's supplier discovery engine

| Feature | What it does |
|---------|-------------|
| **Intelligent Search** | Search 10,000+ verified businesses by product, material, or service |
| **Province & Capacity Filters** | Filter by ON, BC, AB, QC + Small/Medium/Large capacity |
| **Canadian Content Score** | 0-100 confidence score based on registry data, location, and verification signals |
| **Interactive Map** | Leaflet map with color-coded markers showing supplier density across Canada |
| **Tariff Comparison** | See when buying Canadian is already cheaper after import duties |
| **Shortlist & Export** | Save suppliers to lists, export to CSV for procurement workflows |
| **Bilingual (EN/FR)** | Full English and French support — URL-based locale routing |

---

## Slide 4: Live Demo

### Let's find a Canadian supplier right now.

**Demo flow (60 seconds):**

1. **Landing page** — Hero with live stats: "10,000+ Suppliers | 69 Data Sources | All Provinces"
2. **Search "steel fasteners"** — Results show Maple Leaf Fasteners (Mississauga, ON), Prairie Steel Works (Edmonton, AB)
3. **Filter by Ontario** — Narrows to ON suppliers with Canadian content scores
4. **Click a supplier** — Full detail page: address, NAICS codes, capacity tier, data source
5. **Map view** — Pan across Canada, see green/amber/red markers by confidence score
6. **Tariff compare** — "Stainless Steel Hex Bolts from China: $5,805 imported vs $5,200 Canadian — save $605 (10.4%)"

**Live URL:** [cursorhackathon-canada-frontend.vercel.app](https://cursorhackathon-canada-frontend.vercel.app)

---

## Slide 5: Data Source & Credibility

### Powered by Statistics Canada's Open Database of Businesses (ODBus)

- **446,573 real Canadian businesses** (full dataset) — 10,000 in deployed demo
- **69 municipal and provincial open data sources** compiled by Statistics Canada
- Covers: Ontario (205K), BC (163K), Alberta (76K), NB, NT, NU
- Fields: business name, address, NAICS industry codes, employee count, capacity tier, licensing, geocode

**This is not scraped data.** It's authoritative government registry data, deduplicated and normalized.

| Data Signal | Coverage |
|------------|----------|
| Business name | 100% |
| Province & city | 98% |
| Full address | 88% |
| NAICS industry code | 86% |
| Geocode (lat/lon) | 70% |
| Employee count | 29% |

---

## Slide 6: Architecture

### Full-stack Next.js — one deploy, zero external dependencies

```
Frontend (React + Tailwind)     API Routes (Node.js)      Data Layer
    /en/search  ───────>    /api/suppliers  ───────>   JSON (10K records)
    /en/map     ───────>    /api/stats      ───────>   from SQLite ETL
    /en/tariffs ───────>    /api/sources    ───────>   Statistics Canada ODBus
```

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Maps | Leaflet + React Leaflet |
| Data | Statistics Canada ODBus (SQLite -> JSON) |
| Hosting | Vercel (serverless) |
| i18n | Custom EN/FR with URL routing |

**Built in 4 hours.** Deployed on Vercel. No database server. No API keys. No auth required.

---

## Slide 7: Canadian Content Confidence Score

### How we score "Canadianness" — transparently

| Signal | Points | Logic |
|--------|--------|-------|
| Registered in Canadian business registry | +25 | Present in ODBus = confirmed |
| Canadian address on file | +25 | City + province verified |
| Active business status | +10 | Status = "Active" |
| Found in multiple datasets | +10 | Cross-referenced sources |
| Industry classified (NAICS) | +10 | Sector identified |
| Employee data available | +10 | Workforce confirmed |
| Location geocoded | +10 | Lat/lon verified |

**Max score: 100.** Scores below 40 flagged as "limited data — verify directly."

This is a **confidence estimate**, not a certification. It tells buyers: "Here's how much we know about this supplier's Canadian presence."

---

## Slide 8: Market Opportunity

### Why this matters now

- **$2.1T** — Canada's GDP. Yet SMBs default to Alibaba and ThomasNet (US-focused) for sourcing.
- **"Buy Canadian" sentiment** is at an all-time high post-2025 tariff shocks
- **Federal & provincial procurement** mandates Canadian-content requirements but lack tooling
- **No direct competitor** offers cross-registry Canadian supplier search with scoring

**Comparable:** South Korea's data.go.kr enabled domestic supplier discovery and drove measurable import substitution. Canada has no equivalent — until now.

**Target users:**
- 1.2M Canadian SMBs making purchasing decisions
- Federal/provincial procurement officers
- Economic development agencies

---

## Slide 9: What We Built Today vs. Full Vision

| Today (Hackathon MVP) | Phase 2 (3 months) | Phase 3 (6 months) |
|----------------------|--------------------|--------------------|
| 10K suppliers searchable | Full 446K supplier index | AI semantic search |
| Province + capacity filters | Distance radius filtering | RFQ workflow |
| Canadian content scoring | Supplier claim & enrichment | Compliance reporting |
| Static tariff examples | Live CBSA tariff API | Price comparison engine |
| CSV export | Slack/email alerts | ERP/procurement integration |
| EN/FR bilingual | Indigenous language support | Government procurement module |
| Vercel deployment | AWS ca-central-1 (data residency) | SOC 2 compliance |

---

## Slide 10: The Ask

### What we need to make this real

1. **Access to more data** — ISED federal corporation registry API, provincial registries beyond ODBus coverage
2. **Pilot partnerships** — 5 SMBs willing to test SourceLocal for real procurement decisions
3. **$50K seed funding** — 6 months of development to reach full 446K supplier index with live tariff data

### Impact we're targeting (12 months)

| Metric | Target |
|--------|--------|
| Registered users | 5,000 |
| Monthly searches | 20,000 |
| Supplier connections made | 2,000 |
| Estimated import substitution | $10M+ |

---

## Slide 11: Closing

### Every dollar spent with a Canadian supplier strengthens a Canadian community.

**SourceLocal** makes the invisible visible.

We're not asking businesses to change their values — just giving them the tool to act on the values they already have.

**Try it now:** [cursorhackathon-canada-frontend.vercel.app](https://cursorhackathon-canada-frontend.vercel.app)

**GitHub:** [github.com/The-All-Father-Odin/Cursor-Hackathon](https://github.com/The-All-Father-Odin/Cursor-Hackathon)

---
