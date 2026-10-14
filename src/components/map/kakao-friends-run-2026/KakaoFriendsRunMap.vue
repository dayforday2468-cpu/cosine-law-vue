<script setup>
import KakaoMap from '@/components/map/KakaoMap.vue'
import { MapFrame } from '@/components/map/common'

const STADIUM = {
  latitude: 37.4102555,
  longitude: 127.1212958,
}

const MAP_LEVEL = 4
</script>

<template>
  <MapFrame caption="카카오프렌즈 런 2026 코스">
    <KakaoMap
      :latitude="STADIUM.latitude"
      :longitude="STADIUM.longitude"
      :level="MAP_LEVEL"
    />
  </MapFrame>
</template>
