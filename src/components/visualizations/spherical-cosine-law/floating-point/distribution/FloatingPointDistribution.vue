<script setup>
import { computed, ref } from 'vue'

import { VerificationCard } from '@/components/visualizations/common'

import FloatingPointDistributionControls from './FloatingPointDistributionControls.vue'

import {
  formatFloatingPointValue,
  getFiniteValues,
  getMaxFiniteValue,
  getMinFiniteValue,
} from '../floatingPoint.js'

const VIEWBOX_WIDTH = 1000
const VIEWBOX_HEIGHT = 150
const PLOT_LEFT = 36
const PLOT_RIGHT = VIEWBOX_WIDTH - 36
const AXIS_Y = 92
const MARK_TOP = 34

const exponentBits = ref(4)
const fractionBits = ref(5)

const format = computed(() => ({
  exponentBits: exponentBits.value,
  fractionBits: fractionBits.value,
}))

const minValue = computed(() =>
  getMinFiniteValue(format.value),
)

const maxValue = computed(() =>
  getMaxFiniteValue(format.value),
)

const finiteValues = computed(() =>
  getFiniteValues(format.value),
)

const valueMarks = computed(() => {
  const min = minValue.value
  const max = maxValue.value
  const span = max - min

  return finiteValues.value.map((value) => ({
    value,
    x:
      PLOT_LEFT
      + ((value - min) / span)
        * (PLOT_RIGHT - PLOT_LEFT),
  }))
})

const zeroX = computed(() =>
  PLOT_LEFT
  + ((0 - minValue.value)
    / (maxValue.value - minValue.value))
    * (PLOT_RIGHT - PLOT_LEFT),
)
</script>

<template>
  <section class="floating-point-distribution">
    <div class="distribution-chart">
      <svg
        class="distribution-svg"
        :viewBox="`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`"
        role="img"
        aria-label="표현 가능한 부동소수점의 실수축 분포"
      >
        <line
          class="axis-line"
          :x1="PLOT_LEFT"
          :x2="PLOT_RIGHT"
          :y1="AXIS_Y"
          :y2="AXIS_Y"
        />

        <line
          v-for="mark in valueMarks"
          :key="mark.value"
          class="value-mark"
          :x1="mark.x"
          :x2="mark.x"
          :y1="MARK_TOP"
          :y2="AXIS_Y"
        />

        <line
          class="zero-mark"
          :x1="zeroX"
          :x2="zeroX"
          :y1="MARK_TOP - 6"
          :y2="AXIS_Y + 4"
        />

        <text
          class="axis-label"
          :x="PLOT_LEFT"
          y="122"
          text-anchor="start"
        >
          {{ formatFloatingPointValue(minValue) }}
        </text>

        <text
          class="axis-label"
          :x="zeroX"
          y="122"
          text-anchor="middle"
        >
          0
        </text>

        <text
          class="axis-label"
          :x="PLOT_RIGHT"
          y="122"
          text-anchor="end"
        >
          {{ formatFloatingPointValue(maxValue) }}
        </text>
      </svg>
    </div>

    <FloatingPointDistributionControls
      v-model:exponent-bits="exponentBits"
      v-model:fraction-bits="fractionBits"
    />

    <VerificationCard title="부동소수점의 분포">
      <p class="distribution-summary visual-control">
        부동소수점은 절댓값이 작은 영역에서 더 촘촘하게 분포하고,
        절댓값이 커질수록 표현 가능한 값 사이의 간격이 넓어진다.
      </p>
    </VerificationCard>
  </section>
</template>

<style scoped>
.floating-point-distribution {
  width: 100%;
  min-width: 0;
  padding: var(--space-l);

  border: var(--border-default);
  border-radius: var(--radius-m);

  background: var(--color-background);
}

.distribution-chart {
  width: 100%;
  min-width: 0;
}

.distribution-svg {
  display: block;

  width: 100%;
  height: auto;

  overflow: visible;
}

.axis-line {
  stroke: var(--color-text-main);
  stroke-width: 2;
  vector-effect: non-scaling-stroke;
}

.value-mark {
  stroke: var(--color-main);
  stroke-width: 1;
  opacity: 0.28;
  vector-effect: non-scaling-stroke;
}

.zero-mark {
  stroke: var(--color-text-main);
  stroke-width: 2;
  vector-effect: non-scaling-stroke;
}

.axis-label {
  fill: var(--color-text-sub);

  font-family: var(--font-family-content);
  font-size: 14px;
  font-weight: var(--font-weight-regular);
  font-variant-numeric: tabular-nums;
}

.distribution-summary {
  margin: var(--space-m) 0 0;

  line-height: 1.7;
  text-align: center;
}

@media (max-width: 640px) {
  .floating-point-distribution {
    padding: var(--space-m);
  }

  .axis-label {
    font-size: 12px;
  }
}
</style>
