<script setup>
defineProps({
  caption: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="map-frame">
    <div class="map-content">
      <slot />
    </div>

    <div class="map-caption article-component-content">
      {{ caption }}
    </div>
  </div>
</template>

<style scoped>
.map-frame {
  width: 100%;
  max-width: var(--article-content-width);
  margin: var(--space-l) auto;
}

.map-content {
  width: 100%;
  overflow: hidden;

  border: var(--border-default);
  border-radius: var(--radius-m);

  background: var(--color-background-sub);
}

.map-caption {
  margin-top: var(--space-s);

  color: var(--color-text-sub);
  font-size: var(--font-size-s);
  text-align: center;
}
</style>
