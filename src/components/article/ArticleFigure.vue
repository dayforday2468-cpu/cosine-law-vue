<script setup>
import { inject } from 'vue'

defineProps({
  caption: {
    type: String,
    required: true,
  },
  width: {
    type: String,
    default: 'full',
    validator: (value) => ['full', 'content'].includes(value),
  },
})

const getNextFigureNumber = inject('getNextFigureNumber')

const figureNumber = getNextFigureNumber()
</script>

<template>
  <figure
    class="article-figure"
    :class="{ 'article-figure--content': width === 'content' }"
  >
    <div class="figure-content">
      <slot />
    </div>

    <figcaption class="figure-caption">
      <span class="figure-number">Fig {{ figureNumber }}. </span>
      <span>{{ caption }}</span>
    </figcaption>
  </figure>
</template>

<style scoped>
.article-figure {
  width: 100%;
  margin: var(--space-l) auto;
}

.article-figure--content {
  max-width: var(--article-content-width);
}

.figure-content {
  width: 100%;
}

.figure-caption {
  margin-top: var(--space-s);

  color: var(--color-text-sub);
  font-size: var(--font-size-s);
  font-family: var(--font-family-content);
  line-height: 1.6;
  text-align: center;
}

.figure-number {
  font-weight: var(--font-weight-semibold);
}
</style>
