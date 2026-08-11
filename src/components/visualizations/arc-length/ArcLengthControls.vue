<script setup>
import { computed } from 'vue'

import VerificationCard from '../common/VerificationCard.vue'

const arc = defineModel('arc', {
  type: Object,
  required: true,
})

// --------------------------------------
// 원호 길이 계산
// --------------------------------------

const distance = computed(() => {
  const thetaRad = (arc.value.theta * Math.PI) / 180

  return arc.value.radius * thetaRad
})
</script>

<template>
  <section class="arc-length-controls">
    <div class="arc-length-control">
      <label class="visualizer-control-label" for="arc-radius">
        <span>반지름 R</span>
        <output class="visualizer-control-output">{{ arc.radius.toFixed(2) }}</output>
      </label>

      <input
        id="arc-radius"
        v-model.number="arc.radius"
        type="range"
        min="0.5"
        max="2.5"
        step="0.01"
      />
    </div>

    <div class="arc-length-control">
      <label class="visualizer-control-label" for="arc-theta">
        <span>중심각 θ</span>
        <output class="visualizer-control-output">{{ arc.theta.toFixed(0) }}°</output>
      </label>

      <input id="arc-theta" v-model.number="arc.theta" type="range" min="10" max="180" step="1" />
    </div>
  </section>
  <VerificationCard title="원호의 길이">
    <div class="formula">d = Rθ</div>

    <p class="result-description">
      R = {{ arc.radius.toFixed(2) }}, θ = {{ arc.theta.toFixed(0) }}° 일 때
      <br />
      d = {{ distance.toFixed(2) }}
    </p>
  </VerificationCard>
</template>

<style scoped>
.arc-length-controls {
  min-width: 0;
  max-width: 100%;
}

.arc-length-control {
  min-width: 0;
  max-width: 100%;

  margin-bottom: var(--space-m);
}

.arc-length-control:last-child {
  margin-bottom: 0;
}

.arc-length-control label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-s);

  min-width: 0;

  margin-bottom: var(--space-s);
}

.arc-length-control label span {
  min-width: 0;

  overflow-wrap: anywhere;
}

.arc-length-control output {
  flex: 0 0 auto;
}

.arc-length-control input[type='range'] {
  display: block;

  width: 100%;
  min-width: 0;
  margin: 0;

  cursor: pointer;
}

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

.result-description {
  margin: 0;

  color: var(--color-text-content);
  font-size: var(--font-size-m);
  font-family: var(--font-family-content);
  font-weight: var(--font-weight-regular);
  line-height: 1.6;
  text-align: center;
}
</style>
