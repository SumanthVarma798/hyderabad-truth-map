# Domain Scorecard — v1

> Decision date: 2026-06-25. Scoring: 1–5, higher is better. Legal: higher = lower risk.

| Domain | Data | AI Task | Impact | Legal | Total | v1? |
|---|---|---|---|---|---|---|
| Infrastructure | 4 | 4 | 5 | 4 | **17** | Yes |
| Land & Property | 4 | 3 | 5 | 4 | **16** | Yes |
| Environment | 4 | 4 | 4 | 4 | **16** | Yes |
| Education | 4 | 2 | 4 | 3 | 13 | v2 |
| Agriculture | 3 | 3 | 2 | 5 | 13 | v2 |
| Governance | 2 | 1 | 4 | 3 | 10 | v2 |
| Health | 2 | 2 | 3 | 2 | 9 | v2 |
| Public Safety | 1 | 2 | 3 | 1 | 7 | Avoid |

## v1 domains

**Infrastructure** — Roads, drainage, streetlights. GHMC road network + OSM base layer. AI task: photo classification of road condition, pothole, flooding. Agency accountability: GHMC ward + contractor record.

**Land & Property** — Lake encroachment against official HMDA FTL boundaries. Data source: https://lakes.hmda.gov.in/ (scanned PDFs, requires ingestion pipeline). AI task: satellite polygon comparison against FTL boundary + citizen photo classification. Legal defense: rendering official HMDA data, not independent accusation.

**Environment** — Illegal dumping, industrial discharge, green space loss. Data: TSPCB air/water quality stations, HMDA master plan. AI task: garbage dump detection via satellite/photo, green space comparison (master plan vs current).

## Constraints applied

- Machine-readable or archivable data source required (HMDA FTL PDFs qualify via ingestion pipeline)
- Clear AI classification task executable with Claude Vision or GEE
- Legal risk manageable — all three domains reference official data as ground truth
- Hyderabad-specific data available

## Schema implication

Three distinct observation categories: `infrastructure`, `encroachment`, `environment`. Each maps to the same `observations` table with category tag. Official reference data lives in `official_zones` (FTL polygons, HMDA master plan boundaries, TSPCB station locations).
