
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import authCIE from '../views/authCIE.vue'
import authSPID from '../views/authSPID.vue'
import dashboardProponente from '../views/DashboardProponente.vue'
import singleProjectDocumentsView from '../views/SingleProjectDocumentsView.vue'
import formPratica from '../views/formPratica.vue'


const routes = [
    { path: '/', name: 'Home', component: Home, meta: { title:'Home'} },
    { path: '/about', name: 'About', component: About, meta: { title: 'About' } },
    { path: '/authCIE', name: 'authCIE', component: authCIE, meta: { title: 'authCIE' } },
    { path: '/authSPID', name: 'authSPID', component: authSPID, meta: { title: 'authSPID' } },
    { path: '/dashboardProponente', name: 'dashboardProponente', component: dashboardProponente, meta: { title: 'dashboardProponente' } },
    { path: '/singleProjectDocumentsView', name: 'singleProjectDocumentsView', component: singleProjectDocumentsView, meta: { title: 'singleProjectDocumentsView' } },
    { path: '/formPratica', name: 'formPratica', component: formPratica, meta: { title: 'formPratica' } }

]

const router = createRouter({
    history: createWebHistory(),
    routes
})


// Imposta il titolo pagina e protezione delle rotte
router.beforeEach((to, from, next) => {
    if (to.meta?.title) document.title = `Via Portale • ${to.meta.title}`

    if (to.meta?.requiresAuth && !store.getters.isAuthenticated) {
        return next({ path: '/', query: { redirect: to.fullPath } })
    }
    next()
})

export default router

