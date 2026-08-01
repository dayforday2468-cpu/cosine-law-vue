<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

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
  lengths: {
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
// 고정 각도
// --------------------------------------

const theta1 = THREE.MathUtils.degToRad(90)
const theta2 = THREE.MathUtils.degToRad(45)
const theta3 = THREE.MathUtils.degToRad(30)

// --------------------------------------
// 기준 좌표
// --------------------------------------

/*
 * 기존 컴포넌트와 동일한 기준 좌표
 *
 * O = (0, 0, 0)
 * A = (1, 0, 0)
 *
 * B = (0, tan θ₂, 0)
 *
 * C = (
 *   0,
 *   tan θ₃ cos θ₁,
 *   tan θ₃ sin θ₁
 * )
 */
const baseO = new THREE.Vector3(0, 0, 0)

const baseA = new THREE.Vector3(1, 0, 0)

const baseB = new THREE.Vector3(
  0,
  Math.tan(theta2),
  0,
)

const baseC = new THREE.Vector3(
  0,
  Math.tan(theta3) * Math.cos(theta1),
  Math.tan(theta3) * Math.sin(theta1),
)

// --------------------------------------
// 고정 방향벡터
// --------------------------------------

/*
 * A는 고정한다.
 *
 * O, B, C는 각각 A에서 시작하는
 * 고정된 반직선 위에서만 움직인다.
 */
const directionAO = baseO
  .clone()
  .sub(baseA)
  .normalize()

const directionAB = baseB
  .clone()
  .sub(baseA)
  .normalize()

const directionAC = baseC
  .clone()
  .sub(baseA)
  .normalize()

// --------------------------------------
// 이면각 정보 계산
// --------------------------------------

function getDihedralData(
  A,
  O,
  B,
  C,
  centerDistance,
) {
  const axisDirection = O
    .clone()
    .sub(A)
    .normalize()

  /*
   * 이면각 원호의 중심은 공통 모서리 AO 위에 둔다.
   */
  const center = A
    .clone()
    .addScaledVector(
      axisDirection,
      centerDistance,
    )

  /*
   * AB 방향에서 AO 방향 성분을 제거하면
   * 평면 AOB 안에서 AO에 수직인 방향이 된다.
   */
  const radialDirection1 = B
    .clone()
    .sub(A)

  radialDirection1.addScaledVector(
    axisDirection,
    -radialDirection1.dot(axisDirection),
  )

  radialDirection1.normalize()

  /*
   * AC 방향에서도 AO 방향 성분을 제거한다.
   */
  const radialDirection2 = C
    .clone()
    .sub(A)

  radialDirection2.addScaledVector(
    axisDirection,
    -radialDirection2.dot(axisDirection),
  )

  radialDirection2.normalize()

  const dot = THREE.MathUtils.clamp(
    radialDirection1.dot(radialDirection2),
    -1,
    1,
  )

  const angle = Math.acos(dot)

  /*
   * AO축을 기준으로 어느 방향으로 회전해야 하는지
   * 외적의 방향을 이용하여 결정한다.
   */
  const cross = new THREE.Vector3().crossVectors(
    radialDirection1,
    radialDirection2,
  )

  const sign =
    cross.dot(axisDirection) >= 0
      ? 1
      : -1

  return {
    center,
    axisDirection,
    radialDirection1,
    radialDirection2,
    angle,
    sign,
  }
}

// --------------------------------------
// 이면각 원호 생성
// --------------------------------------

function createDihedralArc(
  A,
  O,
  B,
  C,
  centerDistance,
  radius,
  color,
  segments = 64,
) {
  const {
    center,
    axisDirection,
    radialDirection1,
    angle,
    sign,
  } = getDihedralData(
    A,
    O,
    B,
    C,
    centerDistance,
  )

  const points = []

  for (
    let index = 0;
    index <= segments;
    index += 1
  ) {
    const ratio = index / segments

    const direction = radialDirection1
      .clone()
      .applyAxisAngle(
        axisDirection,
        sign * angle * ratio,
      )

    const point = center
      .clone()
      .add(
        direction.multiplyScalar(radius),
      )

    points.push(point)
  }

  const geometry =
    new THREE.BufferGeometry().setFromPoints(points)

  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.95,
    depthTest: false,
  })

  const arc = new THREE.Line(
    geometry,
    material,
  )

  arc.renderOrder = 15

  return arc
}

// --------------------------------------
// 이면각 라벨 위치 계산
// --------------------------------------

function getDihedralLabelPosition(
  A,
  O,
  B,
  C,
  centerDistance,
  radius,
) {
  const {
    center,
    axisDirection,
    radialDirection1,
    angle,
    sign,
  } = getDihedralData(
    A,
    O,
    B,
    C,
    centerDistance,
  )

  const middleDirection = radialDirection1
    .clone()
    .applyAxisAngle(
      axisDirection,
      sign * angle / 2,
    )

  return center
    .clone()
    .add(
      middleDirection.multiplyScalar(radius),
    )
}

// --------------------------------------
// 현재 점 좌표 계산
// --------------------------------------

function calculateCurrentPoints() {
  const A = baseA.clone()

  /*
   * 각 점은 A에서 시작하여
   * 고정 방향으로 주어진 길이만큼 이동한다.
   */
  const O = A
    .clone()
    .addScaledVector(
      directionAO,
      props.lengths.AO,
    )

  const B = A
    .clone()
    .addScaledVector(
      directionAB,
      props.lengths.AB,
    )

  const C = A
    .clone()
    .addScaledVector(
      directionAC,
      props.lengths.AC,
    )

  return {
    O,
    A,
    B,
    C,
  }
}

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

  camera = new THREE.PerspectiveCamera(
    45,
    width / height,
    0.1,
    100,
  )

  /*
   * 기존 컴포넌트와 유사한 카메라 방향을 사용한다.
   */
  camera.position.set(3.35, 3.1, 4.55)

  // Renderer

  renderer = new THREE.WebGLRenderer({
    antialias: true,
  })

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2),
  )

  renderer.setSize(
    width,
    height,
    false,
  )

  viewerElement.prepend(
    renderer.domElement,
  )

  // OrbitControls

  orbitControls = new OrbitControls(
    camera,
    renderer.domElement,
  )

  orbitControls.enableDamping = true

  orbitControls.target.set(
    0.25,
    0.35,
    0.25,
  )

  orbitControls.minDistance = 2
  orbitControls.maxDistance = 12

  orbitControls.update()

  // 조명

  const ambientLight =
    new THREE.AmbientLight(
      0xffffff,
      1.8,
    )

  scene.add(ambientLight)

  const directionalLight =
    new THREE.DirectionalLight(
      0xffffff,
      2,
    )

  directionalLight.position.set(
    5,
    5,
    5,
  )

  scene.add(directionalLight)

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

  const {
    O,
    A,
    B,
    C,
  } = calculateCurrentPoints()

  /*
   * AO 길이에 따라 이면각 원호의 중심 위치를 조절한다.
   * 점 O가 A와 가까워져도 원호가 선분 밖으로 나가지 않게 한다.
   */
  const dihedralCenterDistance = Math.min(
    0.32,
    props.lengths.AO * 0.45,
  )

  // --------------------------------------
  // 두 삼각형 면
  // --------------------------------------

  model.add(
    createFace(
      A,
      O,
      B,
      0x60a5fa,
      0.24,
    ),

    createFace(
      A,
      O,
      C,
      0x34d399,
      0.24,
    ),
  )

  // --------------------------------------
  // A에서 출발하는 세 선분
  // --------------------------------------

  model.add(
    createLine(
      A,
      O,
      0x111827,
    ),

    createLine(
      A,
      B,
      0x2563eb,
    ),

    createLine(
      A,
      C,
      0x059669,
    ),
  )

  // --------------------------------------
  // 꼭짓점
  // --------------------------------------

  model.add(
    createPoint(
      O,
      0xef4444,
    ),

    createPoint(
      A,
      0x111827,
    ),

    createPoint(
      B,
      0x2563eb,
    ),

    createPoint(
      C,
      0x10b981,
    ),
  )

// --------------------------------------
// 꼭짓점 이름
// --------------------------------------

model.add(
  createLabel(
    'O',
    O
      .clone()
      .addScaledVector(
        directionAO,
        0.13,
      ),
    {
      textColor: '#0f172a',
      scale: 0.35,
    },
  ),

  createLabel(
    'A',
    A
      .clone()
      .add(
        new THREE.Vector3(
          0.12,
          0.08,
          0.08,
        ),
      ),
    {
      textColor: '#0f172a',
      scale: 0.35,
    },
  ),

  createLabel(
    'B',
    B
      .clone()
      .addScaledVector(
        directionAB,
        0.13,
      ),
    {
      textColor: '#0f172a',
      scale: 0.35,
    },
  ),

  createLabel(
    'C',
    C
      .clone()
      .addScaledVector(
        directionAC,
        0.13,
      ),
    {
      textColor: '#0f172a',
      scale: 0.35,
    },
  ),
)
  // --------------------------------------
  // 각도 원호
  // --------------------------------------

  model.add(
    /*
     * θ₁
     *
     * 두 평면 AOB, AOC 사이의 이면각이다.
     * O에서의 ∠BOC가 아님에 주의한다.
     */
    createDihedralArc(
      A,
      O,
      B,
      C,
      dihedralCenterDistance,
      0.19,
      0x7c3aed,
    ),

    /*
     * θ₂ = ∠OAB
     */
    createAngleArc(
      A,
      O,
      B,
      0.23,
      0x2563eb,
    ),

    /*
     * θ₃ = ∠OAC
     */
    createAngleArc(
      A,
      O,
      C,
      0.34,
      0x059669,
    ),

    /*
     * 결과 각 ∠CAB
     */
    createAngleArc(
      A,
      C,
      B,
      0.46,
      0xd97706,
    ),
  )

  // --------------------------------------
  // 각도 라벨
  // --------------------------------------

  model.add(
    createLabel(
      'θ₁',
      getDihedralLabelPosition(
        A,
        O,
        B,
        C,
        dihedralCenterDistance,
        0.29,
      ),
      {
        textColor: '#7c3aed',
        scale: 0.2,
      },
    ),

    createLabel(
      'θ₂',
      getAngleLabelPosition(
        A,
        O,
        B,
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
        A,
        O,
        C,
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
        A,
        C,
        B,
        0.57,
      ),
      {
        textColor: '#d97706',
        scale: 0.18,
      },
    ),
  )
}

// --------------------------------------
// 렌더러 크기 조정
// --------------------------------------

function resizeRenderer() {
  const viewerElement = viewer.value

  if (
    !viewerElement ||
    !camera ||
    !renderer
  ) {
    return
  }

  const width =
    viewerElement.clientWidth

  const height =
    viewerElement.clientHeight

  if (width === 0 || height === 0) {
    return
  }

  /*
   * 카메라의 시점은 유지하고
   * 렌더링 영역의 비율만 갱신한다.
   */
  camera.aspect = width / height
  camera.updateProjectionMatrix()

  renderer.setSize(
    width,
    height,
    false,
  )
}

// --------------------------------------
// 렌더링 반복
// --------------------------------------

function animate() {
  animationFrameId =
    requestAnimationFrame(animate)

  orbitControls?.update()

  if (
    renderer &&
    scene &&
    camera
  ) {
    renderer.render(
      scene,
      camera,
    )
  }
}

// --------------------------------------
// 전체 자원 정리
// --------------------------------------

function disposeThree() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(
      animationFrameId,
    )
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
// 선분 길이 변화 감지
// --------------------------------------

watch(
  () => [
    props.lengths.AO,
    props.lengths.AB,
    props.lengths.AC,
  ],
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

  resizeObserver =
    new ResizeObserver(() => {
      resizeRenderer()
    })

  if (viewer.value) {
    resizeObserver.observe(
      viewer.value,
    )
  }
})

onBeforeUnmount(() => {
  disposeThree()
})
</script>

<template>
  <section
    id="invariance-viewer"
    ref="viewer"
  >
    <p class="invariance-guide">
      드래그: 회전 · 휠: 확대/축소
    </p>
  </section>
</template>

<style scoped>
#invariance-viewer {
  position: relative;

  width: 100%;
  height: 100%;

  min-width: 0;
  min-height: 0;

  overflow: hidden;
}

.invariance-guide {
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