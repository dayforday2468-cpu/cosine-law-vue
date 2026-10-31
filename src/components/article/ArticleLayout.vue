<script setup>
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
} from 'vue'

import ArticleTableOfContents from './ArticleTableOfContents.vue'

const figureCount = ref(0)
const sections = ref([])
const activeSectionId = ref('')

let scrollFrame = null

function getNextFigureNumber() {
  figureCount.value += 1
  return figureCount.value
}

function sortSections() {
  sections.value.sort(
    (a, b) => a.element.offsetTop - b.element.offsetTop,
  )
}

function updateActiveSection() {
  scrollFrame = null

  if (sections.value.length === 0) {
    activeSectionId.value = ''
    return
  }

  const activationOffset = 120
  let activeSection = sections.value[0]

  for (const section of sections.value) {
    if (section.element.getBoundingClientRect().top <= activationOffset) {
      activeSection = section
    } else {
      break
    }
  }

  activeSectionId.value = activeSection.id
}

function scheduleActiveSectionUpdate() {
  if (scrollFrame !== null) return

  scrollFrame = window.requestAnimationFrame(updateActiveSection)
}

function registerArticleSection(section) {
  sections.value = [
    ...sections.value.filter(({ id }) => id !== section.id),
    section,
  ]

  nextTick(() => {
    sortSections()
    updateActiveSection()
  })
}

function unregisterArticleSection(id) {
  sections.value = sections.value.filter((section) => section.id !== id)
  updateActiveSection()
}

provide('articleSections', sections)
provide('activeArticleSectionId', activeSectionId)
provide('registerArticleSection', registerArticleSection)
provide('unregisterArticleSection', unregisterArticleSection)
provide('getNextFigureNumber', getNextFigureNumber)

onMounted(() => {
  window.addEventListener('scroll', scheduleActiveSectionUpdate, {
    passive: true,
  })

  updateActiveSection()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', scheduleActiveSectionUpdate)

  if (scrollFrame !== null) {
    window.cancelAnimationFrame(scrollFrame)
  }
})
</script>

<template>
  <main class="article-layout">
    <aside
      v-if="sections.length"
      class="article-toc-rail"
    >
      <ArticleTableOfContents />
    </aside>

    <article class="article-content">
      <slot />
    </article>
  </main>
</template>

<style scoped>
.article-layout {
  display: grid;
  grid-template-columns:
    minmax(0, 1fr)
    minmax(0, var(--container-width))
    minmax(0, 1fr);

  width: 100%;
  min-height: 100vh;

  padding: var(--space-l) var(--space-m);

  background: var(--color-background);
}

.article-content {
  grid-column: 2;

  width: 100%;
  min-width: 0;
}

.article-toc-rail {
  grid-column: 1;
  grid-row: 1;

  justify-self: end;
  align-self: stretch;

  width: 13rem;
  margin-right: var(--space-l);
}

@media (max-width: 1280px) {
  .article-toc-rail {
    display: none;
  }
}

@media (max-width: 768px) {
  .article-layout {
    padding: var(--space-l) var(--space-m);
  }
}
</style>
