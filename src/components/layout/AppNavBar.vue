<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="app-navbar">
    <nav class="navbar-inner">
      <RouterLink class="brand" to="/">
        <strong>김명철</strong>
        <span>Interactive Resume</span>
      </RouterLink>

      <div class="nav-links">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/articles/spherical-cosine-law">Articles</RouterLink>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.app-navbar {
  position: sticky;
  top: 0;
  z-index: 100;

  border-bottom: 1px solid #e2e8f0;

  background: rgba(255, 255, 255, 0.95);
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
  min-height: 72px;
}

.brand {
  display: flex;
  flex-direction: column;

  color: #0f172a;
  text-decoration: none;
}

.brand strong {
  font-family: 'YuhanKimberlyPureunsoop', sans-serif;
  font-size: 20px;
  font-weight: 700;
}

.brand span {
  margin-top: 2px;

  color: #64748b;
  font-size: 14px;
  font-weight: 500;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 28px;
}

.nav-links a {
  position: relative;

  padding: 24px 0;

  color: #64748b;
  font-family: 'NanumBarunGothic', sans-serif;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;

  transition: color 0.2s ease;
}

.nav-links a:hover {
  color: #0f172a;
}

.nav-links a.router-link-exact-active {
  color: #2563eb;
}

.nav-links a.router-link-exact-active::after {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;

  height: 2px;

  background: #2563eb;

  content: '';
}

@media (max-width: 640px) {
  .navbar-inner {
    width: min(100% - 24px, 1120px);
    min-height: 64px;
  }

  .brand span {
    display: none;
  }

  .nav-links {
    gap: 18px;
  }

  .nav-links a {
    padding: 21px 0;

    font-size: 14px;
  }
}
</style>
