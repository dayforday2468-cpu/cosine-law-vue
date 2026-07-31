<script setup>
import { computed } from 'vue'

import { calculateGeometry } from '../utils/geometry.js'

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

    <div class="formula">cos∠CAB = cosθ₂cosθ₃ + sinθ₂sinθ₃cosθ₁</div>

    <div class="substitution">
      cos{{ angles.theta2 }}° cos{{ angles.theta3 }}° + sin{{ angles.theta2 }}° sin{{
        angles.theta3
      }}° cos{{ angles.theta1 }}°
    </div>

    <p class="formula-result">= {{ geometry.rhs.toFixed(6) }}</p>

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
  </section>
</template>
