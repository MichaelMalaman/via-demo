<template>
    <div v-if="!isHome">
        <div v-if="username" class="dropdown position-static" ref="dropdownRoot">
            <span class="me-2">{{ username }}</span>

            <button ref="ddBtn"
                    class="btn btn-dropdown dropdown-toggle"
                    type="button"
                    :id="dropdownId"
                    aria-expanded="isOpen ? 'true' : 'false'"
                    @click="toggle">
                <svg class="icon">
                    <use :href="`${spritesHref}#it-user`"></use>
                </svg>
            </button>

            <div class="dropdown-menu dropdown-menu-end"
                 :class="{ show: isOpen }"
                 :aria-labelledby="dropdownId">
                <div class="link-list-wrapper">
                    <ul class="link-list">
                        <li><a href="#" @click="goToAccount"><span>Account</span></a></li>
                        <li><a href="#" @click="goToNotifications"><span>Notifications</span></a></li>
                        <li><a href="#" @click="goToAbout"><span>Tree</span></a></li>
                        <li><a href="#" @click="onLogout"><span>Disconnetti</span></a></li>
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

    import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
    import { useStore } from 'vuex'
    import { useRouter, useRoute } from 'vue-router'

    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    const isHome = computed(() => route.name === 'home')
    const username = computed(() => store.state.username ?? '')

    const dropdownId = `userMenu_${Math.random().toString(36).slice(2)}`
    const ddBtn = ref(null)
    const dropdownRoot = ref(null)
    const isOpen = ref(false)

    const goToAccount = () => router.push('/')
    const goToNotifications = () => router.push('/Notifications')
    const goToAbout = () => router.push('/About')
    const goToHome = () => router.push({ name: 'home' })

    const doLogout = async () => {
        try {
            await store.dispatch?.('logout')
            store.commit?.('setUsername', '')
        } catch (e) {
            console.error('Errore logout:', e)
        } finally {
            router.push('/')
        }
    }
    const onLogout = () => doLogout()

    const toggle = () => {
        isOpen.value = !isOpen.value
    }

    const onDocumentClick = (e) => {
        // chiudi se click fuori dal dropdown
        if (!dropdownRoot.value) return
        if (!dropdownRoot.value.contains(e.target)) {
            isOpen.value = false
        }
    }

    onMounted(() => {
        document.addEventListener('click', onDocumentClick, true)
    })

    onBeforeUnmount(() => {
        document.removeEventListener('click', onDocumentClick, true)
    })
</script>

<style scoped>
    .dropdown {
        overflow: visible;
    }

    .dropdown-menu {
        z-index: 2000 !important;
    }
        /* Anche qui: leghiamo display:block alla classe .show */
        .dropdown-menu.show {
            display: block;
        }
</style>