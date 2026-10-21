<script setup>
import { onBeforeUnmount } from 'vue'

import KakaoMap from '@/components/map/KakaoMap.vue'
import { MapFrame } from '@/components/map/common'
import { createRunPhotoData } from '@/data/article-media/kakao-friends-run-2026'
import mapData from '@/data/map/map_data.json'

import { usePhotoMarkers } from './usePhotoMarkers'
import { useRouteLayer } from './useRouteLayer'

const STADIUM = {
  latitude: 37.4102555,
  longitude: 127.1212958,
}

const MAP_LEVEL = 4

const photoData = createRunPhotoData(
  mapData.photos,
)

let mapInstance = null
let mapsApi = null

const routeLayer = useRouteLayer()

let photoLayer = null

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

  routeLayer.initialize({
    map,
    maps,
    route: mapData.route,
  })

  photoLayer = usePhotoMarkers({
    map,
    maps,
    photos: photoData,
  })
}

onBeforeUnmount(() => {
  routeLayer.destroy()
  photoLayer?.destroy()
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
