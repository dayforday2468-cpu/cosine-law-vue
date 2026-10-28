<script setup>
defineProps({
  bit: {
    type: Number,
    required: true,
    validator: (value) => value === 0 || value === 1,
  },
  borderColor: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div
    class="bit-card"
    :style="{ borderColor }"
  >
    {{ bit }}
  </div>
</template>

<style scoped>
.bit-card {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 2.25rem;
  height: 2.75rem;
  flex: 0 0 2.25rem;

  border: 2px solid;
  border-radius: var(--radius-s);

  background: var(--color-background);
  color: var(--color-text-main);

  font-family: var(--font-family-formula);
  font-size: var(--font-size-m);
  font-weight: var(--font-weight-semibold);
  font-variant-numeric: tabular-nums;
}
</style>
