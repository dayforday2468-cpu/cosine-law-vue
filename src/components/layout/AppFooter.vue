<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <div class="footer-profile">
        <strong>김명철</strong>
        <p>문제를 발견하고, 구조를 이해하고, 코드로 구현합니다.</p>
      </div>

      <div class="footer-links">
        <a href="mailto:dayforday2468@gmail.com"> Email </a>

        <a href="https://github.com/dayforday2468-cpu" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  margin-top: 80px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;

  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
  padding: 40px 0;
}

.footer-profile strong {
  color: #0f172a;
  font-size: 17px;
  font-weight: 800;
}

.footer-profile p {
  margin: 8px 0 0;

  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
}

.footer-links {
  display: flex;
  gap: 24px;
}

.footer-links a {
  color: #475569;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;

  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: #2563eb;
}

@media (max-width: 640px) {
  .app-footer {
    margin-top: 56px;
  }

  .footer-inner {
    align-items: flex-start;
    flex-direction: column;

    width: min(100% - 24px, 1120px);
    padding: 32px 0;
  }
}
</style>
