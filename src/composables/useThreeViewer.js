import { ref } from 'vue'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { createLabel, disposeObject } from '../utils/threeGeometry.js'

export function useThreeViewer() {
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

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)

    camera.position.set(3.7, 3.4, 5.0)

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
       * ResizeObserver는 observe 직후에도 한 번 실행될 수 있다.
       * 실제 크기가 바뀌지 않았다면 resize 처리를 시작하지 않는다.
       */
      if (width === previousWidth && height === previousHeight) {
        return
      }

      isResizing.value = true

      /*
       * 이전 타이머가 남아 있다면 취소한다.
       * resize가 계속 발생할 때마다 대기 시간을 다시 시작한다.
       */
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
