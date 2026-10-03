<script setup>
import { reactive } from 'vue'

import {
  VisualizerLayout,
  ControlSidebar
} from '@/components/visualizations/common'

import GreatCircleViewer from './GreatCircleViewer.vue'
import GreatCircleControls from './GreatCircleControls.vue'

const route = reactive({
  origin: {
    name: '서울',
    lat: 37.5665,
    lng: 126.978,
  },
  destination: {
    name: '도쿄',
    lat: 35.6762,
    lng: 139.6503,
  },
})
</script>

<template>
  <VisualizerLayout>
    <GreatCircleViewer :route="route" />

    <ControlSidebar title="도착지 선택">
      <GreatCircleControls
        :origin="route.origin"
        v-model:destination="route.destination"
      />
    </ControlSidebar>
  </VisualizerLayout>
</template>
