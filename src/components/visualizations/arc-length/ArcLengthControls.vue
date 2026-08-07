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
    <div class="control-group">
      <label for="arc-radius">
        <span>반지름 R</span>
        <output>{{ arc.radius.toFixed(2) }}</output>
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

    <div class="control-group">
      <label for="arc-theta">
        <span>중심각 θ</span>
        <output>{{ arc.theta.toFixed(0) }}°</output>
      </label>

      <input id="arc-theta" v-model.number="arc.theta" type="range" min="10" max="180" step="1" />
    </div>

    <VerificationCard title="원호의 길이">
      <div class="formula">d = Rθ</div>

      <p class="result-description">
        R = {{ arc.radius.toFixed(2) }}, θ = {{ arc.theta.toFixed(0) }}° 일 때
        <br />
        d = {{ distance.toFixed(2) }}
      </p>
    </VerificationCard>
  </section>
</template>

<style scoped>
.control-group {
  margin-bottom: 28px;
}

.control-group label {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 10px;

  color: #334155;
  font-size: 18px;
  font-weight: 700;
}

.control-group output {
  min-width: 52px;

  color: #2563eb;
  font-variant-numeric: tabular-nums;
  text-align: right;
}

.control-group input {
  width: 100%;

  cursor: pointer;
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

.result-description {
  margin: 0;

  color: #334155;
  font-size: 13px;
  line-height: 1.6;
  text-align: center;
}
</style>
