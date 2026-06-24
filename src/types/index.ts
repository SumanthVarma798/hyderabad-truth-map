export interface WaterExtentFeature extends GeoJSON.Feature<GeoJSON.MultiPolygon> {
  properties: {
    year: number
    area_km2: number
    ndwi_threshold: number
    scene_date_start: string
    scene_date_end: string
    cloud_cover_pct: number
  }
}

export type Epoch = '2016' | '2025'
