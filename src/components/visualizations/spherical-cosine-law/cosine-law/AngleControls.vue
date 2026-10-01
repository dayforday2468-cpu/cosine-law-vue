<script setup>
const angles = defineModel('angles', {
  type: Object,
  required: true,
})
</script>

<template>
  <section class="angle-controls">
    <div class="angle-control">
      <label class="visualizer-control-label" for="theta1">
        <span>θ₁ = ∠BOC(이면각)</span>
        <output class="visualizer-control-output">{{ angles.theta1 }}°</output>
      </label>

      <input id="theta1" v-model.number="angles.theta1" type="range" min="10" max="170" />
    </div>

    <div class="angle-control">
      <label class="visualizer-control-label" for="theta2">
        <span>θ₂ = ∠OAB</span>
        <output class="visualizer-control-output">{{ angles.theta2 }}°</output>
      </label>

      <input id="theta2" v-model.number="angles.theta2" type="range" min="10" max="80" />
    </div>

    <div class="angle-control">
      <label class="visualizer-control-label" for="theta3">
        <span>θ₃ = ∠OAC</span>
        <output class="visualizer-control-output">{{ angles.theta3 }}°</output>
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

.angle-control {
  min-width: 0;
  max-width: 100%;

  margin-bottom: var(--space-m);
}

.angle-control:last-child {
  margin-bottom: 0;
}

.angle-control label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-s);

  min-width: 0;

  margin-bottom: var(--space-s);
}

.angle-control label span {
  min-width: 0;

  overflow-wrap: anywhere;
}

.angle-control output {
  flex: 0 0 auto;
}

.angle-control input[type='range'] {
  display: block;

  width: 100%;
  min-width: 0;
  margin: 0;

  cursor: pointer;
}
</style>
