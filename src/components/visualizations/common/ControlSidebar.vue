<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <aside class="control-sidebar">
    <h2>{{ title }}</h2>

    <slot />
  </aside>
</template>

<style scoped>
.control-sidebar {
  min-width: 0;
  min-height: 0;

  padding: var(--space-m);

  overflow-x: hidden;
  overflow-y: auto;

  border-left: var(--border-default);

  background: var(--color-background);
}

.control-sidebar h2 {
  margin: 0 0 var(--space-s);

  color: var(--color-text-main);
  font-size: var(--font-size-l);
  font-family: var(--font-family-title);
  font-weight: var(--font-weight-bold);
}
</style>
