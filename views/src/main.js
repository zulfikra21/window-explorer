import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createMemoryHistory, createRouter } from 'vue-router'


// initializing the vue application route 
const routes = [
    {
        path: '/',
        component: () => import('./pages/index.vue')
    },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})


createApp(App)
    .use(router)
    .mount('#app')
