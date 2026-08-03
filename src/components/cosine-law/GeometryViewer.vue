<script setup>
import { onBeforeUnmount, onMounted, watch } from 'vue'

import * as THREE from 'three'

import ResizingLoading from '../common/ResizingLoading.vue'

import { useThreeViewer } from '../../composables/useThreeViewer.js'

import {
  createPoint,
  createLine,
  createFace,
  createLabel,
  createAngleArc,
  getAngleLabelPosition,
  disposeObject,
} from '../../utils/threeGeometry.js'

import { calculateGeometry } from './geometry.js'

const props = defineProps({
  angles: {
    type: Object,
    required: true,
  },
})

// --------------------------------------
// Three.js Viewer
// --------------------------------------

const { viewer, isResizing, getModel, initializeThree, resizeRenderer, observeResize, animate, disposeThree } =
  useThreeViewer()

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
// 도형 업데이트
// --------------------------------------

function updateModel() {
  const model = getModel()

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
    createLabel('θ₁', getAngleLabelPosition(O, B, C, 0.5), {
      textColor: '#7c3aed',
      scale: 0.2,
    }),

    createLabel('θ₂', getAngleLabelPosition(A, O, B, 0.29), {
      textColor: '#2563eb',
      scale: 0.18,
    }),

    createLabel('θ₃', getAngleLabelPosition(A, O, C, 0.4), {
      textColor: '#059669',
      scale: 0.18,
    }),

    createLabel('∠CAB', getAngleLabelPosition(A, C, B, 0.57), {
      textColor: '#d97706',
      scale: 0.18,
    }),
  )
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
  observeResize()
})

onBeforeUnmount(() => {
  disposeThree()
})
</script>

<template>
  <section ref="viewer" class="cosine-law-viewer">
    <ResizingLoading :visible="isResizing" message="화면 크기를 조정하고 있습니다." />
    <p class="cosine-law-guide">드래그: 회전 · 휠: 확대/축소</p>
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
  padding: clamp(5px, 0.7vw, 8px) clamp(8px, 1vw, 12px);

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
