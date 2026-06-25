# Civic Intelligence Platform

> Hyderabad → Telangana → India  
> Mapping the gap between what government records say and what satellite + citizen data shows.

A civic intelligence system that observes, classifies, tracks, and narrates every meaningful change across all dimensions of public life — starting with Hyderabad, built to scale to all of India.

---

## What this is

This is **not** a complaint portal. It is not a government dashboard.

It is a system that runs largely unattended and produces a credible, timestamped, evidence-backed picture of civic reality — across infrastructure, land use, environment, education, health, agriculture, governance, and public safety.

**Every area in Hyderabad gets a story.** That story accumulates satellite observations, citizen-submitted evidence, official documents, and AI classifications — and is updated continuously as new evidence arrives.

---

## Platform vision

```
Satellite (Sentinel-2, Landsat)  ──┐
Citizen reports + NGOs           ──┤──▶  Civic Intelligence Platform  ──▶  Area Stories
Government records (HMDA, GHMC)  ──┤                                       Task Board
Live data (sensors, APIs)        ──┘                                       Report Cards
                                                                            Monitoring
```

**Phase 1 — Hyderabad:** Build the model, validate the approach, accumulate ground truth data.  
**Phase 2 — Telangana:** Replicate with state-level administrative data.  
**Phase 3 — India:** Parameterized by state, district, and administrative unit (L1–L5 hierarchy).

See [VISION.md](./VISION.md) for the full platform design.  
See [docs/system-design.html](./docs/system-design.html) for the interactive CTO brief.

---

## Civic domains covered

| Domain | What we track | Priority |
|--------|---------------|----------|
| Infrastructure | Roads, bridges, sewage, electricity, water pipes | v1 |
| Land & Property | Encroachment, zoning violations, land bidding, registry status | v1 |
| Environment | Water bodies, air quality, waste, tree cover, lake health | v1 |
| Education | School construction, enrollment anomalies | v2 |
| Health | Hospital/PHC construction, disease cluster detection | v2 |
| Agriculture | Farmland health (NDVI), crop patterns, irrigation, distress zones | v2 |
| Governance | Project vs. budget utilization, tender compliance | v3 |
| Public Safety | Accident zones, lighting gaps, waterlogging hotspots | v3 |

---

## Architecture overview

Six layers — each independently deployable:

```
[Observation]    Sentinel-2 · Landsat · Citizen App · HMDA/GHMC boundaries
      ↓
[Ingestion]      Google Earth Engine · STAC · Supabase Storage · Cron jobs
      ↓
[AI / ML]        Claude Vision · MNDWI engine · Change detection · SegFormer (research)
      ↓
[Data Store]     Supabase Postgres (OLTP) · ClickHouse (OLAP) · Object Storage
      ↓
[Application]    Map view · Evidence viewer · Task board · Report cards
      ↓
[Alerts]         Escalation tiers (30/60/90 day) · Complaint drafts · RSS/Email
```

**Key patterns:** CQRS (separate write and read paths), append-only evidence chains, JSONB domain metadata for zero-migration domain expansion.

**Storage tiers:** Hot (Redis/CDN) → Warm (Postgres) → Cold (ClickHouse) → Archive (Object storage).

---

## Contributor trust tiers

```
Anonymous (0.20) → Registered (0.40) → Verified (0.70) → NGO Partner (0.80) → Expert Reviewer (0.95)
```

Verified status is maintained monthly via a personalized domain-specific questionnaire (min score: 75%). Trust weight determines how much a contribution influences an area story's confidence score.

---

## Classification engine

Three-stage pipeline with smart retries:

1. **Claude Vision** — zero-shot, target confidence ≥ 0.75
2. **CLIP + domain context** — richer prompt, target ≥ 0.65
3. **Human review queue** — smart batching by domain, capped at 50 items

All stage switches are logged and notified. Failed classifications feed anti-gaming training data.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React + TypeScript, MapLibre GL, TanStack Query, Tailwind |
| Backend | Supabase (Postgres + Storage + Auth + Edge Functions) |
| Satellite processing | Google Earth Engine Python API, Copernicus Dataspace |
| AI classification | Claude Vision API (claude-sonnet-4-6), HuggingFace SegFormer |
| OLAP / analytics | ClickHouse (self-hosted, added when Postgres queries exceed 2s) |
| Hosting | Vercel (frontend), Supabase (backend) |

---

## Build roadmap

| Milestone | Focus | Status |
|-----------|-------|--------|
| M0 | Domain research + scorecard (research first, no code) | 🔴 Next |
| M1 | Core schema + citizen report app | ⬜ Queued |
| M2 | Claude Vision classification engine | ⬜ Queued |
| M3 | Satellite layer + evidence chains | ⬜ Queued |
| M4 | Contributor tiers + security layers | ⬜ Queued |
| M5 | Historical change detection + task board + alerts | ⬜ Queued |
| M6 | Historical water recovery model (research track) | ⬜ Research |
| M7 | Second domain + India parameterization | ⬜ Scale |

See all issues: [github.com/SumanthVarma798/hyderabad-truth-map/issues](https://github.com/SumanthVarma798/hyderabad-truth-map/issues)

---

## Working with Claude Code

Issues prefixed `[DISCUSS]` are open questions designed to be picked up in Claude Code:

```
# In Claude Code chat:
"Read issue #18 and let's discuss it."
```

Each discussion issue contains full context, the question, known constraints, and what a good answer looks like.

---

## Learning path

This project covers two deep technical tracks:

**AI/ML:** Prompt engineering → structured output → geospatial segmentation → active learning → continuous model retraining  
**Space Tech:** GEE Python API → Sentinel-2 band analysis → STAC catalogs → change detection → SegFormer fine-tuning

Both tracks produce portfolio-ready artifacts at each milestone.

---

## License

MIT — built for the commons. Attribution required if you use the data or models.
