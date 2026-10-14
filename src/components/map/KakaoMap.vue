<script setup>
import { onMounted, ref } from 'vue'
import { loadKakaoMaps } from '@/lib/kakaoMaps.js'

const props = defineProps({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  level: {
    type: Number,
    default: 4,
  },
})

const mapContainer = ref(null)

onMounted(async () => {
  const maps = await loadKakaoMaps()

  const center = new maps.LatLng(
    props.latitude,
    props.longitude,
  )

  new maps.Map(mapContainer.value, {
    center,
    level: props.level,
  })
})
</script>

<template>
  <div ref="mapContainer" class="kakao-map" />
</template>

<style scoped>
.kakao-map {
  width: 100%;
  height: 480px;
}
</style>
