#!/usr/bin/env python3
"""Query Microsoft Planetary Computer for Sentinel-2 L2A scenes over Hyderabad.

Issue #36 (M3) — first slice: just the STAC query. No NDWI/MNDWI computation
yet; that comes next session (rasterio band math + COG export to Supabase).

Why Planetary Computer over Google Earth Engine: it exposes a plain STAC API
(no per-user EE project / quota), the Sentinel-2 L2A archive is free and
COG-backed, and `pystac-client` is the standard remote-sensing client for it.

Usage:
    pip install pystac-client planetary-computer
    python scripts/ingest/sentinel2/download.py
"""
from __future__ import annotations

import datetime as dt

import planetary_computer
import pystac_client

# Hyderabad bounding box [west, south, east, north] (approx city extent).
HYDERABAD_BBOX = [78.2, 17.2, 78.7, 17.6]

COLLECTION = "sentinel-2-l2a"
MAX_CLOUD_COVER = 20  # percent
LOOKBACK_DAYS = 90
STAC_URL = "https://planetarycomputer.microsoft.com/api/stac/v1"


def query_scenes(
    bbox: list[float] = HYDERABAD_BBOX,
    max_cloud: int = MAX_CLOUD_COVER,
    lookback_days: int = LOOKBACK_DAYS,
):
    """Return Sentinel-2 L2A items over `bbox`, <max_cloud%, within lookback."""
    end = dt.datetime.now(dt.timezone.utc)
    start = end - dt.timedelta(days=lookback_days)
    datetime_range = f"{start.date().isoformat()}/{end.date().isoformat()}"

    # `modifier` signs asset hrefs so the COGs are directly readable later.
    catalog = pystac_client.Client.open(
        STAC_URL, modifier=planetary_computer.sign_inplace
    )

    search = catalog.search(
        collections=[COLLECTION],
        bbox=bbox,
        datetime=datetime_range,
        query={"eo:cloud_cover": {"lt": max_cloud}},
    )

    items = list(search.items())
    # Sort newest first.
    items.sort(key=lambda it: it.datetime, reverse=True)
    return items, datetime_range


def main() -> None:
    items, datetime_range = query_scenes()

    print(f"Collection : {COLLECTION}")
    print(f"BBox       : {HYDERABAD_BBOX}  (Hyderabad)")
    print(f"Date range : {datetime_range}  (last {LOOKBACK_DAYS} days)")
    print(f"Filter     : eo:cloud_cover < {MAX_CLOUD_COVER}%")
    print(f"Scenes     : {len(items)}\n")

    print(f"{'#':>3}  {'date':<12} {'cloud%':>7}  scene id")
    print("-" * 72)
    for i, item in enumerate(items, 1):
        date = item.datetime.date().isoformat()
        cloud = item.properties.get("eo:cloud_cover", float("nan"))
        print(f"{i:>3}  {date:<12} {cloud:>7.2f}  {item.id}")


if __name__ == "__main__":
    main()
