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

  padding: var(--space-l) var(--space-m);

  background: var(--color-background);
}

.article-content {
  width: 100%;
  max-width: var(--container-width);

  margin: 0 auto;
}

@media (max-width: 768px) {
  .article-layout {
    padding: var(--space-l) var(--space-m);
  }
}
</style>
