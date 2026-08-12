import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import ArticlesView from '@/views/ArticlesView.vue'
import SphericalCosineLawView from '@/views/SphericalCosineLawView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/articles',
      name: 'articles',
      component: ArticlesView,
    },
    {
      path: '/articles/spherical-cosine-law',
      name: 'spherical-cosine-law',
      component: SphericalCosineLawView,
    },
  ],
})

export default router
