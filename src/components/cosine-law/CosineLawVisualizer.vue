<script setup>
import { reactive } from 'vue'

import AngleControls from './AngleControls.vue'
import FormulaVerification from './FormulaVerification.vue'
import GeometryViewer from './GeometryViewer.vue'

const angles = reactive({
  theta1: 90,
  theta2: 45,
  theta3: 50,
})
</script>

<template>
  <main class="cosine-law-app">
    <GeometryViewer :angles="angles" />

    <aside class="cosine-law-controls">
      <AngleControls v-model:angles="angles" />
      <FormulaVerification :angles="angles" />
    </aside>
  </main>
</template>
<style scoped>
.cosine-law-app {
  display: grid;

  grid-template-columns:
    minmax(0, 3fr)
    minmax(0, 1fr);

  grid-template-rows: minmax(0, 1fr);

  width: 100%;
  height: 100%;
}

.cosine-law-controls {
  min-width: 0;
  min-height: 0;

  overflow-x: hidden;
  overflow-y: auto;

  padding: clamp(12px, 2vw, 28px) clamp(8px, 1.6vw, 22px);

  border-left: 1px solid #dbe3ee;

  background: #f8fafc;
}
</style>
