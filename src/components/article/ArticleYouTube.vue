<script setup>
import ArticleMediaFrame from './ArticleMediaFrame.vue'

defineProps({
  videoId: {
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
    <div class="youtube-player">
      <iframe
        :src="`https://www.youtube.com/embed/${videoId}`"
        :title="caption"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      />
    </div>
  </ArticleMediaFrame>
</template>

<style scoped>
.youtube-player {
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;

  border: var(--border-default);
  border-radius: var(--radius-m);

  background: var(--color-background-sub);
}

.youtube-player iframe {
  display: block;
  width: 100%;
  height: 100%;

  border: 0;
}
</style>
