<script setup>
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'

import { LoadingOverlay } from '@/components/common'
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
const map = shallowRef(null)
const isLoading = ref(true)

let mapsApi = null
let tilesLoadedHandler = null

onMounted(async () => {
  try {
    mapsApi = await loadKakaoMaps()

    const center = new mapsApi.LatLng(
      props.latitude,
      props.longitude,
    )

    map.value = new mapsApi.Map(mapContainer.value, {
      center,
      level: props.level,
    })

    tilesLoadedHandler = () => {
      isLoading.value = false

      mapsApi.event.removeListener(
        map.value,
        'tilesloaded',
        tilesLoadedHandler,
      )

      tilesLoadedHandler = null
    }

    mapsApi.event.addListener(
      map.value,
      'tilesloaded',
      tilesLoadedHandler,
    )
  } catch (error) {
    isLoading.value = false
    console.error('Failed to initialize Kakao Map:', error)
  }
})

onBeforeUnmount(() => {
  if (mapsApi && map.value && tilesLoadedHandler) {
    mapsApi.event.removeListener(
      map.value,
      'tilesloaded',
      tilesLoadedHandler,
    )
  }
})
</script>

<template>
  <div class="kakao-map-wrapper">
    <div ref="mapContainer" class="kakao-map" />

    <LoadingOverlay
      :visible="isLoading"
      message="지도를 불러오고 있습니다."
    />
  </div>
</template>

<style scoped>
.kakao-map-wrapper {
  position: relative;

  width: 100%;
  height: 480px;
}

.kakao-map {
  width: 100%;
  height: 100%;
}
</style>
