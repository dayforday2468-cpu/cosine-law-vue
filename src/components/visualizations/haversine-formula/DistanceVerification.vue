<script setup>
import { computed } from 'vue'

import VerificationCard from '@/components/common/VerificationCard.vue'

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

const distanceDifference = computed(() =>
  Math.abs(haversineDistance.value - sphericalCosineDistance.value),
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
      <span>거리 차이</span>
      <strong>{{ distanceDifference.toFixed(12) }} km</strong>
    </div>
  </VerificationCard>
</template>

<style scoped>
.formula {
  max-width: 100%;

  margin-bottom: 14px;
  padding: clamp(6px, 1vw, 12px);

  border: 1px solid #dbe3ee;
  border-radius: 8px;

  background: #ffffff;
  color: #334155;

  font-family: 'Times New Roman', serif;

  font-size: clamp(9px, 1.1vw, 15px);
  line-height: 1.6;
  text-align: center;

  overflow-wrap: anywhere;
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
