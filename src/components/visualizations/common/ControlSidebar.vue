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

  padding: clamp(12px, 2vw, 28px);

  overflow-x: hidden;
  overflow-y: auto;

  border-left: 1px solid #e2e8f0;

  background: #ffffff;
}

.control-sidebar h2 {
  margin: 0 0 7px;

  color: #0f172a;
  font-size: 24px;
}
</style>
