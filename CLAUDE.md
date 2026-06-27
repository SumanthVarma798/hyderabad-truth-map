# Aware India — agent guide

## The vision

A civic awareness project to raise **transparency, accountability, and public
awareness on civic and social problems across India — starting with Hyderabad.**

The core idea: surface the gap between what official records say and what is
actually on the ground — encroached lakes, missing roads, broken infrastructure,
unaddressed civic and social issues — and make that gap visible, verifiable, and
hard to ignore. Citizens view, report, and verify ground reality; the platform
turns scattered local truth into accountability pressure.

Hyderabad is the wedge, not the ceiling. Every design decision should be judged
against the question: *does this generalize to other Indian cities and states?*
The moat is local ground-truth data that no public dataset or model has.

See [README](README.md) and [docs/architecture.md](docs/architecture.md) for the
current build, and [`docs/research/`](docs/research/) for long-term theses.

## Current ground rules (v1)

- Plain lat/lng columns in Supabase Postgres (no PostGIS for v1).
- OpenFreeMap base tiles; no custom tile server.
- Photo classification via Claude Vision at submission time is the key AI differentiator.
- Citizen reports are the data flywheel — treat that dataset as the long-term asset.
- Spectral indices are physics-derived (NDWI, NDVI, MNDWI) ground truth — never LLM-generated.

## North-star theses (read before proposing long-term direction)

Some architectural directions are **deliberately parked** — recorded as research
docs, each with a concrete revisit signal. Do not treat them as actionable backlog;
do know they exist and were deferred on purpose. They are *individual angles* on the
future, not the project's whole vision (the vision is above). Tracked on the board
under the `north-star` label.

- [World models for spectral analysis](docs/research/world-models-spectral-thesis.md)
  — why LLMs can't derive spectral indices from first principles, and the exact
  capability signal that means it's time to revisit. One future angle, not the whole story.

When work touches the spectral analysis pipeline, check that thesis first.

## Project board

Board #11 (https://github.com/users/SumanthVarma798/projects/11) is organized by:
- **Phase** — milestone timeline (M0–M7, DISCUSS).
- **Energy / Mood** — ADHD-friendly: pick tasks matching current energy
  (🔬 Research Heavy · 🛠️ Get Shit Done · 🪶 Low Energy / Lightweight · 📚 Just Learn).
- Parked future directions carry the `north-star` label.
