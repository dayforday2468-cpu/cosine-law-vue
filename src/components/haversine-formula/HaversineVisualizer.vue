<script setup>
import { ref } from 'vue'

import VisualizerLayout from '../common/VisualizerLayout.vue'
import ControlSidebar from '../common/ControlSidebar.vue'

import HaversineViewer from './HaversineViewer.vue'
import LocationControls from './LocationControls.vue'
import DistanceVerification from './DistanceVerification.vue'

// --------------------------------------
// 두 지점의 위도 / 경도
// --------------------------------------

const latitude1 = ref(37.5665)
const longitude1 = ref(126.978)

const latitude2 = ref(35.6762)
const longitude2 = ref(139.6503)
</script>

<template>
  <VisualizerLayout>
    <HaversineViewer
      :latitude1="latitude1"
      :longitude1="longitude1"
      :latitude2="latitude2"
      :longitude2="longitude2"
    />

    <ControlSidebar>
      <LocationControls
        v-model:latitude1="latitude1"
        v-model:longitude1="longitude1"
        v-model:latitude2="latitude2"
        v-model:longitude2="longitude2"
      />
      <DistanceVerification
        :latitude1="latitude1"
        :longitude1="longitude1"
        :latitude2="latitude2"
        :longitude2="longitude2"
      />
    </ControlSidebar>
  </VisualizerLayout>
</template>
