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

const ROUTE_STYLE = {
  strokeWeight: 6,
  strokeColor: '#FEE500',
  strokeOpacity: 0.95,
  strokeStyle: 'solid',
}

let routePolyline = null

function handleMapReady({ map, maps }) {
  const path = mapData.route.map(
    ({ latitude, longitude }) =>
      new maps.LatLng(latitude, longitude),
  )

  routePolyline = new maps.Polyline({
    map,
    path,
    ...ROUTE_STYLE,
  })
}

onBeforeUnmount(() => {
  routePolyline?.setMap(null)
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
