
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import authCIE from '../views/authCIE.vue'

import dashboard from '../views/Dashboard.vue'
import singleProjectDocumentsView from '../views/SingleProjectDocumentsView.vue'
import formPratica from '../views/formPratica.vue'
import singleFileOpen from '../views/SingleFileOpen.vue'
import messages from '../views/Messages.vue'


const routes = [
    { path: '/', name: 'Home', component: Home, meta: { title:'Home'} },
    { path: '/about', name: 'About', component: About, meta: { title: 'About' } },
    { path: '/authCIE', name: 'authCIE', component: authCIE, meta: { title: 'authCIE' } },
    { path: '/dashboard', name: 'dashboard', component: dashboard, meta: { title: 'dashboard' } },
    { path: '/singleProjectDocumentsView', name: 'singleProjectDocumentsView', component: singleProjectDocumentsView, meta: { title: 'singleProjectDocumentsView' } },
    { path: '/formPratica', name: 'formPratica', component: formPratica, meta: { title: 'formPratica' } },
    { path: '/singleFileOpen', name: 'singleFileOpen', component: singleFileOpen, meta: { title: 'singleFileOpen' } },
    { path: '/messages', name: 'messages', component: messages, meta: { title: 'messages' } }

]

const router = createRouter({
    history: createWebHistory(),
    routes
})


// Imposta il titolo pagina e protezione delle rotte
router.beforeEach((to, from, next) => {
    if (to.meta?.title) document.title = `Via Portale - ${to.meta.title}`

    if (to.meta?.requiresAuth && !store.getters.isAuthenticated) {
        return next({ path: '/', query: { redirect: to.fullPath } })
    }
    next()
})

export default router

