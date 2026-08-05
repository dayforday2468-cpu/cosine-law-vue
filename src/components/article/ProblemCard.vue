<script setup>
import { useMathRenderer } from '@/composables/useMathRenderer.js'

defineProps({
  title: {
    type: String,
    default: '문제',
  },
})

const { mathContainer } = useMathRenderer()
</script>

<template>
  <section ref="mathContainer" class="problem-card">
    <div class="problem-title">
      {{ title }}
    </div>

    <div class="problem-content">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.problem-card {
  width: 100%;
  max-width: 760px;

  margin: 32px auto;
  padding: 24px 28px;

  border: 1px solid #cbd5e1;
  border-radius: 12px;

  background: #f8fafc;
}

.problem-title {
  margin-bottom: 18px;

  color: #0f172a;
  font-size: 16px;
  font-weight: 700;
}

.problem-content {
  color: #334155;
  font-size: 16px;
  line-height: 1.8;
}
</style>