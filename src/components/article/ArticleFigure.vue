<script setup>
import { inject } from 'vue'

defineProps({
  caption: {
    type: String,
    default: '',
  },
})

const getNextFigureNumber = inject('getNextFigureNumber')

const figureNumber = getNextFigureNumber()
</script>

<template>
  <figure class="article-figure">
    <div class="figure-content">
      <slot />
    </div>

    <figcaption class="figure-caption">
      <span class="figure-number">Fig {{ figureNumber }}</span>
      <span v-if="caption">. {{ caption }}</span>
    </figcaption>
  </figure>
</template>

<style scoped>
.article-figure {
  width: 100%;
  margin: 32px auto;
}

.figure-content {
  width: 100%;
}

.figure-caption {
  margin-top: 12px;

  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
  text-align: center;
}

.figure-number {
  font-weight: 700;
}
</style>
