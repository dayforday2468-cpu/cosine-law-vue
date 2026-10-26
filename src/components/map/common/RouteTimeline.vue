<script setup>
import { onBeforeUnmount } from 'vue'

import KakaoMap from '@/components/map/KakaoMap.vue'

import MapFrame from './MapFrame.vue'
import RouteScrubber from './RouteScrubber.vue'
import { useRouteLayer } from './useRouteLayer'

const props = defineProps({
  route: {
    type: Array,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
  axes: {
    type: Array,
    required: true,
  },
  fields: {
    type: Array,
    required: true,
  },
  caption: {
    type: String,
    default: '',
  },
})

const emit = defineEmits([
  'ready',
])

let mapInstance = null
let mapsApi = null

const routeLayer = useRouteLayer()

function resetMapView() {
  if (!mapInstance || !mapsApi) {
    return
  }

  const center = new mapsApi.LatLng(
    props.latitude,
    props.longitude,
  )

  mapInstance.setCenter(center)
  mapInstance.setLevel(props.level)
}

function handleMapReady({ map, maps }) {
  mapInstance = map
  mapsApi = maps

  routeLayer.initialize({
    map,
    maps,
    route: props.route,
  })

  emit('ready', {
    map,
    maps,
  })
}

function handlePointHover(point) {
  routeLayer.showHoverPoint(point)
}

function handlePointLeave() {
  routeLayer.hideHoverPoint()
}

onBeforeUnmount(() => {
  routeLayer.destroy()
})
</script>

<template>
  <MapFrame :caption="caption">
    <KakaoMap
      :latitude="latitude"
      :longitude="longitude"
      :level="level"
      @ready="handleMapReady"
    />

    <div class="route-legend map-control">
      <div class="legend-item">
        <span
          class="
            legend-point
            legend-point-start
          "
        ></span>
        <span>시작</span>
      </div>

      <div class="legend-item">
        <span
          class="
            legend-point
            legend-point-end
          "
        ></span>
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

    <RouteScrubber
      :data="route"
      :axes="axes"
      :fields="fields"
      @hover="handlePointHover"
      @leave="handlePointLeave"
    />
  </MapFrame>
</template>

<style scoped>
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
  top: var(--space-m);
  left: var(--space-m);

  padding: var(--space-s) var(--space-m);

  cursor: pointer;
}
</style>
