# Graph Report - /Users/varma/myWorkshop/aware-india  (2026-06-26)

## Corpus Check
- Corpus is ~17,565 words - fits in a single context window. You may not need a graph.

## Summary
- 39 nodes · 48 edges · 7 communities detected
- Extraction: 79% EXTRACTED · 19% INFERRED · 2% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.76)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Vision & Architecture|Vision & Architecture]]
- [[_COMMUNITY_Backend & Data Pipeline|Backend & Data Pipeline]]
- [[_COMMUNITY_Spectral Analysis & World Models|Spectral Analysis & World Models]]
- [[_COMMUNITY_Citizen Reports & Moat|Citizen Reports & Moat]]
- [[_COMMUNITY_Sentinel-2 Ingest Script|Sentinel-2 Ingest Script]]
- [[_COMMUNITY_Civic Domains & Legal Grounding|Civic Domains & Legal Grounding]]
- [[_COMMUNITY_Supabase Types|Supabase Types]]

## God Nodes (most connected - your core abstractions)
1. `Civic geospatial platform architecture` - 6 edges
2. `Backend: Supabase (Auth + PostGIS + Storage + Edge Fns)` - 6 edges
3. `North-star thesis: world models for spectral analysis` - 5 edges
4. `Aware India (civic awareness platform)` - 4 edges
5. `official_zones table (GHMC/Telangana boundaries)` - 4 edges
6. `Data ingest ETL pipeline (scripts/ingest)` - 4 edges
7. `Domain scorecard v1 (domain selection)` - 4 edges
8. `query_scenes()` - 3 edges
9. `Vision: transparency & accountability for civic problems` - 3 edges
10. `Moat: local ground-truth citizen-report data` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Civic Intelligence Platform — CTO Brief v0.2` --semantically_similar_to--> `Civic geospatial platform architecture`  [INFERRED] [semantically similar]
  /Users/varma/myWorkshop/aware-india/docs/system-design.html → /Users/varma/myWorkshop/aware-india/docs/architecture.md
- `Constraint: reference official data as ground truth (legal defense)` --conceptually_related_to--> `Core idea: gap between official records and ground reality`  [INFERRED]
  /Users/varma/myWorkshop/aware-india/docs/domain-scorecard.md → /Users/varma/myWorkshop/aware-india/CLAUDE.md
- `Claude Vision photo classification (key AI differentiator)` --conceptually_related_to--> `Infrastructure domain (roads/drainage/streetlights)`  [INFERRED]
  /Users/varma/myWorkshop/aware-india/CLAUDE.md → /Users/varma/myWorkshop/aware-india/docs/domain-scorecard.md
- `Claude Vision photo classification (key AI differentiator)` --semantically_similar_to--> `Rationale: LLMs cannot derive spectral indices from first principles`  [INFERRED] [semantically similar]
  /Users/varma/myWorkshop/aware-india/CLAUDE.md → /Users/varma/myWorkshop/aware-india/docs/research/world-models-spectral-thesis.md
- `Ground rule: plain lat/lng columns, no PostGIS for v1` --conceptually_related_to--> `Decision: Supabase over Firebase`  [AMBIGUOUS]
  /Users/varma/myWorkshop/aware-india/CLAUDE.md → /Users/varma/myWorkshop/aware-india/docs/architecture.md

## Hyperedges (group relationships)
- **Official-vs-ground-truth gap surfacing flow** — claudemd_official_vs_ground_gap, arch_observations_table, arch_official_zones_table, scorecard_legal_official_data [INFERRED 0.80]
- **Spectral indices as physics-derived ground truth (parked LLM stance)** — claudemd_spectral_physics_ground_truth, thesis_world_models_spectral, thesis_physics_indices_ndwi, thesis_llm_cannot_derive_physics [INFERRED 0.85]
- **v1 domain selection (infrastructure/land/environment)** — scorecard_infrastructure, scorecard_land_property, scorecard_environment, scorecard_domain_v1 [INFERRED 0.85]

## Communities

### Community 0 - "Vision & Architecture"
Cohesion: 0.24
Nodes (10): Civic geospatial platform architecture, Decision: MapLibre over Mapbox, Frontend: React + Vite + MapLibre GL JS, Core idea: gap between official records and ground reality, Vision: transparency & accountability for civic problems, Learning dashboard / personal dev journal (static HTML), Aware India (civic awareness platform), Learning dashboard (sprint task tracker) (+2 more)

### Community 1 - "Backend & Data Pipeline"
Cohesion: 0.31
Nodes (9): compute-ndwi edge function (Landsat B3+B5), Data ingest ETL pipeline (scripts/ingest), Decision: Supabase over Firebase, External data sources (OSM, GHMC, Bhuvan/ISRO, Telangana GIS), official_zones table (GHMC/Telangana boundaries), Backend: Supabase (Auth + PostGIS + Storage + Edge Fns), Ground rule: plain lat/lng columns, no PostGIS for v1, Sprint 1 — Scaffold & data model (+1 more)

### Community 2 - "Spectral Analysis & World Models"
Cohesion: 0.4
Nodes (6): Claude Vision photo classification (key AI differentiator), Ground rule: spectral indices are physics-derived, never LLM-generated, Rationale: LLMs cannot derive spectral indices from first principles, Physics-derived indices NDWI/NDVI/MNDWI as ground truth, Revisit signal: model derives physically-grounded index from raw curves, North-star thesis: world models for spectral analysis

### Community 3 - "Citizen Reports & Moat"
Cohesion: 0.4
Nodes (5): Decision: anonymous auth allowed, observations table (ground-truth reports), Moat: local ground-truth citizen-report data, Hyderabad is the wedge, not the ceiling, Infrastructure domain (roads/drainage/streetlights)

### Community 4 - "Sentinel-2 Ingest Script"
Cohesion: 0.67
Nodes (3): main(), query_scenes(), Return Sentinel-2 L2A items over `bbox`, <max_cloud%, within lookback.

### Community 5 - "Civic Domains & Legal Grounding"
Cohesion: 0.5
Nodes (4): Domain scorecard v1 (domain selection), Environment domain (dumping/discharge/green-space loss), Land & Property domain (lake encroachment vs HMDA FTL), Constraint: reference official data as ground truth (legal defense)

### Community 6 - "Supabase Types"
Cohesion: 1.0
Nodes (0): 

## Ambiguous Edges - Review These
- `Ground rule: plain lat/lng columns, no PostGIS for v1` → `Decision: Supabase over Firebase`  [AMBIGUOUS]
  /Users/varma/myWorkshop/aware-india/CLAUDE.md · relation: conceptually_related_to

## Knowledge Gaps
- **9 isolated node(s):** `Return Sentinel-2 L2A items over `bbox`, <max_cloud%, within lookback.`, `Hyderabad is the wedge, not the ceiling`, `Ground rule: plain lat/lng columns, no PostGIS for v1`, `Learning dashboard / personal dev journal (static HTML)`, `Decision: MapLibre over Mapbox` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Supabase Types`** (1 nodes): `supabase.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Ground rule: plain lat/lng columns, no PostGIS for v1` and `Decision: Supabase over Firebase`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `Civic geospatial platform architecture` connect `Vision & Architecture` to `Backend & Data Pipeline`, `Spectral Analysis & World Models`?**
  _High betweenness centrality (0.343) - this node is a cross-community bridge._
- **Why does `Backend: Supabase (Auth + PostGIS + Storage + Edge Fns)` connect `Backend & Data Pipeline` to `Vision & Architecture`, `Citizen Reports & Moat`?**
  _High betweenness centrality (0.339) - this node is a cross-community bridge._
- **Why does `North-star thesis: world models for spectral analysis` connect `Spectral Analysis & World Models` to `Vision & Architecture`, `Civic Domains & Legal Grounding`?**
  _High betweenness centrality (0.171) - this node is a cross-community bridge._
- **What connects `Return Sentinel-2 L2A items over `bbox`, <max_cloud%, within lookback.`, `Hyderabad is the wedge, not the ceiling`, `Ground rule: plain lat/lng columns, no PostGIS for v1` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._