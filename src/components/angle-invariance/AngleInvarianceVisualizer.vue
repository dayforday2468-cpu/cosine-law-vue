<script setup>
import { ref } from 'vue'

import InvarianceViewer from './InvarianceViewer.vue'
import LengthControls from './LengthControls.vue'

import { invarianceGeometry } from '../../utils/invarianceGeometry.js'

const {
  A,
  OExtended,
  BExtended,
  CExtended,
  maxLengths,
} = invarianceGeometry

const lengths = ref({
  AO: maxLengths.AO / 2,
  AB: maxLengths.AB / 2,
  AC: maxLengths.AC / 2,
})

const geometry = {
  A,
  OExtended,
  BExtended,
  CExtended,
}
</script>

<template>
  <main class="invariance-app">
    <section class="invariance-viewer">
      <InvarianceViewer :lengths="lengths" :geometry="geometry"/>
    </section>

    <aside class="invariance-controls">
      <LengthControls v-model:lengths="lengths" :max-lengths="maxLengths"/>
    </aside>
  </main>
</template>

<style scoped>
.invariance-app {
  display: grid;
  grid-template-columns:
    minmax(0, 3fr)
    minmax(260px, 1fr);

  width: 100%;
  height: 100vh;
}

.invariance-viewer {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  min-width: 0;
  min-height: 0;

  overflow: hidden;

  background: #f8fafc;
}

.invariance-controls {
  min-width: 0;
  min-height: 0;

  padding: 28px;

  overflow-y: auto;

  border-left: 1px solid #e2e8f0;

  background: #ffffff;
}
</style>