<script setup>
const exponentBits = defineModel('exponentBits', {
  type: Number,
  required: true,
})

const fractionBits = defineModel('fractionBits', {
  type: Number,
  required: true,
})
</script>

<template>
  <section class="distribution-controls visual-control">
    <div class="control-group">
      <label
        class="control-label visual-control-label"
        for="distribution-exponent-bits"
      >
        <span>지수부 길이</span>
        <output class="visual-control-output">
          {{ exponentBits }} bit
        </output>
      </label>

      <input
        id="distribution-exponent-bits"
        v-model.number="exponentBits"
        type="range"
        min="2"
        max="4"
        step="1"
      />

      <div class="range-labels visual-control-caption">
        <span>2</span>
        <span>4</span>
      </div>
    </div>

    <div class="control-group">
      <label
        class="control-label visual-control-label"
        for="distribution-fraction-bits"
      >
        <span>가수부 길이</span>
        <output class="visual-control-output">
          {{ fractionBits }} bit
        </output>
      </label>

      <input
        id="distribution-fraction-bits"
        v-model.number="fractionBits"
        type="range"
        min="1"
        max="5"
        step="1"
      />

      <div class="range-labels visual-control-caption">
        <span>1</span>
        <span>5</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.distribution-controls {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-l);

  margin-top: var(--space-l);
}

.control-group {
  min-width: 0;
}

.control-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-s);

  margin-bottom: var(--space-s);
}

.distribution-controls input[type='range'] {
  display: block;

  width: 100%;
  min-width: 0;
  margin: 0;

  cursor: pointer;
}

.range-labels {
  display: flex;
  justify-content: space-between;

  margin-top: var(--space-xs);

  font-variant-numeric: tabular-nums;
}

@media (max-width: 640px) {
  .distribution-controls {
    grid-template-columns: 1fr;
    gap: var(--space-m);
  }
}
</style>
