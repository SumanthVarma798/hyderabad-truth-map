# North-Star Thesis — World Models for Spectral Analysis

> **Status:** Parked / Future. Not buildable today.
> **Owner:** Sumanth Varma
> **Filed:** 2026-06-26
> **Board card:** see the `north-star` label on the [project board](https://github.com/users/SumanthVarma798/projects/11)

---

## TL;DR for future AI / developers

This document records a long-term architectural thesis for Civic Sense's spectral
analysis layer. **It is intentionally not actionable now.** It exists so that
whoever (human or AI) picks up the spectral analysis pipeline in the future knows
this direction was considered deliberately, why it was deferred, and the *exact
signal* that means "now is the time to revisit it."

Until that signal fires, the project uses **physics-derived spectral indices
(NDWI, NDVI, MNDWI) as ground truth — never LLM-generated ones.**

---

## The thesis

Current LLMs cannot derive spectral indices from first principles because they have
no causal understanding of physics — only pattern matching over text that describes
physics. When you ask an LLM to look at spectral signatures and figure out that
`(Green - NIR) / (Green + NIR)` separates water from land, it can only do that if it
has seen NDWI described in training data. It cannot reason its way there from the
underlying physics of molecular absorption.

The right long-term approach for Civic Sense's spectral analysis layer is **world
models** — models with an internal causal simulation of how electromagnetic
radiation interacts with matter. Such a model would derive water's NIR absorption
from the physics of O–H molecular bonds, not from having read a remote sensing
textbook. From that foundation, discovering or deriving any discriminating spectral
index becomes principled reasoning rather than retrieval.

This is not buildable today. World models are pre-ChatGPT-moment.

---

## The revisit signal

> **Revisit this as a core capability when a model can take raw, unlabeled spectral
> curves and derive a physically-grounded discriminating index, with an explanation
> of why it works at the molecular level.**

That is the concrete, testable trigger. Not "world models got better" in the
abstract — the specific demonstrable capability above. When that exists, this moves
from a parked thesis to an active milestone in the spectral analysis pipeline.

---

## What we do until then

- Use **physics-derived indices (NDWI, NDVI, MNDWI)** as ground truth.
- Treat any LLM involvement in index *selection* as a convenience over retrieval,
  never as a source of physical truth.
- Keep the ground-truth flywheel (citizen reports) growing — it is the asset that a
  future world-model approach would also benefit from.

## How to test the signal (a concrete check for future-you)

Give the candidate model raw reflectance curves for water, vegetation, soil, and
built-up surfaces with **no labels and no band names**. Ask it to propose a
normalized index that separates water from the rest, and to justify it from
molecular physics (O–H absorption in NIR/SWIR). If it derives something MNDWI-like
*and* the justification is physically correct rather than recalled — the signal has
fired.

---

## Related

- [Architecture](../architecture.md)
- [Domain scorecard](../domain-scorecard.md)
- Project memory: `project-aware-india` (NDWI dropped in favor of AI-model research thread)
