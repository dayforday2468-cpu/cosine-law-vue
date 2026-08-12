<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <details class="article-disclosure">
    <summary class="disclosure-summary article-component-title">
      {{ title }}
    </summary>

    <div class="disclosure-content article-component-content">
      <slot />
    </div>
  </details>
</template>

<style scoped>
.article-disclosure {
  width: 100%;
  max-width: var(--article-content-width);

  margin: var(--space-l) auto;

  border: var(--border-default);
  border-radius: var(--radius-m);

  background: var(--color-background-sub);
}

.disclosure-summary {
  padding: var(--space-m);
  cursor: pointer;
}

.disclosure-content {
  padding: 0 var(--space-m) var(--space-m);
}
</style>
