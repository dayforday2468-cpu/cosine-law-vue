<script setup>
import { useMathRenderer } from '@/composables/useMathRenderer.js'

defineProps({
  title: {
    type: String,
    default: '',
  },
})

const { mathContainer } = useMathRenderer()
</script>

<template>
  <section ref="mathContainer" class="article-callout">
    <div v-if="title" class="callout-title">
      {{ title }}
    </div>

    <div class="callout-content">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.article-callout {
  width: 100%;
  max-width: 760px;

  margin: 32px auto;
  padding: 24px 28px;

  border: 1px solid #cbd5e1;
  border-radius: 12px;

  background: #f8fafc;
}

.callout-title {
  margin-bottom: 18px;

  color: #0f172a;
  font-size: 16px;
  font-weight: 700;
}

.callout-content {
  color: #334155;
  font-size: 16px;
  line-height: 1.8;
}
</style>
