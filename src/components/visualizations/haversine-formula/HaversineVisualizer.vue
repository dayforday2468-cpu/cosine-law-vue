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

const latitude1 = ref(0)
const longitude1 = ref(0)

const latitude2 = ref(30)
const longitude2 = ref(90)
</script>

<template>
  <VisualizerLayout>
    <HaversineViewer
      :latitude1="latitude1"
      :longitude1="longitude1"
      :latitude2="latitude2"
      :longitude2="longitude2"
    />

    <ControlSidebar title="위도 / 경도 조절">
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
