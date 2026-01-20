
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Dashboard from '../views/Dashboard.vue'
import SingleProjectDocumentsView from '../views/SingleProjectDocumentsView.vue'
import FormPratica from '../views/formPratica.vue'
import SingleFileOpen from '../views/SingleFileOpen.vue'
import Messages from '../views/Messages.vue'
import NewProject from '../views/newProject.vue'
import Notifications from '../views/Notifications.vue'

import api from '@/services/api'   

const routes = [
    //  ROTTA PUBBLICA
    { path: '/', name: 'home', component: Home, meta: { title: 'home', public: true } },

    //  TUTTE LE ALTRE ROTTE SONO PROTETTE
    { path: '/about', name: 'about', component: About, meta: { title: 'about', public: false } },
    { path: '/dashboard', name: 'dashboard', component: Dashboard, meta: { title: 'dashboard', public: false } },
    { path: '/singleProjectDocumentsView', name: 'singleProjectDocumentsView', component: SingleProjectDocumentsView, meta: { title: 'SingleProjectDocumentsView', public: false } },
    { path: '/formPratica', name: 'formPratica', component: FormPratica, public: false, meta: { title: 'formPratica', public: false } },
    { path: '/singleFileOpen', name: 'singleFileOpen', component: SingleFileOpen, meta: { title: 'singleFileOpen', public: false } },
    { path: '/messages', name: 'messages', component: Messages, meta: { title: 'messages', public: false } },
    { path: '/newProject', name: 'newProject', component: NewProject, meta: { title: 'newProject', public: false } },
    { path: '/notifications', name: 'notifications', component: Notifications, meta: { title: 'notifications', public: false } }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// ===================================================
//  ROUTER GUARD CON VALIDAZIONE JWT
// ===================================================
router.beforeEach(async (to, from, next) => {
    // Imposta il titolo
    if (to.meta?.title) {
        document.title = `Via Portale - ${to.meta.title}`
    }

    // Controlla se la rotta è pubblica
    if (to.meta.public) {
        return next()
    }

    // Controlla token localStorage
    const token = localStorage.getItem('token')

    if (!token) {
        // Token mancante → torna alla login
        return next({ name: 'home' })
    }

    // Verifica token col backend
    try {
        await api.get('users/me', {
            headers: { Authorization: `Bearer ${token}` }
        })

        // Token valido → avanti
        return next()
    } catch (err) {
        console.error('JWT NON valido:', err)

        // Rimuovi token e rimanda alla login
        localStorage.removeItem('token')

        return next({ name: 'home' })
    }
})

export default router
