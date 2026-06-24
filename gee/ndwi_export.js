/**
 * Hussain Sagar — NDWI water extent export
 * Google Earth Engine script
 *
 * Usage:
 *   1. Open https://code.earthengine.google.com
 *   2. Paste this script
 *   3. Click Run
 *   4. In the Tasks panel, run both export tasks
 *   5. Download GeoJSON files from your Google Drive
 *   6. Place them in public/data/
 *
 * NDWI = (Green − NIR) / (Green + NIR)
 * Threshold: NDWI > 0.1  →  water pixel
 * Season: November–February (dry season, low cloud cover)
 * CRS: WGS84 / EPSG:4326
 */

// ─── Area of Interest ───────────────────────────────────────────────────────
var AOI = ee.Geometry.Rectangle([78.38, 17.40, 78.50, 17.48]);

// ─── Helpers ────────────────────────────────────────────────────────────────
function maskS2clouds(image) {
  var qa = image.select('QA60');
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
               .and(qa.bitwiseAnd(cirrusBitMask).eq(0));
  return image.updateMask(mask).divide(10000);
}

function computeNDWI(image) {
  // Sentinel-2 bands: B3 = Green, B8 = NIR
  return image.normalizedDifference(['B3', 'B8']).rename('NDWI');
}

function getWaterExtent(year, startMonth, endMonth) {
  var start = ee.Date.fromYMD(year, startMonth, 1);
  var end   = ee.Date.fromYMD(year, endMonth, 28);

  var composite = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterBounds(AOI)
    .filterDate(start, end)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
    .map(maskS2clouds)
    .map(computeNDWI)
    .median()
    .clip(AOI);

  var water = composite.gt(0.1).selfMask();

  // Vectorise water pixels
  var vectors = water.reduceToVectors({
    geometry: AOI,
    crs: composite.projection(),
    scale: 10,
    geometryType: 'polygon',
    eightConnected: false,
    labelProperty: 'water',
    reducer: ee.Reducer.countEvery(),
    maxPixels: 1e8,
  });

  // Compute area in km²
  var withArea = vectors.map(function(f) {
    var areakm2 = f.geometry().area(1).divide(1e6);
    return f.set({
      year: year,
      area_km2: areakm2,
      ndwi_threshold: 0.1,
      scene_date_start: start.format('YYYY-MM-dd'),
      scene_date_end:   end.format('YYYY-MM-dd'),
    });
  });

  return withArea;
}

// ─── Run for both epochs ────────────────────────────────────────────────────
var water2016 = getWaterExtent(2016, 11, 12);
var water2025 = getWaterExtent(2025, 11, 12);

// ─── Visualise (optional) ───────────────────────────────────────────────────
Map.centerObject(AOI, 13);
Map.addLayer(water2016, { color: '1a6fba' }, 'Water 2016');
Map.addLayer(water2025, { color: '0dc9f7' }, 'Water 2025');

// ─── Export tasks ───────────────────────────────────────────────────────────
Export.table.toDrive({
  collection: water2016,
  description: 'hussain_sagar_2016',
  fileFormat: 'GeoJSON',
  folder: 'hyderabad-truth-map',
});

Export.table.toDrive({
  collection: water2025,
  description: 'hussain_sagar_2025',
  fileFormat: 'GeoJSON',
  folder: 'hyderabad-truth-map',
});

print('2016 feature count:', water2016.size());
print('2025 feature count:', water2025.size());
