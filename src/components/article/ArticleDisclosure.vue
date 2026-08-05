<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <details class="article-disclosure">
    <summary class="disclosure-summary">
      {{ title }}
    </summary>

    <div class="disclosure-content">
      <slot />
    </div>
  </details>
</template>

<style scoped>
.article-disclosure {
  width: 100%;
  max-width: 760px;

  margin: 24px auto;

  border: 1px solid #dbe3ee;
  border-radius: 10px;

  background: #f8fafc;
}

.disclosure-summary {
  padding: 14px 16px;

  color: #1e293b;
  font-size: 15px;
  font-weight: 700;

  cursor: pointer;
}

.disclosure-content {
  padding: 0 16px 16px;

  color: #334155;
  font-size: 15px;
  line-height: 1.8;
}
</style>