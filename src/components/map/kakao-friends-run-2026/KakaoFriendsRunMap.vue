<script setup>
import { onBeforeUnmount } from 'vue'

import KakaoMap from '@/components/map/KakaoMap.vue'
import { MapFrame } from '@/components/map/common'
import mapData from '@/data/map/map_data.json'

const STADIUM = {
  latitude: 37.4102555,
  longitude: 127.1212958,
}

const MAP_LEVEL = 4

const ROUTE_OUTLINE_STYLE = {
  strokeWeight: 8,
  strokeColor: '#333333',
  strokeOpacity: 0.9,
  strokeStyle: 'solid',
}

const ROUTE_STYLE = {
  strokeWeight: 5,
  strokeColor: '#FEE500',
  strokeOpacity: 1,
  strokeStyle: 'solid',
}

const START_POINT_STYLE = {
  radius: 10,
  strokeWeight: 3,
  strokeColor: '#ffffff',
  strokeOpacity: 1,
  fillColor: '#22c55e',
  fillOpacity: 1,
}

const END_POINT_STYLE = {
  radius: 10,
  strokeWeight: 3,
  strokeColor: '#ffffff',
  strokeOpacity: 1,
  fillColor: '#ef4444',
  fillOpacity: 1,
}

let routeOutline = null
let routePolyline = null
let startPoint = null
let endPoint = null

function handleMapReady({ map, maps }) {
  const path = mapData.route.map(
    ({ latitude, longitude }) =>
      new maps.LatLng(latitude, longitude),
  )

  routeOutline = new maps.Polyline({
    map,
    path,
    ...ROUTE_OUTLINE_STYLE,
  })

  routePolyline = new maps.Polyline({
    map,
    path,
    ...ROUTE_STYLE,
  })

  startPoint = new maps.Circle({
    map,
    center: path[0],
    ...START_POINT_STYLE,
  })

  endPoint = new maps.Circle({
    map,
    center: path.at(-1),
    ...END_POINT_STYLE,
  })
}

onBeforeUnmount(() => {
  routeOutline?.setMap(null)
  routePolyline?.setMap(null)
  startPoint?.setMap(null)
  endPoint?.setMap(null)
})
</script>

<template>
  <MapFrame caption="카카오프렌즈 런 2026 코스">
    <KakaoMap
      :latitude="STADIUM.latitude"
      :longitude="STADIUM.longitude"
      :level="MAP_LEVEL"
      @ready="handleMapReady"
    />
  </MapFrame>
</template>
