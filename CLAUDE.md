# SourceLocal — Product Specification

## Product Overview

**SourceLocal** is a web application that helps Canadian businesses discover, evaluate, and connect with domestic suppliers — replacing the default reflex of sourcing internationally with a fast, data-driven path to buying Canadian.

**One-line pitch:** "Find who makes it near you — before you look abroad."

---

## Problem Statement

Canadian small and mid-size businesses (SMBs) default to international suppliers (primarily US and Chinese) not because domestic options don't exist, but because they're invisible. Supplier data is fragmented across provincial business registries, Industry Canada databases, trade association directories, and municipal economic development portals. No single tool lets a buyer search by product, material, or service and get a ranked list of verified Canadian suppliers with proximity, capacity, and pricing context.

This creates three concrete harms:

1. **Economic leakage** — money flows out of Canada for goods and services that are produced domestically, weakening local supply chains.
2. **Resilience risk** — over-reliance on foreign suppliers exposes businesses to tariff shocks, border disruptions, and geopolitical volatility (e.g., 2025 US tariff escalations).
3. **Missed policy alignment** — federal and provincial "buy Canadian" procurement preferences exist but are hard to operationalize without supplier visibility.

---

## Target Users

### Primary: Canadian SMB Procurement Managers & Business Owners

- Companies with 5–500 employees making regular purchasing decisions
- Currently using Google, Alibaba, ThomasNet (US-focused), or personal networks to find suppliers
- Industries: manufacturing, food & beverage, construction, retail, hospitality

### Secondary: Government Procurement Officers

- Federal, provincial, and municipal buyers with Canadian-content requirements
- Need auditable proof of supplier origin for compliance

### Tertiary: Economic Development Agencies

- Provincial and municipal agencies promoting local business-to-business connections
- Need data on supply gaps and supplier density to inform policy

---

## Core User Journeys

### Journey 1: Product Search → Supplier Discovery

1. User enters a product or material need (e.g., "stainless steel fasteners," "organic oat flour," "commercial HVAC filters")
2. System returns a ranked list of Canadian suppliers matching the query
3. Each result shows: company name, location, distance from user, Canadian-content confidence score, estimated capacity tier, contact method
4. User filters by province, distance radius, capacity, certifications
5. User saves shortlist or exports to CSV for internal procurement workflow

### Journey 2: Category Browse → Gap Identification

1. User browses by NAICS/UNSPSC product category
2. System shows a map view of supplier density across Canada for that category
3. Sparse regions are flagged — useful for economic development agencies identifying supply gaps
4. User can set alerts for new suppliers entering an underserved category

### Journey 3: Tariff Context → Cost Comparison

1. User enters a product they currently import
2. System shows the applicable tariff/duty rate (pulled from CBSA tariff schedules)
3. System surfaces Canadian alternatives with an estimated landed-cost comparison
4. User sees when "buy Canadian" is already price-competitive after duties

---

## Feature Specification

### F1: Intelligent Search Engine

| Attribute       | Detail                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------- |
| Input           | Free-text product/material/service query in EN or FR                                        |
| Processing      | NLP-based query understanding mapped to NAICS codes, UNSPSC codes, and product taxonomy     |
| Output          | Ranked supplier list with relevance score                                                   |
| Ranking factors | Query relevance, proximity to user, Canadian-content confidence, data freshness, capacity   |
| Bilingual       | Search, results, and UI fully functional in English and French                               |

### F2: Supplier Profile Cards

Each supplier result displays:

- **Company name** and legal entity type
- **Location** — city, province, postal code, distance from searcher
- **Canadian-content confidence score** (0–100) — composite of: registration in Canadian business registries, headquarters location, manufacturing/production location if available, Canadian ownership signals
- **Capacity tier** — Small / Medium / Large (inferred from employee count and revenue band where available)
- **NAICS codes** — primary and secondary industry classifications
- **Certifications** — ISO, organic, B Corp, Indigenous-owned, women-owned, diversity certifications (where data is available)
- **Contact** — website, email, phone (pulled from public registry data)
- **Data sources** — which registries/databases this profile draws from (transparency signal)

### F3: Map View & Supplier Density

- Interactive map showing supplier locations for a given query or category
- Cluster view at national scale, individual pins at regional zoom
- Heatmap toggle showing supplier density by region
- "Supply desert" highlighting for categories with low domestic coverage

### F4: Tariff & Landed-Cost Context

- User inputs a product they currently import + origin country
- System pulls applicable MFN or preferential tariff rate from CBSA tariff data
- Displays estimated landed cost (product price + duty + estimated freight) vs. Canadian supplier pricing (where available or estimated from category benchmarks)
- **Not a quoting tool** — positioned as directional cost context, not binding pricing

### F5: Alerts & Saved Searches

- Users save searches and receive email/in-app alerts when new suppliers match
- Economic development users can subscribe to category-level alerts for their region
- Weekly digest option summarizing new suppliers, trending categories

### F6: Shortlist & Export

- Save suppliers to named shortlists (e.g., "Q3 packaging vendor search")
- Export shortlist to CSV with all profile fields
- Share shortlist via link with team members

### F7: Supplier Claim & Enrichment

- Suppliers can "claim" their profile and add verified information (product catalog, capacity details, certifications, pricing ranges)
- Claimed profiles are badged and rank higher in results
- Self-serve onboarding flow for suppliers not yet in the database

---

## Data Architecture

### Data Sources (MVP)

| Source                                       | What it provides                                     | Access method             | Status         |
| -------------------------------------------- | ---------------------------------------------------- | ------------------------- | -------------- |
| Statistics Canada Canadian Business Register | Company name, NAICS, location, employee size band    | Open data / bulk download | Available now  |
| Innovation, Science and Economic Development Canada (ISED) federal corporation registry | Incorporated company data | Open API                  | Available now  |
| Provincial business registries (ON, QC, BC, AB as MVP) | Provincial incorporation and registration data | Varies by province        | Available now  |
| Canadian Trade Commissioner Service — supplier directories | Export-ready Canadian companies by sector   | Web scrape / partnership  | Requires agreement |
| CBSA Customs Tariff Schedule                 | HS codes, MFN tariff rates, preferential rates       | Open data                 | Available now  |
| UNSPSC / NAICS crosswalk tables              | Product-to-industry mapping                          | Open reference data       | Available now  |
| Canadian Company Capabilities (CCC) database | Defence and government supplier capabilities         | Requires registration     | Partial access |
| Municipal economic development directories   | Local business listings by city/region                | Web scrape / partnership  | Varies         |

### Data Pipeline

```
[Source Registries] → [ETL / Ingestion Layer] → [Normalized Company Graph]
                                                        ↓
                                              [Search Index (Elasticsearch)]
                                                        ↓
                                              [API Layer] → [Web App]
```

- **Ingestion frequency:** Weekly batch for registries; daily for claimed/enriched profiles
- **Entity resolution:** Deduplicate companies appearing in multiple registries using name + address + NAICS fuzzy matching
- **Taxonomy mapping:** Map free-text product descriptions to NAICS and UNSPSC codes using an NLP classifier trained on Canadian industry data
- **Canadian-content scoring model:** Weighted composite of registration jurisdiction, HQ location, production location (if known), ownership signals

### Data Quality & Gaps

- **Known gap:** Most registries provide company name and industry code but not specific product-level detail. Product specificity improves when suppliers claim profiles and add catalog data.
- **Known gap:** Employee count and revenue are often reported in bands, not exact figures. Capacity tier is approximate.
- **Known gap:** Pricing data is not available from registries. Landed-cost comparison relies on category-level benchmarks until supplier-provided pricing is available.
- **Mitigation:** The supplier claim/enrichment flow (F7) is the primary mechanism for closing these gaps over time.

---

## Technical Architecture

### Stack

| Layer        | Technology                          | Rationale                                                    |
| ------------ | ----------------------------------- | ------------------------------------------------------------ |
| Frontend     | Next.js (React) + Tailwind CSS     | Fast iteration, SSR for SEO, bilingual routing               |
| Backend API  | Node.js (Express or Fastify)       | Lightweight, easy to deploy, good ecosystem for ETL tooling  |
| Search       | Elasticsearch                      | Full-text search with faceting, geo queries, relevance tuning |
| Database     | PostgreSQL                         | Relational store for company graph, user accounts, shortlists |
| Maps         | Mapbox or Leaflet + OpenStreetMap  | Interactive map with clustering, no Google Maps lock-in       |
| NLP          | Sentence-transformers (for semantic search) + lightweight classifier (for NAICS mapping) | Runs on CPU, no GPU dependency for MVP |
| Auth         | NextAuth.js or Clerk               | Simple auth with email + OAuth                               |
| Hosting      | Canadian cloud (AWS ca-central-1 or Azure Canada Central) | Data residency in Canada                  |
| CI/CD        | GitHub Actions                     | Standard, free for open-source                               |

### Bilingual Implementation

- All UI strings stored in i18n resource files (EN/FR)
- URL structure: `sourcelocal.ca/en/...` and `sourcelocal.ca/fr/...`
- Search queries processed in detected language; results returned with bilingual company names where available (many Quebec companies have both)
- Tariff and legal terms reviewed by bilingual domain expert before launch

---

## Canadian-Content Confidence Score — Methodology

The score (0–100) is computed as a weighted sum:

| Signal                                             | Weight | Scoring logic                                                        |
| -------------------------------------------------- | ------ | -------------------------------------------------------------------- |
| Registered in a Canadian federal or provincial registry | 25     | Yes = 25, No = 0                                                    |
| Headquarters located in Canada                     | 25     | Confirmed Canadian address = 25, Unknown = 10                        |
| Production / manufacturing in Canada               | 30     | Confirmed = 30, Likely (industry + location signals) = 15, Unknown = 0 |
| Canadian ownership signals                         | 10     | Sole Canadian parent = 10, Mixed/unknown = 5, Foreign parent = 0     |
| Active in Canadian trade directories / programs    | 10     | Listed in CCC or Trade Commissioner directories = 10, Otherwise = 0  |

- Scores below 40 are flagged as "limited Canadian-content data — verify directly"
- Suppliers who claim their profile and provide documentation can override inferred scores

---

## MVP Scope & Milestones

### MVP (Weeks 1–12)

| Week   | Milestone                                                                         |
| ------ | --------------------------------------------------------------------------------- |
| 1–2    | Data ingestion pipeline for 4 source registries (federal + ON, QC, BC)            |
| 3–4    | Entity resolution and normalized company graph in PostgreSQL                      |
| 5–6    | Elasticsearch index with NAICS-based search + geo filtering                       |
| 7–8    | Web app: search, results list, supplier cards, map view (EN only)                 |
| 9–10   | French localization, tariff context module (CBSA data), shortlist/export           |
| 11–12  | Supplier claim flow (basic), Canadian-content scoring, QA, and soft launch        |

**MVP delivers:** Search across ~1.2M+ Canadian businesses, filtered by product category, province, and proximity, with Canadian-content scoring and basic tariff context. Covers Ontario, Quebec, BC, and Alberta.

### Post-MVP Roadmap

| Phase   | Timeline       | Features                                                                    |
| ------- | -------------- | --------------------------------------------------------------------------- |
| Phase 2 | Months 4–6     | Remaining provinces + territories; supplier enrichment dashboard; API for procurement systems integration |
| Phase 3 | Months 7–9     | AI-powered "sourcing assistant" chat (e.g., "I need a Quebec-based co-packer for 10,000 units of granola bars"); RFQ workflow |
| Phase 4 | Months 10–12   | Government procurement module (Canadian-content compliance reporting); analytics dashboard for economic development agencies |

---

## Success Metrics

### North Star Metric

**Monthly successful supplier connections** — defined as a user viewing a supplier profile and then clicking contact (email, phone, or website) or adding to a shortlist.

### Operational Metrics

| Metric                                | Target (6 months post-launch)   |
| ------------------------------------- | ------------------------------- |
| Registered users                      | 5,000                           |
| Monthly active searches               | 20,000                          |
| Supplier profiles in index            | 1,200,000+                      |
| Claimed / enriched supplier profiles  | 2,000                           |
| Avg. search-to-contact rate           | 8%                              |
| User satisfaction (NPS)               | 40+                             |
| French-language sessions as % of total | ≥ 20%                          |

### Impact Metrics (12-month horizon)

- Estimated import substitution value driven by SourceLocal connections (survey-based)
- Number of "new" supplier relationships formed (self-reported by users)
- Supply gap reports generated for economic development agencies

---

## Risks & Mitigations

| Risk                                              | Severity | Mitigation                                                                                       |
| ------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| Registry data is stale or incomplete               | High     | Weekly refresh cycles; supplier claim flow as primary enrichment mechanism; display "last verified" dates |
| Product-level specificity is too low for useful search | High  | Invest in NLP taxonomy mapping; prioritize supplier claim onboarding for high-demand categories   |
| Low supplier claim adoption                        | Medium   | Offer free "verified" badge and higher ranking; partner with trade associations for onboarding drives |
| Tariff data misinterpreted as binding advice        | Medium   | Prominent disclaimers; frame as "directional context, not legal/trade advice"                     |
| User confusion between company registration and actual production capability | Medium | Canadian-content score clearly labeled as "confidence estimate"; encourage verification |
| Bilingual quality issues in auto-translated content | Low      | Human review of all UI strings; supplier-provided content displayed as-is with language tag        |

---

## Competitive Landscape

| Existing tool         | What it does                          | Why SourceLocal is different                                       |
| --------------------- | ------------------------------------- | ------------------------------------------------------------------ |
| ThomasNet             | US-focused industrial supplier search | US-centric; poor Canadian coverage; no Canadian-content scoring     |
| Alibaba / Global Sources | Global supplier discovery           | Optimizes for cheapest global source, not domestic resilience       |
| Canadian Company Capabilities (CCC) | Defence/government supplier database | Narrow scope (defence); not designed for general SMB procurement |
| Google Maps / Search  | General business search               | No product-level taxonomy, no tariff context, no Canadian-content scoring |
| Provincial directories | Regional business listings           | Siloed by province; no cross-Canada search; no ranking or filtering |

**SourceLocal's moat:** The unified cross-registry company graph with Canadian-content scoring and tariff context does not exist anywhere today. The closest analogue is what data.go.kr enables in South Korea — but for supplier discovery rather than general open data.

---

## Open Questions for Hackathon Team

1. **Scope the demo:** Should the hackathon prototype cover all of Canada or focus on one province (e.g., Ontario) to maximize data quality in the demo?
2. **Tariff module depth:** Is the tariff/landed-cost comparison essential for the demo, or should it be deferred to post-hackathon? It adds complexity but is a strong differentiator.
3. **Supplier claim flow:** Should the hackathon build include a working supplier onboarding flow, or is the search-and-discover side sufficient for judging?
4. **AI search vs. keyword search:** Is semantic search (NLP-based) worth the extra build time for the hackathon, or is structured NAICS-code filtering enough to demonstrate value?
