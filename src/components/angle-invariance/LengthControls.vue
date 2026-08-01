<script setup>
const lengths = defineModel('lengths', {
  type: Object,
  required: true,
})

defineProps({
  maxLengths: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <section class="length-controls">
    <h2>선분 길이 조절</h2>

    <div class="control-group">
      <label for="length-ao">
        <span>AO</span>
        <output>{{ lengths.AO.toFixed(2) }}</output>
      </label>

      <input
        id="length-ao"
        v-model.number="lengths.AO"
        type="range"
        min="0.5"
        :max="maxLengths.AO"
        step="0.01"
      />
    </div>

    <div class="control-group">
      <label for="length-ab">
        <span>AB</span>
        <output>{{ lengths.AB.toFixed(2) }}</output>
      </label>

      <input
        id="length-ab"
        v-model.number="lengths.AB"
        type="range"
        min="0.5"
        :max="maxLengths.AB"
        step="0.01"
      />
    </div>

    <div class="control-group">
      <label for="length-ac">
        <span>AC</span>
        <output>{{ lengths.AC.toFixed(2) }}</output>
      </label>

      <input
        id="length-ac"
        v-model.number="lengths.AC"
        type="range"
        min="0.5"
        :max="maxLengths.AC"
        step="0.01"
      />
    </div>

    <section class="invariance-result">
      <p class="result-title">
        ✓ 각도 불변!
      </p>

      <p class="result-description">
        선분의 길이는 변하지만<br />
        표시된 각도의 크기는 변하지 않습니다.
      </p>
    </section>
  </section>
</template>

<style scoped>
.length-controls h2 {
  margin: 0 0 28px;

  color: #0f172a;
  font-size: 24px;
}

.control-group {
  margin-bottom: 28px;
}

.control-group label {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 10px;

  color: #334155;
  font-size: 18px;
  font-weight: 700;
}

.control-group output {
  min-width: 52px;

  color: #2563eb;
  font-variant-numeric: tabular-nums;
  text-align: right;
}

.control-group input {
  width: 100%;

  cursor: pointer;
}

.invariance-result {
  margin-top: 42px;
  padding: 22px 18px;

  border: 2px solid #22c55e;
  border-radius: 14px;

  text-align: center;

  background: #f0fdf4;
}

.result-title {
  margin: 0 0 12px;

  color: #15803d;
  font-size: 26px;
  font-weight: 800;
}

.result-description {
  margin: 0;

  color: #166534;
  line-height: 1.6;
}
</style>