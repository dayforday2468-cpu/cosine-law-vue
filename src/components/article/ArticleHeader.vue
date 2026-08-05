<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  date: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <header class="article-header">
    <h1>{{ title }}</h1>

    <p v-if="description" class="description">
      {{ description }}
    </p>

    <time v-if="date" class="date">
      {{ date }}
    </time>
  </header>
</template>

<style scoped>
.article-header {
  margin-bottom: 48px;
  padding-bottom: 24px;

  border-bottom: 1px solid #cbd5e1;
}

.article-header h1 {
  margin: 0 0 16px;

  color: #0f172a;
  font-family: 'YuhanKimberlyPureunsoop', sans-serif;
  font-size: clamp(32px, 5vw, 48px);
  line-height: 1.2;
}

.description {
  margin: 0 0 12px;

  color: #475569;
  font-size: 18px;
  line-height: 1.7;
}

.date {
  color: #94a3b8;
  font-size: 14px;
}
</style>
