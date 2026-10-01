<script setup>
import { reactive } from 'vue'

import {
  VisualizerLayout,
  ControlSidebar
} from '@/components/visualizations/common'

import AngleControls from './AngleControls.vue'
import FormulaVerification from './FormulaVerification.vue'
import GeometryViewer from './GeometryViewer.vue'

const angles = reactive({
  theta1: 90,
  theta2: 45,
  theta3: 30,
})
</script>

<template>
  <VisualizerLayout>
    <GeometryViewer :angles="angles" />

    <ControlSidebar title="각도 조절">
      <AngleControls v-model:angles="angles" />
      <FormulaVerification :angles="angles" />
    </ControlSidebar>
  </VisualizerLayout>
</template>
