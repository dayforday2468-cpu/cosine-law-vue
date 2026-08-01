import * as THREE from 'three'

const theta1 = THREE.MathUtils.degToRad(90)
const theta2 = THREE.MathUtils.degToRad(45)
const theta3 = THREE.MathUtils.degToRad(30)

const A = new THREE.Vector3(
  1,
  0,
  0,
)

const extensionDistance = 2

const OExtended = new THREE.Vector3(
  -1,
  0,
  0,
)

const BExtended = new THREE.Vector3(
  -1,
  extensionDistance * Math.tan(theta2),
  0,
)

const CExtended = new THREE.Vector3(
  -1,
  extensionDistance * Math.tan(theta3) * Math.cos(theta1),
  extensionDistance * Math.tan(theta3) * Math.sin(theta1),
)

export const invarianceGeometry = {
  A,

  OExtended,
  BExtended,
  CExtended,

  maxLengths: {
    AO: A.distanceTo(OExtended),
    AB: A.distanceTo(BExtended),
    AC: A.distanceTo(CExtended),
  },
}