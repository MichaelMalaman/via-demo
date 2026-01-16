
<template>
    <div v-if="!isHome">
        <div v-if="username" class="dropdown">
            {{username}}

            <button class="btn btn-dropdown dropdown-toggle"
                    type="button"
                    id="dropdownMenuLink"
                    data-bs-toggle="dropdown"
                    data-bs-display="static"
                    data-focus-mouse="false"
                    aria-expanded="false">
                <svg class="icon"><use :href="`${spritesHref}#it-user`"></use></svg>
            </button>

            <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <div class="link-list-wrapper">
                    <ul class="link-list">

                        <li>
                            <a href="#" @click.prevent="goToAccount"><span>Account</span></a>

                        </li>
                        <li>
                            <a href="#" @click.prevent="goToNotifications"><span>Notifications</span></a>
                        </li>
                        <li>
                            <a href="#" @click.prevent="goToMessages"><span>Messaggi</span></a>
                        </li>
                        <li>
                            <a href="#" @click.prevent="onLogout"><span>Disconnetti</span></a>
                        </li>


                    </ul>
                </div>
            </div>
        </div>

        <div v-else>
            <button class="btn btn-primary d-flex align-items-center gap-2"
                    @click.prevent="goToHome">
                <svg class="icon"><use :href="`${spritesHref}#it-home`"></use></svg>
                Torna alla homepage
            </button>
        </div>
    </div>
</template>

<script setup>
    import spritesUrl from 'bootstrap-italia/dist/svg/sprites.svg?url'
    const spritesHref = spritesUrl
    import { ref, computed } from 'vue'
    import { useStore } from 'vuex'

import { useRouter, useRoute } from 'vue-router'


const store = useStore()
const router = useRouter()
const route = useRoute()

    
const isHome = computed(() => route.name === 'home')


    // Computed che legge lo username dallo store
    const username = computed(() => store.state.username ?? '')

    // Azioni del menu
    const goToAccount = () => {
        router.push('/') // aggiorna con il tuo path reale
    }

    const goToMessages = () => {
        router.push('/messages') // aggiorna con il tuo path reale
    }
    const goToNotifications = () => {
        router.push('/Notifications') // aggiorna con il tuo path reale
    }

    function goToHome() { router.push({ name: 'home' }) }

    goToNotifications
    const doLogout = async () => {
        try {
            // Esempio di logout: pulisci lo store e vai alla login
            // Adatta a come gestisci l’autenticazione (action Vuex, token, ecc.)
            await store.dispatch?.('logout') // se hai un'azione 'logout', altrimenti rimuovi questa riga
            store.commit?.('setUsername', '') // se hai una mutation dedicata; altrimenti:
            // store.state.username = '' // NON consigliato: evita mutazioni dirette
        } catch (e) {
            console.error('Errore logout:', e)
        } finally {
            router.push('/') // pagina di autenticazione
        }
    }
</script>
