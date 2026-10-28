<script setup>
const floatIndex = defineModel({
  type: Number,
  required: true,
})

defineProps({
  minIndex: {
    type: Number,
    required: true,
  },
  maxIndex: {
    type: Number,
    required: true,
  },
  minValue: {
    type: Number,
    required: true,
  },
  maxValue: {
    type: Number,
    required: true,
  },
  currentValue: {
    type: Number,
    required: true,
  },
  formatValue: {
    type: Function,
    required: true,
  },
})
</script>

<template>
  <section class="floating-point-controls">
    <label
      class="control-label visual-control-label"
      for="floating-point-value"
    >
      <span>표현 가능한 값</span>
      <output class="visual-control-output">
        {{ formatValue(currentValue) }}
      </output>
    </label>

    <input
      id="floating-point-value"
      v-model.number="floatIndex"
      type="range"
      :min="minIndex"
      :max="maxIndex"
      step="1"
    />

    <div class="range-labels visual-control-caption">
      <span>{{ formatValue(minValue) }}</span>
      <span>0</span>
      <span>{{ formatValue(maxValue) }}</span>
    </div>

    <p class="step-caption visual-control-caption">
      한 칸마다 다음으로 표현 가능한 부동소수점으로 이동합니다.
    </p>
  </section>
</template>

<style scoped>
.floating-point-controls {
  min-width: 0;
  max-width: 100%;

  margin-top: var(--space-l);
}

.control-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-s);

  min-width: 0;

  margin-bottom: var(--space-s);
}

.control-label span {
  min-width: 0;

  overflow-wrap: anywhere;
}

.control-label output {
  flex: 0 0 auto;
}

.floating-point-controls input[type='range'] {
  display: block;

  width: 100%;
  min-width: 0;
  margin: 0;

  cursor: pointer;
}

.range-labels {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-s);

  margin-top: var(--space-xs);

  font-variant-numeric: tabular-nums;
}

.range-labels span:nth-child(2) {
  text-align: center;
}

.range-labels span:last-child {
  text-align: right;
}

.step-caption {
  margin: var(--space-s) 0 0;

  text-align: center;
}
</style>
