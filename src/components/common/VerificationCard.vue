<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <section class="verification">
    <h2>{{ title }}</h2>

    <slot />
  </section>
</template>

<style scoped>
.verification {
  margin-top: 22px;
  padding: 14px;

  border: 2px solid #2563eb;
  border-radius: 12px;

  background: #eff6ff;
}

.verification h2 {
  margin: 0 0 12px;

  color: #1d4ed8;
  font-size: 20px;
  font-weight: 800;
  text-align: center;
}
</style>
