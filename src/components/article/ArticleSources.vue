<script setup>
import ArticleSource from './ArticleSource.vue'

defineProps({
  sources: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <section class="article-sources">
    <h2 class="sources-title article-component-title">
      출처 및 기여
    </h2>

    <div class="source-list">
      <ArticleSource
        v-for="source in sources"
        :key="source.title"
        v-bind="source"
      />
    </div>
  </section>
</template>

<style scoped>
.article-sources {
  width: 100%;
  max-width: var(--article-content-width);

  margin: var(--space-l) auto 0;
  padding-top: var(--space-m);

  border-top: var(--border-default);
}

.sources-title {
  margin: 0 0 var(--space-m);
}

.source-list {
  width: 100%;
}
</style>
