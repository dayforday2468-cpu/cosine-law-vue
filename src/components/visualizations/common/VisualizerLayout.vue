<template>
  <main class="visualizer-layout">
    <slot />
  </main>
</template>

<style scoped>
.visualizer-layout {
  display: grid;

  grid-template-columns: 1.5fr 1fr;

  grid-template-rows: minmax(0, 1fr);

  width: 100%;
  height: 100%;

  overflow: hidden;

  border: var(--border-default);
  border-radius: var(--radius-m);
}
</style>
