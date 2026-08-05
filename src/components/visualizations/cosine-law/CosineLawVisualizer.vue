<script setup>
import { reactive } from 'vue'

import VisualizerLayout from '@/components/common/VisualizerLayout.vue'
import ControlSidebar from '@/components/common/ControlSidebar.vue'

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
  <VisualizerLayout>
    <GeometryViewer :angles="angles" />

    <ControlSidebar title="각도 조절">
      <AngleControls v-model:angles="angles" />
      <FormulaVerification :angles="angles" />
    </ControlSidebar>
  </VisualizerLayout>
</template>
