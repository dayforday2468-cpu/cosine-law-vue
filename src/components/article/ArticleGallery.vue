<script setup>
import { computed, ref, watch } from 'vue'

import { LoadingOverlay } from '@/components/common'

import ArticleMediaFrame from './ArticleMediaFrame.vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
})

const currentIndex = ref(0)
const isLoading = ref(true)

const currentItem = computed(() => props.items[currentIndex.value])

watch(
  () => currentItem.value?.src,
  () => {
    isLoading.value = true
  },
)

function showPrevious() {
  currentIndex.value =
    (currentIndex.value - 1 + props.items.length) % props.items.length
}

function showNext() {
  currentIndex.value =
    (currentIndex.value + 1) % props.items.length
}

function showItem(index) {
  currentIndex.value = index
}
</script>

<template>
  <ArticleMediaFrame
    v-if="currentItem"
    :caption="currentItem.caption"
  >
    <div class="gallery-viewer">
      <img
        :key="currentItem.src"
        :src="currentItem.src"
        :alt="currentItem.caption"
        class="gallery-image"
        loading="lazy"
        decoding="async"
        @load="isLoading = false"
        @error="isLoading = false"
      />

      <LoadingOverlay
        :visible="isLoading"
        message="사진을 불러오고 있습니다."
      />

      <template v-if="items.length > 1">
        <button
          type="button"
          class="gallery-control gallery-control--previous"
          aria-label="이전 사진"
          @click="showPrevious"
        >
          ‹
        </button>

        <button
          type="button"
          class="gallery-control gallery-control--next"
          aria-label="다음 사진"
          @click="showNext"
        >
          ›
        </button>

        <span class="gallery-counter">
          {{ currentIndex + 1 }} / {{ items.length }}
        </span>
      </template>
    </div>

    <div v-if="items.length > 1" class="gallery-indicator" aria-label="사진 선택">
      <button
        v-for="(_, index) in items"
        :key="index"
        type="button"
        class="gallery-dot"
        :class="{ 'gallery-dot--active': index === currentIndex }"
        :aria-label="`${index + 1}번째 사진 보기`"
        :aria-current="index === currentIndex ? 'true' : undefined"
        @click="showItem(index)"
      />
    </div>
  </ArticleMediaFrame>
</template>

<style scoped>
.gallery-viewer {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;

  border: var(--border-default);
  border-radius: var(--radius-m);

  background: var(--color-background-sub);
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.gallery-control {
  position: absolute;
  top: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  width: var(--space-l);
  height: var(--space-l);
  padding: 0;

  border: var(--border-default);
  border-radius: 50%;

  background: var(--color-background-overlay);
  color: var(--color-text-main);

  font-size: var(--font-size-l);
  line-height: 1;

  cursor: pointer;
  transform: translateY(-50%);
}

.gallery-control--previous {
  left: var(--space-s);
}

.gallery-control--next {
  right: var(--space-s);
}

.gallery-counter {
  position: absolute;
  top: var(--space-s);
  right: var(--space-s);

  padding: var(--space-s);

  border-radius: var(--radius-s);

  background: var(--color-background-overlay);
  color: var(--color-text-sub);

  font-family: var(--font-family-content);
  font-size: var(--font-size-s);
  line-height: 1;
}

.gallery-indicator {
  display: flex;
  justify-content: center;
  gap: var(--space-s);

  margin-top: var(--space-s);
}

.gallery-dot {
  width: var(--space-s);
  height: var(--space-s);
  padding: 0;

  border: 0;
  border-radius: 50%;

  background: var(--color-main-sub);

  cursor: pointer;
}

.gallery-dot--active {
  background: var(--color-main);
}
</style>
