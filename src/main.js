import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import './style.css'
import './components/styles/font.css'
import './components/styles/tokens.css'
import './components/styles/typography.css'

const app = createApp(App)

app.use(router)

app.mount('#app')
