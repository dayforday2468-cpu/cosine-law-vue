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
  gap: 12px;

  background: rgb(248 250 252 / 94%);
  color: #334155;

  pointer-events: all;
}

.resize-loading p {
  margin: 0;

  font-size: 14px;
  font-weight: 700;
}

.loading-spinner {
  width: 32px;
  height: 32px;

  border: 3px solid #bfdbfe;
  border-top-color: #2563eb;
  border-radius: 50%;

  animation: loading-spin 0.8s linear infinite;
}

@keyframes loading-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>