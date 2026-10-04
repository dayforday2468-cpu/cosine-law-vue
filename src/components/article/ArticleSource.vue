<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  contribution: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    default: '',
  },
  links: {
    type: Array,
    default: () => [],
  },
  license: {
    type: String,
    default: '',
  },
  licenseUrl: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <article class="article-source">
    <h3>{{ title }}</h3>

    <p class="source-contribution">
      {{ contribution }}
    </p>

    <div
      v-if="source || links.length > 0 || license"
      class="source-meta"
    >
      <span v-if="source" class="source-name">
        {{ source }}
      </span>

      <template
        v-for="link in links"
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

      <template v-if="license">
        <span class="meta-separator">·</span>

        <a
          v-if="licenseUrl"
          :href="licenseUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ license }}
        </a>

        <span v-else>{{ license }}</span>
      </template>
    </div>
  </article>
</template>

<style scoped>
.article-source {
  padding: var(--space-m) 0;

  border-bottom: var(--border-default);
}

.article-source:first-child {
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
