<script setup>
import ArticleLayout from '@/components/article/ArticleLayout.vue'
import ArticleHeader from '@/components/article/ArticleHeader.vue'
import {
  CosineLawVisualizer,
  AngleInvarianceVisualizer,
  HaversineVisualizer,
} from '@/components/visualizations'
</script>

<template>
  <ArticleLayout>
    <ArticleHeader
      title="구면 코사인 법칙에서 Haversine 공식까지"
      description="평면의 코사인 법칙에서 출발해 구면거리 공식까지 연결해봅니다."
      date="2026-08-05"
    />

    <p>테스트용 본문입니다.</p>
    <CosineLawVisualizer />
    <p>테스트용 본문입니다.</p>
    <AngleInvarianceVisualizer />
    <p>테스트용 본문입니다.</p>
    <HaversineVisualizer />
  </ArticleLayout>
</template>
