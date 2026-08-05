<script setup>
import { ref } from 'vue'

import VisualizerLayout from '@/components/common/VisualizerLayout.vue'
import ControlSidebar from '@/components/common/ControlSidebar.vue'

import InvarianceViewer from './InvarianceViewer.vue'
import LengthControls from './LengthControls.vue'

import { invarianceGeometry } from './invarianceGeometry.js'

const { A, OExtended, BExtended, CExtended, maxLengths } = invarianceGeometry

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
  <VisualizerLayout>
    <InvarianceViewer :lengths="lengths" :geometry="geometry" />

    <ControlSidebar title="선분 길이 조절">
      <LengthControls v-model:lengths="lengths" :max-lengths="maxLengths" />
    </ControlSidebar>
  </VisualizerLayout>
</template>
