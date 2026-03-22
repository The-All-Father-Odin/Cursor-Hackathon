# SourceLocal — 3-Minute Pitch Transcript

**Total time: ~3 minutes (180 seconds)**

---

## [0:00–0:25] THE HOOK (25 seconds)

Let me ask you a question. If you run a Canadian business and you need stainless steel fasteners — where do you go? Most people open Google. Maybe Alibaba. Maybe ThomasNet, which is American.

What they don't do is find the manufacturer 40 kilometers away in Mississauga, Ontario — because they don't know it exists.

This is the problem. It's not that Canadian suppliers don't exist. It's that they're invisible. Supplier data is scattered across 69 different municipal and provincial databases. Nobody has connected the dots — until now.

---

## [0:25–0:55] THE SOLUTION (30 seconds)

We built **SourceLocal** — Canada's supplier discovery engine.

Type in what you need — "steel fasteners," "organic oat flour," "HVAC filters" — and get a ranked list of verified Canadian businesses that make it. Every result shows you where they are, how big they are, what industry they're in, and a Canadian Content Confidence Score from 0 to 100 — so you know how much we can verify about their Canadian presence.

You can filter by province, capacity, view them on an interactive map, compare tariff costs against imports, and export your shortlist to CSV. It's bilingual — English and French. And it's live right now on Vercel.

---

## [0:55–1:30] THE DATA (35 seconds)

Now, what makes this credible is the data source. We're not scraping random websites. We're powered by Statistics Canada's Open Database of Businesses — ODBus. That's 446,000 real Canadian businesses compiled from 69 official municipal and provincial open data sources.

We know their names, addresses, NAICS industry codes, employee counts, and for 70 percent of them, exact GPS coordinates. This is government registry data — authoritative, deduplicated, and normalized.

For our demo today, we're serving 10,000 suppliers through Next.js API routes backed by JSON data. The full pipeline can scale to the entire 446K dataset.

---

## [1:30–2:05] THE DEMO (35 seconds)

Let me show you. *[Switch to demo]*

Here's the landing page — live stats pulled from our API. Let me search for "pharmacy" in Ontario. Instantly, I get results with Canadian Content scores, capacity tiers, and data source attribution.

I can click into a supplier — full detail page with address, NAICS classification, licensing info, everything sourced from Statistics Canada.

Switch to the map view — you can see suppliers across Canada, color-coded green for high confidence, amber for medium. Pan, zoom, click any marker for details.

And here's the tariff comparison — stainless steel bolts from China cost $5,805 landed after duties. The Canadian alternative? $5,200. That's $605 in savings and a stronger supply chain.

---

## [2:05–2:30] WHY NOW (25 seconds)

This matters right now because of what happened in 2025. US tariff escalations exposed how fragile our cross-border dependencies are. "Buy Canadian" went from a nice slogan to a strategic imperative overnight.

But there's a gap between the sentiment and the action. Procurement officers have Canadian-content mandates but no tooling. SMB owners want to source locally but can't find who makes what. SourceLocal bridges that gap.

There is no ThomasNet for Canada. No Alibaba for domestic sourcing. We're building it.

---

## [2:30–2:55] THE ASK & IMPACT (25 seconds)

We built this entire full-stack application in one day — Next.js, TypeScript, Tailwind, Leaflet maps, bilingual support, real government data, deployed on Vercel. The code is open source on GitHub.

To take this to production, we need three things: access to additional federal and provincial registry APIs, five pilot SMBs willing to test real procurement decisions through SourceLocal, and six months of runway.

Our 12-month target: 5,000 users, 20,000 monthly searches, and $10 million in estimated import substitution.

---

## [2:55–3:00] THE CLOSE (5 seconds)

Every dollar spent with a Canadian supplier strengthens a Canadian community. SourceLocal makes the invisible visible. Thank you.

---

## Speaker Notes & Tips

- **Slide 4 (Demo):** Have the live site open in a browser tab, pre-loaded at `/en/search`. Practice the demo flow: search -> filter -> detail -> map -> tariff. Keep it under 35 seconds.
- **Pacing:** The hook should be conversational, almost casual. Speed up slightly during the data section to convey authority. Slow down for the closing line.
- **Key numbers to memorize:** 446,573 businesses, 69 data sources, $605 savings on steel bolts, $67B in imports, 10.4% cheaper.
- **If asked "Why not just use Google?"** — Google shows you businesses exist. It doesn't tell you their NAICS code, capacity tier, Canadian content confidence, or how they compare to an import after duties. We're a procurement tool, not a search engine.
- **If asked about revenue model:** Freemium — free search, paid for advanced filters, API access, supplier enrichment dashboards, and government procurement compliance reporting.
- **If asked about competition:** ThomasNet is US-focused with poor Canadian coverage. Alibaba optimizes for cheapest global source. Canadian Company Capabilities (CCC) is defence-only. We're the first cross-registry, general-purpose Canadian supplier search.
