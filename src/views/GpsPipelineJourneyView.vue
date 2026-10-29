<script setup>
import {
  ArticleHeader,
  ArticleLayout,
} from '@/components/article'

import { articles } from '@/data/articles.js'

const article = articles.find(
  ({ slug }) => slug === 'gps-pipeline-journey',
)
</script>

<template>
  <ArticleLayout>
    <ArticleHeader
      :title="article.title"
      :description="article.description"
      :date="article.date"
    />
  </ArticleLayout>
</template>
