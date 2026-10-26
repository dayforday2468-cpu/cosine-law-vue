<script setup>
import { onBeforeUnmount } from 'vue'

import {
  RouteTimeline,
} from '@/components/map/common'
import { createRunPhotoData } from '@/data/article-media/kakao-friends-run-2026'
import photoMarkerData from '@/data/map/kakao-friends-run-2026/photo-markers.json'
import routeData from '@/data/map/kakao-friends-run-2026/route.json'

import { usePhotoMarkers } from './usePhotoMarkers'

const STADIUM = {
  latitude: 37.4102555,
  longitude: 127.1212958,
}

const MAP_LEVEL = 4

const photoData = createRunPhotoData(
  photoMarkerData,
)

const routeAxes = [
  {
    key: 'timestamp',
    label: '시간',
    parser: parseTimeValue,
    formatter: formatTimeTick,
  },
  {
    key: 'cumulativeDistance',
    label: '누적거리',
    formatter: formatDistanceTick,
  },
]

const routeFields = [
  {
    key: 'latitude',
    label: '위도',
    formatter: formatCoordinate,
  },
  {
    key: 'longitude',
    label: '경도',
    formatter: formatCoordinate,
  },
  {
    key: 'timestamp',
    label: '시간',
    formatter: formatTime,
  },
  {
    key: 'speed',
    label: '속도',
    formatter: formatSpeed,
  },
  {
    key: 'cumulativeDistance',
    label: '누적거리',
    formatter: formatDistance,
  },
]

let photoLayer = null

function parseTimeValue(value) {
  if (!value) {
    return Number.NaN
  }

  return new Date(value).getTime()
}

function formatTimeTick(value) {
  return new Date(value).toLocaleTimeString(
    'ko-KR',
    {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    },
  )
}

function formatDistanceTick(value) {
  return `${(value / 1000).toFixed(1)} km`
}

function formatCoordinate(value) {
  if (!Number.isFinite(value)) {
    return '-'
  }

  return value.toFixed(6)
}

function formatTime(value) {
  if (!value) {
    return '-'
  }

  return new Date(value).toLocaleTimeString(
    'ko-KR',
    {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    },
  )
}

function formatSpeed(value) {
  if (!Number.isFinite(value)) {
    return '-'
  }

  return `${(value * 3.6).toFixed(1)} km/h`
}

function formatDistance(value) {
  if (!Number.isFinite(value)) {
    return '-'
  }

  return `${(value / 1000).toFixed(2)} km`
}

function handleMapReady({ map, maps }) {
  photoLayer?.destroy()

  photoLayer = usePhotoMarkers({
    map,
    maps,
    photos: photoData,
  })
}

onBeforeUnmount(() => {
  photoLayer?.destroy()
})
</script>

<template>
  <RouteTimeline
    :route="routeData"
    :latitude="STADIUM.latitude"
    :longitude="STADIUM.longitude"
    :level="MAP_LEVEL"
    :axes="routeAxes"
    :fields="routeFields"
    caption="카카오프렌즈 런 2026 코스"
    @ready="handleMapReady"
  />
</template>
