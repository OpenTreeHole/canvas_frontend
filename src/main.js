import { createApp } from 'vue'
import App from '@/App.vue'
import router from './plugins/router'
import store from '@/plugins/store'
import '@/css/index.css'
import eventBus from 'vue3-eventbus'

const app = createApp(App)

app.use(eventBus)
app.use(store)
app.use(router)
app.mount('#app')
