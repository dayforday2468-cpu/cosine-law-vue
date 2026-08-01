<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { calculateGeometry } from '../../utils/geometry.js'

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
// 점 생성
// --------------------------------------

function createPoint(position, color) {
  const geometry = new THREE.SphereGeometry(0.065, 12, 12)

  const material = new THREE.MeshStandardMaterial({
    color,
  })

  const point = new THREE.Mesh(geometry, material)

  point.position.copy(position)

  return point
}

// --------------------------------------
// 선 생성
// --------------------------------------

function createLine(start, end, color, opacity = 1) {
  const geometry = new THREE.BufferGeometry().setFromPoints([start, end])

  const material = new THREE.LineBasicMaterial({
    color,
    transparent: opacity < 1,
    opacity,
  })

  return new THREE.Line(geometry, material)
}

// --------------------------------------
// 삼각형 면 생성
// --------------------------------------

function createFace(a, b, c, color, opacity) {
  const geometry = new THREE.BufferGeometry()

  const vertices = new Float32Array([a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z])

  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))

  geometry.computeVertexNormals()

  const material = new THREE.MeshStandardMaterial({
    color,
    transparent: true,
    opacity,
    side: THREE.DoubleSide,
    depthWrite: false,
  })

  return new THREE.Mesh(geometry, material)
}

// --------------------------------------
// 문자 라벨 생성
// --------------------------------------

function createLabel(text, position, color = '#111827', size = 0.28) {
  const canvas = document.createElement('canvas')

  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Canvas 2D context를 생성할 수 없습니다.')
  }

  const fontSize = 56
  const horizontalPadding = 28

  context.font = `bold ${fontSize}px Arial`

  const textWidth = Math.ceil(context.measureText(text).width)

  canvas.width = Math.max(128, textWidth + horizontalPadding * 2)

  canvas.height = 128

  /*
   * canvas의 크기를 변경하면 context 설정이
   * 초기화되므로 다시 지정한다.
   */
  context.clearRect(0, 0, canvas.width, canvas.height)

  context.fillStyle = color
  context.font = `bold ${fontSize}px Arial`
  context.textAlign = 'center'
  context.textBaseline = 'middle'

  context.fillText(text, canvas.width / 2, canvas.height / 2)

  const texture = new THREE.CanvasTexture(canvas)

  texture.needsUpdate = true

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,

    /*
     * 다른 면 뒤에 있어도
     * 라벨이 보이도록 한다.
     */
    depthTest: false,
  })

  const label = new THREE.Sprite(material)

  const aspectRatio = canvas.width / canvas.height

  label.position.copy(position)

  label.scale.set(size * aspectRatio, size, 1)

  label.renderOrder = 20

  return label
}

// --------------------------------------
// 각도 원호 생성
// --------------------------------------

function createAngleArc(vertex, point1, point2, radius, color, segments = 64) {
  const direction1 = point1.clone().sub(vertex).normalize()

  const direction2 = point2.clone().sub(vertex).normalize()

  const dot = THREE.MathUtils.clamp(direction1.dot(direction2), -1, 1)

  const angle = Math.acos(dot)

  const points = []

  if (angle < 1e-7) {
    points.push(vertex.clone().add(direction1.clone().multiplyScalar(radius)))
  } else {
    let axis = new THREE.Vector3().crossVectors(direction1, direction2)

    /*
     * 두 벡터가 반대 방향이면 외적이 0이 된다.
     * 이 경우 임의의 수직축을 만든다.
     */
    if (axis.lengthSq() < 1e-10) {
      axis = new THREE.Vector3(1, 0, 0).cross(direction1)

      if (axis.lengthSq() < 1e-10) {
        axis = new THREE.Vector3(0, 1, 0).cross(direction1)
      }
    }

    axis.normalize()

    for (let index = 0; index <= segments; index += 1) {
      const ratio = index / segments

      const direction = direction1
        .clone()
        .applyAxisAngle(axis, angle * ratio)
        .normalize()

      const point = vertex.clone().add(direction.multiplyScalar(radius))

      points.push(point)
    }
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points)

  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.95,

    /*
     * 삼각형 면에 가려지지 않도록 한다.
     */
    depthTest: false,
  })

  const arc = new THREE.Line(geometry, material)

  arc.renderOrder = 15

  return arc
}

// --------------------------------------
// 각도 라벨 위치 계산
// --------------------------------------

function getAngleLabelPosition(vertex, point1, point2, radius) {
  const direction1 = point1.clone().sub(vertex).normalize()

  const direction2 = point2.clone().sub(vertex).normalize()

  /*
   * 두 단위벡터의 합은
   * 두 방향 사이의 이등분선 방향이다.
   */
  let bisector = direction1.clone().add(direction2)

  if (bisector.lengthSq() < 1e-10) {
    bisector = new THREE.Vector3(1, 0, 0).cross(direction1)

    if (bisector.lengthSq() < 1e-10) {
      bisector = new THREE.Vector3(0, 1, 0).cross(direction1)
    }
  }

  return vertex.clone().add(bisector.normalize().multiplyScalar(radius))
}

// --------------------------------------
// 객체 메모리 정리
// --------------------------------------

function disposeObject(object) {
  object.geometry?.dispose()

  if (Array.isArray(object.material)) {
    object.material.forEach((material) => {
      material.map?.dispose()
      material.dispose()
    })

    return
  }

  object.material?.map?.dispose()
  object.material?.dispose()
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
    createLabel('x', new THREE.Vector3(2.7, 0, 0), '#ef4444', 0.32),

    createLabel('y', new THREE.Vector3(0, 2.7, 0), '#16a34a', 0.32),

    createLabel('z', new THREE.Vector3(0, 0, 2.7), '#2563eb', 0.32),
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
    createLabel(`θ₁`, getAngleLabelPosition(O, B, C, 0.5), '#7c3aed', 0.2),

    createLabel(`θ₂`, getAngleLabelPosition(A, O, B, 0.29), '#2563eb', 0.18),

    createLabel(`θ₃`, getAngleLabelPosition(A, O, C, 0.4), '#059669', 0.18),

    createLabel(`∠CAB`, getAngleLabelPosition(A, C, B, 0.57), '#d97706', 0.18),
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