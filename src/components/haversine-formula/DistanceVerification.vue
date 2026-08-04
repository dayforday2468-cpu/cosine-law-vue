<script setup>
import { computed } from 'vue'

import {
  calculateHaversineAngle,
  calculateHaversineDistance,
  calculateSphericalCosineAngle,
  calculateSphericalCosineDistance,
} from './haversineGeometry.js'

const props = defineProps({
  latitude1: {
    type: Number,
    required: true,
  },
  longitude1: {
    type: Number,
    required: true,
  },
  latitude2: {
    type: Number,
    required: true,
  },
  longitude2: {
    type: Number,
    required: true,
  },
})

const haversineAngle = computed(() =>
  calculateHaversineAngle(props.latitude1, props.longitude1, props.latitude2, props.longitude2),
)

const sphericalCosineAngle = computed(() =>
  calculateSphericalCosineAngle(
    props.latitude1,
    props.longitude1,
    props.latitude2,
    props.longitude2,
  ),
)

const haversineDistance = computed(() =>
  calculateHaversineDistance(props.latitude1, props.longitude1, props.latitude2, props.longitude2),
)

const sphericalCosineDistance = computed(() =>
  calculateSphericalCosineDistance(
    props.latitude1,
    props.longitude1,
    props.latitude2,
    props.longitude2,
  ),
)

const distanceDifference = computed(() =>
  Math.abs(haversineDistance.value - sphericalCosineDistance.value),
)

const haversineAngleDegrees = computed(() => (haversineAngle.value * 180) / Math.PI)

const sphericalCosineAngleDegrees = computed(() => (sphericalCosineAngle.value * 180) / Math.PI)
</script>

<template>
  <section class="distance-result">
    <p class="result-title">대권거리 계산</p>

    <div class="result-row">
      <span>Haversine 중심각</span>
      <strong>{{ haversineAngleDegrees.toFixed(4) }}°</strong>
    </div>

    <div class="result-row">
      <span>구면 코사인 중심각</span>
      <strong>{{ sphericalCosineAngleDegrees.toFixed(4) }}°</strong>
    </div>

    <div class="result-row">
      <span>Haversine 거리</span>
      <strong>{{ haversineDistance.toFixed(12) }} km</strong>
    </div>

    <div class="result-row">
      <span>구면 코사인 거리</span>
      <strong>{{ sphericalCosineDistance.toFixed(12) }} km</strong>
    </div>

    <div class="result-row difference">
      <span>거리 차이</span>
      <strong>{{ distanceDifference.toFixed(12) }} km</strong>
    </div>
  </section>
</template>

<style scoped>
.distance-result {
  margin-top: 22px;
  padding: 14px;

  border: 2px solid #2563eb;
  border-radius: 12px;

  background: #eff6ff;
}

.result-title {
  margin: 0 0 12px;

  color: #1d4ed8;
  font-size: 20px;
  font-weight: 800;
  text-align: center;
}

.result-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  margin-bottom: 6px;

  color: #334155;
  font-size: 13px;
}

.result-row strong {
  color: #1e3a8a;

  font-variant-numeric: tabular-nums;
  text-align: right;
  white-space: nowrap;
}

.result-row.difference {
  margin-top: 10px;
  margin-bottom: 0;
  padding-top: 10px;

  border-top: 1px solid #bfdbfe;
}
</style>
