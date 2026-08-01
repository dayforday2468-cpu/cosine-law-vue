import * as THREE from 'three'

// --------------------------------------
// 점 생성
// --------------------------------------

export function createPoint(position, color, radius = 0.065) {
  const geometry = new THREE.SphereGeometry(radius, 12, 12)

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

export function createLine(start, end, color, opacity = 1) {
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

export function createFace(a, b, c, color, opacity) {
  const geometry = new THREE.BufferGeometry()

  const vertices = new Float32Array([a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z])

  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))

  geometry.computeVertexNormals()

  const material = new THREE.MeshStandardMaterial({
    color,
    transparent: opacity < 1,
    opacity,
    side: THREE.DoubleSide,
    depthWrite: false,
  })

  return new THREE.Mesh(geometry, material)
}

// --------------------------------------
// 라벨 생성
// --------------------------------------

export function createLabel(
  text,
  position,
  { fontSize = 48, fontFamily = 'Arial', textColor = '#0f172a', padding = 16, scale = 0.35 } = {},
) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Canvas 2D context를 생성할 수 없습니다.')
  }

  context.font = `${fontSize}px ${fontFamily}`

  const textMetrics = context.measureText(text)
  const textWidth = Math.ceil(textMetrics.width)

  canvas.width = textWidth + padding * 2
  canvas.height = fontSize + padding * 2

  // canvas 크기를 바꾸면 context 상태가 초기화되므로 다시 지정한다.
  context.font = `${fontSize}px ${fontFamily}`
  context.textAlign = 'center'
  context.textBaseline = 'middle'

  context.fillStyle = textColor
  context.fillText(text, canvas.width / 2, canvas.height / 2)

  const texture = new THREE.CanvasTexture(canvas)

  texture.needsUpdate = true

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
  })

  const label = new THREE.Sprite(material)

  const aspectRatio = canvas.width / canvas.height

  label.scale.set(scale * aspectRatio, scale, 1)

  label.position.copy(position)

  return label
}

// --------------------------------------
// 각도 원호 생성
// --------------------------------------

export function createAngleArc(vertex, point1, point2, radius, color, segments = 64) {
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
     * 두 방향이 서로 반대라면 외적의 길이가 0이 된다.
     * 이 경우 direction1에 수직인 임의의 회전축을 만든다.
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
    depthTest: false,
  })

  const arc = new THREE.Line(geometry, material)

  arc.renderOrder = 15

  return arc
}

// --------------------------------------
// 각도 라벨 위치 계산
// --------------------------------------

export function getAngleLabelPosition(vertex, point1, point2, radius) {
  const direction1 = point1.clone().sub(vertex).normalize()

  const direction2 = point2.clone().sub(vertex).normalize()

  /*
   * 두 단위벡터의 합은 두 방향 사이의
   * 내부각 이등분선 방향이 된다.
   */
  let bisector = direction1.clone().add(direction2)

  /*
   * 두 방향이 서로 반대라면 합이 0이므로
   * direction1에 수직인 임의의 방향을 사용한다.
   */
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

export function disposeObject(object) {
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
