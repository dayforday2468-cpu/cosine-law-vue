<script setup>
import { inject } from 'vue'

const sections = inject('articleSections')
const activeSectionId = inject('activeArticleSectionId')

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}
</script>

<template>
  <nav
    class="article-toc"
    aria-label="게시물 목차"
  >
    <p class="toc-title">목차</p>

    <ul class="toc-list">
      <li
        v-for="section in sections"
        :key="section.id"
      >
        <button
          type="button"
          class="toc-link"
          :class="{ active: activeSectionId === section.id }"
          :aria-current="activeSectionId === section.id ? 'location' : undefined"
          @click="scrollToSection(section.id)"
        >
          {{ section.title }}
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.article-toc {
  position: sticky;
  top: var(--space-l);

  width: 100%;
}

.toc-title {
  margin: 0 0 var(--space-m);

  color: var(--color-text-main);
  font-family: var(--font-family-title);
  font-size: var(--font-size-m);
  font-weight: var(--font-weight-bold);
}

.toc-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);

  margin: 0;
  padding: 0;

  list-style: none;
}

.toc-link {
  width: 100%;

  padding: var(--space-xs) 0 var(--space-xs) var(--space-s);

  border: 0;
  border-left: 2px solid transparent;

  background: transparent;

  color: var(--color-text-sub);
  font-family: var(--font-family-content);
  font-size: var(--font-size-s);
  font-weight: var(--font-weight-regular);
  line-height: 1.4;
  text-align: left;

  cursor: pointer;

  transition:
    color 0.15s ease,
    border-color 0.15s ease;
}

.toc-link:hover {
  color: var(--color-text-main);
}

.toc-link.active {
  border-left-color: var(--color-main);

  color: var(--color-main);
  font-weight: var(--font-weight-semibold);
}
</style>
