<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <div class="footer-profile">
        <strong class="text-identity">김명철</strong>
        <p class="text-description">문제를 발견하고, 구조를 이해하고, 코드로 구현합니다.</p>
      </div>

      <div class="footer-links">
        <a class="text-link" href="mailto:dayforday2468@gmail.com">Email</a>

        <a
          class="text-link"
          href="https://github.com/dayforday2468-cpu"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  margin-top: var(--space-l);

  border-top: var(--border-default);
  background: var(--color-background);
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: min(var(--container-width), calc(100% - var(--space-l)));
  margin: 0 auto;
  min-height: var(--layout-bar-height);
}

.footer-profile p {
  margin: var(--space-s) 0 0;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(2, var(--link-column-width));
  gap: var(--space-m);
}

.footer-links a {
  text-align: center;
  text-decoration: none;

  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: var(--color-main);
}

@media (max-width: 640px) {
  .footer-inner {
    width: min(var(--container-width), calc(100% - var(--space-m)));
  }
}
</style>
