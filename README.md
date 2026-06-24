# Hyderabad Truth Map

> Satellite-derived before/after evidence of Hussain Sagar lake encroachment — 2016 vs 2025.

[![CI](https://github.com/SumanthVarma798/hyderabad-truth-map/actions/workflows/ci.yml/badge.svg)](https://github.com/SumanthVarma798/hyderabad-truth-map/actions/workflows/ci.yml)
[![Deploy](https://github.com/SumanthVarma798/hyderabad-truth-map/actions/workflows/deploy.yml/badge.svg)](https://github.com/SumanthVarma798/hyderabad-truth-map/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Why this matters

Hussain Sagar, Hyderabad's iconic heart-shaped lake built in 1562, has shrunk dramatically over the past three decades. Encroachments — residential, commercial, and road constructions permitted or tolerated by successive administrations — have eroded the Full Tank Level (FTL) boundary established under the Hyderabad Metropolitan Development Authority (HMDA) norms.

Between 2016 and 2025, satellite imagery tells a story that official reports often obscure. This project processes **Sentinel-2 multispectral imagery** through the **Normalized Difference Water Index (NDWI)** to produce an objective, reproducible, peer-reviewable record of how much lake has been lost — and where.

The data is open. The methodology is documented. The numbers can be checked.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      DATA PIPELINE                              │
│                                                                 │
│  Sentinel-2 L2A          Google Earth Engine        GeoJSON     │
│  (ESA Copernicus)   ──►  NDWI threshold script  ──► export     │
│  2016 + 2025 images      (gee/ndwi_export.js)       to Drive   │
│                                                        │        │
│                                           Download & commit     │
│                                           to public/data/       │
└────────────────────────────────────────────────┬────────────────┘
                                                 │
                                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND                                   │
│                                                                 │
│  React + Vite + TypeScript + Tailwind CSS                       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  MapView (Leaflet)                                       │   │
│  │  ├── TileLayer (OpenStreetMap / CartoDB)                 │   │
│  │  ├── GeoJSON Layer — 2016 water extent                   │   │
│  │  ├── GeoJSON Layer — 2025 water extent                   │   │
│  │  ├── GeoJSON Layer — encroachment delta                  │   │
│  │  └── BeforeAfterSlider (CSS clip-path)                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌──────────────────┐  ┌──────────────────────────────────┐    │
│  │  StatsPanel      │  │  MethodologyPanel                │    │
│  │  area diff / %   │  │  NDWI formula, thresholds, CRS   │    │
│  └──────────────────┘  └──────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
                    GitHub Pages (static hosting)
```

---

## Stack

| Layer | Technology |
|---|---|
| Satellite data | Sentinel-2 Level-2A (ESA Copernicus) |
| Spectral index | NDWI = (Green − NIR) / (Green + NIR) |
| Cloud processing | Google Earth Engine (JavaScript API) |
| Export format | GeoJSON (WGS84 / EPSG:4326) |
| Frontend framework | React 18 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| Map engine | Leaflet via react-leaflet |
| Testing | Vitest + Testing Library |
| Linting | ESLint + Prettier |
| CI/CD | GitHub Actions |
| Hosting | GitHub Pages |

---

## Learning Journal

This repository doubles as a **public learning log**. The goal is radical transparency: every sprint ends with a journal entry in `docs/journal/` covering what I learned, what surprised me, what I got wrong, and what the data actually shows.

Remote sensing is hard to learn in private. Making the process visible — including mistakes — is the point.

> _Sprint journal entries will appear in `docs/journal/` as each sprint completes._

---

## Setup

### Prerequisites

- Node.js ≥ 20
- A Google Earth Engine account (free for non-commercial use)

### Clone and run

```bash
git clone https://github.com/SumanthVarma798/hyderabad-truth-map.git
cd hyderabad-truth-map
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`.

### Type-check and lint

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # ESLint
npm run test        # Vitest
npm run build       # production build → dist/
```

---

## Data Pipeline

```
1. Open gee/ndwi_export.js in the GEE Code Editor
2. Authenticate and run the script
3. Export tasks appear in the GEE Tasks tab
4. Run both exports: hussain_sagar_2016 and hussain_sagar_2025
5. Download GeoJSON files from Google Drive
6. Place them in public/data/
   └── public/data/hussain_sagar_2016.geojson
   └── public/data/hussain_sagar_2025.geojson
7. npm run dev — the map loads them at runtime via fetch()
```

The GEE script applies a **cloud mask** (QA60 band), computes NDWI over a dry-season composite (November–February), and thresholds at **NDWI > 0.1** to classify water pixels. Output is vectorised to GeoJSON with area statistics attached as feature properties.

---

## Contributing

Pull requests are welcome — especially:
- Improved cloud-masking logic in the GEE script
- Alternative NDWI threshold justifications
- Additional time slices (2010, 2020)
- Accessibility improvements

Please open an issue first for any significant change.

---

## License

MIT — see [LICENSE](LICENSE). Satellite imagery is sourced from ESA Copernicus (open access). GeoJSON outputs derived from this imagery carry the same open-access terms.
