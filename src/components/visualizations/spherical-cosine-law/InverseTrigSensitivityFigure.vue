<script setup>
import { onBeforeUnmount, onMounted } from 'vue'

import * as THREE from 'three'

import { LoadingOverlay } from '@/components/common'
import { ViewerGuide } from '@/components/visualizations/common'

import { useThreeViewer } from '@/composables/useThreeViewer.js'

import {
  createAxes2D,
  createFunctionCurve2D,
  createLabel,
  createLine,
  createPoint2D,
  updateLine,
} from '@/utils/threeGeometry.js'

// --------------------------------------
// 그래프 설정
// --------------------------------------

const X_MIN = 0
const X_MAX = 1
const Y_MIN = 0
const Y_MAX = Math.PI / 2

const X_SCALE = 1.7
const Y_SCALE = 1.35

const LEFT_GRAPH_POSITION = new THREE.Vector3(-3.25, -1.35, 0)
const RIGHT_GRAPH_POSITION = new THREE.Vector3(0.65, -1.35, 0)

const CURVE_COLOR = 0x2563eb
const AXIS_COLOR = 0x94a3b8
const MOVING_POINT_COLOR = 0xd97706
const FIXED_POINT_COLOR = 0x0f172a
const SECANT_COLOR = 0x7c3aed
const DELTA_X_COLOR = 0x059669
const DELTA_Y_COLOR = 0xdc2626

/*
 * 두 점이 완전히 겹치면 할선의 방향을 계산할 수 없다.
 * 끝점 바로 앞까지 이동시켜 기울기의 극한을 시각화한다.
 */
const ENDPOINT_EPSILON = 0.01

// --------------------------------------
// 애니메이션 시간
// --------------------------------------

const INITIAL_HOLD_DURATION = 1200
const MOVE_DURATION = 3200
const FINAL_HOLD_DURATION = 1600

const MOVE_START = INITIAL_HOLD_DURATION
const FINAL_HOLD_START = MOVE_START + MOVE_DURATION
const CYCLE_DURATION = FINAL_HOLD_START + FINAL_HOLD_DURATION

let animationStartTime = null

// --------------------------------------
// Three.js 객체 참조
// --------------------------------------

let arccosGroup = null
let arcsinGroup = null

let arccosMovingPoint = null
let arccosSecantLine = null
let arccosDeltaXLine = null
let arccosDeltaYLine = null
let arccosDeltaXLabel = null
let arccosDeltaYLabel = null

let arcsinMovingPoint = null
let arcsinSecantLine = null
let arcsinDeltaXLine = null
let arcsinDeltaYLine = null
let arcsinDeltaXLabel = null
let arcsinDeltaYLabel = null

// --------------------------------------
// 좌표 변환
// --------------------------------------

function graphPoint(x, y) {
  return new THREE.Vector3(
    x * X_SCALE,
    y * Y_SCALE,
    0,
  )
}

function arccosPoint(x) {
  return graphPoint(x, Math.acos(x))
}

function arcsinPoint(x) {
  return graphPoint(x, Math.asin(x))
}

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

function updateSecantLine(line, pointA, pointB) {
  const direction = pointB.clone().sub(pointA)

  if (direction.lengthSq() < 1e-10) {
    return
  }

  direction.normalize()

  const midpoint = pointA.clone().add(pointB).multiplyScalar(0.5)
  const halfLength = 1.75

  const start = midpoint.clone().addScaledVector(direction, -halfLength)
  const end = midpoint.clone().addScaledVector(direction, halfLength)

  updateLine(line, start, end)
}

function updateDeltaGuides(
  deltaXLine,
  deltaYLine,
  deltaXLabel,
  deltaYLabel,
  moving,
  fixed,
) {
  const corner = new THREE.Vector3(
    fixed.x,
    moving.y,
    0,
  )

  updateLine(deltaXLine, moving, corner)
  updateLine(deltaYLine, corner, fixed)

  deltaXLabel.position.copy(
    moving.clone().add(corner).multiplyScalar(0.5).add(
      new THREE.Vector3(0, 0.13, 0),
    ),
  )

  deltaYLabel.position.copy(
    corner.clone().add(fixed).multiplyScalar(0.5).add(
      new THREE.Vector3(0.13, 0, 0),
    ),
  )
}

// --------------------------------------
// 동적 기하 업데이트
// --------------------------------------

function updateArccosGeometry(progress) {
  const x = THREE.MathUtils.lerp(
    X_MIN,
    X_MAX - ENDPOINT_EPSILON,
    progress,
  )

  const moving = arccosPoint(x)
  const fixed = arccosPoint(1)

  arccosMovingPoint.position.copy(moving)
  updateSecantLine(arccosSecantLine, moving, fixed)
  updateDeltaGuides(
    arccosDeltaXLine,
    arccosDeltaYLine,
    arccosDeltaXLabel,
    arccosDeltaYLabel,
    moving,
    fixed,
  )
}

function updateArcsinGeometry(progress) {
  const x = THREE.MathUtils.lerp(
    X_MAX,
    X_MIN + ENDPOINT_EPSILON,
    progress,
  )

  const moving = arcsinPoint(x)
  const fixed = arcsinPoint(0)

  arcsinMovingPoint.position.copy(moving)
  updateSecantLine(arcsinSecantLine, moving, fixed)
  updateDeltaGuides(
    arcsinDeltaXLine,
    arcsinDeltaYLine,
    arcsinDeltaXLabel,
    arcsinDeltaYLabel,
    moving,
    fixed,
  )
}

// --------------------------------------
// 프레임 업데이트
// --------------------------------------

function updateAnimation(timestamp) {
  if (
    !arccosGroup ||
    !arcsinGroup ||
    !arccosMovingPoint ||
    !arccosSecantLine ||
    !arccosDeltaXLine ||
    !arccosDeltaYLine ||
    !arccosDeltaXLabel ||
    !arccosDeltaYLabel ||
    !arcsinMovingPoint ||
    !arcsinSecantLine ||
    !arcsinDeltaXLine ||
    !arcsinDeltaYLine ||
    !arcsinDeltaXLabel ||
    !arcsinDeltaYLabel
  ) {
    return
  }

  if (animationStartTime === null) {
    animationStartTime = timestamp
  }

  const elapsed = (timestamp - animationStartTime) % CYCLE_DURATION

  const progress = easeInOutCubic(
    phaseProgress(elapsed, MOVE_START, MOVE_DURATION),
  )

  updateArccosGeometry(progress)
  updateArcsinGeometry(progress)
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
} = useThreeViewer('2d', {
  onFrame: updateAnimation,
})

// --------------------------------------
// 그래프 공통 요소
// --------------------------------------

function createGraphBase(title, fn) {
  const group = new THREE.Group()

  group.add(
    createAxes2D({
      xMin: X_MIN,
      xMax: X_MAX + 0.12,
      yMin: Y_MIN,
      yMax: Y_MAX + 0.12,
      xScale: X_SCALE,
      yScale: Y_SCALE,
      color: AXIS_COLOR,
    }),
    createFunctionCurve2D(
      fn,
      X_MIN,
      X_MAX,
      CURVE_COLOR,
      {
        xScale: X_SCALE,
        yScale: Y_SCALE,
      },
    ),
    createLabel(
      title,
      new THREE.Vector3(X_SCALE * 0.5, Y_SCALE * (Y_MAX + 0.45), 0),
      {
        textColor: '#0f172a',
        scale: 0.28,
      },
    ),
    createLabel(
      '0',
      new THREE.Vector3(-0.08, -0.18, 0),
      {
        textColor: '#64748b',
        scale: 0.18,
      },
    ),
    createLabel(
      '1',
      new THREE.Vector3(X_SCALE, -0.18, 0),
      {
        textColor: '#64748b',
        scale: 0.18,
      },
    ),
    createLabel(
      'π/2',
      new THREE.Vector3(-0.22, Y_SCALE * Y_MAX, 0),
      {
        textColor: '#64748b',
        scale: 0.18,
      },
    ),
  )

  return group
}

// --------------------------------------
// 도형 생성
// --------------------------------------

function createModel() {
  const model = getModel()

  if (!model) {
    return
  }

  animationStartTime = null

  // arccos

  arccosGroup = createGraphBase('y = arccos(x)', Math.acos)
  arccosGroup.position.copy(LEFT_GRAPH_POSITION)

  const arccosMovingStart = arccosPoint(0)
  const arccosFixed = arccosPoint(1)

  arccosMovingPoint = createPoint2D(
    arccosMovingStart,
    MOVING_POINT_COLOR,
    0.075,
  )

  const arccosFixedPoint = createPoint2D(
    arccosFixed,
    FIXED_POINT_COLOR,
    0.075,
  )

  arccosSecantLine = createLine(
    arccosMovingStart,
    arccosFixed,
    SECANT_COLOR,
    0.9,
  )
  arccosSecantLine.material.depthTest = false
  arccosSecantLine.renderOrder = 5

  arccosDeltaXLine = createLine(
    arccosMovingStart,
    new THREE.Vector3(arccosFixed.x, arccosMovingStart.y, 0),
    DELTA_X_COLOR,
  )
  arccosDeltaYLine = createLine(
    new THREE.Vector3(arccosFixed.x, arccosMovingStart.y, 0),
    arccosFixed,
    DELTA_Y_COLOR,
  )

  arccosDeltaXLine.material.depthTest = false
  arccosDeltaYLine.material.depthTest = false
  arccosDeltaXLine.renderOrder = 6
  arccosDeltaYLine.renderOrder = 6

  arccosDeltaXLabel = createLabel(
    'Δx',
    new THREE.Vector3(0, 0, 0),
    {
      textColor: '#059669',
      scale: 0.18,
    },
  )
  arccosDeltaYLabel = createLabel(
    'Δy',
    new THREE.Vector3(0, 0, 0),
    {
      textColor: '#dc2626',
      scale: 0.18,
    },
  )

  arccosGroup.add(
    arccosSecantLine,
    arccosDeltaXLine,
    arccosDeltaYLine,
    arccosDeltaXLabel,
    arccosDeltaYLabel,
    arccosMovingPoint,
    arccosFixedPoint,
  )

  // arcsin

  arcsinGroup = createGraphBase('y = arcsin(x)', Math.asin)
  arcsinGroup.position.copy(RIGHT_GRAPH_POSITION)

  const arcsinMovingStart = arcsinPoint(1)
  const arcsinFixed = arcsinPoint(0)

  arcsinMovingPoint = createPoint2D(
    arcsinMovingStart,
    MOVING_POINT_COLOR,
    0.075,
  )

  const arcsinFixedPoint = createPoint2D(
    arcsinFixed,
    FIXED_POINT_COLOR,
    0.075,
  )

  arcsinSecantLine = createLine(
    arcsinMovingStart,
    arcsinFixed,
    SECANT_COLOR,
    0.9,
  )
  arcsinSecantLine.material.depthTest = false
  arcsinSecantLine.renderOrder = 5

  arcsinDeltaXLine = createLine(
    arcsinMovingStart,
    new THREE.Vector3(arcsinFixed.x, arcsinMovingStart.y, 0),
    DELTA_X_COLOR,
  )
  arcsinDeltaYLine = createLine(
    new THREE.Vector3(arcsinFixed.x, arcsinMovingStart.y, 0),
    arcsinFixed,
    DELTA_Y_COLOR,
  )

  arcsinDeltaXLine.material.depthTest = false
  arcsinDeltaYLine.material.depthTest = false
  arcsinDeltaXLine.renderOrder = 6
  arcsinDeltaYLine.renderOrder = 6

  arcsinDeltaXLabel = createLabel(
    'Δx',
    new THREE.Vector3(0, 0, 0),
    {
      textColor: '#059669',
      scale: 0.18,
    },
  )
  arcsinDeltaYLabel = createLabel(
    'Δy',
    new THREE.Vector3(0, 0, 0),
    {
      textColor: '#dc2626',
      scale: 0.18,
    },
  )

  arcsinGroup.add(
    arcsinSecantLine,
    arcsinDeltaXLine,
    arcsinDeltaYLine,
    arcsinDeltaXLabel,
    arcsinDeltaYLabel,
    arcsinMovingPoint,
    arcsinFixedPoint,
  )

  model.add(arccosGroup, arcsinGroup)

  updateArccosGeometry(0)
  updateArcsinGeometry(0)
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
    class="inverse-trig-sensitivity-figure"
  >
    <LoadingOverlay
      :visible="isResizing"
      message="화면 크기를 조정하고 있습니다."
    />
    <ViewerGuide>
      휠: 확대/축소
    </ViewerGuide>
  </section>
</template>

<style scoped>
.inverse-trig-sensitivity-figure {
  position: relative;

  width: 100%;
  min-width: 0;
  min-height: 420px;

  overflow: hidden;

  border: var(--border-default);
  border-radius: var(--radius-m);

  background: var(--color-background);
}

.inverse-trig-sensitivity-figure :deep(canvas) {
  position: absolute;
  inset: 0;

  display: block;
  width: 100%;
  height: 100%;
}
</style>
