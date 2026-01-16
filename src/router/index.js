
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

import api from '@/services/api'   // <--- usa il tuo client axios

const routes = [
    //  ROTTA PUBBLICA
    { path: '/', name: 'home', component: Home, meta: { title: 'home', public: true } },

    //  TUTTE LE ALTRE ROTTE SONO PROTETTE
    { path: '/about', name: 'about', component: About, meta: { title: 'about' } },
    { path: '/dashboard', name: 'dashboard', component: Dashboard, meta: { title: 'dashboard' } },
    { path: '/singleProjectDocumentsView', name: 'singleProjectDocumentsView', component: SingleProjectDocumentsView },
    { path: '/formPratica', name: 'formPratica', component: FormPratica },
    { path: '/singleFileOpen', name: 'singleFileOpen', component: SingleFileOpen },
    { path: '/messages', name: 'messages', component: Messages },
    { path: '/newProject', name: 'newProject', component: NewProject },
    { path: '/notifications', name: 'notifications', component: Notifications }
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
