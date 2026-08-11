<template>
  <p class="viewer-guide">
    <slot />
  </p>
</template>

<style scoped>
.viewer-guide {
  position: absolute;
  z-index: 10;

  bottom: var(--space-m);
  left: var(--space-m);

  margin: 0;
  padding: var(--space-s) var(--space-s);

  border: var(--border-default);
  border-radius: var(--radius-m);

  background: var(--color-background-overlay);
  color: var(--color-text-sub);

  font-size: var(--font-size-s);
  font-family: var(--font-family-content);
  font-weight: var(--font-weight-regular);
  line-height: 1.4;
  white-space: nowrap;

  pointer-events: none;
}
</style>
