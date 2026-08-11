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
  margin-top: var(--space-l);
  padding: var(--space-m);

  border: var(--border-emphasize);
  border-radius: var(--radius-l);

  background: var(--color-background-sub);
}

.verification h2 {
  margin: 0 0 var(--space-m);

  color: var(--color-main);
  font-size: var(--font-size-l);
  font-weight: var(--font-weight-semibold);
  text-align: center;
}
</style>
