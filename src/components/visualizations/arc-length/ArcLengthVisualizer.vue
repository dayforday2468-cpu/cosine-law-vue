<script setup>
import { ref } from 'vue'

import VisualizerLayout from '../common/VisualizerLayout.vue'
import ControlSidebar from '../common/ControlSidebar.vue'

import ArcLengthViewer from './ArcLengthViewer.vue'
import ArcLengthControls from './ArcLengthControls.vue'

const arc = ref({
  radius: 2,
  theta: 60,
})
</script>

<template>
  <VisualizerLayout>
    <ArcLengthViewer :arc="arc" />

    <ControlSidebar title="반지름과 중심각 조절">
      <ArcLengthControls v-model:arc="arc" />
    </ControlSidebar>
  </VisualizerLayout>
</template>
