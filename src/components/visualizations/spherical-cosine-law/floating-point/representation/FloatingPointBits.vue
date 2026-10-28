<script setup>
import BitCard from './BitCard.vue'

defineProps({
  signBit: {
    type: Number,
    required: true,
  },
  exponentBits: {
    type: Array,
    required: true,
  },
  fractionBits: {
    type: Array,
    required: true,
  },
})

const BIT_COLORS = {
  sign: '#d97706',
  exponent: '#2563eb',
  fraction: '#059669',
}
</script>

<template>
  <div class="floating-point-bits-scroll">
    <div class="floating-point-bits">
      <section class="bit-group">
        <span class="group-label visual-control-label">Sign</span>

        <div class="bit-row">
          <BitCard
            :bit="signBit"
            :border-color="BIT_COLORS.sign"
          />
        </div>

        <span class="group-caption visual-control-caption">1 bit</span>
      </section>

      <section class="bit-group">
        <span class="group-label visual-control-label">Exponent</span>

        <div class="bit-row">
          <BitCard
            v-for="(bit, index) in exponentBits"
            :key="`exponent-${index}`"
            :bit="bit"
            :border-color="BIT_COLORS.exponent"
          />
        </div>

        <span class="group-caption visual-control-caption">
          {{ exponentBits.length }} bits
        </span>
      </section>

      <section class="bit-group">
        <span class="group-label visual-control-label">Fraction</span>

        <div class="bit-row">
          <BitCard
            v-for="(bit, index) in fractionBits"
            :key="`fraction-${index}`"
            :bit="bit"
            :border-color="BIT_COLORS.fraction"
          />
        </div>

        <span class="group-caption visual-control-caption">
          {{ fractionBits.length }} bits
        </span>
      </section>
    </div>
  </div>
</template>

<style scoped>
.floating-point-bits-scroll {
  max-width: 100%;

  overflow-x: auto;
}

.floating-point-bits {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: var(--space-m);

  width: max-content;
  min-width: 100%;
  padding-bottom: var(--space-xs);
}

.bit-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-s);
}

.bit-row {
  display: flex;
  gap: var(--space-xs);
}

.group-label,
.group-caption {
  white-space: nowrap;
}
</style>
