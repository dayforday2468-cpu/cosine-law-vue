<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="app-navbar">
    <nav class="navbar-inner">
      <RouterLink class="brand" to="/">
        <strong class="site-identity">김명철</strong>
        <span class="site-description">Interactive Resume</span>
      </RouterLink>

      <div class="nav-links">
        <RouterLink class="site-link" to="/">Home</RouterLink>
        <RouterLink class="site-link" to="/articles/spherical-cosine-law">Articles</RouterLink>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.app-navbar {
  position: sticky;
  top: 0;
  z-index: 100;

  border-bottom: var(--border-default);

  background: var(--color-background-overlay);
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: min(var(--container-width), calc(100% - var(--space-l)));
  margin: 0 auto;
  height: var(--layout-bar-height);
}

.brand {
  display: flex;
  flex-direction: column;

  text-decoration: none;
}

.brand span {
  margin-top: var(--space-s);
}

.nav-links {
  display: grid;
  grid-template-columns: repeat(2, var(--link-column-width));
  gap: var(--space-m);
}

.nav-links a {
  text-align: center;
  text-decoration: none;

  transition: color 0.2s ease;
}

.nav-links a:hover {
  color: var(--color-main);
}

.nav-links a.router-link-exact-active {
  color: var(--color-main);
  font-weight: var(--font-weight-bold);
}

@media (max-width: 640px) {
  .navbar-inner {
    width: min(var(--container-width), calc(100% - var(--space-m)));
  }
}
</style>
