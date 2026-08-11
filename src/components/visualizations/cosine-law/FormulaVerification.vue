<script setup>
import { computed } from 'vue'

import VerificationCard from '../common/VerificationCard.vue'

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

.calculation {
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

.calculation strong {
  font-variant-numeric: tabular-nums;
  text-align: right;
  white-space: nowrap;
}
</style>
