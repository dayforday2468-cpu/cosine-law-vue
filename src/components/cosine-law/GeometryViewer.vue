<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { calculateGeometry } from '../../utils/geometry.js'

import {
  createPoint,
  createLine,
  createFace,
  createLabel,
  createAngleArc,
  getAngleLabelPosition,
  disposeObject,
} from '../../utils/threeGeometry.js'

const props = defineProps({
  angles: {
    type: Object,
    required: true,
  },
})

const viewer = ref(null)

let scene = null
let camera = null
let renderer = null
let orbitControls = null
let resizeObserver = null
let animationFrameId = null
let model = null

// --------------------------------------
// 기존 모델 제거
// --------------------------------------

function clearModel() {
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
// Three.js 초기화
// --------------------------------------

function initializeThree() {
  const viewerElement = viewer.value

  if (!viewerElement) {
    return
  }

  const width = viewerElement.clientWidth
  const height = viewerElement.clientHeight

  if (width === 0 || height === 0) {
    return
  }

  // Scene

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)

  // Camera

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)

  /*
   * O = (0, 0, 0)을 화면 중심으로 보되,
   * 기존 카메라의 거리와 방향을 유지한다.
   */
  camera.position.set(3.35, 3.1, 4.55)

  // Renderer

  renderer = new THREE.WebGLRenderer({
    antialias: true,
  })

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  renderer.setSize(width, height, false)

  viewerElement.prepend(renderer.domElement)

  // OrbitControls

  orbitControls = new OrbitControls(camera, renderer.domElement)

  orbitControls.enableDamping = true

  orbitControls.target.set(0, 0, 0)

  orbitControls.minDistance = 2
  orbitControls.maxDistance = 12

  orbitControls.update()

  // 조명

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.8)

  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2)

  directionalLight.position.set(5, 5, 5)

  scene.add(directionalLight)

  // 좌표축

  const axesHelper = new THREE.AxesHelper(2.5)

  scene.add(axesHelper)

  // 좌표축 라벨

  const axisLabels = new THREE.Group()

  axisLabels.add(
    createLabel('x', new THREE.Vector3(2.7, 0, 0), {
      textColor: '#ef4444',
      scale: 0.32,
    }),

    createLabel('y', new THREE.Vector3(0, 2.7, 0), {
      textColor: '#16a34a',
      scale: 0.32,
    }),

    createLabel('z', new THREE.Vector3(0, 0, 2.7), {
      textColor: '#2563eb',
      scale: 0.32,
    }),
  )
  scene.add(axisLabels)

  // 실제 도형 그룹

  model = new THREE.Group()

  scene.add(model)
}

// --------------------------------------
// 도형 업데이트
// --------------------------------------

function updateModel() {
  if (!model) {
    return
  }

  clearModel()

  const { O, A, B, C, OExtended, BExtended, CExtended } = calculateGeometry({
    theta1: props.angles.theta1,
    theta2: props.angles.theta2,
    theta3: props.angles.theta3,
    extensionScale: 1.9,
  })

  // --------------------------------------
  // 확장된 면
  // --------------------------------------

  model.add(
    createFace(A, OExtended, BExtended, 0x60a5fa, 0.08),

    createFace(A, OExtended, CExtended, 0x34d399, 0.08),
  )

  // --------------------------------------
  // 기존 삼각형 면
  // --------------------------------------

  model.add(
    createFace(O, A, B, 0x60a5fa, 0.24),

    createFace(O, A, C, 0x34d399, 0.24),

    createFace(A, B, C, 0xfbbf24, 0.12),
  )

  // --------------------------------------
  // 기존 모서리
  // --------------------------------------

  model.add(
    createLine(O, A, 0x111827),

    createLine(O, B, 0x2563eb),

    createLine(O, C, 0x059669),

    createLine(A, B, 0x2563eb),

    createLine(A, C, 0x059669),

    createLine(B, C, 0x64748b),
  )

  // --------------------------------------
  // AB, AC 연장선
  // --------------------------------------

  model.add(
    createLine(B, BExtended, 0x60a5fa, 0.65),

    createLine(C, CExtended, 0x34d399, 0.65),
  )

  // --------------------------------------
  // 꼭짓점
  // --------------------------------------

  model.add(
    createPoint(O, 0xef4444),

    createPoint(A, 0x111827),

    createPoint(B, 0x2563eb),

    createPoint(C, 0x10b981),
  )

  // --------------------------------------
  // 꼭짓점 이름
  // --------------------------------------

  model.add(
    createLabel('O', O.clone().add(new THREE.Vector3(-0.13, -0.13, -0.08))),

    createLabel('A', A.clone().add(new THREE.Vector3(0.12, 0.08, 0.08))),

    createLabel('B', B.clone().add(new THREE.Vector3(0.08, 0.12, 0.08))),

    createLabel('C', C.clone().add(new THREE.Vector3(0.08, 0.08, 0.12))),
  )

  // --------------------------------------
  // 각도 원호
  // --------------------------------------

  model.add(
    /*
     * θ₁ = ∠BOC
     */
    createAngleArc(O, B, C, 0.34, 0x7c3aed),

    /*
     * θ₂ = ∠OAB
     */
    createAngleArc(A, O, B, 0.23, 0x2563eb),

    /*
     * θ₃ = ∠OAC
     */
    createAngleArc(A, O, C, 0.34, 0x059669),

    /*
     * 결과 각 ∠CAB
     */
    createAngleArc(A, C, B, 0.46, 0xd97706),
  )

  // --------------------------------------
  // 각도 값 라벨
  // --------------------------------------

  model.add(
    createLabel(`θ₁`, getAngleLabelPosition(O, B, C, 0.5), {
      textColor: '#7c3aed',
      scale: 0.2,
    }),

    createLabel(`θ₂`, getAngleLabelPosition(A, O, B, 0.29), {
      textColor: '#2563eb',
      scale: 0.18,
    }),

    createLabel(`θ₃`, getAngleLabelPosition(A, O, C, 0.4), {
      textColor: '#059669',
      scale: 0.18,
    }),

    createLabel(`∠CAB`, getAngleLabelPosition(A, C, B, 0.57), {
      textColor: '#d97706',
      scale: 0.18,
    }),
  )
}

// --------------------------------------
// 렌더러 크기 조정
// --------------------------------------

function resizeRenderer() {
  const viewerElement = viewer.value

  if (!viewerElement || !camera || !renderer) {
    return
  }

  const width = viewerElement.clientWidth

  const height = viewerElement.clientHeight

  if (width === 0 || height === 0) {
    return
  }

  /*
   * FOV와 카메라 위치는 변경하지 않는다.
   * 렌더링 영역의 비율만 갱신한다.
   */
  camera.aspect = width / height
  camera.updateProjectionMatrix()

  renderer.setSize(width, height, false)
}

// --------------------------------------
// 렌더링 반복
// --------------------------------------

function animate() {
  animationFrameId = requestAnimationFrame(animate)

  orbitControls?.update()

  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}

// --------------------------------------
// 전체 자원 정리
// --------------------------------------

function disposeThree() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }

  resizeObserver?.disconnect()
  orbitControls?.dispose()

  scene?.traverse((object) => {
    disposeObject(object)
  })

  renderer?.dispose()
  renderer?.domElement.remove()

  scene = null
  camera = null
  renderer = null
  orbitControls = null
  resizeObserver = null
  animationFrameId = null
  model = null
}

// --------------------------------------
// 각도 변화 감지
// --------------------------------------

watch(
  () => [props.angles.theta1, props.angles.theta2, props.angles.theta3],
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

  resizeObserver = new ResizeObserver(() => {
    resizeRenderer()
  })

  if (viewer.value) {
    resizeObserver.observe(viewer.value)
  }
})

onBeforeUnmount(() => {
  disposeThree()
})
</script>

<template>
  <section
    ref="viewer"
    class="cosine-law-viewer"
  >
    <p class="cosine-law-guide">
      드래그: 회전 · 휠: 확대/축소
    </p>
  </section>
</template>

<style scoped>
.cosine-law-viewer {
  position: relative;

  min-width: 0;
  min-height: 0;

  overflow: hidden;

  background: #ffffff;
}

.cosine-law-viewer :deep(canvas) {
  display: block;

  width: 100%;
  height: 100%;
}

.cosine-law-guide {
  position: absolute;
  z-index: 10;
  bottom: clamp(10px, 1.5vw, 20px);
  left: clamp(10px, 1.5vw, 20px);

  width: auto;
  height: auto;

  margin: 0;
  padding:
    clamp(5px, 0.7vw, 8px)
    clamp(8px, 1vw, 12px);

  border: 1px solid #dbe3ee;
  border-radius: 8px;

  background: rgb(255 255 255 / 90%);
  color: #475569;

  font-size: clamp(10px, 1vw, 14px);
  line-height: 1.4;
  white-space: nowrap;

  pointer-events: none;
}
</style>