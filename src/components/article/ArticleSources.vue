<script setup>
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

    <article
      v-for="source in sources"
      :key="source.title"
      class="article-source"
    >
      <h3>{{ source.title }}</h3>

      <p class="source-contribution">
        {{ source.contribution }}
      </p>

      <div
        v-if="source.source || source.links?.length > 0 || source.license"
        class="source-meta"
      >
        <span v-if="source.source" class="source-name">
          {{ source.source }}
        </span>

        <template
          v-for="link in source.links"
          :key="link.url"
        >
          <span class="meta-separator">·</span>

          <a
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ link.label }}
          </a>
        </template>

        <template v-if="source.license">
          <span class="meta-separator">·</span>

          <a
            v-if="source.licenseUrl"
            :href="source.licenseUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ source.license }}
          </a>

          <span v-else>{{ source.license }}</span>
        </template>
      </div>
    </article>
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

.article-source {
  padding: var(--space-m) 0;

  border-bottom: var(--border-default);
}

.article-source:first-of-type {
  padding-top: 0;
}

.article-source:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.article-source h3 {
  margin: 0;

  color: var(--color-text-main);
  font-family: var(--font-family-content);
  font-size: var(--font-size-m);
  font-weight: var(--font-weight-semibold);
  line-height: 1.5;
}

.source-contribution {
  margin: var(--space-s) 0 0;

  color: var(--color-text-content);
  font-family: var(--font-family-content);
  font-size: var(--font-size-s);
  font-weight: var(--font-weight-regular);
  line-height: 1.7;
}

.source-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-xs);

  margin-top: var(--space-s);

  color: var(--color-text-sub);
  font-family: var(--font-family-content);
  font-size: var(--font-size-s);
  line-height: 1.5;
}

.source-name {
  font-weight: var(--font-weight-semibold);
}

.source-meta a {
  color: var(--color-main);
  text-decoration: none;
}

.source-meta a:hover {
  text-decoration: underline;
}

.meta-separator {
  color: var(--color-text-sub);
}
</style>
