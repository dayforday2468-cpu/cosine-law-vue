<script setup>
import { computed, ref } from 'vue'

import HaversineViewer from './HaversineViewer.vue'
import LocationControls from './LocationControls.vue'

import {
  calculateHaversineAngle,
  calculateHaversineDistance,
  calculateSphericalCosineAngle,
  calculateSphericalCosineDistance,
} from './haversineGeometry.js'

// --------------------------------------
// 두 지점의 위도 / 경도
// --------------------------------------

const latitude1 = ref(37.5665)
const longitude1 = ref(126.978)

const latitude2 = ref(35.6762)
const longitude2 = ref(139.6503)

// --------------------------------------
// 중심각
// --------------------------------------

const haversineAngle = computed(() =>
  calculateHaversineAngle(
    latitude1.value,
    longitude1.value,
    latitude2.value,
    longitude2.value,
  ),
)

const sphericalCosineAngle = computed(() =>
  calculateSphericalCosineAngle(
    latitude1.value,
    longitude1.value,
    latitude2.value,
    longitude2.value,
  ),
)

// --------------------------------------
// 대권거리
// --------------------------------------

const haversineDistance = computed(() =>
  calculateHaversineDistance(
    latitude1.value,
    longitude1.value,
    latitude2.value,
    longitude2.value,
  ),
)

const sphericalCosineDistance = computed(() =>
  calculateSphericalCosineDistance(
    latitude1.value,
    longitude1.value,
    latitude2.value,
    longitude2.value,
  ),
)

// --------------------------------------
// 두 계산 결과의 차이
// --------------------------------------

const distanceDifference = computed(() =>
  Math.abs(haversineDistance.value - sphericalCosineDistance.value),
)
</script>

<template>
  <main class="haversine-app">
    <section class="haversine-viewer">
      <HaversineViewer
        :latitude1="latitude1"
        :longitude1="longitude1"
        :latitude2="latitude2"
        :longitude2="longitude2"
      />
    </section>

    <aside class="haversine-controls">
      <LocationControls
        v-model:latitude1="latitude1"
        v-model:longitude1="longitude1"
        v-model:latitude2="latitude2"
        v-model:longitude2="longitude2"
        :haversine-angle="haversineAngle"
        :spherical-cosine-angle="sphericalCosineAngle"
        :haversine-distance="haversineDistance"
        :spherical-cosine-distance="sphericalCosineDistance"
        :distance-difference="distanceDifference"
      />
    </aside>
  </main>
</template>

<style scoped>
.haversine-app {
  display: grid;
  grid-template-columns:
    minmax(0, 3fr)
    minmax(260px, 1fr);

  width: 100%;
  height: 100vh;
}

.haversine-viewer {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  min-width: 0;
  min-height: 0;

  overflow: hidden;

  background: #f8fafc;
}

.haversine-controls {
  min-width: 0;
  min-height: 0;

  padding: 28px;

  overflow-y: auto;

  border-left: 1px solid #e2e8f0;

  background: #ffffff;
}
</style>