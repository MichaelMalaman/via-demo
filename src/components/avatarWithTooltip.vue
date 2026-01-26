
<template>
    <div v-if="!isHome">
        <div v-if="username" class="dropdown position-static" @click.stop>
            <span class="me-2">{{ username }}</span>

            <button ref="ddBtn"
                    class="btn btn-dropdown dropdown-toggle"
                    type="button"
                    :id="dropdownId"
                    data-bs-toggle="dropdown"
                    data-bs-display="static"
                    data-bs-auto-close="outside"
                    data-focus-mouse="false"
                    aria-expanded="false">
                <svg class="icon">
                    <use :href="`${spritesHref}#it-user`"></use>
                </svg>
            </button>

            <div class="dropdown-menu dropdown-menu-end" :aria-labelledby="dropdownId">
                <div class="link-list-wrapper">
                    <ul class="link-list">
                        <li>
                            <a href="#" @click.prevent="goToAccount"><span>Account</span></a>
                        </li>
                        <li>
                            <a href="#" @click.prevent="goToNotifications"><span>Notifications</span></a>
                        </li>
                        <li>
                            <a href="#" @click.prevent="goToAbout"><span>Tree</span></a>
                        </li>
                        <li>
                            <a href="#" @click.prevent="onLogout"><span>Disconnetti</span></a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div v-else>
            <button class="btn btn-primary d-flex align-items-center gap-2" @click.prevent="goToHome">
                Non sei autenticato torna alla Home
                <svg class="icon"><use :href="`${spritesHref}#it-home`"></use></svg>
            </button>
        </div>
    </div>
</template>

<script setup>
    import spritesUrl from 'bootstrap-italia/dist/svg/sprites.svg?url'
    const spritesHref = spritesUrl

    import { ref, computed, onMounted, nextTick } from 'vue'
    import { useStore } from 'vuex'
    import { useRouter, useRoute } from 'vue-router'

    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    const isHome = computed(() => route.name === 'home')
    const username = computed(() => store.state.username ?? '')

    // ---- Dropdown: id univoco + ref al bottone
    const dropdownId = `userMenu_${Math.random().toString(36).slice(2)}`
    const ddBtn = ref(null)



    // ---- Navigazione
    const goToAccount = () => router.push('/')                 // aggiorna con il path reale
    const goToNotifications = () => router.push('/Notifications') // aggiorna con il path reale
    const goToAbout = () => router.push('/About')
    const goToHome = () => router.push({ name: 'home' })

    // ---- Logout
    const doLogout = async () => {
        try {
            await store.dispatch?.('logout')         // se esiste
            store.commit?.('setUsername', '')        // se esiste
        } catch (e) {
            console.error('Errore logout:', e)
        } finally {
            router.push('/')                         // pagina di autenticazione
        }
    }
    const onLogout = () => doLogout()
</script>

<style scoped>
    /* Evita che un ancestor "tagli" il menu */
    .dropdown {
        overflow: visible;
    }
</style>
