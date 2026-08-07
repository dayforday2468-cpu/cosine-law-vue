<script setup>
import { onBeforeUnmount, onMounted, watch } from 'vue'

import * as THREE from 'three'

import ResizingLoading from '../common/ResizingLoading.vue'
import ViewerGuide from '../common/ViewerGuide.vue'

import { useThreeViewer } from '@/composables/useThreeViewer.js'

import {
  createCircle2D,
  createPoint2D,
  createLine,
  createLabel,
  createAngleArc,
  getAngleLabelPosition,
} from '@/utils/threeGeometry.js'

const props = defineProps({
  arc: {
    type: Object,
    required: true,
  },
})

// --------------------------------------
// Three.js Viewer
// --------------------------------------

const {
  viewer,
  isResizing,
  getModel,
  initializeThree,
  resizeRenderer,
  observeResize,
  animate,
  clearModel,
  disposeThree,
} = useThreeViewer('2d')

// --------------------------------------
// 현재 점 좌표 계산
// --------------------------------------

function calculateCurrentPoints() {
  const radius = props.arc.radius

  const theta = THREE.MathUtils.degToRad(props.arc.theta)

  const O = new THREE.Vector3(0, 0, 0)

  const A = new THREE.Vector3(radius, 0, 0)

  const B = new THREE.Vector3(radius * Math.cos(theta), radius * Math.sin(theta), 0)

  return {
    O,
    A,
    B,
    radius,
    theta,
  }
}

// --------------------------------------
// 도형 업데이트
// --------------------------------------

function updateModel() {
  const model = getModel()

  if (!model) {
    return
  }

  clearModel()

  const { O, A, B, radius, theta } = calculateCurrentPoints()

  // --------------------------------------
  // 큰 원
  // --------------------------------------

  model.add(createCircle2D(O, radius, 0x94a3b8))

  // --------------------------------------
  // 반지름
  // --------------------------------------

  model.add(
    createLine(O, A, 0x2563eb),

    createLine(O, B, 0x64748b),
  )

  // --------------------------------------
  // 대권거리 원호 AB
  // --------------------------------------

  model.add(createAngleArc(O, A, B, radius, 0xd97706))

  // --------------------------------------
  // 중심각
  // --------------------------------------

  const angleArcRadius = Math.min(radius * 0.25, 0.5)

  model.add(createAngleArc(O, A, B, angleArcRadius, 0x7c3aed))

  // --------------------------------------
  // 점
  // --------------------------------------

  model.add(
    createPoint2D(O, 0x111827),

    createPoint2D(A, 0x2563eb),

    createPoint2D(B, 0xd97706),
  )

  // --------------------------------------
  // 점 이름
  // --------------------------------------

  const directionOA = A.clone().sub(O).normalize()

  const directionOB = B.clone().sub(O).normalize()

  model.add(
    createLabel('O', O.clone().add(new THREE.Vector3(-0.15, -0.15, 0)), {
      textColor: '#0f172a',
      scale: 0.28,
    }),

    createLabel('A', A.clone().addScaledVector(directionOA, 0.18), {
      textColor: '#0f172a',
      scale: 0.28,
    }),

    createLabel('B', B.clone().addScaledVector(directionOB, 0.18), {
      textColor: '#0f172a',
      scale: 0.28,
    }),
  )

  // --------------------------------------
  // 중심각 라벨
  // --------------------------------------

  model.add(
    createLabel('θ', getAngleLabelPosition(O, A, B, angleArcRadius + 0.16), {
      textColor: '#7c3aed',
      scale: 0.22,
    }),
  )

  // --------------------------------------
  // 반지름 라벨
  // --------------------------------------

  const radiusLabelPosition = O.clone()
    .add(A)
    .multiplyScalar(0.5)
    .add(new THREE.Vector3(0, -0.18, 0))

  model.add(
    createLabel('R', radiusLabelPosition, {
      textColor: '#2563eb',
      scale: 0.22,
    }),
  )

  // --------------------------------------
  // 대권거리 라벨
  // --------------------------------------

  const middleAngle = theta / 2

  const distanceLabelPosition = new THREE.Vector3(
    (radius + 0.22) * Math.cos(middleAngle),

    (radius + 0.22) * Math.sin(middleAngle),

    0,
  )

  model.add(
    createLabel('d', distanceLabelPosition, {
      textColor: '#d97706',
      scale: 0.22,
    }),
  )
}

// --------------------------------------
// 반지름 / 중심각 변화 감지
// --------------------------------------

watch(
  () => [props.arc.radius, props.arc.theta],
  () => {
    updateModel()
  },
)

// --------------------------------------
// Vue 생명주기
// --------------------------------------

onMounted(() => {
  initializeThree()
  updateModel()
  resizeRenderer()
  animate()
  observeResize()
})

onBeforeUnmount(() => {
  disposeThree()
})
</script>

<template>
  <section id="arc-length-viewer" ref="viewer">
    <ResizingLoading :visible="isResizing" message="화면 크기를 조정하고 있습니다." />

    <ViewerGuide> 휠: 확대/축소 </ViewerGuide>
  </section>
</template>

<style scoped>
#arc-length-viewer {
  position: relative;

  min-width: 0;
  min-height: 0;

  overflow: hidden;

  background: #ffffff;
}

#arc-length-viewer :deep(canvas) {
  display: block;

  width: 100%;
  height: 100%;
}
</style>
