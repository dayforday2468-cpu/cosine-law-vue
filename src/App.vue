<script setup>
import { reactive } from 'vue'

import AngleControls from './components/AngleControls.vue'
import FormulaVerification from './components/FormulaVerification.vue'
import GeometryViewer from './components/GeometryViewer.vue'

const angles = reactive({
  theta1: 60,
  theta2: 45,
  theta3: 50,
})
</script>

<template>
  <main class="app">
    <GeometryViewer :angles="angles" />

    <aside class="controls">
      <AngleControls v-model:angles="angles" />

      <FormulaVerification :angles="angles" />
    </aside>
  </main>
</template>
