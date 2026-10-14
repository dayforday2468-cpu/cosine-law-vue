<script setup>
import ArticleMediaFrame from './ArticleMediaFrame.vue'

defineProps({
  src: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <ArticleMediaFrame :caption="caption">
    <video
      class="video-player"
      :src="src"
      controls
      preload="metadata"
      playsinline
    />
  </ArticleMediaFrame>
</template>

<style scoped>
.video-player {
  display: block;

  width: 100%;

  border: var(--border-default);
  border-radius: var(--radius-m);

  background: var(--color-background-sub);
}
</style>
