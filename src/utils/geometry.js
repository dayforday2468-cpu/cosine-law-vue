import * as THREE from 'three'

export function toRadians(degrees) {
  return (degrees * Math.PI) / 180
}

export function extendFromPoint(origin, point, scale) {
  return origin.clone().add(point.clone().sub(origin).multiplyScalar(scale))
}

export function calculateGeometry({ theta1, theta2, theta3, extensionScale = 1.9 }) {
  const t1 = toRadians(theta1)
  const t2 = toRadians(theta2)
  const t3 = toRadians(theta3)

  const O = new THREE.Vector3(0, 0, 0)

  const A = new THREE.Vector3(1, 0, 0)

  const B = new THREE.Vector3(0, Math.tan(t2), 0)

  const C = new THREE.Vector3(0, Math.tan(t3) * Math.cos(t1), Math.tan(t3) * Math.sin(t1))

  /*
   * A를 기준으로 AB와 AC를 연장한다.
   */
  const BExtended = extendFromPoint(A, B, extensionScale)

  const CExtended = extendFromPoint(A, C, extensionScale)

  const OExtended = extendFromPoint(A, O, extensionScale)

  const vectorAB = B.clone().sub(A)
  const vectorAC = C.clone().sub(A)

  const denominator = vectorAB.length() * vectorAC.length()

  const lhs =
    denominator === 0 ? 1 : THREE.MathUtils.clamp(vectorAB.dot(vectorAC) / denominator, -1, 1)

  const rhs = Math.cos(t2) * Math.cos(t3) + Math.sin(t2) * Math.sin(t3) * Math.cos(t1)

  const angleCAB = THREE.MathUtils.radToDeg(Math.acos(lhs))

  return {
    O,
    A,
    B,
    C,
    OExtended,
    BExtended,
    CExtended,

    t1,
    t2,
    t3,

    lhs,
    rhs,
    angleCAB,
  }
}
