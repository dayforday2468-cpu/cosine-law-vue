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
const ARC_ALTITUDE = 0.18
const AIRPLANE_LOOP_DURATION = 6000

let globe = null
let airplane = null
let airplaneAnimationFrameId = null
let airplaneAnimationStartedAt = null

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

  return {
    lat: THREE.MathUtils.radToDeg(Math.asin(normalized.y)),
    lng: THREE.MathUtils.radToDeg(Math.atan2(normalized.x, normalized.z)),
  }
}

function interpolateGreatCircle(start, end, progress) {
  const startVector = latLngToUnitVector(start)
  const endVector = latLngToUnitVector(end)

  const dot = THREE.MathUtils.clamp(startVector.dot(endVector), -1, 1)
  const angle = Math.acos(dot)

  if (angle < 1e-7) {
    return start
  }

  const sinAngle = Math.sin(angle)
  const startWeight = Math.sin((1 - progress) * angle) / sinAngle
  const endWeight = Math.sin(progress * angle) / sinAngle

  const interpolated = startVector
    .multiplyScalar(startWeight)
    .add(endVector.multiplyScalar(endWeight))

  return unitVectorToLatLng(interpolated)
}

// --------------------------------------
// 비행기
// --------------------------------------

function createAirplane() {
  const material = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    roughness: 0.55,
  })

  const airplaneGroup = new THREE.Group()

  const body = new THREE.Mesh(
    new THREE.ConeGeometry(0.055, 0.22, 4),
    material,
  )

  const wing = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.025, 0.045),
    material,
  )

  wing.position.y = -0.025

  airplaneGroup.add(body, wing)

  return airplaneGroup
}

function updateAirplanePosition(timestamp) {
  if (!globe || !airplane) {
    return
  }

  if (airplaneAnimationStartedAt === null) {
    airplaneAnimationStartedAt = timestamp
  }

  const progress =
    ((timestamp - airplaneAnimationStartedAt) % AIRPLANE_LOOP_DURATION) /
    AIRPLANE_LOOP_DURATION

  const nextProgress = (progress + 0.002) % 1

  const current = interpolateGreatCircle(
    props.route.origin,
    props.route.destination,
    progress,
  )

  const next = interpolateGreatCircle(
    props.route.origin,
    props.route.destination,
    nextProgress,
  )

  const altitude = 0.025 + Math.sin(Math.PI * progress) * ARC_ALTITUDE
  const nextAltitude = 0.025 + Math.sin(Math.PI * nextProgress) * ARC_ALTITUDE

  const position = globe.getCoords(current.lat, current.lng, altitude)
  const nextPosition = globe.getCoords(next.lat, next.lng, nextAltitude)

  const scaledPosition = new THREE.Vector3(position.x, position.y, position.z)
    .multiplyScalar(GLOBE_SCALE)

  const scaledNextPosition = new THREE.Vector3(
    nextPosition.x,
    nextPosition.y,
    nextPosition.z,
  ).multiplyScalar(GLOBE_SCALE)

  airplane.position.copy(scaledPosition)

  const tangent = scaledNextPosition.sub(scaledPosition).normalize()

  airplane.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    tangent,
  )

  airplaneAnimationFrameId = requestAnimationFrame(updateAirplanePosition)
}

function restartAirplaneAnimation() {
  airplaneAnimationStartedAt = null
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
    .arcAltitude(ARC_ALTITUDE)
    .arcStroke(0.45)
    .arcColor(() => '#ef4444')
    .labelText('name')
    .labelColor(() => '#111827')
    .labelSize(0.55)
    .labelAltitude(0.045)
    .labelDotRadius(0)

  globe.scale.setScalar(GLOBE_SCALE)

  airplane = createAirplane()

  model.add(globe, airplane)

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

  globe
    .pointsData(points)
    .labelsData(points)
    .arcsData([
      {
        startLat: props.route.origin.lat,
        startLng: props.route.origin.lng,
        endLat: props.route.destination.lat,
        endLng: props.route.destination.lng,
      },
    ])

  restartAirplaneAnimation()
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

  airplaneAnimationFrameId = requestAnimationFrame(updateAirplanePosition)
})

onBeforeUnmount(() => {
  if (airplaneAnimationFrameId !== null) {
    cancelAnimationFrame(airplaneAnimationFrameId)
  }

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
