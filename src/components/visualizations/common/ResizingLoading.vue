<script setup>
defineProps({
  visible: {
    type: Boolean,
    required: true,
  },

  message: {
    type: String,
    default: '화면 크기를 조정하고 있습니다.',
  },
})
</script>

<template>
  <div v-if="visible" class="resize-loading" aria-live="polite">
    <span class="loading-spinner"></span>
    <p>{{ message }}</p>
  </div>
</template>

<style scoped>
.resize-loading {
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

.resize-loading p {
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
