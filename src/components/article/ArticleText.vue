<script setup>
import { useMathRenderer } from '@/composables/useMathRenderer.js'

const { mathContainer } = useMathRenderer()
</script>

<template>
  <div ref="mathContainer" class="article-text">
    <slot />
  </div>
</template>

<style scoped>
.article-text {
  width: 100%;
  max-width: 760px;

  margin: 0 auto;

  color: #334155;
  font-size: 16px;
  line-height: 1.8;
}
</style>