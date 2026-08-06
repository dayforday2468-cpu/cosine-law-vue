<script setup>
import { provide, ref } from 'vue'

const figureCount = ref(0)

function getNextFigureNumber() {
  figureCount.value += 1
  return figureCount.value
}

provide('getNextFigureNumber', getNextFigureNumber)
</script>

<template>
  <main class="article-layout">
    <article class="article-content">
      <slot />
    </article>
  </main>
</template>

<style scoped>
.article-layout {
  width: 100%;
  min-height: 100vh;

  padding: 48px 24px;

  background: #ffffff;
}

.article-content {
  width: 100%;
  max-width: 1100px;

  margin: 0 auto;

  color: #334155;
  font-size: 16px;
  line-height: 1.8;
}
@media (max-width: 768px) {
  .article-layout {
    padding: 32px 16px;
  }
}
</style>
