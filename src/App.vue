<script setup>
import { RouterView } from 'vue-router'

import AppNavbar from '@/components/layout/AppNavBar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
</script>

<template>
  <AppNavbar />
  <RouterView />
  <AppFooter />
</template>
