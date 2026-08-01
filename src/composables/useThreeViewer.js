import { ref } from 'vue'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import {
  createLabel,
  disposeObject,
} from '../utils/threeGeometry.js'

export function useThreeViewer() {
  // --------------------------------------
  // Viewer DOM
  // --------------------------------------

  const viewer = ref(null)

  // --------------------------------------
  // Three.js 상태
  // --------------------------------------

  let scene = null
  let camera = null
  let renderer = null
  let orbitControls = null
  let resizeObserver = null
  let animationFrameId = null
  let model = null

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

    camera.position.set(
      3.35,
      3.1,
      4.55,
    )

    // Renderer

    renderer = new THREE.WebGLRenderer({
      antialias: true,
    })

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        2,
      ),
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
      0,
      0,
      0,
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

    scene.add(
      ambientLight,
    )

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

    scene.add(
      directionalLight,
    )

    // 좌표축

    const axesHelper =
      new THREE.AxesHelper(
        2.5,
      )

    scene.add(
      axesHelper,
    )

    // 좌표축 라벨

    const axisLabels =
      new THREE.Group()

    axisLabels.add(
      createLabel(
        'x',
        new THREE.Vector3(
          2.7,
          0,
          0,
        ),
        {
          textColor: '#ef4444',
          scale: 0.32,
        },
      ),

      createLabel(
        'y',
        new THREE.Vector3(
          0,
          2.7,
          0,
        ),
        {
          textColor: '#16a34a',
          scale: 0.32,
        },
      ),

      createLabel(
        'z',
        new THREE.Vector3(
          0,
          0,
          2.7,
        ),
        {
          textColor: '#2563eb',
          scale: 0.32,
        },
      ),
    )

    scene.add(
      axisLabels,
    )

    // 실제 도형 그룹

    model = new THREE.Group()

    scene.add(
      model,
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
     * FOV와 카메라 위치는 변경하지 않는다.
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
  // ResizeObserver 시작
  // --------------------------------------

  function observeResize() {
    if (!viewer.value) {
      return
    }

    resizeObserver = new ResizeObserver(() => {
      resizeRenderer()
    })

    resizeObserver.observe(
      viewer.value,
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
  // 외부에 공개
  // --------------------------------------

  return {
    viewer,
    getModel,
    initializeThree,
    resizeRenderer,
    observeResize,
    animate,
    disposeThree,
  }
}