<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  route: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits([
  'hover-point',
  'leave',
])

const mode = ref('time')
const hoveredPoint = ref(null)
const pointerRatio = ref(null)

const axisPoints = computed(() =>
  props.route.filter((point) =>
    Number.isFinite(getAxisValue(point)),
  ),
)

const axisRange = computed(() => {
  if (axisPoints.value.length === 0) {
    return null
  }

  return {
    min: getAxisValue(axisPoints.value[0]),
    max: getAxisValue(axisPoints.value.at(-1)),
  }
})

const ticks = computed(() => {
  if (!axisRange.value) {
    return []
  }

  const { min, max } = axisRange.value
  const count = 5

  if (min === max) {
    return [
      {
        value: min,
        ratio: 0,
        label: formatAxisValue(min),
      },
    ]
  }

  return Array.from(
    { length: count },
    (_, index) => {
      const ratio = index / (count - 1)
      const value = min + (max - min) * ratio

      return {
        value,
        ratio,
        label: formatAxisValue(value),
      }
    },
  )
})

const indicatorStyle = computed(() => {
  if (pointerRatio.value === null) {
    return {}
  }

  return {
    left: `${pointerRatio.value * 100}%`,
  }
})

const tooltipClass = computed(() => {
  if (pointerRatio.value === null) {
    return ''
  }

  if (pointerRatio.value < 0.2) {
    return 'route-details-left'
  }

  if (pointerRatio.value > 0.8) {
    return 'route-details-right'
  }

  return 'route-details-center'
})

function getAxisValue(point) {
  if (mode.value === 'distance') {
    return Number(point.cumulativeDistance)
  }

  if (!point.timestamp) {
    return Number.NaN
  }

  return new Date(point.timestamp).getTime()
}

function formatAxisValue(value) {
  if (mode.value === 'distance') {
    return `${(value / 1000).toFixed(1)} km`
  }

  return new Date(value).toLocaleTimeString(
    'ko-KR',
    {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    },
  )
}

function formatTime(timestamp) {
  if (!timestamp) {
    return '-'
  }

  return new Date(timestamp).toLocaleTimeString(
    'ko-KR',
    {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    },
  )
}

function formatSpeed(speed) {
  if (!Number.isFinite(speed)) {
    return '-'
  }

  return `${(speed * 3.6).toFixed(1)} km/h`
}

function formatDistance(distance) {
  if (!Number.isFinite(distance)) {
    return '-'
  }

  return `${(distance / 1000).toFixed(2)} km`
}

function findNearestPoint(target) {
  const points = axisPoints.value

  if (points.length === 0) {
    return null
  }

  let low = 0
  let high = points.length - 1

  while (low < high) {
    const mid = Math.floor((low + high) / 2)

    if (getAxisValue(points[mid]) < target) {
      low = mid + 1
    } else {
      high = mid
    }
  }

  if (low === 0) {
    return points[0]
  }

  const current = points[low]
  const previous = points[low - 1]

  return (
    Math.abs(getAxisValue(current) - target)
    < Math.abs(getAxisValue(previous) - target)
  )
    ? current
    : previous
}

function selectMode(nextMode) {
  if (mode.value === nextMode) {
    return
  }

  mode.value = nextMode
  clearHover()
}

function handlePointerMove(event) {
  if (!axisRange.value) {
    return
  }

  const bounds =
    event.currentTarget.getBoundingClientRect()

  if (bounds.width === 0) {
    return
  }

  const ratio = Math.min(
    1,
    Math.max(
      0,
      (event.clientX - bounds.left)
        / bounds.width,
    ),
  )

  const { min, max } = axisRange.value
  const target = min + (max - min) * ratio
  const point = findNearestPoint(target)

  if (!point) {
    return
  }

  const pointValue = getAxisValue(point)
  const pointRatio = max === min
    ? 0
    : (pointValue - min) / (max - min)

  pointerRatio.value = pointRatio
  hoveredPoint.value = point

  emit('hover-point', point)
}

function clearHover() {
  pointerRatio.value = null
  hoveredPoint.value = null

  emit('leave')
}
</script>

<template>
  <div class="route-timeline map-control">
    <div class="timeline-header">
      <div
        class="timeline-mode"
        role="group"
        aria-label="경로 탐색 기준"
      >
        <button
          class="mode-button"
          :class="{ active: mode === 'time' }"
          type="button"
          @click="selectMode('time')"
        >
          시간
        </button>

        <button
          class="mode-button"
          :class="{ active: mode === 'distance' }"
          type="button"
          @click="selectMode('distance')"
        >
          누적거리
        </button>
      </div>
    </div>

    <div
      class="timeline-track"
      @pointermove="handlePointerMove"
      @pointerleave="clearHover"
    >
      <div
        v-if="hoveredPoint"
        class="route-details"
        :class="tooltipClass"
        :style="indicatorStyle"
      >
        <div class="detail-item">
          <span class="detail-label">위도</span>
          <strong>
            {{ hoveredPoint.latitude.toFixed(6) }}
          </strong>
        </div>

        <div class="detail-item">
          <span class="detail-label">경도</span>
          <strong>
            {{ hoveredPoint.longitude.toFixed(6) }}
          </strong>
        </div>

        <div class="detail-item">
          <span class="detail-label">시간</span>
          <strong>
            {{ formatTime(hoveredPoint.timestamp) }}
          </strong>
        </div>

        <div class="detail-item">
          <span class="detail-label">속도</span>
          <strong>
            {{ formatSpeed(hoveredPoint.speed) }}
          </strong>
        </div>

        <div class="detail-item">
          <span class="detail-label">누적거리</span>
          <strong>
            {{ formatDistance(hoveredPoint.cumulativeDistance) }}
          </strong>
        </div>
      </div>

      <div class="track-line"></div>

      <div
        v-if="hoveredPoint"
        class="timeline-indicator"
        :style="indicatorStyle"
      ></div>

      <div
        v-for="tick in ticks"
        :key="tick.value"
        class="timeline-tick"
        :style="{ left: `${tick.ratio * 100}%` }"
      >
        <span class="tick-mark"></span>
        <span class="tick-label">
          {{ tick.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.map-control {
  border: var(--border-default);
  border-radius: var(--radius-m);

  background: var(--color-background);

  color: var(--color-text-content);
  font-family: var(--font-family-content);
  font-size: var(--font-size-s);
}

.route-timeline {
  position: absolute;
  right: var(--space-m);
  bottom: var(--space-m);
  left: var(--space-m);
  z-index: 10;

  padding:
    var(--space-s)
    var(--space-m)
    var(--space-m);
}

.timeline-header {
  display: flex;
  justify-content: flex-start;

  margin-bottom: var(--space-m);
}

.timeline-mode {
  display: inline-flex;

  overflow: hidden;

  border: var(--border-default);
  border-radius: var(--radius-s);
}

.mode-button {
  padding:
    calc(var(--space-s) / 2)
    var(--space-s);

  border: 0;

  background: var(--color-background);

  color: var(--color-text-sub);
  font: inherit;
  font-weight: var(--font-weight-semibold);

  cursor: pointer;
}

.mode-button + .mode-button {
  border-left: var(--border-default);
}

.mode-button.active {
  background: #FEE500;
  color: #191919;
}

.timeline-track {
  position: relative;

  height: 34px;

  cursor: crosshair;
  touch-action: pan-y;
}

.track-line {
  position: absolute;
  top: 8px;
  right: 0;
  left: 0;

  height: 3px;

  border-radius: 999px;

  background: #333333;
}

.timeline-tick {
  position: absolute;
  top: 4px;

  display: flex;
  flex-direction: column;
  align-items: center;

  transform: translateX(-50%);

  pointer-events: none;
}

.tick-mark {
  width: 2px;
  height: 11px;

  background: #333333;
}

.tick-label {
  margin-top: 4px;

  color: var(--color-text-sub);
  font-size: 0.75rem;
  font-weight: var(--font-weight-semibold);
  white-space: nowrap;
}

.timeline-indicator {
  position: absolute;
  top: -4px;
  bottom: 14px;
  z-index: 2;

  width: 2px;

  background: #FEE500;

  transform: translateX(-50%);

  pointer-events: none;
}

.route-details {
  position: absolute;
  bottom: calc(100% + var(--space-s));
  z-index: 3;

  display: grid;
  grid-template-columns: repeat(5, max-content);
  gap: var(--space-m);

  max-width:
    calc(100% - var(--space-m));
  padding: var(--space-s) var(--space-m);

  border: var(--border-default);
  border-radius: var(--radius-m);

  background: var(--color-background);

  box-shadow:
    0 2px 8px rgb(15 23 42 / 18%);

  white-space: nowrap;

  pointer-events: none;
}

.route-details-center {
  transform: translateX(-50%);
}

.route-details-left {
  transform: translateX(0);
}

.route-details-right {
  transform: translateX(-100%);
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.detail-label {
  color: var(--color-text-sub);
  font-size: 0.75rem;
  font-weight: var(--font-weight-regular);
}

.detail-item strong {
  color: var(--color-text-content);
  font-weight: var(--font-weight-semibold);
}

@media (max-width: 640px) {
  .route-details {
    grid-template-columns: repeat(2, max-content);
    gap: var(--space-s) var(--space-m);
  }

  .tick-label {
    font-size: 0.6875rem;
  }
}
</style>
