import { createApp } from 'vue'
import App from '@/App.vue'
import router from './plugins/router'
import store from '@/plugins/store'
import '@/css/index.css'

const app = createApp(App)
app.use(store)
app.use(router)
app.mount('#app')
