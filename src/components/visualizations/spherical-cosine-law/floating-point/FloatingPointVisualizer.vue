<script setup>
import { computed, ref } from 'vue'

import { VerificationCard } from '@/components/visualizations/common'

import FloatingPointBits from './FloatingPointBits.vue'
import FloatingPointControlBar from './FloatingPointControlBar.vue'

import {
  formatFloatingPointValue,
  getBias,
  getMaxFiniteValue,
  getMinFiniteValue,
  getPositiveFiniteCount,
  indexToFloatingPoint,
} from './floatingPoint.js'

// --------------------------------------
// Custom floating-point format
// --------------------------------------

const FLOAT_FORMAT = {
  exponentBits: 4,
  fractionBits: 5,
}

const BIAS = getBias(FLOAT_FORMAT)
const POSITIVE_FINITE_COUNT = getPositiveFiniteCount(FLOAT_FORMAT)
const MIN_FINITE_VALUE = getMinFiniteValue(FLOAT_FORMAT)
const MAX_FINITE_VALUE = getMaxFiniteValue(FLOAT_FORMAT)

// --------------------------------------
// 현재 부동소수점 상태
// --------------------------------------

const floatIndex = ref(0)

const floatingPoint = computed(() =>
  indexToFloatingPoint(floatIndex.value, FLOAT_FORMAT),
)

const fractionBitString = computed(() =>
  floatingPoint.value.fractionBits.join(''),
)

const significandExpression = computed(() => {
  if (floatingPoint.value.kind === 'zero') {
    return `(0.${fractionBitString.value})₂`
  }

  const leadingBit =
    floatingPoint.value.kind === 'subnormal'
      ? 0
      : 1

  return `(${leadingBit}.${fractionBitString.value})₂`
})

const signExpression = computed(() =>
  `(-1)^${floatingPoint.value.signBit} = ${floatingPoint.value.signBit === 1 ? '-1' : '1'}`,
)

const exponentExpression = computed(() => {
  if (floatingPoint.value.kind === 'zero') {
    return '사용하지 않음'
  }

  if (floatingPoint.value.kind === 'subnormal') {
    return `2^(1 - ${BIAS}) = 2^${1 - BIAS}`
  }

  return `2^(${floatingPoint.value.rawExponent} - ${BIAS}) = 2^${floatingPoint.value.unbiasedExponent}`
})

const valueExpression = computed(() => {
  if (floatingPoint.value.kind === 'zero') {
    return '0'
  }

  const exponentTerm =
    floatingPoint.value.kind === 'subnormal'
      ? `2^(1 - ${BIAS})`
      : `2^(${floatingPoint.value.rawExponent} - ${BIAS})`

  return `(-1)^${floatingPoint.value.signBit} × ${significandExpression.value} × ${exponentTerm}`
})

const valueKind = computed(() => {
  if (floatingPoint.value.kind === 'subnormal') {
    return 'Subnormal'
  }

  if (floatingPoint.value.kind === 'normal') {
    return 'Normal'
  }

  return 'Zero'
})
</script>

<template>
  <section class="floating-point-visualizer">
    <FloatingPointBits
      :sign-bit="floatingPoint.signBit"
      :exponent-bits="floatingPoint.exponentBits"
      :fraction-bits="floatingPoint.fractionBits"
    />

    <FloatingPointControlBar
      v-model="floatIndex"
      :min-index="-POSITIVE_FINITE_COUNT"
      :max-index="POSITIVE_FINITE_COUNT"
      :min-value="MIN_FINITE_VALUE"
      :max-value="MAX_FINITE_VALUE"
      :current-value="floatingPoint.value"
      :format-value="formatFloatingPointValue"
    />

    <VerificationCard title="실수 표현">
      <div class="result-row">
        <span class="visual-control-label">Sign</span>
        <span class="visual-control-output">{{ signExpression }}</span>
      </div>

      <div class="result-row">
        <span class="visual-control-label">Exponent</span>
        <span class="visual-control-output">{{ exponentExpression }}</span>
      </div>

      <div class="result-row">
        <span class="visual-control-label">Significand</span>
        <span class="visual-control-output">{{ significandExpression }}</span>
      </div>

      <div class="formula">
        {{ valueExpression }}
      </div>

      <div class="result-row result">
        <span class="visual-control-label">Result</span>
        <span class="visual-control-output">
          {{ formatFloatingPointValue(floatingPoint.value) }}
        </span>
      </div>

      <p class="value-kind visual-control-caption">
        {{ valueKind }}
      </p>
    </VerificationCard>
  </section>
</template>

<style scoped>
.floating-point-visualizer {
  width: 100%;
  min-width: 0;
  padding: var(--space-l);

  border: var(--border-default);
  border-radius: var(--radius-m);

  background: var(--color-background);
}

.result-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-s);

  margin-bottom: var(--space-s);
}

.result-row .visual-control-output {
  min-width: 0;

  text-align: right;
  overflow-wrap: anywhere;
}

.formula {
  max-width: 100%;

  margin: var(--space-m) 0 var(--space-s);
  padding: var(--space-s);

  border: var(--border-default);
  border-radius: var(--radius-m);

  background: var(--color-background);
  color: var(--color-text-content);

  font-family: var(--font-family-formula);
  font-size: var(--font-size-m);
  font-weight: var(--font-weight-regular);
  line-height: 1.6;
  text-align: center;

  overflow-wrap: anywhere;
}

.result-row.result {
  margin-bottom: 0;
  padding-top: var(--space-s);

  border-top: var(--border-default);
}

.value-kind {
  margin: var(--space-s) 0 0;

  text-align: right;
}

@media (max-width: 640px) {
  .floating-point-visualizer {
    padding: var(--space-m);
  }

  .result-row {
    align-items: flex-start;
    flex-direction: column;
  }

  .result-row .visual-control-output {
    text-align: left;
  }
}
</style>
