
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
import AreaCommunityCommenti from '../views/AreaCommunityCommenti.vue'
import AssistenteAnalisiImpatti from '../views/AssistenteAnalisiImpatti.vue'
import scoping from '../views/scoping.vue'
import provvedimentoDiConsultazione from '../views/provvedimentoDiConsultazione.vue'
import AggregazioneESintesi from '../views/AggregazioneESintesi.vue'
import ControdeduzioniConsultazionePubblica from '../views/ControdeduzioniConsultazionePubblica.vue'



import api from '@/services/api'   

const routes = [
    //  ROTTA PUBBLICA
    { path: '/', name: 'home', component: Home, meta: { title: 'home', public: true } },

    //  TUTTE LE ALTRE ROTTE SONO PROTETTE
    { path: '/about', name: 'about', component: About, meta: { title: 'about', public: true } },
    { path: '/dashboard', name: 'dashboard', component: Dashboard, meta: { title: 'dashboard', public: true } },
    { path: '/singleProjectDocumentsView', name: 'singleProjectDocumentsView', component: SingleProjectDocumentsView, meta: { title: 'SingleProjectDocumentsView', public: true } },
    { path: '/formPratica', name: 'formPratica', component: FormPratica, public: true, meta: { title: 'formPratica', public: true } },
    { path: '/singleFileOpen', name: 'singleFileOpen', component: SingleFileOpen, meta: { title: 'singleFileOpen', public: true } },
    { path: '/messages', name: 'messages', component: Messages, meta: { title: 'messages', public: true } },
    { path: '/newProject', name: 'newProject', component: NewProject, meta: { title: 'newProject', public: true } },
    { path: '/notifications', name: 'notifications', component: Notifications, meta: { title: 'notifications', public: true } },
    { path: '/AreaCommunityCommenti', name: 'AreaCommunityCommenti', component: AreaCommunityCommenti, meta: { title: 'AreaCommunityCommenti', public: true } },
    { path: '/AssistenteAnalisiImpatti', name: 'AssistenteAnalisiImpatti', component: AssistenteAnalisiImpatti, meta: { title: 'AssistenteAnalisiImpatti', public: true } },
    { path: '/scoping', name: 'scoping', component: scoping, meta: { title: 'scoping', public: true } },
    { path: '/provvedimentoDiConsultazione', name: 'provvedimentoDiConsultazione', component: provvedimentoDiConsultazione, meta: { title: 'scoping', public: true } },
    { path: '/AggregazioneESintesi', name: 'AggregazioneESintesi', component: AggregazioneESintesi, meta: { title: 'scoping', public: true } },
    { path: '/ControdeduzioniConsultazionePubblica', name: 'ControdeduzioniConsultazionePubblica', component: ControdeduzioniConsultazionePubblica, meta: { title: 'ControdeduzioniConsultazionePubblica', public: true } }

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
