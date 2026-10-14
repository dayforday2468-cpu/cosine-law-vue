<script setup>
defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  message: {
    type: String,
    default: '불러오는 중입니다.',
  },
})
</script>

<template>
  <div v-if="visible" class="loading-overlay" aria-live="polite">
    <span class="loading-spinner"></span>
    <p>{{ message }}</p>
  </div>
</template>

<style scoped>
.loading-overlay {
  position: absolute;
  z-index: 20;
  inset: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-m);

  background: var(--color-background-overlay);

  pointer-events: all;
}

.loading-overlay p {
  color: var(--color-text-sub);
  font-size: var(--font-size-m);
  font-family: var(--font-family-content);
  font-weight: var(--font-weight-bold);
}

.loading-spinner {
  width: var(--font-size-xl);
  height: var(--font-size-xl);

  border: 3px solid var(--color-main-sub);
  border-top-color: var(--color-main);
  border-radius: 50%;

  animation: loading-spin 0.8s linear infinite;
}

@keyframes loading-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
