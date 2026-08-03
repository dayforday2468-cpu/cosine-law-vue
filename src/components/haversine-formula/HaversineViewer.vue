<script setup>
import { onBeforeUnmount, onMounted, watch } from 'vue'

import * as THREE from 'three'

import ResizingLoading from '../common/ResizingLoading.vue'
import ViewerGuide from '../common/ViewerGuide.vue'

import { useThreeViewer } from '../../composables/useThreeViewer.js'

import {
  createAngleArc,
  createFace,
  createLabel,
  createLine,
  createPoint,
  createSphere,
  disposeObject,
  getAngleLabelPosition,
} from '../../utils/threeGeometry.js'

import { EARTH_RADIUS, calculateGreatCirclePoints, latLonToVector3 } from './haversineGeometry.js'

const props = defineProps({
  latitude1: {
    type: Number,
    required: true,
  },

  longitude1: {
    type: Number,
    required: true,
  },

  latitude2: {
    type: Number,
    required: true,
  },

  longitude2: {
    type: Number,
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
  disposeThree,
} = useThreeViewer()

// --------------------------------------
// 현재 기하 상태 계산
// --------------------------------------

function calculateCurrentGeometry() {
  const O = new THREE.Vector3(0, 0, 0)

  const N = new THREE.Vector3(0, EARTH_RADIUS, 0)

  const P1 = latLonToVector3(props.latitude1, props.longitude1, EARTH_RADIUS)

  const P2 = latLonToVector3(props.latitude2, props.longitude2, EARTH_RADIUS)

  const rayLength = 1.6

  const northDirection = new THREE.Vector3(0, 1, 0)
  const direction1 = P1.clone().normalize()
  const direction2 = P2.clone().normalize()

  const northExtended = northDirection.clone().multiplyScalar(rayLength)
  const P1Extended = direction1.clone().multiplyScalar(rayLength)
  const P2Extended = direction2.clone().multiplyScalar(rayLength)

  const greatCirclePoints = calculateGreatCirclePoints(P1, P2, EARTH_RADIUS * 1.01)

  return {
    O,
    N,
    P1,
    P2,

    northExtended,
    P1Extended,
    P2Extended,

    greatCirclePoints,
  }
}

// --------------------------------------
// 기존 모델 제거
// --------------------------------------

function clearModel() {
  const model = getModel()

  if (!model) {
    return
  }

  while (model.children.length > 0) {
    const object = model.children[0]

    model.remove(object)
    disposeObject(object)
  }
}

// --------------------------------------
// 대권호 선 생성
// --------------------------------------

function createGreatCircleLine(points, color, opacity = 1) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points)

  const material = new THREE.LineBasicMaterial({
    color,
    transparent: opacity < 1,
    opacity,
  })

  return new THREE.Line(geometry, material)
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

  const { O, N, P1, P2, northExtended, P1Extended, P2Extended, greatCirclePoints } =
    calculateCurrentGeometry()

  // --------------------------------------
  // 지구
  // --------------------------------------

  model.add(createSphere(EARTH_RADIUS, 0x60a5fa, 0.28, 64))

  // --------------------------------------
  // 중심에서 시작하는 세 반직선
  // --------------------------------------

  const northRay = createLine(O, northExtended, 0x64748b, 0.8)
  const P1Ray = createLine(O, P1Extended, 0x2563eb, 0.8)
  const P2Ray = createLine(O, P2Extended, 0x059669, 0.8)

  northRay.material.depthTest = false
  P1Ray.material.depthTest = false
  P2Ray.material.depthTest = false

  model.add(northRay, P1Ray, P2Ray)

  // --------------------------------------
  // Extended 삼각형 면
  // --------------------------------------

  const face1 = createFace(O, northExtended, P1Extended, 0x2563eb, 0.12)
  const face2 = createFace(O, northExtended, P2Extended, 0x10b981, 0.12)

  face1.material.depthTest = false
  face2.material.depthTest = false

  model.add(face1, face2)

  // --------------------------------------
  // P1-P2 대권호
  // --------------------------------------

  model.add(createGreatCircleLine(greatCirclePoints, 0xf59e0b))

  // --------------------------------------
  // 중심각 θ
  // --------------------------------------

  model.add(createAngleArc(O, P1, P2, 0.34, 0x7c3aed))

  // --------------------------------------
  // 북극 방향과 P1/P2 방향 사이의 각
  // 90° - 위도
  // --------------------------------------

  model.add(createAngleArc(O, N, P1, 0.5, 0x2563eb), createAngleArc(O, N, P2, 0.62, 0x10b981))

  // --------------------------------------
  // 점
  // --------------------------------------

  model.add(
    createPoint(O, 0xef4444),

    createPoint(N, 0x64748b),

    createPoint(P1, 0x2563eb),

    createPoint(P2, 0x10b981),
  )

  // --------------------------------------
  // 라벨
  // --------------------------------------

  model.add(
    createLabel('O', O.clone().add(new THREE.Vector3(0.08, 0.08, 0.08)), {
      textColor: '#0f172a',
      scale: 0.34,
    }),

    createLabel('N', N.clone().add(new THREE.Vector3(0.08, 0.1, 0)), {
      textColor: '#64748b',
      scale: 0.28,
    }),

    createLabel('P₁', P1.clone().addScaledVector(P1.clone().normalize(), 0.12), {
      textColor: '#2563eb',
      scale: 0.32,
    }),

    createLabel('P₂', P2.clone().addScaledVector(P2.clone().normalize(), 0.12), {
      textColor: '#059669',
      scale: 0.32,
    }),

    createLabel('θ', getAngleLabelPosition(O, P1, P2, 0.47), {
      textColor: '#7c3aed',
      scale: 0.24,
    }),

    createLabel('90° - φ₁', getAngleLabelPosition(O, N, P1, 0.62), {
      textColor: '#2563eb',
      scale: 0.23,
    }),

    createLabel('90° - φ₂', getAngleLabelPosition(O, N, P2, 0.76), {
      textColor: '#059669',
      scale: 0.23,
    }),
  )
}

// --------------------------------------
// 위도 / 경도 변화 감지
// --------------------------------------

watch(
  () => [props.latitude1, props.longitude1, props.latitude2, props.longitude2],
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
  <section ref="viewer" class="haversine-viewer">
    <ResizingLoading :visible="isResizing" message="화면 크기를 조정하고 있습니다." />
    <ViewerGuide>드래그: 회전 · 휠: 확대/축소</ViewerGuide>
  </section>
</template>

<style scoped>
.haversine-viewer {
  position: relative;

  min-width: 0;
  min-height: 0;

  overflow: hidden;

  background: #ffffff;
}

.haversine-viewer :deep(canvas) {
  display: block;

  width: 100%;
  height: 100%;
}
</style>
