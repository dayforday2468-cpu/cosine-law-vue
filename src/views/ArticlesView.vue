<script setup>
import { articles } from '../data/articles.js'
</script>

<template>
  <main class="articles">
    <header class="articles-header">
      <h1>Articles</h1>
      <p>문제에서 출발해 구조를 발견하고 구현한 기록입니다.</p>
    </header>

    <section class="article-list">
      <RouterLink
        v-for="article in articles"
        :key="article.slug"
        class="article-card"
        :to="`/articles/${article.slug}`"
      >
        <time :datetime="article.date">
          {{ article.date }}
        </time>

        <h2>{{ article.title }}</h2>

        <p>{{ article.description }}</p>

        <ul class="article-tags">
          <li v-for="tag in article.tags" :key="tag">
            {{ tag }}
          </li>
        </ul>
      </RouterLink>
    </section>
  </main>
</template>

<style scoped>
.articles {
  width: min(var(--container-width), calc(100% - var(--space-l)));
  margin: var(--space-l) auto;
}

.articles-header {
  margin-bottom: var(--space-l);
}

.articles-header h1 {
  margin: 0;

  color: var(--color-text-main);

  font-family: var(--font-family-title);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  line-height: 1.2;
}

.articles-header p {
  margin: var(--space-m) 0 0;

  color: var(--color-text-content);

  font-family: var(--font-family-content);
  font-size: var(--font-size-m);
  font-weight: var(--font-weight-regular);
  line-height: 1.8;
}

.article-list {
  display: grid;
  gap: var(--space-m);
}

.article-card {
  display: block;

  padding: var(--space-l);

  border: var(--border-default);
  border-radius: var(--radius-l);

  background: var(--color-background);
  color: inherit;

  text-decoration: none;

  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    transform 0.2s ease;
}

.article-card:hover {
  border-color: var(--color-main);
  background: var(--color-background-sub);

  transform: translateY(-2px);
}

.article-card time {
  display: block;

  margin-bottom: var(--space-s);

  color: var(--color-text-sub);

  font-family: var(--font-family-content);
  font-size: var(--font-size-s);
  font-weight: var(--font-weight-regular);
}

.article-card h2 {
  margin: 0;

  color: var(--color-text-main);

  font-family: var(--font-family-content);
  font-size: var(--font-size-l);
  font-weight: var(--font-weight-semibold);
  line-height: 1.4;
}

.article-card > p {
  margin: var(--space-s) 0 0;

  color: var(--color-text-content);

  font-family: var(--font-family-content);
  font-size: var(--font-size-m);
  font-weight: var(--font-weight-regular);
  line-height: 1.8;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-s);

  margin: var(--space-m) 0 0;
  padding: 0;

  list-style: none;
}

.article-tags li {
  padding: var(--space-s) var(--space-m);

  border: var(--border-default);
  border-radius: var(--radius-l);

  background: var(--color-background-sub);
  color: var(--color-text-sub);

  font-family: var(--font-family-content);
  font-size: var(--font-size-s);
  font-weight: var(--font-weight-semibold);
}

@media (max-width: 640px) {
  .articles {
    width: min(var(--container-width), calc(100% - var(--space-m)));
  }

  .article-card {
    padding: var(--space-m);
  }
}
</style>
