<script setup>
const latitude1 = defineModel('latitude1', {
  type: Number,
  required: true,
})

const longitude1 = defineModel('longitude1', {
  type: Number,
  required: true,
})

const latitude2 = defineModel('latitude2', {
  type: Number,
  required: true,
})

const longitude2 = defineModel('longitude2', {
  type: Number,
  required: true,
})

// 미세 조정 소수점 자릿수
const FINE_DIGITS = 5

const FINE_STEP = 10 ** -FINE_DIGITS

function adjustCoordinate(value, step, min, max) {
  const nextValue = Math.min(max, Math.max(min, value + step))

  return Number(nextValue.toFixed(FINE_DIGITS))
}
</script>

<template>
  <div class="control-group">
    <label for="latitude-1">
      <span>P₁ 위도(φ₁)</span>

      <div class="value-control">
        <button type="button" @click="latitude1 = adjustCoordinate(latitude1, -FINE_STEP, -90, 90)">
          −
        </button>

        <output>{{ latitude1.toFixed(FINE_DIGITS) }}°</output>

        <button type="button" @click="latitude1 = adjustCoordinate(latitude1, FINE_STEP, -90, 90)">
          +
        </button>
      </div>
    </label>

    <input id="latitude-1" v-model.number="latitude1" type="range" min="-90" max="90" step="1" />
  </div>

  <div class="control-group">
    <label for="longitude-1">
      <span>P₁ 경도(λ₁)</span>

      <div class="value-control">
        <button
          type="button"
          @click="longitude1 = adjustCoordinate(longitude1, -FINE_STEP, -180, 180)"
        >
          −
        </button>

        <output>{{ longitude1.toFixed(FINE_DIGITS) }}°</output>

        <button
          type="button"
          @click="longitude1 = adjustCoordinate(longitude1, FINE_STEP, -180, 180)"
        >
          +
        </button>
      </div>
    </label>

    <input
      id="longitude-1"
      v-model.number="longitude1"
      type="range"
      min="-180"
      max="180"
      step="1"
    />
  </div>

  <div class="control-group">
    <label for="latitude-2">
      <span>P₂ 위도(φ₂)</span>

      <div class="value-control">
        <button type="button" @click="latitude2 = adjustCoordinate(latitude2, -FINE_STEP, -90, 90)">
          −
        </button>

        <output>{{ latitude2.toFixed(FINE_DIGITS) }}°</output>

        <button type="button" @click="latitude2 = adjustCoordinate(latitude2, FINE_STEP, -90, 90)">
          +
        </button>
      </div>
    </label>

    <input id="latitude-2" v-model.number="latitude2" type="range" min="-90" max="90" step="1" />
  </div>

  <div class="control-group">
    <label for="longitude-2">
      <span>P₂ 경도(λ₂)</span>

      <div class="value-control">
        <button
          type="button"
          @click="longitude2 = adjustCoordinate(longitude2, -FINE_STEP, -180, 180)"
        >
          −
        </button>

        <output>{{ longitude2.toFixed(FINE_DIGITS) }}°</output>

        <button
          type="button"
          @click="longitude2 = adjustCoordinate(longitude2, FINE_STEP, -180, 180)"
        >
          +
        </button>
      </div>
    </label>

    <input
      id="longitude-2"
      v-model.number="longitude2"
      type="range"
      min="-180"
      max="180"
      step="1"
    />
  </div>
</template>

<style scoped>
.control-group {
  margin-bottom: 16px;
}

.control-group label {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 6px;

  color: #334155;
  font-size: 16px;
  font-weight: 700;
}

.control-group output {
  min-width: 64px;

  color: #2563eb;
  font-variant-numeric: tabular-nums;
  text-align: right;
}

.control-group input {
  width: 100%;

  cursor: pointer;
}

.value-control {
  display: flex;
  align-items: center;
  gap: 6px;
}

.value-control output {
  min-width: 68px;
}

.value-control button {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 26px;
  height: 26px;
  padding: 0;

  border: 1px solid #cbd5e1;
  border-radius: 6px;

  background: #ffffff;
  color: #2563eb;

  font-size: 18px;
  font-weight: 700;
  line-height: 1;

  cursor: pointer;
}

.value-control button:hover {
  background: #eff6ff;
}
</style>
