<template>
  <p class="viewer-guide">
    <slot />
  </p>
</template>

<style scoped>
.viewer-guide {
  position: absolute;
  z-index: 10;

  bottom: clamp(10px, 1.5vw, 20px);
  left: clamp(10px, 1.5vw, 20px);

  margin: 0;
  padding: clamp(5px, 0.7vw, 8px) clamp(8px, 1vw, 12px);

  border: 1px solid #dbe3ee;
  border-radius: 8px;

  background: rgb(255 255 255 / 90%);
  color: #475569;

  font-size: clamp(10px, 1vw, 14px);
  line-height: 1.4;
  white-space: nowrap;

  pointer-events: none;
}
</style>