<template>
  <main class="visualizer-layout">
    <slot />
  </main>
</template>

<style scoped>
.visualizer-layout {
  display: grid;

  grid-template-columns:
    minmax(0, 3fr)
    minmax(260px, 1fr);

  grid-template-rows: minmax(0, 1fr);

  width: 100%;
  height: 100%;
}
</style>
