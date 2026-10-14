<script setup>
defineProps({
  caption: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="article-media-frame">
    <div class="media-content">
      <slot />

      <div class="media-caption article-component-content">
        {{ caption }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-media-frame {
  width: 100%;
  max-width: var(--article-content-width);
  margin: var(--space-l) auto;
}

.media-content {
  width: 75%;
  margin: 0 auto;
}

.media-caption {
  margin-top: var(--space-s);

  color: var(--color-text-sub);
  font-size: var(--font-size-s);
  text-align: center;
}

@media (max-width: 768px) {
  .media-content {
    width: 100%;
  }
}
</style>
