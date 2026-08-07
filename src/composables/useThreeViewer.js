import { ref } from 'vue'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { createLabel, disposeObject } from '../utils/threeGeometry.js'

export function useThreeViewer(dimension = '3d') {
  // --------------------------------------
  // Dimension 검증
  // --------------------------------------

  if (dimension !== '2d' && dimension !== '3d') {
    throw new Error(`지원하지 않는 dimension입니다: ${dimension}`)
  }

  // --------------------------------------
  // Viewer DOM
  // --------------------------------------

  const viewer = ref(null)

  // --------------------------------------
  // Resize 상태
  // --------------------------------------

  const isResizing = ref(false)

  const RESIZE_DEBOUNCE_DELAY = 200

  // --------------------------------------
  // 2D Camera 설정
  // --------------------------------------

  /*
   * OrthographicCamera가 보여줄
   * 세로 방향의 절반 크기.
   *
   * top = 3
   * bottom = -3
   * 이므로 세로 범위는 총 6이다.
   */
  const ORTHOGRAPHIC_HALF_HEIGHT = 3

  // --------------------------------------
  // Three.js 상태
  // --------------------------------------

  let scene = null
  let camera = null
  let renderer = null
  let orbitControls = null
  let resizeObserver = null
  let resizeTimerId = null
  let animationFrameId = null
  let model = null

  let previousWidth = 0
  let previousHeight = 0

  // --------------------------------------
  // Model 접근
  // --------------------------------------

  function getModel() {
    return model
  }

  // --------------------------------------
  // Camera 생성
  // --------------------------------------

  function createCamera(width, height) {
    const aspect = width / height

    if (dimension === '2d') {
      camera = new THREE.OrthographicCamera(
        -ORTHOGRAPHIC_HALF_HEIGHT * aspect,
        ORTHOGRAPHIC_HALF_HEIGHT * aspect,
        ORTHOGRAPHIC_HALF_HEIGHT,
        -ORTHOGRAPHIC_HALF_HEIGHT,
        0.1,
        100,
      )

      /*
       * xy 평면을 정면으로 바라본다.
       */
      camera.position.set(0, 0, 10)
      camera.lookAt(0, 0, 0)

      return
    }

    camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100)

    camera.position.set(3.7, 3.4, 5.0)
  }

  // --------------------------------------
  // OrbitControls 생성
  // --------------------------------------

  function createOrbitControls() {
    orbitControls = new OrbitControls(camera, renderer.domElement)

    orbitControls.enableDamping = true
    orbitControls.target.set(0, 0, 0)

    if (dimension === '2d') {
      /*
       * 2D에서는 화면을 회전시키지 않는다.
       * 확대/축소만 허용한다.
       */
      orbitControls.enableRotate = false
      orbitControls.enablePan = false
      orbitControls.enableZoom = true

      orbitControls.minZoom = 0.7
      orbitControls.maxZoom = 3
    } else {
      orbitControls.minDistance = 2
      orbitControls.maxDistance = 12
    }

    orbitControls.update()
  }

  // --------------------------------------
  // Scene 환경 설정
  // --------------------------------------

  function setupSceneEnvironment() {
    /*
     * 2D visualizer에서는
     * 좌표축과 3D 조명이 필요하지 않다.
     */
    if (dimension === '2d') {
      return
    }

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

    previousWidth = width
    previousHeight = height

    // Scene

    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xffffff)

    // Camera

    createCamera(width, height)

    // Renderer

    renderer = new THREE.WebGLRenderer({
      antialias: true,
    })

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    renderer.setSize(width, height, false)

    viewerElement.prepend(renderer.domElement)

    // OrbitControls

    createOrbitControls()

    // Dimension별 Scene 환경

    setupSceneEnvironment()

    // 실제 도형 그룹

    model = new THREE.Group()

    scene.add(model)
  }

  // --------------------------------------
  // Camera 크기 조정
  // --------------------------------------

  function resizeCamera(width, height) {
    const aspect = width / height

    if (dimension === '2d') {
      /*
       * 세로 방향의 표시 범위는 유지하고
       * 화면 비율에 맞춰 가로 범위만 변경한다.
       */
      camera.left = -ORTHOGRAPHIC_HALF_HEIGHT * aspect

      camera.right = ORTHOGRAPHIC_HALF_HEIGHT * aspect

      camera.top = ORTHOGRAPHIC_HALF_HEIGHT

      camera.bottom = -ORTHOGRAPHIC_HALF_HEIGHT

      camera.updateProjectionMatrix()

      return
    }

    /*
     * PerspectiveCamera에서는
     * FOV와 카메라 위치를 유지하고
     * 화면 비율만 변경한다.
     */
    camera.aspect = aspect
    camera.updateProjectionMatrix()
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

    resizeCamera(width, height)

    renderer.setSize(width, height, false)

    previousWidth = width
    previousHeight = height
  }

  // --------------------------------------
  // ResizeObserver 시작
  // --------------------------------------

  function observeResize() {
    const viewerElement = viewer.value

    if (!viewerElement) {
      return
    }

    resizeObserver = new ResizeObserver(() => {
      const width = viewerElement.clientWidth

      const height = viewerElement.clientHeight

      if (width === 0 || height === 0) {
        return
      }

      /*
       * ResizeObserver는 observe 직후에도
       * 한 번 실행될 수 있다.
       */
      if (width === previousWidth && height === previousHeight) {
        return
      }

      isResizing.value = true

      if (resizeTimerId !== null) {
        clearTimeout(resizeTimerId)
      }

      resizeTimerId = window.setTimeout(() => {
        resizeRenderer()

        isResizing.value = false
        resizeTimerId = null
      }, RESIZE_DEBOUNCE_DELAY)
    })

    resizeObserver.observe(viewerElement)
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
  // 전체 자원 정리
  // --------------------------------------

  function disposeThree() {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
    }

    if (resizeTimerId !== null) {
      clearTimeout(resizeTimerId)
    }

    resizeObserver?.disconnect()
    orbitControls?.dispose()

    scene?.traverse((object) => {
      disposeObject(object)
    })

    renderer?.dispose()
    renderer?.domElement.remove()

    isResizing.value = false

    scene = null
    camera = null
    renderer = null
    orbitControls = null
    resizeObserver = null
    resizeTimerId = null
    animationFrameId = null
    model = null

    previousWidth = 0
    previousHeight = 0
  }

  // --------------------------------------
  // 외부에 공개
  // --------------------------------------

  return {
    viewer,
    isResizing,
    getModel,
    initializeThree,
    resizeRenderer,
    observeResize,
    animate,
    clearModel,
    disposeThree,
  }
}
