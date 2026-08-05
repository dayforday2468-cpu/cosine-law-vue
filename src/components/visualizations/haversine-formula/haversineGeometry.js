import * as THREE from 'three'

// Three.js 시각화에서 사용할 지구 반지름
export const EARTH_RADIUS = 1

// 실제 거리 계산에서 사용할 지구 평균 반지름 (km)
export const EARTH_RADIUS_KM = 6371

/**
 * 위도/경도를 Three.js 구면 위의 좌표로 변환한다.
 *
 * 좌표계:
 * - +y: 북극
 * - (위도 0°, 경도 0°): +x
 *
 * @param {number} latitude 위도 (degree)
 * @param {number} longitude 경도 (degree)
 * @param {number} radius 구의 반지름
 * @returns {THREE.Vector3}
 */
export function latLonToVector3(latitude, longitude, radius = EARTH_RADIUS) {
  const phi = THREE.MathUtils.degToRad(latitude)
  const lambda = THREE.MathUtils.degToRad(longitude)

  return new THREE.Vector3(
    radius * Math.cos(phi) * Math.cos(lambda),
    radius * Math.sin(phi),
    radius * Math.cos(phi) * Math.sin(lambda),
  )
}

export function calculateHaversineGeometry(latitude1, longitude1, latitude2, longitude2) {
  const O = new THREE.Vector3(0, 0, 0)
  const N = new THREE.Vector3(0, EARTH_RADIUS, 0)

  const P1 = latLonToVector3(latitude1, longitude1, EARTH_RADIUS)
  const P2 = latLonToVector3(latitude2, longitude2, EARTH_RADIUS)

  const Q1 = latLonToVector3(0, longitude1, EARTH_RADIUS)
  const Q2 = latLonToVector3(0, longitude2, EARTH_RADIUS)

  const rayLength = 1.6

  const northDirection = new THREE.Vector3(0, 1, 0)
  const direction1 = P1.clone().normalize()
  const direction2 = P2.clone().normalize()

  const northExtended = northDirection.clone().multiplyScalar(rayLength)
  const P1Extended = direction1.clone().multiplyScalar(rayLength)
  const P2Extended = direction2.clone().multiplyScalar(rayLength)

  return {
    O,
    N,
    P1,
    P2,
    northExtended,
    P1Extended,
    P2Extended,

    Q1,
    Q2,
  }
}

/**
 * 구면 코사인 법칙을 이용해 두 지점 사이의 중심각을 계산한다.
 *
 * @returns {number} 중심각 (radian)
 */
export function calculateSphericalCosineAngle(latitude1, longitude1, latitude2, longitude2) {
  const phi1 = THREE.MathUtils.degToRad(latitude1)
  const phi2 = THREE.MathUtils.degToRad(latitude2)
  const deltaLambda = THREE.MathUtils.degToRad(longitude2 - longitude1)

  const cosAngle =
    Math.sin(phi1) * Math.sin(phi2) + Math.cos(phi1) * Math.cos(phi2) * Math.cos(deltaLambda)

  // 부동소수점 오차로 acos의 입력 범위 [-1, 1]을 벗어나는 것을 방지
  const clampedCosAngle = THREE.MathUtils.clamp(cosAngle, -1, 1)

  return Math.acos(clampedCosAngle)
}

/**
 * Haversine 공식을 이용해 두 지점 사이의 중심각을 계산한다.
 *
 * @returns {number} 중심각 (radian)
 */
export function calculateHaversineAngle(latitude1, longitude1, latitude2, longitude2) {
  const phi1 = THREE.MathUtils.degToRad(latitude1)
  const phi2 = THREE.MathUtils.degToRad(latitude2)

  const deltaPhi = THREE.MathUtils.degToRad(latitude2 - latitude1)
  const deltaLambda = THREE.MathUtils.degToRad(longitude2 - longitude1)

  const haversine =
    Math.sin(deltaPhi / 2) ** 2 + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2

  // 부동소수점 오차로 [0, 1]을 벗어나는 경우 방지
  const clampedHaversine = THREE.MathUtils.clamp(haversine, 0, 1)

  return 2 * Math.atan2(Math.sqrt(clampedHaversine), Math.sqrt(1 - clampedHaversine))
}

/**
 * 구면 코사인 법칙으로 두 지점 사이의 대권거리를 계산한다.
 *
 * @returns {number} 거리
 */
export function calculateSphericalCosineDistance(
  latitude1,
  longitude1,
  latitude2,
  longitude2,
  radius = EARTH_RADIUS_KM,
) {
  const angle = calculateSphericalCosineAngle(latitude1, longitude1, latitude2, longitude2)

  return radius * angle
}

/**
 * Haversine 공식으로 두 지점 사이의 대권거리를 계산한다.
 *
 * @returns {number} 거리
 */
export function calculateHaversineDistance(
  latitude1,
  longitude1,
  latitude2,
  longitude2,
  radius = EARTH_RADIUS_KM,
) {
  const angle = calculateHaversineAngle(latitude1, longitude1, latitude2, longitude2)

  return radius * angle
}
