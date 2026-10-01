<script setup>
import { onBeforeUnmount, onMounted } from 'vue'

import * as THREE from 'three'

import {
  ResizingLoading,
  ViewerGuide
} from '@/components/visualizations/common'

import { useThreeViewer } from '@/composables/useThreeViewer.js'

import {
  createPoint,
  createLine,
  createFace,
  createLabel,
  createAngleArc,
  getAngleLabelPosition,
} from '@/utils/threeGeometry.js'

// --------------------------------------
// 고정 좌표
// --------------------------------------

const O = new THREE.Vector3(0, 0, 0)

const A = new THREE.Vector3(1, 0, 0)

const B = new THREE.Vector3(0, 1, 0)

const C = new THREE.Vector3(0, 0, 0.57735)

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
} = useThreeViewer()

// --------------------------------------
// 도형 생성
// --------------------------------------

function updateModel() {
  const model = getModel()

  if (!model) {
    return
  }

  clearModel()

  // --------------------------------------
  // 삼각형 면
  // --------------------------------------

  model.add(
    createFace(O, A, B, 0x60a5fa, 0.24),

    createFace(O, A, C, 0x34d399, 0.24),

    createFace(A, B, C, 0xfbbf24, 0.12),
  )

  // --------------------------------------
  // 모서리
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
     * ∠BOC = 90°
     */
    createAngleArc(O, B, C, 0.34, 0x7c3aed),

    /*
     * ∠OAB = 45°
     */
    createAngleArc(A, O, B, 0.23, 0x2563eb),

    /*
     * ∠OAC = 30°
     */
    createAngleArc(A, O, C, 0.34, 0x059669),

    /*
     * 구하려는 각 ∠CAB
     */
    createAngleArc(A, C, B, 0.46, 0xd97706),
  )

  // --------------------------------------
  // 각도 라벨
  // --------------------------------------

  model.add(
    createLabel('90°', getAngleLabelPosition(O, B, C, 0.5), {
      textColor: '#7c3aed',
      scale: 0.2,
    }),

    createLabel('45°', getAngleLabelPosition(A, O, B, 0.29), {
      textColor: '#2563eb',
      scale: 0.18,
    }),

    createLabel('30°', getAngleLabelPosition(A, O, C, 0.4), {
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
  <section ref="viewer" class="problem-figure">
    <ResizingLoading :visible="isResizing" message="화면 크기를 조정하고 있습니다." />
    <ViewerGuide>드래그: 회전 · 휠: 확대/축소</ViewerGuide>
  </section>
</template>

<style scoped>
.problem-figure {
  position: relative;

  width: 100%;
  min-width: 0;
  min-height: 420px;

  overflow: hidden;

  background: var(--color-background);
}

.problem-figure :deep(canvas) {
  position: absolute;
  inset: 0;

  display: block;
  width: 100%;
  height: 100%;
}
</style>
