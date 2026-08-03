<template>
  <aside class="control-sidebar">
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
</style>