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
    country: '대한민국',
    lat: 37.5665,
    lng: 126.978,
  },
  destination: {
    name: '하와이',
    country: '미국',
    lat: 21.3069,
    lng: -157.8583,
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
