# Architecture

_Placeholder — will be expanded after Sprint 1 is complete._

See the ASCII diagram in the README for the high-level overview.

## Key decisions

| Decision | Rationale |
|---|---|
| GEE for processing | Free tier covers this workload; no local compute needed |
| GeoJSON (not raster) | Small files, native Leaflet support, easy to inspect |
| Leaflet over Mapbox GL | No token required; sufficient for static polygon layers |
| CSS clip-path slider | No library dependency; works on mobile |
| GitHub Pages | Free, CI/CD integrated, no server to maintain |
