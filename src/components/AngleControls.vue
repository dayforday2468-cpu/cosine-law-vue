<script setup>
const angles = defineModel('angles', {
  type: Object,
  required: true,
})
</script>

<template>
  <section class="angle-controls">
    <h1>각도 조절</h1>

    <div class="control">
      <label for="theta1">
        <span>θ₁ = ∠BOC</span>
        <output>{{ angles.theta1 }}°</output>
      </label>

      <input id="theta1" v-model.number="angles.theta1" type="range" min="10" max="170" />
    </div>

    <div class="control">
      <label for="theta2">
        <span>θ₂ = ∠OAB</span>
        <output>{{ angles.theta2 }}°</output>
      </label>

      <input id="theta2" v-model.number="angles.theta2" type="range" min="10" max="80" />
    </div>

    <div class="control">
      <label for="theta3">
        <span>θ₃ = ∠OAC</span>
        <output>{{ angles.theta3 }}°</output>
      </label>

      <input id="theta3" v-model.number="angles.theta3" type="range" min="10" max="80" />
    </div>
  </section>
</template>
