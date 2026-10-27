<script setup>
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  axes: {
    type: Array,
    required: true,
  },
  fields: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits([
  'hover',
  'leave',
])

const selectedAxisKey = ref(
  props.axes[0]?.key ?? null,
)
const hoveredPoint = ref(null)
const pointerRatio = ref(null)
const scrubberRef = ref(null)
const detailLeft = ref(0)
const detailWidth = ref(0)
const fieldWidths = ref([])

const selectedAxis = computed(() =>
  props.axes.find(
    (axis) =>
      axis.key === selectedAxisKey.value,
  ) ?? props.axes[0] ?? null,
)

const axisPoints = computed(() => {
  const axis = selectedAxis.value

  if (!axis) {
    return []
  }

  return props.data.filter((point) =>
    Number.isFinite(
      getAxisValue(point, axis),
    ),
  )
})

const axisRange = computed(() => {
  if (axisPoints.value.length === 0) {
    return null
  }

  const axis = selectedAxis.value

  return {
    min: getAxisValue(
      axisPoints.value[0],
      axis,
    ),
    max: getAxisValue(
      axisPoints.value.at(-1),
      axis,
    ),
  }
})

const ticks = computed(() => {
  if (
    !axisRange.value
    || !selectedAxis.value
  ) {
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

const detailStyle = computed(() => ({
  left: `${detailLeft.value}px`,
  gridTemplateColumns: fieldWidths.value
    .map((width) => `${width}px`)
    .join(' '),
}))

function getValue(target, key) {
  return key
    .split('.')
    .reduce(
      (value, part) =>
        value?.[part],
      target,
    )
}

function getAxisValue(point, axis) {
  const rawValue = getValue(
    point,
    axis.key,
  )

  if (axis.parser) {
    return axis.parser(rawValue)
  }

  return Number(rawValue)
}

function formatAxisValue(value) {
  const axis = selectedAxis.value

  if (!axis) {
    return ''
  }

  if (axis.formatter) {
    return axis.formatter(value)
  }

  return String(value)
}

function formatField(point, field) {
  const value = getValue(
    point,
    field.key,
  )

  if (field.formatter) {
    return field.formatter(value, point)
  }

  if (
    value === null
    || value === undefined
  ) {
    return '-'
  }

  return String(value)
}

function findNearestPoint(target) {
  const points = axisPoints.value
  const axis = selectedAxis.value

  if (
    points.length === 0
    || !axis
  ) {
    return null
  }

  let low = 0
  let high = points.length - 1

  while (low < high) {
    const mid = Math.floor(
      (low + high) / 2,
    )

    if (
      getAxisValue(points[mid], axis)
      < target
    ) {
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
    Math.abs(
      getAxisValue(current, axis)
      - target,
    )
    < Math.abs(
      getAxisValue(previous, axis)
      - target,
    )
  )
    ? current
    : previous
}

function measureTextWidth(
  context,
  text,
  font,
) {
  context.font = font

  return context.measureText(text).width
}

function measureCssLength(value) {
  if (
    !scrubberRef.value
    || !value
  ) {
    return 0
  }

  const probe = document.createElement('div')

  probe.style.position = 'absolute'
  probe.style.visibility = 'hidden'
  probe.style.width = value

  scrubberRef.value.appendChild(probe)

  const width =
    probe.getBoundingClientRect().width

  probe.remove()

  return width
}

function initializeDetailLayout() {
  if (!scrubberRef.value) {
    return
  }

  const canvas =
    document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    return
  }

  const style =
    getComputedStyle(scrubberRef.value)
  const rootStyle =
    getComputedStyle(document.documentElement)

  const rootFontSize =
    Number.parseFloat(rootStyle.fontSize)
    || 16
  const fontFamily = style.fontFamily
  const valueWeight =
    style.getPropertyValue(
      '--font-weight-semibold',
    ).trim()
    || '600'
  const labelWeight =
    style.getPropertyValue(
      '--font-weight-regular',
    ).trim()
    || '400'

  const valueFont =
    `${valueWeight} ${style.fontSize} ${fontFamily}`
  const labelFont =
    `${labelWeight} ${rootFontSize * 0.75}px ${fontFamily}`

  fieldWidths.value = props.fields.map(
    (field) => {
      let width = measureTextWidth(
        context,
        field.label,
        labelFont,
      )

      for (const point of props.data) {
        width = Math.max(
          width,
          measureTextWidth(
            context,
            formatField(point, field),
            valueFont,
          ),
        )
      }

      return Math.ceil(width)
    },
  )

  const gap = measureCssLength(
    style.getPropertyValue('--space-m'),
  )
  const padding = gap
  const borderWidth = 2

  detailWidth.value =
    fieldWidths.value.reduce(
      (sum, width) => sum + width,
      0,
    )
    + Math.max(
      props.fields.length - 1,
      0,
    ) * gap
    + padding * 2
    + borderWidth
}

function updateDetailPosition(trackWidth) {
  if (
    pointerRatio.value === null
    || detailWidth.value === 0
  ) {
    return
  }

  const pointerX =
    trackWidth * pointerRatio.value
  const maxLeft = Math.max(
    trackWidth - detailWidth.value,
    0,
  )

  detailLeft.value = Math.min(
    Math.max(
      pointerX - detailWidth.value / 2,
      0,
    ),
    maxLeft,
  )
}

function selectAxis(axisKey) {
  if (
    selectedAxisKey.value === axisKey
  ) {
    return
  }

  selectedAxisKey.value = axisKey
  clearHover()
}

function handlePointerMove(event) {
  if (
    !axisRange.value
    || !selectedAxis.value
  ) {
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
  const target =
    min + (max - min) * ratio
  const point = findNearestPoint(target)

  if (!point) {
    return
  }

  const pointValue = getAxisValue(
    point,
    selectedAxis.value,
  )

  const pointRatio = max === min
    ? 0
    : (pointValue - min) / (max - min)

  pointerRatio.value = pointRatio
  hoveredPoint.value = point

  updateDetailPosition(bounds.width)

  emit('hover', point)
}

function clearHover() {
  pointerRatio.value = null
  hoveredPoint.value = null

  emit('leave')
}

onMounted(() => {
  initializeDetailLayout()
})
</script>

<template>
  <div
    ref="scrubberRef"
    class="route-scrubber map-control visual-control"
  >
    <div class="scrubber-header">
      <div
        class="axis-selector"
        role="group"
        aria-label="경로 탐색 기준"
      >
        <button
          v-for="axis in axes"
          :key="axis.key"
          class="axis-button visual-control"
          :class="{
            active:
              selectedAxisKey === axis.key,
          }"
          type="button"
          @click="selectAxis(axis.key)"
        >
          {{ axis.label }}
        </button>
      </div>
    </div>

    <div
      class="scrubber-track"
      @pointermove="handlePointerMove"
      @pointerleave="clearHover"
    >
      <div
        v-if="hoveredPoint"
        class="route-details"
        :style="detailStyle"
      >
        <div
          v-for="field in fields"
          :key="field.key"
          class="detail-item"
        >
          <span class="detail-label visual-control-caption">
            {{ field.label }}
          </span>

          <strong class="visual-control-output">
            {{ formatField(
              hoveredPoint,
              field,
            ) }}
          </strong>
        </div>
      </div>

      <div class="track-line"></div>

      <div
        v-if="hoveredPoint"
        class="scrubber-indicator"
        :style="indicatorStyle"
      ></div>

      <div
        v-for="tick in ticks"
        :key="tick.value"
        class="scrubber-tick"
        :style="{
          left: `${tick.ratio * 100}%`,
        }"
      >
        <span class="tick-mark"></span>
        <span class="tick-label visual-control-caption">
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
}

.route-scrubber {
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

.scrubber-header {
  display: flex;
  justify-content: flex-start;

  margin-bottom: var(--space-m);
}

.axis-selector {
  display: inline-flex;

  overflow: hidden;

  border: var(--border-default);
  border-radius: var(--radius-s);
}

.axis-button {
  padding:
    calc(var(--space-s) / 2)
    var(--space-s);

  border: 0;

  background: var(--color-background);

  cursor: pointer;
}

.axis-button + .axis-button {
  border-left: var(--border-default);
}

.axis-button.active {
  background: #FEE500;
  color: #191919;
}

.scrubber-track {
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

.scrubber-tick {
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

  white-space: nowrap;
}

.scrubber-indicator {
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

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}



@media (max-width: 640px) {
  .route-details {
    gap: var(--space-s) var(--space-m);
  }
}
</style>
