<script setup>
import { computed } from 'vue'

import {
  calculateHaversineAngle,
  calculateHaversineDistance,
  calculateSphericalCosineAngle,
  calculateSphericalCosineDistance,
} from './haversineGeometry.js'

const latitude1 = defineModel('latitude1', {
  type: Number,
  required: true,
})

const longitude1 = defineModel('longitude1', {
  type: Number,
  required: true,
})

const latitude2 = defineModel('latitude2', {
  type: Number,
  required: true,
})

const longitude2 = defineModel('longitude2', {
  type: Number,
  required: true,
})

// --------------------------------------
// 중심각
// --------------------------------------

const haversineAngle = computed(() =>
  calculateHaversineAngle(latitude1.value, longitude1.value, latitude2.value, longitude2.value),
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
  calculateHaversineDistance(latitude1.value, longitude1.value, latitude2.value, longitude2.value),
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

const haversineAngleDegrees = computed(() => (haversineAngle.value * 180) / Math.PI)

const sphericalCosineAngleDegrees = computed(() => (sphericalCosineAngle.value * 180) / Math.PI)

const FINE_STEP = 0.01

function adjustCoordinate(value, amount, min, max) {
  const nextValue = value + amount

  return Math.min(max, Math.max(min, Number(nextValue.toFixed(2))))
}
</script>

<template>
  <section class="location-controls">
    <h2>두 지점 설정</h2>

    <h3>P₁</h3>

    <div class="control-group">
      <label for="latitude-1">
        <span>위도</span>

        <div class="value-control">
          <button
            type="button"
            @click="latitude1 = adjustCoordinate(latitude1, -FINE_STEP, -90, 90)"
          >
            −
          </button>

          <output>{{ latitude1.toFixed(2) }}°</output>

          <button
            type="button"
            @click="latitude1 = adjustCoordinate(latitude1, FINE_STEP, -90, 90)"
          >
            +
          </button>
        </div>
      </label>

      <input id="latitude-1" v-model.number="latitude1" type="range" min="-90" max="90" step="1" />
    </div>

    <div class="control-group">
      <label for="longitude-1">
        <span>경도</span>

        <div class="value-control">
          <button
            type="button"
            @click="longitude1 = adjustCoordinate(longitude1, -FINE_STEP, -180, 180)"
          >
            −
          </button>

          <output>{{ longitude1.toFixed(2) }}°</output>

          <button
            type="button"
            @click="longitude1 = adjustCoordinate(longitude1, FINE_STEP, -180, 180)"
          >
            +
          </button>
        </div>
      </label>

      <input
        id="longitude-1"
        v-model.number="longitude1"
        type="range"
        min="-180"
        max="180"
        step="1"
      />
    </div>

    <h3>P₂</h3>

    <div class="control-group">
      <label for="latitude-2">
        <span>위도</span>

        <div class="value-control">
          <button
            type="button"
            @click="latitude2 = adjustCoordinate(latitude2, -FINE_STEP, -90, 90)"
          >
            −
          </button>

          <output>{{ latitude2.toFixed(2) }}°</output>

          <button
            type="button"
            @click="latitude2 = adjustCoordinate(latitude2, FINE_STEP, -90, 90)"
          >
            +
          </button>
        </div>
      </label>

      <input id="latitude-2" v-model.number="latitude2" type="range" min="-90" max="90" step="1" />
    </div>

    <div class="control-group">
      <label for="longitude-2">
        <span>경도</span>

        <div class="value-control">
          <button
            type="button"
            @click="longitude2 = adjustCoordinate(longitude2, -FINE_STEP, -180, 180)"
          >
            −
          </button>

          <output>{{ longitude2.toFixed(2) }}°</output>

          <button
            type="button"
            @click="longitude2 = adjustCoordinate(longitude2, FINE_STEP, -180, 180)"
          >
            +
          </button>
        </div>
      </label>

      <input
        id="longitude-2"
        v-model.number="longitude2"
        type="range"
        min="-180"
        max="180"
        step="1"
      />
    </div>

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
  </section>
</template>

<style scoped>
.location-controls h2 {
  margin: 0 0 18px;

  color: #0f172a;
  font-size: 22px;
}

.location-controls h3 {
  margin: 0 0 10px;

  color: #334155;
  font-size: 18px;
}

.control-group {
  margin-bottom: 16px;
}

.control-group label {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 6px;

  color: #334155;
  font-size: 16px;
  font-weight: 700;
}

.control-group output {
  min-width: 64px;

  color: #2563eb;
  font-variant-numeric: tabular-nums;
  text-align: right;
}

.control-group input {
  width: 100%;

  cursor: pointer;
}

.distance-result {
  margin-top: 22px;
  padding: 14px 14px;

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

.value-control {
  display: flex;
  align-items: center;
  gap: 6px;
}

.value-control output {
  min-width: 68px;
}

.value-control button {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 26px;
  height: 26px;
  padding: 0;

  border: 1px solid #cbd5e1;
  border-radius: 6px;

  background: #ffffff;
  color: #2563eb;

  font-size: 18px;
  font-weight: 700;
  line-height: 1;

  cursor: pointer;
}

.value-control button:hover {
  background: #eff6ff;
}
</style>
