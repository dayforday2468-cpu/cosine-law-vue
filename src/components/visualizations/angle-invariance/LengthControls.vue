<script setup>
import VerificationCard from '../common/VerificationCard.vue'

const lengths = defineModel('lengths', {
  type: Object,
  required: true,
})

defineProps({
  maxLengths: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <section class="length-controls">
    <div class="length-control">
      <label class="visualizer-control-label" for="length-ao">
        <span>AO</span>
        <output class="visualizer-control-output">{{ lengths.AO.toFixed(2) }}</output>
      </label>

      <input
        id="length-ao"
        v-model.number="lengths.AO"
        type="range"
        min="0.5"
        :max="maxLengths.AO"
        step="0.01"
      />
    </div>

    <div class="length-control">
      <label class="visualizer-control-label" for="length-ab">
        <span>AB</span>
        <output class="visualizer-control-output">{{ lengths.AB.toFixed(2) }}</output>
      </label>

      <input
        id="length-ab"
        v-model.number="lengths.AB"
        type="range"
        min="0.5"
        :max="maxLengths.AB"
        step="0.01"
      />
    </div>

    <div class="length-control">
      <label class="visualizer-control-label" for="length-ac">
        <span>AC</span>
        <output class="visualizer-control-output">{{ lengths.AC.toFixed(2) }}</output>
      </label>

      <input
        id="length-ac"
        v-model.number="lengths.AC"
        type="range"
        min="0.5"
        :max="maxLengths.AC"
        step="0.01"
      />
    </div>
  </section>
  <VerificationCard title="✓ 각도 불변!">
    <p class="result-description">
      선분의 길이는 변하지만<br />
      표시된 각도의 크기는 변하지 않습니다.
    </p>
  </VerificationCard>
</template>

<style scoped>
.length-controls {
  min-width: 0;
  max-width: 100%;
}

.length-control {
  min-width: 0;
  max-width: 100%;

  margin-bottom: var(--space-m);
}

.length-control:last-child {
  margin-bottom: 0;
}

.length-control label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-s);

  min-width: 0;

  margin-bottom: var(--space-s);
}

.length-control label span {
  min-width: 0;

  overflow-wrap: anywhere;
}

.length-control output {
  flex: 0 0 auto;
}

.length-control input[type='range'] {
  display: block;

  width: 100%;
  min-width: 0;
  margin: 0;

  cursor: pointer;
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
