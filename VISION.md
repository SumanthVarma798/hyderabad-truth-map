# Platform Vision — Civic Intelligence Platform v0.2

> Last updated: 2026-06-25  
> Status: Design locked, pre-build  
> Interactive CTO brief: `docs/system-design.html`

---

## North star

A system that runs largely unattended and produces a credible, up-to-date picture of civic reality — across all dimensions of public life — starting with Hyderabad, scaling to all of India.

This is not a complaint portal. Not a government dashboard. Not a one-domain tool.

It is a **civic intelligence system** that:
- Detects civic events autonomously (satellite + sensors)
- Classifies and routes them without human intervention
- Builds and maintains the **story of every area** over time
- Improves its own accuracy as evidence accumulates
- Knows what it doesn't know and flags it

---

## Geographic ambition

| Phase | Scope | Goal |
|-------|-------|------|
| 1 | Hyderabad | Build the model, validate the approach, accumulate ground truth |
| 2 | Telangana | Replicate with state-level administrative data |
| 3 | India | Parameterize by state, district, administrative unit (L1–L5) |

The architecture must be designed for Phase 3 from Day 1. Hyderabad is the pilot, not the ceiling.

---

## Civic domains

Scored by: data availability · classification difficulty · civic impact · legal risk

| Domain | v1? | Data sources | AI task |
|--------|-----|--------------|---------|
| Infrastructure | ✅ | Citizen photos, satellite, maintenance schedules | Photo classification, damage scoring |
| Land & Property | ✅ | HMDA records, satellite, citizen, Registrations dept | Change detection, boundary comparison |
| Environment | ✅ | Sentinel-2, CPCB API, citizen, NDVI | Segmentation, change detection |
| Education | v2 | DISE data, citizen, satellite | Construction phase detection |
| Health | v2 | NHM data, citizen, IDSP disease reports | Clustering, facility scoring |
| Agriculture | v2 | Sentinel-2 NDVI, Fasal Bima, citizen | NDVI time-series, distress classification |
| Governance | v3 | e-procurement portal, RTI responses | Document parsing, anomaly detection |
| Public Safety | v3 | NCRB data (anonymized), citizen | Hotspot clustering, recurrence detection |

**Pre-build requirement:** Complete a domain scorecard (see issue [#18](../../issues/18)) before writing v1 code.

---

## System architecture

### Six layers

```
[Observation]    Sentinel-2 (10m/5-day) · Landsat 8/9 (30m/archive 1972) · Citizen App · HMDA/GHMC
      ↓
[Ingestion]      GEE Python pipelines · STAC Catalog · Supabase Storage · Cron jobs (weekly/hourly/daily)
      ↓
[AI / ML]        Claude Vision (photo classify) · MNDWI rule (water detect) · Change detection · SegFormer (research)
      ↓
[Data Store]     Supabase Postgres (OLTP) · ClickHouse (OLAP) · Object Storage (archive) · Redis (hot cache)
      ↓
[Application]    Map view · Evidence viewer · Task board · Contributor portal · Report cards · Monitoring dash
      ↓
[Alerts]         Escalation tiers 30/60/90 day · Complaint draft generator · RSS/Email per ward
```

### Key architecture patterns

**CQRS (Command/Query Responsibility Segregation)**  
All writes flow through an event stream (Supabase Realtime → Kafka at scale). Reads are served from pre-computed materialized views. The map never runs a live aggregate query.

**Storage tiers (Google pattern)**
- Hot: Redis + CDN — sub-100ms, ward summaries, recent reports
- Warm: Postgres OLTP — transactional data, evidence chains, tasks
- Cold: ClickHouse OLAP — historical time-series, analytics, ML training data
- Archive: Object storage — raw satellite images, photos, GeoJSON

**Append-only evidence chains**  
Evidence items are never updated, only added. Every area story has a complete, immutable audit trail.

**JSONB domain metadata**  
New civic domains never require schema migrations. Core tables (`area_stories`, `evidence_items`) are stable forever. New domains add rows with new JSONB shapes to `domain_metadata`.

---

## Core data model

```sql
-- Every area in Hyderabad (ward section / block)
area_stories(
  id, geo_id, ward_id, district,
  domain: 'infrastructure'|'land'|'environment'|'education'|...,
  status: 'active'|'resolved'|'monitoring'|'disputed'|'false_positive',
  narrative_summary,    -- AI-generated, updated weekly as evidence accumulates
  confidence_score,     -- weighted average across all evidence items
  opened_at, updated_at, resolved_at
)

-- All evidence links to a story (append-only)
evidence_items(
  id, story_id,
  type: 'citizen_report'|'satellite_obs'|'govt_document'|'ai_inference'|'official_response',
  source_id,            -- FK to reports / satellite_alerts / documents
  contributor_id,
  trust_weight,         -- based on contributor tier + source type
  captured_at,
  payload_url           -- photo, GeoJSON diff, PDF, structured JSON
)

-- Domain-specific metadata (never needs migration)
domain_metadata(story_id, domain, metadata JSONB)

-- Generic admin hierarchy (works for any Indian state)
admin_units(id, level: 1-5, name, parent_id, state_code)
-- L1=State, L2=District, L3=Mandal/Taluka, L4=Ward/Village, L5=Block/Survey
```

---

## AI / ML pipeline

### Four problems, four approaches

| Problem | Approach | Difficulty |
|---------|----------|------------|
| Photo classification | Claude Vision, zero-shot | Low — ship in M2 |
| Current water detection | MNDWI threshold on Sentinel-2 | Low — ship in M3 |
| Historical change detection | Landsat composite diff | Medium — ship in M5 |
| Historical water recovery | SegFormer fine-tuned on HMDA + Landsat | Research — M6 |

### Classification engine (3 stages)

```
New evidence arrives
      ↓
Stage 1: Claude Vision (zero-shot) → confidence ≥ 0.75 → PUBLISH ✓
      ↓ < 0.75 (switch notified)
Stage 2: CLIP + domain context → confidence ≥ 0.65 → PUBLISH (low-conf badge) ⚠️
      ↓ < 0.65
Stage 3: Human review queue (smart batching, domain-routed, capped 50 items)
      ↓ rejected
      → Log as false_positive → anti-gaming training data
```

### Data flywheel

Satellite observations + citizen ground truth + official records → training corpus → better models → better classification → more reliable stories → more contributor trust → more citizen data → better training corpus.

---

## Contributor system

### Trust tiers

| Tier | Trust weight | Requirements |
|------|-------------|--------------|
| Anonymous | 0.20 | None |
| Registered | 0.40 | Phone verified |
| Verified | 0.70 | Monthly quiz ≥ 75%, active submission history |
| NGO Partner | 0.80 | Org vetting + 30-day probation |
| Expert Reviewer | 0.95 | Domain specialist, closes disputes, labels training data |

### Monthly questionnaire

Verified status is not permanent. Monthly personalized quiz tests:
- Domain knowledge (classify photos — same task as Claude Vision)
- Local knowledge (department routing in Hyderabad)
- Past submission review (assess their own last 30 days)

Below 75% → downgraded to Registered. No bans. Status shown publicly.

### Incentive system

- Public ward leaderboard by verified report count + accuracy score
- "Ward Guardian" badge for contributors in well-covered wards
- Report outcome notifications ("your report is now Escalated T2, 340 views")
- Ward-anchored public forums for each area story

---

## Security & anti-gaming

Six defense layers (start with 1–3 in v1, add layers as attack vectors emerge):

1. **Rate limit** — 5 reports/hour per user, IP burst detection
2. **Geo-fence** — GPS must be ≤ 2km from claimed pin location
3. **AI filter** — detect staged photos, stock images, exact duplicates
4. **Cross-validation** — high-severity stories require 3+ independent sources
5. **Reputation decay** — contributor score drops on disputed reports
6. **Coordinated attack detection** — burst from same network/device cluster

All rejected reports get a reason code + appeal link. Successful appeals restore reputation. High appeal success rate on a rule → review the rule, not the contributors.

Security rules are stored in DB and updated without code deploys. New attack patterns are logged as `attack_pattern` records. Monthly security report reviews new vectors.

---

## Monitoring system

Three monthly reports, all auto-generated, all triggerable on demand:

**Technical report:** Pipeline health, AI accuracy per domain, false positive rates, human review queue depth, API costs, infrastructure latency, storage growth.

**Product report:** Active contributors by tier, quiz pass/fail rates, ward coverage gaps, story open/close/escalation rates, domain distribution.

**Impact report:** Stories opened by source (satellite-only / citizen-only / combined), issues resolved, average days to resolution by domain, escalations triggered.

**Anomaly alerts (immediate, not monthly):**
- AI confidence drops below 0.60 average for any domain
- Human review queue exceeds 50 items
- Satellite pull fails for 7+ consecutive days
- Report burst 10x normal rate in any ward within 2 hours
- Claude API spend exceeds monthly budget threshold

---

## Escalation tiers

| Tier | Trigger | Action |
|------|---------|--------|
| T0 | Report filed | Story opens, evidence chain begins |
| T1 | 30 days unresolved | Auto-draft complaint generated (citizen clicks to file) |
| T2 | 60 days unresolved | Appears in weekly RSS + digest, "Escalated" badge on task board |
| T3 | 90 days unresolved | Included in monthly ward report card, flagged for election cycle summary |

The system **drafts** complaints. It does not auto-file. Citizens retain full control.

---

## Open questions (active)

These are unresolved design questions. Each has a corresponding GitHub issue for Claude Code discussion.

| # | Question | Issue |
|---|----------|-------|
| 1 | Which 3 domains for v1? (domain scorecard needed) | [#18](../../issues/18) |
| 2 | How do we detect resolution automatically? | [#19](../../issues/19) |
| 3 | What if HMDA historical GIS data isn't available? | [#20](../../issues/20) |
| 4 | ClickHouse vs BigQuery — which OLAP layer? | [#21](../../issues/21) |
| 5 | Generic L1–L5 admin hierarchy design for India | [#22](../../issues/22) |
| 6 | How to recruit expert reviewers? | [#23](../../issues/23) |
| 7 | Monsoon cloud cover — composite strategy details | [#24](../../issues/24) |
| 8 | Security v1 — what's the minimum viable defense? | [#25](../../issues/25) |
| 9 | How to find and onboard first NGO partners? | [#26](../../issues/26) |
| 10 | Appeal system — full UX and backend design | [#27](../../issues/27) |

---

## Build roadmap

| Milestone | Focus | Est. duration |
|-----------|-------|---------------|
| M0 | Domain research + scorecard | 2–3 weeks |
| M1 | Core schema + citizen report app | 2–3 weeks |
| M2 | Classification engine (Claude Vision + monitoring skeleton) | 2 weeks |
| M3 | Satellite layer + evidence chains + AI narrative | 3–4 weeks |
| M4 | Contributor tiers + security layers 1–3 | 3–4 weeks |
| M5 | Historical change detection + task board + alerts | 3 weeks |
| M6 | Historical water recovery model (research) | 2–6 months |
| M7 | Second domain + India parameterization | Open |

**Critical constraint:** M0 (research) must complete before M1 (schema). Domain choices determine schema shape. Building before researching produces the wrong system.

---

## Learning path

### AI/ML track
From this project: prompt engineering for structured output → supervised segmentation → active learning → continuous model retraining  
Market skills: Python · PyTorch · HuggingFace (SegFormer, SAM) · MLflow/W&B · LLM tool calling

### Space Tech track
From this project: GEE Python API → Sentinel-2 band analysis → STAC catalogs → change detection → SegFormer fine-tuning  
Market skills: GEE · GDAL · Rasterio · QGIS · Cloud-optimized GeoTIFF · OGC standards

**Portfolio framing:** "Built a civic AI system that detects historically-encroached water bodies in Hyderabad using Sentinel-2, Landsat, and a custom segmentation model trained on HMDA boundary data."
