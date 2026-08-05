<script setup>
import { onBeforeUnmount, onMounted, watch } from 'vue'

import * as THREE from 'three'

import ResizingLoading from '@/components/common/ResizingLoading.vue'
import ViewerGuide from '@/components/common/ViewerGuide.vue'

import { useThreeViewer } from '@/composables/useThreeViewer.js'

import {
  createPoint,
  createLine,
  createFace,
  createLabel,
  createAngleArc,
  getAngleLabelPosition,
  disposeObject,
} from '@/utils/threeGeometry.js'

const props = defineProps({
  lengths: {
    type: Object,
    required: true,
  },

  geometry: {
    type: Object,
    required: true,
  },
})

// --------------------------------------
// 고정 기하 정보
// --------------------------------------

const { A: baseA, OExtended, BExtended, CExtended } = props.geometry

// --------------------------------------
// 고정 방향벡터
// --------------------------------------

/*
 * O, B, C는 A에서 시작하여
 * 각각 Extended 점을 향하는 직선 위에서 움직인다.
 */

const directionAO = OExtended.clone().sub(baseA).normalize()

const directionAB = BExtended.clone().sub(baseA).normalize()

const directionAC = CExtended.clone().sub(baseA).normalize()

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
// 현재 점 좌표 계산
// --------------------------------------

function calculateCurrentPoints() {
  const A = baseA.clone()

  /*
   * 각 점은 A에서 시작하여
   * 고정된 방향으로 현재 길이만큼 이동한다.
   */

  const O = A.clone().addScaledVector(directionAO, props.lengths.AO)

  const B = A.clone().addScaledVector(directionAB, props.lengths.AB)

  const C = A.clone().addScaledVector(directionAC, props.lengths.AC)

  return {
    O,
    A,
    B,
    C,
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

  const { O, A, B, C } = calculateCurrentPoints()

  // --------------------------------------
  // 확장된 면
  // --------------------------------------

  model.add(
    createFace(A, OExtended, BExtended, 0x60a5fa, 0.08),

    createFace(A, OExtended, CExtended, 0x34d399, 0.08),
  )

  // --------------------------------------
  // 현재 삼각형 면
  // --------------------------------------

  model.add(
    createFace(A, O, B, 0x60a5fa, 0.24),

    createFace(A, O, C, 0x34d399, 0.24),
  )

  // --------------------------------------
  // 현재 선분
  // --------------------------------------

  model.add(
    createLine(A, O, 0x111827),

    createLine(A, B, 0x2563eb),

    createLine(A, C, 0x059669),
  )

  // --------------------------------------
  // 최대 위치까지의 연장선
  // --------------------------------------

  model.add(
    createLine(O, OExtended, 0x64748b, 0.65),

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
    createLabel('O', O.clone().addScaledVector(directionAO, 0.13), {
      textColor: '#0f172a',
      scale: 0.35,
    }),

    createLabel('A', A.clone().add(new THREE.Vector3(0.12, 0.08, 0.08)), {
      textColor: '#0f172a',
      scale: 0.35,
    }),

    createLabel('B', B.clone().addScaledVector(directionAB, 0.13), {
      textColor: '#0f172a',
      scale: 0.35,
    }),

    createLabel('C', C.clone().addScaledVector(directionAC, 0.13), {
      textColor: '#0f172a',
      scale: 0.35,
    }),
  )

  // --------------------------------------
  // 각도 원호
  // --------------------------------------

  model.add(
    /*
     * θ₁
     *
     * OExtended, BExtended, CExtended는
     * AO에 수직인 동일한 평면 위에 있다.
     *
     * 따라서
     * ∠BExtended OExtended CExtended
     * 는 두 평면 AOB, AOC의 이면각이다.
     */
    createAngleArc(OExtended, BExtended, CExtended, 0.34, 0x7c3aed),

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
  // 각도 라벨
  // --------------------------------------

  model.add(
    createLabel('θ₁', getAngleLabelPosition(OExtended, BExtended, CExtended, 0.5), {
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
// 선분 길이 변화 감지
// --------------------------------------

watch(
  () => [props.lengths.AO, props.lengths.AB, props.lengths.AC],
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
  <section id="invariance-viewer" ref="viewer">
    <ResizingLoading :visible="isResizing" message="화면 크기를 조정하고 있습니다." />
    <ViewerGuide>드래그: 회전 · 휠: 확대/축소</ViewerGuide>
  </section>
</template>

<style scoped>
#invariance-viewer {
  position: relative;

  min-width: 0;
  min-height: 0;

  overflow: hidden;

  background: #ffffff;
}

#invariance-viewer :deep(canvas) {
  display: block;

  width: 100%;
  height: 100%;
}
</style>
