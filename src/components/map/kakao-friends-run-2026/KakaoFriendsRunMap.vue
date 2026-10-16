<script setup>
import { onBeforeUnmount } from 'vue'

import KakaoMap from '@/components/map/KakaoMap.vue'
import { MapFrame } from '@/components/map/common'
import mapData from '@/data/map/map_data.json'

const STADIUM = {
  latitude: 37.4102555,
  longitude: 127.1212958,
}

const MAP_LEVEL = 4

const START_POINT_COLOR = '#22c55e'
const END_POINT_COLOR = '#ef4444'

let routeSegments = []
let startPoint = null
let endPoint = null

let mapsApi = null
let mapInstance = null
let zoomChangedHandler = null

function getSegmentSize(level) {
  if (level <= 2) return 2
  if (level === 3) return 5
  if (level === 4) return 10
  if (level === 5) return 20

  return 40
}

function chunkRoute(route, size) {
  const chunks = []

  for (let i = 0; i < route.length - 1; i += size) {
    const end = Math.min(
      i + size,
      route.length - 1,
    )

    chunks.push(
      route.slice(i, end + 1),
    )
  }

  return chunks
}

function clearRouteSegments() {
  for (const segment of routeSegments) {
    segment.setMap(null)
  }

  routeSegments = []
}

function drawRouteSegments({
  map,
  maps,
  route,
}) {
  const level = map.getLevel()
  const segmentSize = getSegmentSize(level)
  const chunks = chunkRoute(route, segmentSize)

  const segments = []

  for (const chunk of chunks) {
    const path = chunk.map(
      ({ latitude, longitude }) =>
        new maps.LatLng(
          latitude,
          longitude,
        ),
    )

    const outline = new maps.Polyline({
      map,
      path,
      strokeWeight: 8,
      strokeColor: '#333333',
      strokeOpacity: 0.9,
      strokeStyle: 'solid',
    })

    const line = new maps.Polyline({
      map,
      path,
      strokeWeight: 5,
      strokeColor: '#FEE500',
      strokeOpacity: 1,
      strokeStyle: 'solid',
    })

    segments.push(outline, line)
  }

  return segments
}

function renderRoute() {
  if (!mapInstance || !mapsApi) {
    return
  }

  clearRouteSegments()

  routeSegments = drawRouteSegments({
    map: mapInstance,
    maps: mapsApi,
    route: mapData.route,
  })
}

function createPointOverlay({
  map,
  maps,
  position,
  color,
}) {
  const element = document.createElement('div')

  element.style.width = '16px'
  element.style.height = '16px'
  element.style.border = '3px solid #ffffff'
  element.style.borderRadius = '50%'
  element.style.backgroundColor = color
  element.style.boxSizing = 'border-box'

  return new maps.CustomOverlay({
    map,
    position,
    content: element,
    xAnchor: 0.5,
    yAnchor: 0.5,
  })
}

function resetMapView() {
  if (!mapInstance || !mapsApi) {
    return
  }

  const center = new mapsApi.LatLng(
    STADIUM.latitude,
    STADIUM.longitude,
  )

  mapInstance.setCenter(center)
  mapInstance.setLevel(MAP_LEVEL)
}

function handleMapReady({ map, maps }) {
  mapInstance = map
  mapsApi = maps

  renderRoute()

  const start = mapData.route[0]
  const end = mapData.route.at(-1)

  startPoint = createPointOverlay({
    map,
    maps,
    position: new maps.LatLng(
      start.latitude,
      start.longitude,
    ),
    color: START_POINT_COLOR,
  })

  endPoint = createPointOverlay({
    map,
    maps,
    position: new maps.LatLng(
      end.latitude,
      end.longitude,
    ),
    color: END_POINT_COLOR,
  })

  zoomChangedHandler = () => {
    renderRoute()
  }

  maps.event.addListener(
    map,
    'zoom_changed',
    zoomChangedHandler,
  )
}

onBeforeUnmount(() => {
  clearRouteSegments()

  startPoint?.setMap(null)
  endPoint?.setMap(null)

  if (
    mapsApi
    && mapInstance
    && zoomChangedHandler
  ) {
    mapsApi.event.removeListener(
      mapInstance,
      'zoom_changed',
      zoomChangedHandler,
    )
  }
})
</script>

<template>
  <MapFrame caption="카카오프렌즈 런 2026 코스">
    <div class="map-visualization">
      <KakaoMap
        :latitude="STADIUM.latitude"
        :longitude="STADIUM.longitude"
        :level="MAP_LEVEL"
        @ready="handleMapReady"
      />

      <div class="route-legend map-control">
        <div class="legend-item">
          <span class="legend-point legend-point-start"></span>
          <span>시작</span>
        </div>

        <div class="legend-item">
          <span class="legend-point legend-point-end"></span>
          <span>끝</span>
        </div>
      </div>

      <button
        class="reset-map-button map-control"
        type="button"
        @click="resetMapView"
      >
        초기화
      </button>
    </div>
  </MapFrame>
</template>

<style scoped>
.map-visualization {
  position: relative;
}

.map-control {
  position: absolute;
  z-index: 10;

  border: var(--border-default);
  border-radius: var(--radius-m);

  background: var(--color-background);

  color: var(--color-text-content);
  font-family: var(--font-family-content);
  font-size: var(--font-size-s);
  font-weight: var(--font-weight-semibold);
}

.route-legend {
  top: var(--space-m);
  right: var(--space-m);

  display: flex;
  gap: var(--space-m);

  padding: var(--space-s) var(--space-m);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--space-s);
}

.legend-point {
  width: 12px;
  height: 12px;

  border: 2px solid #ffffff;
  border-radius: 50%;

  box-sizing: border-box;
}

.legend-point-start {
  background: #22c55e;
}

.legend-point-end {
  background: #ef4444;
}

.reset-map-button {
  right: var(--space-m);
  bottom: var(--space-m);

  padding: var(--space-s) var(--space-m);

  cursor: pointer;
}
</style>