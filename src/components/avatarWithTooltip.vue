
<template>
    <div class="d-flex align-center">
        <!-- Tooltip sull'icona utente, come nel tuo codice -->
        <v-tooltip v-if="store.state.username" v-model="showTooltip" location="start">
            <template #activator="{ props }">
                <v-icon v-bind="props"
                        size="56"
                        class="cursor-pointer"
                        style="color:white"
                        @click="toggleTooltip">
                    mdi-account-circle
                </v-icon>
            </template>
            <span>{{ tooltipText }}</span>
        </v-tooltip>

        <!-- MENU sulla label: si attiva solo se label != 'Utente' -->
        <v-menu v-if="label !== 'Utente'"
                v-model="menuOpen"
                :close-on-content-click="true"
                location="bottom"
                :offset="8">
            <!-- Attivatore: lo span della label -->
            <template #activator="{ props }">
                <span class="ml-4 font-weight-medium cursor-pointer"
                      v-bind="props"
                      role="button"
                      aria-haspopup="menu"
                      :aria-expanded="menuOpen ? 'true' : 'false'">
                    {{ label }}
                </span>
            </template>

            <!-- Contenuto del menu -->
            <v-list density="comfortable" nav>
                <v-list-item value="account"
                             prepend-icon="mdi-account"
                             @click="goToAccount">
                    <v-list-item-title>Account utente</v-list-item-title>
                </v-list-item>

                <v-list-item value="messages"
                             prepend-icon="mdi-email"
                             @click="goToMessages">
                    <v-list-item-title>Messaggi</v-list-item-title>
                </v-list-item>

                <v-divider class="my-1" />

                <v-list-item value="logout"
                             prepend-icon="mdi-logout"
                             class="text-error"
                             @click="doLogout">
                    <v-list-item-title>Logout</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>

        <!-- Fallback quando non autenticato -->
        <span v-else class="ml-4 font-weight-medium">
            <v-btn color="secondary" @click="$router.push('/')">
                vai alla pagina di autenticazione
            </v-btn>
        </span>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue'
    import { useStore } from 'vuex'
    import { useRouter } from 'vue-router'

    const store = useStore()
    const router = useRouter()

    // Computed che legge lo username dallo store
    const username = computed(() => store.state.username ?? '')

    // (Opzionale) calcola un ruolo a partire dallo username
    const ruolo = computed(() => {
        switch (username.value.toLowerCase()) {
            case 'pippo': return 'Proponente'
            case 'topolino': return 'Ente'
            case 'minny': return 'Autorità competente'
            case 'paperino': return 'Utente community'
            default: return 'Utente'
        }
    })

    // Tooltip: usa una computed per testi dinamici
    const tooltipText = computed(() => `Sei autenticato con il ruolo di ${ruolo.value}`)

    // Label accanto all’avatar: mostra lo username, con fallback
    const label = computed(() => username.value || 'Utente')

    // Stato tooltip + toggle
    const showTooltip = ref(false)
    const toggleTooltip = () => { showTooltip.value = !showTooltip.value }

    // Stato del menu
    const menuOpen = ref(false)

    // Azioni del menu
    const goToAccount = () => {
        menuOpen.value = false
        router.push('/account') // aggiorna con il tuo path reale
    }

    const goToMessages = () => {
        menuOpen.value = false
        router.push('/messaggi') // aggiorna con il tuo path reale
    }

    const doLogout = async () => {
        menuOpen.value = false
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

    console.log('username:', username.value)
</script>

<style scoped>
    .cursor-pointer {
        cursor: pointer;
    }
</style>