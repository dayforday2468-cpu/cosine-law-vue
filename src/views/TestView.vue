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
      title="6년 묵은 오답노트, 커리어의 핵심이 되다."
      description="계산 실수로 발견한 구면 삼각형 코사인 법칙이 나의 커리어를 바꾼 이야기"
      date="2026-08-05"
    />
    <div class="article-text">
      <p>
        실수는 누구나 피하고 싶은 것이다. 고등학교 시절, 한 문제라도 더 맞는게 목표였던 나는 검산도
        2번 이상 하던 완벽함에 목매던 사람이었다. dddddddddddddddddddddddddd
      </p>
    </div>
    <CosineLawVisualizer />
    <p>테스트용 본문입니다.</p>
    <AngleInvarianceVisualizer />
    <p>테스트용 본문입니다.</p>
    <HaversineVisualizer />
  </ArticleLayout>
</template>
