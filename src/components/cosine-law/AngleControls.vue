<script setup>
const angles = defineModel('angles', {
  type: Object,
  required: true,
})
</script>

<template>
  <section class="angle-controls">
    <h1>각도 조절</h1>

    <div class="angle-control">
      <label for="theta1">
        <span>θ₁ = ∠BOC(이면각)</span>
        <output>{{ angles.theta1 }}°</output>
      </label>

      <input id="theta1" v-model.number="angles.theta1" type="range" min="10" max="170" />
    </div>

    <div class="angle-control">
      <label for="theta2">
        <span>θ₂ = ∠OAB</span>
        <output>{{ angles.theta2 }}°</output>
      </label>

      <input id="theta2" v-model.number="angles.theta2" type="range" min="10" max="80" />
    </div>

    <div class="angle-control">
      <label for="theta3">
        <span>θ₃ = ∠OAC</span>
        <output>{{ angles.theta3 }}°</output>
      </label>

      <input id="theta3" v-model.number="angles.theta3" type="range" min="10" max="80" />
    </div>
  </section>
</template>

<style scoped>
.angle-controls {
  min-width: 0;
  max-width: 100%;
}

.angle-controls h1 {
  margin: 0 0 clamp(18px, 2.4vw, 32px);

  color: #0f172a;

  font-size: clamp(14px, 1.5vw, 20px);
}

.angle-control {
  min-width: 0;
  max-width: 100%;

  margin-bottom: clamp(16px, 2.2vw, 30px);
}

.angle-control:last-child {
  margin-bottom: 0;
}

.angle-control label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;

  min-width: 0;

  margin-bottom: clamp(7px, 1vw, 12px);

  color: #334155;

  font-size: clamp(10px, 1.1vw, 15px);
  font-weight: 600;
}

.angle-control label span {
  min-width: 0;

  overflow-wrap: anywhere;
}

.angle-control output {
  flex: 0 0 auto;

  color: #2563eb;

  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.angle-control input[type='range'] {
  display: block;

  width: 100%;
  min-width: 0;
  margin: 0;

  cursor: pointer;
}
</style>
