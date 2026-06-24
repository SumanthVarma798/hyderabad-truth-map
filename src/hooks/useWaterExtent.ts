import { useState, useEffect } from 'react'
import type { WaterExtentFeature } from '../types'

const BASE = import.meta.env.BASE_URL

export function useWaterExtent(year: '2016' | '2025') {
  const [data, setData] = useState<GeoJSON.FeatureCollection | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch(`${BASE}data/hussain_sagar_${year}.geojson`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json() as Promise<GeoJSON.FeatureCollection>
      })
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [year])

  return { data, loading, error }
}

export type { WaterExtentFeature }
