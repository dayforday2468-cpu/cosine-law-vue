<script setup>
import { computed } from 'vue'

import VerificationCard from '../common/VerificationCard.vue'

import {
  calculateHaversineDistance,
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

const distanceDifference = computed(
  () => 1000 * Math.abs(haversineDistance.value - sphericalCosineDistance.value),
)
</script>

<template>
  <VerificationCard title="대권거리 계산">
    <div class="result-row">
      <span>Haversine 거리</span>
      <strong>{{ haversineDistance.toFixed(12) }} km</strong>
    </div>

    <div class="formula">
      d = R · 2atan2(√a, √(1-a))<br />
      a = sin²(Δφ/2) + cosφ₁cosφ₂sin²(Δλ/2)
    </div>

    <div class="result-row">
      <span>구면 코사인 거리</span>
      <strong>{{ sphericalCosineDistance.toFixed(12) }} km</strong>
    </div>

    <div class="formula">d = R · acos(sinφ₁sinφ₂ + cosφ₁cosφ₂cosΔλ)</div>

    <div class="result-row difference">
      <span>계산 결과 차이</span>
      <strong>{{ distanceDifference.toFixed(9) }} m</strong>
    </div>
  </VerificationCard>
</template>

<style scoped>
.formula {
  max-width: 100%;

  margin-bottom: var(--space-s);
  padding: var(--space-s);

  border: var(--border-default);
  border-radius: var(--radius-m);

  background: var(--color-background);
  color: var(--color-text-content);

  font-family: var(--font-family-formula);
  font-size: var(--font-size-m);
  font-weight: var(--font-weight-regular);
  line-height: 1.6;
  text-align: center;

  overflow-wrap: anywhere;
}

.result-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-s);

  margin-bottom: var(--space-s);

  color: var(--color-text-content);
  font-size: var(--font-size-s);
  font-family: var(--font-family-content);
  font-weight: var(--font-weight-regular);
}

.result-row strong {
  font-variant-numeric: tabular-nums;
  text-align: right;
  white-space: nowrap;
}

.result-row.difference {
  margin-top: var(--space-s);
  margin-bottom: 0;
  padding-top: var(--space-s);

  border-top: var(--border-default);
}
</style>
