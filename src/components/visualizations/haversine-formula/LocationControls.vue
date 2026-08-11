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
  <section class="control-groups">
    <div class="control-group">
      <label class="visualizer-control-label" for="latitude-1">
        <span>P₁ 위도(φ₁)</span>

        <div class="value-control">
          <button
            type="button"
            @click="latitude1 = adjustCoordinate(latitude1, -FINE_STEP, -90, 90)"
          >
            −
          </button>

          <output class="visualizer-control-output">{{ latitude1.toFixed(FINE_DIGITS) }}°</output>

          <button
            type="button"
            @click="latitude1 = adjustCoordinate(latitude1, FINE_STEP, -90, 90)"
          >
            +
          </button>
        </div>
      </label>

      <input id="latitude-1" v-model.number="latitude1" type="range" min="-90" max="90" step="1" />
    </div>

    <div class="control-group">
      <label class="visualizer-control-label" for="longitude-1">
        <span>P₁ 경도(λ₁)</span>

        <div class="value-control">
          <button
            type="button"
            @click="longitude1 = adjustCoordinate(longitude1, -FINE_STEP, -180, 180)"
          >
            −
          </button>

          <output class="visualizer-control-output">{{ longitude1.toFixed(FINE_DIGITS) }}°</output>

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
      <label class="visualizer-control-label" for="latitude-2">
        <span>P₂ 위도(φ₂)</span>

        <div class="value-control">
          <button
            type="button"
            @click="latitude2 = adjustCoordinate(latitude2, -FINE_STEP, -90, 90)"
          >
            −
          </button>

          <output class="visualizer-control-output">{{ latitude2.toFixed(FINE_DIGITS) }}°</output>

          <button
            type="button"
            @click="latitude2 = adjustCoordinate(latitude2, FINE_STEP, -90, 90)"
          >
            +
          </button>
        </div>
      </label>

      <input id="latitude-2" v-model.number="latitude2" type="range" min="-90" max="90" step="1" />
    </div>

    <div class="control-group">
      <label class="visualizer-control-label" for="longitude-2">
        <span>P₂ 경도(λ₂)</span>

        <div class="value-control">
          <button
            type="button"
            @click="longitude2 = adjustCoordinate(longitude2, -FINE_STEP, -180, 180)"
          >
            −
          </button>

          <output class="visualizer-control-output">{{ longitude2.toFixed(FINE_DIGITS) }}°</output>

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
  </section>
</template>

<style scoped>
.control-groups {
  min-width: 0;
  max-width: 100%;
}
.control-group {
  min-width: 0;
  max-width: 100%;

  margin-bottom: var(--space-m);
}

.control-group:last-child {
  margin-bottom: 0;
}

.control-group label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-s);

  min-width: 0;

  margin-bottom: var(--space-s);
}

.control-group label span {
  min-width: 0;

  overflow-wrap: anywhere;
}

.control-group input[type='range'] {
  display: block;

  width: 100%;
  min-width: 0;
  margin: 0;

  cursor: pointer;
}

.value-control {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: var(--space-s);
}

.value-control output {
  flex: 0 0 auto;
}

.value-control button {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 26px;
  height: 26px;
  padding: 0;

  border: var(--border-default);
  border-radius: var(--radius-s);

  background: var(--color-background);
  color: var(--color-main);

  font-size: var(--font-size-m);
  font-weight: var(--font-weight-semibold);
  font-family: var(--font-family-content);
  line-height: 1;

  cursor: pointer;
}

.value-control button:hover {
  background: var(--color-main-sub);
}
</style>
