<script setup>
import { ref, watch } from 'vue'

import { LoadingOverlay } from '@/components/common'

import ArticleMediaFrame from './ArticleMediaFrame.vue'

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
})

const isLoading = ref(true)

watch(
  () => props.src,
  () => {
    isLoading.value = true
  },
)
</script>

<template>
  <ArticleMediaFrame :caption="caption">
    <div class="video-wrapper">
      <video
        class="video-player"
        :src="src"
        controls
        preload="metadata"
        playsinline
        @loadedmetadata="isLoading = false"
        @error="isLoading = false"
      />

      <LoadingOverlay
        :visible="isLoading"
        message="동영상을 불러오고 있습니다."
      />
    </div>
  </ArticleMediaFrame>
</template>

<style scoped>
.video-wrapper {
  position: relative;
}

.video-player {
  display: block;

  width: 100%;

  border: var(--border-default);
  border-radius: var(--radius-m);

  background: var(--color-background-sub);
}
</style>
