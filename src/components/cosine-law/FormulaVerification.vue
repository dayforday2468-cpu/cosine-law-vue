<script setup>
import { computed } from 'vue'

import { calculateGeometry } from '../../utils/geometry.js'

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
  <section class="verification">
    <h2>공식 검증</h2>

    <div class="formula">
      cos∠CAB = cosθ₂cosθ₃ + sinθ₂sinθ₃cosθ₁
    </div>

    <div class="substitution">
      cos{{ angles.theta2 }}° cos{{ angles.theta3 }}°
      + sin{{ angles.theta2 }}° sin{{ angles.theta3 }}°
      cos{{ angles.theta1 }}°
    </div>

    <p class="formula-result">
      = {{ geometry.rhs.toFixed(6) }}
    </p>

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

      <strong>
        {{ geometry.angleCAB.toFixed(1) }}°
      </strong>
    </div>
  </section>
</template>

<style scoped>
.verification {
  min-width: 0;
  max-width: 100%;

  margin-top: clamp(18px, 2.7vw, 36px);
  padding-top: clamp(14px, 2vw, 26px);

  border-top: 1px solid #dbe3ee;
}

.verification h2 {
  margin: 0 0 clamp(10px, 1.3vw, 16px);

  color: #0f172a;

  font-size: clamp(12px, 1.3vw, 17px);
}

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

.substitution {
  min-height: 36px;
  max-width: 100%;

  padding: 8px 2px;

  color: #475569;

  font-family: 'Times New Roman', serif;

  font-size: clamp(9px, 1vw, 15px);
  line-height: 1.6;
  text-align: center;

  overflow-wrap: anywhere;
}

.formula-result {
  max-width: 100%;

  margin: 2px 0 18px;

  color: #2563eb;

  font-family: Consolas, Monaco, monospace;

  font-size: clamp(11px, 1.25vw, 17px);
  font-weight: 700;
  text-align: center;

  overflow-wrap: anywhere;
}

.calculation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;

  min-width: 0;

  padding: 7px 0;

  color: #475569;

  font-size: clamp(9px, 1vw, 14px);
}

.calculation span {
  min-width: 0;
}

.calculation strong {
  flex: 0 0 auto;

  color: #0f172a;

  font-family: Consolas, Monaco, monospace;

  font-size: clamp(8px, 0.95vw, 13px);

  white-space: nowrap;
}
</style>