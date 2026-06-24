# Hyderabad Truth Map

> Map what Hyderabad actually looks like — not what the official records say.

---

## Resume where you left off

```bash
cd hyderabad-truth-map
python3 -m http.server 4242 --directory learning
open http://localhost:4242
```

The learning dashboard tracks your sprint tasks and notes. State is saved in your browser — just open it and pick up where you stopped.

---

## Project links

| | |
|---|---|
| Learning dashboard | `learning/index.html` — run the command above |
| Architecture | [`docs/architecture.md`](docs/architecture.md) |
| GitHub repo | https://github.com/SumanthVarma798/hyderabad-truth-map |
| Project board | https://github.com/users/SumanthVarma798/projects/11 |

---

## What this is

A civic geospatial platform that surfaces the gap between official data and ground reality in Hyderabad. Users can view, report, and verify conditions across infrastructure, water bodies, roads, and urban development.

Full design: [`docs/architecture.md`](docs/architecture.md).

---

## Current sprint

**Sprint 1 — Scaffold & data model** (Jun 24 – Jul 7, 2026)

- [x] Create GitHub repo + project board
- [x] Write architecture doc
- [ ] Initialise Supabase project + enable PostGIS
- [ ] Define observations + official_zones schema
- [ ] Scaffold React + Vite + MapLibre hello-world
- [ ] Render OpenStreetMap base layer
- [ ] Write first ingest script (GHMC wards → PostGIS)

Check off tasks in the [learning dashboard](http://localhost:4242) — not here. The dashboard persists state; the README is just a snapshot.

---

## Stack

- **Frontend** — React 18 + Vite + TypeScript + MapLibre GL JS
- **Backend** — Supabase (Postgres + PostGIS + Auth + Storage)
- **Tiles** — OpenFreeMap (no API key)
- **Deploy** — Vercel (frontend) + Supabase (backend)
