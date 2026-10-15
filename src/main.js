import { inject } from '@vercel/analytics'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import './style.css'
import './components/styles/font.css'
import './components/styles/tokens.css'
import './components/styles/typography.css'

inject()

const app = createApp(App)

app.use(router)

app.mount('#app')
