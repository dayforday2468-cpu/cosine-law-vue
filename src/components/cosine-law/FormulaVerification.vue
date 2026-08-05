<script setup>
import { computed } from 'vue'

import VerificationCard from '@/components/common/VerificationCard.vue'

import { calculateGeometry } from './geometry.js'

const props = defineProps({
  angles: {
    type: Object,
    required: true,
  },
})

const geometry = computed(() => {
  return calculateGeometry(props.angles)
})
</script>

<template>
  <VerificationCard title="공식 검증">
    <div class="formula">cos∠CAB = cosθ₂cosθ₃ + sinθ₂sinθ₃cosθ₁</div>

    <div class="calculation">
      <span>좌변</span>

      <strong>
        {{ geometry.lhs.toFixed(6) }}
      </strong>
    </div>

    <div class="calculation">
      <span>우변</span>

      <strong>
        {{ geometry.rhs.toFixed(6) }}
      </strong>
    </div>

    <div class="calculation">
      <span>∠CAB</span>

      <strong> {{ geometry.angleCAB.toFixed(1) }}° </strong>
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

.calculation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  margin-bottom: 6px;

  color: #334155;
  font-size: 13px;
}

.calculation strong {
  color: #1e3a8a;

  font-variant-numeric: tabular-nums;
  text-align: right;
  white-space: nowrap;
}
</style>
