<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <header class="article-header">
    <h1>{{ title }}</h1>

    <p class="description">{{ description }}</p>

    <time class="date">{{ date }}</time>
  </header>
</template>

<style scoped>
.article-header {
  margin-bottom: var(--space-l);
  padding-bottom: var(--space-m);

  border-bottom: var(--border-default);
}

.article-header h1 {
  margin: 0 0 var(--space-m);

  color: var(--color-text-main);
  font-family: var(--font-family-title);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  line-height: 1.2;
}

.description {
  margin: 0 0 var(--space-s);

  color: var(--color-text-sub);
  font-family: var(--font-family-content);
  font-size: var(--font-size-m);
  font-weight: var(--font-weight-regular);
  line-height: 1.6;
}

.date {
  color: var(--color-text-sub);
  font-family: var(--font-family-content);
  font-size: var(--font-size-s);
  font-weight: var(--font-weight-regular);
}
</style>
