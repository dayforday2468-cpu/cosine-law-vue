<script setup>
import { useMathRenderer } from '@/composables/useMathRenderer.js'

const { mathContainer } = useMathRenderer()
</script>

<template>
  <div ref="mathContainer" class="article-text article-component-content">
    <slot />
  </div>
</template>

<style scoped>
.article-text {
  width: 100%;
  max-width: var(--article-content-width);

  margin: 0 auto;
}
</style>
