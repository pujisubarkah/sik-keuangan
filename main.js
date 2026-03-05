import { createApp } from 'vue'
import App from './app.vue'
import router from './router'
import { createPinia } from 'pinia'
import IddsVue from '@idds/vue'
import '@idds/vue/index.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(IddsVue)

app.mount('#app')