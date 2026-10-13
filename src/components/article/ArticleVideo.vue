<script setup>
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
  <div class="article-video">
    <div class="video-content">
      <video
        class="video-player"
        :src="src"
        controls
        preload="metadata"
        playsinline
      />

      <div class="video-caption article-component-content">
        {{ caption }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-video {
  width: 100%;
  max-width: var(--article-content-width);

  margin: var(--space-l) auto;
}

.video-content {
  width: 75%;
  margin: 0 auto;
}

.video-player {
  display: block;

  width: 100%;

  border: var(--border-default);
  border-radius: var(--radius-m);

  background: var(--color-background-sub);
}

.video-caption {
  margin-top: var(--space-s);

  color: var(--color-text-sub);
  font-size: var(--font-size-s);
  text-align: center;
}

@media (max-width: 768px) {
  .video-content {
    width: 100%;
  }
}
</style>
