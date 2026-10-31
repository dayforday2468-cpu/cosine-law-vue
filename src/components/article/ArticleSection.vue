<script setup>
import {
  inject,
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
})

const sectionElement = ref(null)

const registerArticleSection = inject('registerArticleSection')
const unregisterArticleSection = inject('unregisterArticleSection')

onMounted(() => {
  registerArticleSection?.({
    id: props.id,
    title: props.title,
    element: sectionElement.value,
  })
})

onBeforeUnmount(() => {
  unregisterArticleSection?.(props.id)
})
</script>

<template>
  <section
    :id="id"
    ref="sectionElement"
    class="article-section"
  >
    <h2>{{ title }}</h2>
  </section>
</template>

<style scoped>
.article-section {
  width: 100%;
  max-width: var(--article-content-width);

  margin: var(--space-xl) auto var(--space-m);
  padding-bottom: var(--space-s);

  border-bottom: var(--border-default);

  scroll-margin-top: var(--space-l);
}

.article-section h2 {
  margin: 0;

  color: var(--color-text-main);
  font-family: var(--font-family-title);
  font-size: var(--font-size-l);
  font-weight: var(--font-weight-bold);
  line-height: 1.2;
}
</style>
