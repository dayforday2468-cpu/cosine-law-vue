<script setup>
import { onBeforeUnmount, onMounted, watch } from 'vue'

import * as THREE from 'three'
import ThreeGlobe from 'three-globe'

import {
  ResizingLoading,
  ViewerGuide
} from '@/components/visualizations/common'

import { useThreeViewer } from '@/composables/useThreeViewer.js'

const props = defineProps({
  route: {
    type: Object,
    required: true,
  },
})

const EARTH_IMAGE_URL =
  'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'

const GLOBE_SCALE = 0.02
const PATH_ALTITUDE = 0.01
const PATH_TRANSITION_DURATION = 1800
const PATH_SEGMENTS = 96

/*
 * useThreeViewer의 기본 카메라는 원점을 향한다.
 * 서울이 초기 화면의 정면에 오도록 지구본 자체만 회전시킨다.
 */
const INITIAL_VIEW_DIRECTION = new THREE.Vector3(3.7, 3.4, 5.0).normalize()

let globe = null

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
} = useThreeViewer('3d', {
  showAxes: false,
})

// --------------------------------------
// 대권 경로
// --------------------------------------

function latLngToUnitVector({ lat, lng }) {
  const latitude = THREE.MathUtils.degToRad(lat)
  const longitude = THREE.MathUtils.degToRad(lng)

  return new THREE.Vector3(
    Math.cos(latitude) * Math.sin(longitude),
    Math.sin(latitude),
    Math.cos(latitude) * Math.cos(longitude),
  )
}

function unitVectorToLatLng(vector) {
  const normalized = vector.clone().normalize()

  return [
    THREE.MathUtils.radToDeg(Math.asin(normalized.y)),
    THREE.MathUtils.radToDeg(Math.atan2(normalized.x, normalized.z)),
    PATH_ALTITUDE,
  ]
}

function createGreatCirclePath(start, end) {
  const startVector = latLngToUnitVector(start)
  const endVector = latLngToUnitVector(end)

  const dot = THREE.MathUtils.clamp(startVector.dot(endVector), -1, 1)
  const angle = Math.acos(dot)

  if (angle < 1e-7) {
    return [
      [start.lat, start.lng, PATH_ALTITUDE],
      [end.lat, end.lng, PATH_ALTITUDE],
    ]
  }

  const sinAngle = Math.sin(angle)

  return Array.from({ length: PATH_SEGMENTS + 1 }, (_, index) => {
    const progress = index / PATH_SEGMENTS

    const startWeight = Math.sin((1 - progress) * angle) / sinAngle
    const endWeight = Math.sin(progress * angle) / sinAngle

    const point = startVector
      .clone()
      .multiplyScalar(startWeight)
      .add(endVector.clone().multiplyScalar(endWeight))

    return unitVectorToLatLng(point)
  })
}

// --------------------------------------
// 지구본 초기 방향
// --------------------------------------

function orientGlobeToOrigin() {
  if (!globe) {
    return
  }

  const originCoords = globe.getCoords(
    props.route.origin.lat,
    props.route.origin.lng,
    0,
  )

  const originDirection = new THREE.Vector3(
    originCoords.x,
    originCoords.y,
    originCoords.z,
  ).normalize()

  globe.quaternion.setFromUnitVectors(
    originDirection,
    INITIAL_VIEW_DIRECTION,
  )
}

// --------------------------------------
// 지구본 생성 / 업데이트
// --------------------------------------

function createModel() {
  const model = getModel()

  if (!model) {
    return
  }

  globe = new ThreeGlobe({
    animateIn: false,
  })
    .globeImageUrl(EARTH_IMAGE_URL)
    .showGraticules(true)
    .showAtmosphere(true)
    .atmosphereColor('#93c5fd')
    .atmosphereAltitude(0.12)
    .pointAltitude(0.025)
    .pointRadius(0.55)
    .pointColor((point) => point.color)
    .pathPointAlt((point) => point[2])
    .pathColor(() => '#ef4444')
    .pathStroke(0.65)
    .pathTransitionDuration(PATH_TRANSITION_DURATION)
    .labelText('name')
    .labelColor(() => '#111827')
    .labelSize(0.55)
    .labelAltitude(0.045)
    .labelDotRadius(0)

  globe.scale.setScalar(GLOBE_SCALE)

  orientGlobeToOrigin()

  model.add(globe)

  updateRoute()
}

function updateRoute() {
  if (!globe) {
    return
  }

  const points = [
    {
      ...props.route.origin,
      color: '#2563eb',
    },
    {
      ...props.route.destination,
      color: '#ef4444',
    },
  ]

  const path = createGreatCirclePath(
    props.route.origin,
    props.route.destination,
  )

  globe
    .pointsData(points)
    .labelsData(points)
    .pathsData([path])
}

// --------------------------------------
// 위치 변화 감지
// --------------------------------------

watch(
  () => [
    props.route.destination.lat,
    props.route.destination.lng,
  ],
  () => {
    updateRoute()
  },
)

// --------------------------------------
// Vue 생명주기
// --------------------------------------

onMounted(() => {
  initializeThree()
  createModel()
  resizeRenderer()
  animate()
  observeResize()
})

onBeforeUnmount(() => {
  disposeThree()
})
</script>

<template>
  <section ref="viewer" class="great-circle-viewer">
    <ResizingLoading :visible="isResizing" message="화면 크기를 조정하고 있습니다." />
    <ViewerGuide>드래그: 회전 · 휠: 확대/축소</ViewerGuide>
  </section>
</template>

<style scoped>
.great-circle-viewer {
  position: relative;

  min-width: 0;
  min-height: 0;

  overflow: hidden;

  background: var(--color-background);
}

.great-circle-viewer :deep(canvas) {
  position: absolute;
  inset: 0;

  display: block;
  width: 100%;
  height: 100%;
}
</style>
