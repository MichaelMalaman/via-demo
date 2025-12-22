
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'bootstrap-italia/dist/css/bootstrap-italia.min.css'
import 'bootstrap-italia/dist/js/bootstrap-italia.bundle.min.js'

createApp(App)
    .use(router)
    .use(store)
    .mount('#app')
