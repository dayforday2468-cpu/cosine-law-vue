<script setup>
import { onBeforeUnmount, onMounted } from 'vue'

import * as THREE from 'three'

import {
  ResizingLoading,
  ViewerGuide
} from '@/components/visualizations/common'

import { useThreeViewer } from '@/composables/useThreeViewer.js'

import {
  createAngleArc,
  createFace,
  createLabel,
  createLine,
  createPoint,
  createSphere,
  getAngleLabelPosition,
} from '@/utils/threeGeometry.js'

import { invarianceGeometry } from './angle-invariance/invarianceGeometry.js'

// --------------------------------------
// 기준 기하
// --------------------------------------

const {
  A: INITIAL_A,
  OExtended,
  BExtended,
  CExtended,
  maxLengths,
} = invarianceGeometry

const ORIGIN = new THREE.Vector3(0, 0, 0)

const directionAO = OExtended.clone().sub(INITIAL_A).normalize()
const directionAB = BExtended.clone().sub(INITIAL_A).normalize()
const directionAC = CExtended.clone().sub(INITIAL_A).normalize()

/*
 * AngleInvarianceVisualizer의 초기값과 동일하게
 * 각 최대 길이의 절반에서 시작한다.
 */
const initialLengths = {
  AO: maxLengths.AO / 2,
  AB: maxLengths.AB / 2,
  AC: maxLengths.AC / 2,
}

const initialO = directionAO.clone().multiplyScalar(initialLengths.AO)
const initialB = directionAB.clone().multiplyScalar(initialLengths.AB)
const initialC = directionAC.clone().multiplyScalar(initialLengths.AC)

const extendedO = OExtended.clone().sub(INITIAL_A)
const extendedB = BExtended.clone().sub(INITIAL_A)
const extendedC = CExtended.clone().sub(INITIAL_A)

const SPHERE_RADIUS = 1
const SPHERE_OPACITY = 0.28

const targetO = directionAO.clone().multiplyScalar(SPHERE_RADIUS)
const targetB = directionAB.clone().multiplyScalar(SPHERE_RADIUS)
const targetC = directionAC.clone().multiplyScalar(SPHERE_RADIUS)

/*
 * A를 원점으로 옮긴 뒤 AO가 +y축을 향하도록
 * z축 기준으로 -90° 회전한다.
 */
const TARGET_ROTATION = new THREE.Quaternion().setFromAxisAngle(
  new THREE.Vector3(0, 0, 1),
  -Math.PI / 2,
)

// --------------------------------------
// 애니메이션 시간
// --------------------------------------

const INITIAL_HOLD_DURATION = 1500
const TRANSLATE_DURATION = 900
const ROTATE_DURATION = 1100
const SPHERE_FADE_DURATION = 700
const NORMALIZE_DURATION = 1500
const GEOMETRY_HOLD_DURATION = 600
const LABEL_TRANSITION_DURATION = 700
const FINAL_HOLD_DURATION = 2000

const TRANSLATE_START = INITIAL_HOLD_DURATION
const ROTATE_START = TRANSLATE_START + TRANSLATE_DURATION
const SPHERE_FADE_START = ROTATE_START + ROTATE_DURATION
const NORMALIZE_START = SPHERE_FADE_START + SPHERE_FADE_DURATION
const GEOMETRY_HOLD_START = NORMALIZE_START + NORMALIZE_DURATION
const LABEL_TRANSITION_START = GEOMETRY_HOLD_START + GEOMETRY_HOLD_DURATION
const FINAL_HOLD_START = LABEL_TRANSITION_START + LABEL_TRANSITION_DURATION

const CYCLE_DURATION = FINAL_HOLD_START + FINAL_HOLD_DURATION

let animationStartTime = null

// --------------------------------------
// Three.js 객체 참조
// --------------------------------------

let figureGroup = null
let guideGroup = null
let initialTheta1Group = null
let sphereTheta1ArcGroup = null
let sphereTheta1LabelGroup = null
let initialLabelsGroup = null
let finalLabelsGroup = null
let sphere = null

let pointO = null
let pointB = null
let pointC = null

let lineAO = null
let lineAB = null
let lineAC = null

let faceAOB = null
let faceAOC = null

const initialPointLabels = {}
const finalPointLabels = {}

// --------------------------------------
// 애니메이션 보조 함수
// --------------------------------------

function clampProgress(value) {
  return THREE.MathUtils.clamp(value, 0, 1)
}

function phaseProgress(elapsed, start, duration) {
  return clampProgress((elapsed - start) / duration)
}

function easeInOutCubic(value) {
  return value < 0.5
    ? 4 * value ** 3
    : 1 - ((-2 * value + 2) ** 3) / 2
}

function setGroupOpacity(group, factor) {
  if (!group) {
    return
  }

  group.traverse((object) => {
    const materials = Array.isArray(object.material)
      ? object.material
      : [object.material]

    materials.forEach((material) => {
      if (!material) {
        return
      }

      if (material.userData.baseOpacity === undefined) {
        material.userData.baseOpacity = material.opacity
      }

      material.transparent = true
      material.opacity = material.userData.baseOpacity * factor
    })
  })
}

function updateLine(line, start, end) {
  const positions = line.geometry.getAttribute('position')

  positions.setXYZ(0, start.x, start.y, start.z)
  positions.setXYZ(1, end.x, end.y, end.z)
  positions.needsUpdate = true

  line.geometry.computeBoundingSphere()
}

function updateFace(face, a, b, c) {
  const positions = face.geometry.getAttribute('position')

  positions.setXYZ(0, a.x, a.y, a.z)
  positions.setXYZ(1, b.x, b.y, b.z)
  positions.setXYZ(2, c.x, c.y, c.z)
  positions.needsUpdate = true

  face.geometry.computeVertexNormals()
  face.geometry.computeBoundingSphere()
}

function pointLabelPosition(point, direction) {
  return point.clone().addScaledVector(direction, 0.13)
}

// --------------------------------------
// 동적 기하 업데이트
// --------------------------------------

function updateCurrentGeometry(normalizeProgress) {
  const easedProgress = easeInOutCubic(normalizeProgress)

  const currentO = directionAO.clone().multiplyScalar(
    THREE.MathUtils.lerp(initialLengths.AO, SPHERE_RADIUS, easedProgress),
  )

  const currentB = directionAB.clone().multiplyScalar(
    THREE.MathUtils.lerp(initialLengths.AB, SPHERE_RADIUS, easedProgress),
  )

  const currentC = directionAC.clone().multiplyScalar(
    THREE.MathUtils.lerp(initialLengths.AC, SPHERE_RADIUS, easedProgress),
  )

  pointO.position.copy(currentO)
  pointB.position.copy(currentB)
  pointC.position.copy(currentC)

  updateLine(lineAO, ORIGIN, currentO)
  updateLine(lineAB, ORIGIN, currentB)
  updateLine(lineAC, ORIGIN, currentC)

  updateFace(faceAOB, ORIGIN, currentO, currentB)
  updateFace(faceAOC, ORIGIN, currentO, currentC)

  initialPointLabels.O.position.copy(
    pointLabelPosition(currentO, directionAO),
  )
  initialPointLabels.B.position.copy(
    pointLabelPosition(currentB, directionAB),
  )
  initialPointLabels.C.position.copy(
    pointLabelPosition(currentC, directionAC),
  )

  finalPointLabels.N.position.copy(
    pointLabelPosition(currentO, directionAO),
  )
  finalPointLabels.P1.position.copy(
    pointLabelPosition(currentB, directionAB),
  )
  finalPointLabels.P2.position.copy(
    pointLabelPosition(currentC, directionAC),
  )
}

// --------------------------------------
// 프레임 업데이트
// --------------------------------------

function updateAnimation(timestamp) {
  if (
    !figureGroup ||
    !sphere ||
    !pointO ||
    !pointB ||
    !pointC
  ) {
    return
  }

  if (animationStartTime === null) {
    animationStartTime = timestamp
  }

  const elapsed = (timestamp - animationStartTime) % CYCLE_DURATION

  const translateProgress = easeInOutCubic(
    phaseProgress(elapsed, TRANSLATE_START, TRANSLATE_DURATION),
  )

  const rotateProgress = easeInOutCubic(
    phaseProgress(elapsed, ROTATE_START, ROTATE_DURATION),
  )

  const sphereProgress = easeInOutCubic(
    phaseProgress(elapsed, SPHERE_FADE_START, SPHERE_FADE_DURATION),
  )

  const normalizeProgress = phaseProgress(
    elapsed,
    NORMALIZE_START,
    NORMALIZE_DURATION,
  )

  const labelProgress = easeInOutCubic(
    phaseProgress(
      elapsed,
      LABEL_TRANSITION_START,
      LABEL_TRANSITION_DURATION,
    ),
  )

  figureGroup.position
    .copy(INITIAL_A)
    .lerp(ORIGIN, translateProgress)

  figureGroup.quaternion
    .identity()
    .slerp(TARGET_ROTATION, rotateProgress)

  sphere.material.opacity = SPHERE_OPACITY * sphereProgress

  setGroupOpacity(guideGroup, 1 - sphereProgress)
  setGroupOpacity(initialTheta1Group, 1 - sphereProgress)
  setGroupOpacity(sphereTheta1ArcGroup, sphereProgress)
  setGroupOpacity(
    sphereTheta1LabelGroup,
    sphereProgress * (1 - labelProgress),
  )

  setGroupOpacity(initialLabelsGroup, 1 - labelProgress)
  setGroupOpacity(finalLabelsGroup, labelProgress)

  updateCurrentGeometry(normalizeProgress)
}

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
  onFrame: updateAnimation,
})

// --------------------------------------
// 도형 생성
// --------------------------------------

function createModel() {
  const model = getModel()

  if (!model) {
    return
  }

  animationStartTime = null

  // --------------------------------------
  // 반지름 1인 구
  // --------------------------------------

  sphere = createSphere(
    SPHERE_RADIUS,
    0x60a5fa,
    SPHERE_OPACITY,
    64,
  )

  sphere.material.opacity = 0
  sphere.material.depthWrite = false
  sphere.renderOrder = -1

  model.add(sphere)

  // --------------------------------------
  // 사면체 그룹
  // --------------------------------------

  figureGroup = new THREE.Group()
  figureGroup.position.copy(INITIAL_A)

  model.add(figureGroup)

  // --------------------------------------
  // AngleInvariance의 연장 가이드
  // --------------------------------------

  guideGroup = new THREE.Group()

  guideGroup.add(
    createFace(ORIGIN, extendedO, extendedB, 0x60a5fa, 0.08),
    createFace(ORIGIN, extendedO, extendedC, 0x34d399, 0.08),

    createLine(initialO, extendedO, 0x64748b, 0.65),
    createLine(initialB, extendedB, 0x60a5fa, 0.65),
    createLine(initialC, extendedC, 0x34d399, 0.65),
  )

  figureGroup.add(guideGroup)

  // --------------------------------------
  // 현재 삼각형 면
  // --------------------------------------

  faceAOB = createFace(
    ORIGIN,
    initialO,
    initialB,
    0x60a5fa,
    0.24,
  )

  faceAOC = createFace(
    ORIGIN,
    initialO,
    initialC,
    0x34d399,
    0.24,
  )

  figureGroup.add(faceAOB, faceAOC)

  // --------------------------------------
  // 현재 선분
  // --------------------------------------

  lineAO = createLine(ORIGIN, initialO, 0x111827)
  lineAB = createLine(ORIGIN, initialB, 0x2563eb)
  lineAC = createLine(ORIGIN, initialC, 0x059669)

  figureGroup.add(lineAO, lineAB, lineAC)

  // --------------------------------------
  // 꼭짓점
  // --------------------------------------

  const pointA = createPoint(ORIGIN, 0x111827)

  pointO = createPoint(initialO, 0xef4444)
  pointB = createPoint(initialB, 0x2563eb)
  pointC = createPoint(initialC, 0x10b981)

  figureGroup.add(pointA, pointO, pointB, pointC)

  // --------------------------------------
  // 고정 각도 원호
  // --------------------------------------

  figureGroup.add(
    createAngleArc(
      ORIGIN,
      initialO,
      initialB,
      0.23,
      0x2563eb,
    ),

    createAngleArc(
      ORIGIN,
      initialO,
      initialC,
      0.34,
      0x059669,
    ),

    createAngleArc(
      ORIGIN,
      initialC,
      initialB,
      0.46,
      0xd97706,
    ),
  )

  // --------------------------------------
  // θ₁: 기존 이면각 표시
  // --------------------------------------

  initialTheta1Group = new THREE.Group()

  initialTheta1Group.add(
    createAngleArc(
      extendedO,
      extendedB,
      extendedC,
      0.34,
      0x7c3aed,
    ),

    createLabel(
      'θ₁',
      getAngleLabelPosition(
        extendedO,
        extendedB,
        extendedC,
        0.5,
      ),
      {
        textColor: '#7c3aed',
        scale: 0.2,
      },
    ),
  )

  figureGroup.add(initialTheta1Group)

  // --------------------------------------
  // θ₁: 북극점에서 본 두 자오면 사이의 각
  // --------------------------------------

  const transverseB = directionAB
    .clone()
    .addScaledVector(
      directionAO,
      -directionAB.dot(directionAO),
    )
    .normalize()

  const transverseC = directionAC
    .clone()
    .addScaledVector(
      directionAO,
      -directionAC.dot(directionAO),
    )
    .normalize()

  const theta1PointB = targetO.clone().add(transverseB)
  const theta1PointC = targetO.clone().add(transverseC)

  sphereTheta1ArcGroup = new THREE.Group()

  sphereTheta1ArcGroup.add(
    createAngleArc(
      targetO,
      theta1PointB,
      theta1PointC,
      0.28,
      0x7c3aed,
    ),
  )

  figureGroup.add(sphereTheta1ArcGroup)

  sphereTheta1LabelGroup = new THREE.Group()

  sphereTheta1LabelGroup.add(
    createLabel(
      'θ₁',
      getAngleLabelPosition(
        targetO,
        theta1PointB,
        theta1PointC,
        0.42,
      ),
      {
        textColor: '#7c3aed',
        scale: 0.2,
      },
    ),
  )

  figureGroup.add(sphereTheta1LabelGroup)

  // --------------------------------------
  // 사면체 문제 라벨
  // --------------------------------------

  initialLabelsGroup = new THREE.Group()

  initialPointLabels.A = createLabel(
    'A',
    new THREE.Vector3(0.12, 0.08, 0.08),
    {
      scale: 0.35,
    },
  )

  initialPointLabels.O = createLabel(
    'O',
    pointLabelPosition(initialO, directionAO),
    {
      scale: 0.35,
    },
  )

  initialPointLabels.B = createLabel(
    'B',
    pointLabelPosition(initialB, directionAB),
    {
      scale: 0.35,
    },
  )

  initialPointLabels.C = createLabel(
    'C',
    pointLabelPosition(initialC, directionAC),
    {
      scale: 0.35,
    },
  )

  initialLabelsGroup.add(
    initialPointLabels.A,
    initialPointLabels.O,
    initialPointLabels.B,
    initialPointLabels.C,

    createLabel(
      'θ₂',
      getAngleLabelPosition(
        ORIGIN,
        initialO,
        initialB,
        0.29,
      ),
      {
        textColor: '#2563eb',
        scale: 0.18,
      },
    ),

    createLabel(
      'θ₃',
      getAngleLabelPosition(
        ORIGIN,
        initialO,
        initialC,
        0.4,
      ),
      {
        textColor: '#059669',
        scale: 0.18,
      },
    ),

    createLabel(
      '∠CAB',
      getAngleLabelPosition(
        ORIGIN,
        initialC,
        initialB,
        0.57,
      ),
      {
        textColor: '#d97706',
        scale: 0.18,
      },
    ),
  )

  figureGroup.add(initialLabelsGroup)

  // --------------------------------------
  // 구면 문제 라벨
  // --------------------------------------

  finalLabelsGroup = new THREE.Group()

  finalPointLabels.O = createLabel(
    'O',
    new THREE.Vector3(0.12, 0.08, 0.08),
    {
      scale: 0.35,
    },
  )

  finalPointLabels.N = createLabel(
    'N',
    pointLabelPosition(targetO, directionAO),
    {
      scale: 0.32,
    },
  )

  finalPointLabels.P1 = createLabel(
    'P₁',
    pointLabelPosition(targetB, directionAB),
    {
      scale: 0.32,
    },
  )

  finalPointLabels.P2 = createLabel(
    'P₂',
    pointLabelPosition(targetC, directionAC),
    {
      scale: 0.32,
    },
  )

  finalLabelsGroup.add(
    finalPointLabels.O,
    finalPointLabels.N,
    finalPointLabels.P1,
    finalPointLabels.P2,

    createLabel(
      'Δλ',
      getAngleLabelPosition(
        targetO,
        theta1PointB,
        theta1PointC,
        0.42,
      ),
      {
        textColor: '#7c3aed',
        scale: 0.2,
      },
    ),

    createLabel(
      '90° - φ₁',
      getAngleLabelPosition(
        ORIGIN,
        targetO,
        targetB,
        0.34,
      ),
      {
        textColor: '#2563eb',
        scale: 0.2,
      },
    ),

    createLabel(
      '90° - φ₂',
      getAngleLabelPosition(
        ORIGIN,
        targetO,
        targetC,
        0.45,
      ),
      {
        textColor: '#059669',
        scale: 0.2,
      },
    ),

    createLabel(
      'θ',
      getAngleLabelPosition(
        ORIGIN,
        targetC,
        targetB,
        0.57,
      ),
      {
        textColor: '#d97706',
        scale: 0.2,
      },
    ),
  )

  figureGroup.add(finalLabelsGroup)

  // 첫 프레임 전 숨겨야 하는 요소
  setGroupOpacity(sphereTheta1ArcGroup, 0)
  setGroupOpacity(sphereTheta1LabelGroup, 0)
  setGroupOpacity(finalLabelsGroup, 0)
}

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
  <section
    ref="viewer"
    class="sphere-normalization-figure"
  >
    <ResizingLoading
      :visible="isResizing"
      message="화면 크기를 조정하고 있습니다."
    />
    <ViewerGuide>
      드래그: 회전 · 휠: 확대/축소
    </ViewerGuide>
  </section>
</template>

<style scoped>
.sphere-normalization-figure {
  position: relative;

  width: 100%;
  min-width: 0;
  min-height: 420px;

  overflow: hidden;

  border: var(--border-default);
  border-radius: var(--radius-m);

  background: var(--color-background);
}

.sphere-normalization-figure :deep(canvas) {
  position: absolute;
  inset: 0;

  display: block;
  width: 100%;
  height: 100%;
}
</style>
