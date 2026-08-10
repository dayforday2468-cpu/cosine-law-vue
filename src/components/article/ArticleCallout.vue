<script setup>
import { useMathRenderer } from '@/composables/useMathRenderer.js'

defineProps({
  title: {
    type: String,
    required:true,
  },
})

const { mathContainer } = useMathRenderer()
</script>

<template>
  <section ref="mathContainer" class="article-callout">
    <div class="callout-title article-component-title">
      {{ title }}
    </div>

    <div class="article-component-content">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.article-callout {
  width: 100%;
  max-width: var(--article-content-width);

  margin: var(--space-l) auto;
  padding: var(--space-m);

  border: var(--border-default);
  border-radius: var(--radius-m);

  background: var(--color-background-sub);
}

.callout-title {
  margin-bottom: var(--space-m);
}
</style>