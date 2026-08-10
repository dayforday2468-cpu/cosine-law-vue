import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import './style.css'
import './font.css'

const app = createApp(App)

app.use(router)

app.mount('#app')
