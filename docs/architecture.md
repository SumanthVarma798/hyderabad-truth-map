# Architecture — Aware India

> Last updated: 2026-06-24

## What this is

A civic geospatial platform that surfaces the gap between official data and ground reality in Hyderabad. Users can view, report, and verify conditions across infrastructure, water bodies, roads, and urban development — building a living map that reflects what is actually there, not just what government records say.

---

## System overview

```
Browser (React + MapLibre GL)
        │
        ├── /map          Interactive map + layer controls
        ├── /report       Submit a ground truth observation
        ├── /verify       Review & upvote submitted reports
        └── /learning     Personal dev journal (static HTML)
        │
        ▼
   Supabase (Backend)
        │
        ├── Auth          Anonymous + email magic link
        ├── PostGIS DB    Spatial tables for observations + tiles
        ├── Storage       Photos attached to reports
        └── Edge Fns      NDWI computation, tile serving
        │
        ▼
   External Data Sources
        ├── OpenStreetMap (Overpass API)    Base road + building layer
        ├── GHMC Open Data                  Official ward/zone boundaries
        ├── Bhuvan / ISRO                   Satellite imagery (Landsat 8/9)
        └── Telangana State GIS             Official land-use polygons
```

---

## Frontend

**Stack:** React 18 + Vite + TypeScript + MapLibre GL JS

**Map renderer:** MapLibre GL JS (no API key; tiles from [OpenFreeMap](https://openfreemap.org) or self-hosted PMTiles)

**Key screens:**

| Route | Purpose |
|---|---|
| `/map` | Main interactive map. Layers toggle: base OSM, NDWI water, official land-use, ground truth reports |
| `/report` | Form to submit an observation. Attaches GPS coordinate, photo, category tag |
| `/verify` | Queue of unverified reports. Community upvotes promote to verified layer |
| `/learning` | Static personal dev journal. No auth, no backend |

**State management:** Zustand (lightweight; map layer state + filter state)

**Styling:** Tailwind CSS

---

## Backend — Supabase

### Tables

```sql
observations
  id          uuid PK
  created_at  timestamptz
  geom        geometry(Point, 4326)   -- PostGIS
  category    text                    -- 'water', 'road', 'encroachment', 'other'
  status      text                    -- 'pending', 'verified', 'disputed'
  photo_url   text
  description text
  upvotes     int default 0
  user_id     uuid references auth.users

official_zones
  id          uuid PK
  geom        geometry(MultiPolygon, 4326)
  zone_name   text
  land_use    text                    -- from GHMC/Telangana GIS
  source_url  text
  fetched_at  timestamptz
```

### Row-level security

- `observations`: anyone can read verified rows; authenticated users can insert; only own rows can be updated
- `official_zones`: read-only public

### Edge functions

| Function | Purpose |
|---|---|
| `compute-ndwi` | Accepts bounding box, fetches Landsat 8/9 bands B3+B5 from Bhuvan, returns NDWI GeoTIFF |
| `serve-tiles` | Wraps PostGIS `ST_AsMVT` into a `/tiles/{z}/{x}/{y}` endpoint for the map |

---

## Data pipeline

Ground truth layer is user-submitted. Official layer is a one-time (and periodically refreshed) ETL:

```
scripts/ingest/
  fetch_ghmc_wards.py     → official_zones table
  fetch_osm_water.py      → seeded observations with status='official'
  compute_ndwi_batch.py   → runs NDWI over city bbox, stores raster in Storage
```

Run manually for now; move to a scheduled Supabase edge function once stable.

---

## Hosting & deployment

| Layer | Host |
|---|---|
| Frontend | Vercel (auto-deploy from `main`) |
| Backend | Supabase (managed Postgres + Auth + Storage) |
| Map tiles | OpenFreeMap (free, self-hostable fallback: PMTiles on Cloudflare R2) |
| Satellite raster | Supabase Storage (GeoTIFFs from ISRO Bhuvan) |

---

## Decisions log

| Date | Decision | Why |
|---|---|---|
| 2026-06-24 | MapLibre over Mapbox | Open source, no API key, same GL spec |
| 2026-06-24 | Supabase over Firebase | PostGIS is non-negotiable for spatial queries |
| 2026-06-24 | PMTiles for tile serving | Single-file format, no tile server process needed |
| 2026-06-24 | Anonymous auth allowed | Lower friction for first report submission |

---

## What is deliberately out of scope (v1)

- Mobile app (PWA is fine for now)
- Real-time collaboration / live cursors
- ML-based automatic verification
- Integration with GHMC grievance portal (API doesn't exist yet)

---

## North-star theses (parked / future)

Long-term directions recorded deliberately, not actionable now. Each has a concrete
revisit signal. See [`docs/research/`](research/).

- [World models for spectral analysis](research/world-models-spectral-thesis.md) —
  why current LLMs can't derive spectral indices from first principles; revisit when
  a model can derive a physically-grounded index from raw unlabeled spectral curves.
  Until then, spectral indices (NDWI/NDVI/MNDWI) are physics-derived ground truth.

---

## Open questions

- [ ] Which ISRO Bhuvan dataset has the best temporal resolution for Hyderabad?
- [ ] Does GHMC publish ward boundaries as GeoJSON or only PDF?
- [ ] Should the NDWI layer be computed on-demand or precomputed nightly?
