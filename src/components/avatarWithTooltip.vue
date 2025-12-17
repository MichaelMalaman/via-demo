
<template>
    <div class="d-flex align-items-center">
        <!-- Icona utente con tooltip -->
        <button v-if="store.state.username"
                ref="avatarBtnRef"
                type="button"
                class="btn btn-link p-0 me-2"
                aria-label="Utente autenticato"
                @click="toggleTooltip">
            <!-- Sostituibile con sprite BI -->
            <svg class="icon" style="width:56px;height:56px;color:white;">
                <circle cx="28" cy="28" r="28" fill="currentColor" opacity="0.0"></circle>
                <circle cx="28" cy="22" r="10" fill="currentColor"></circle>
                <rect x="14" y="34" width="28" height="14" rx="7" fill="currentColor"></rect>
            </svg>
        </button>

        <!-- MENU sulla label (dropdown) -->
        <div v-if="label !== 'Utente'" class="dropdown">
            <span class="ms-3 fw-medium cursor-pointer"
                  role="button"
                  id="userMenuToggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false">
                {{ label }}
            </span>

            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userMenuToggle">
                <li>
                    <button class="dropdown-item d-flex align-items-center gap-2" @click="goToAccount">
                        <span>Account utente</span>
                    </button>
                </li>
                <li>
                    <button class="dropdown-item d-flex align-items-center gap-2" @click="goToMessages">
                        <span>Messaggi</span>
                    </button>
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                    <button class="dropdown-item text-danger d-flex align-items-center gap-2" @click="doLogout">
                        <span>Logout</span>
                    </button>
                </li>
            </ul>
        </div>

        <!-- Fallback quando non autenticato -->
        <span v-else class="ms-3 fw-medium">
            <button type="button" class="btn btn-secondary" @click="$router.push('/')">
                vai alla pagina di autenticazione
            </button>
        </span>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
    import { useStore } from 'vuex'
    import { useRouter } from 'vue-router'
    // Se vuoi usare le icone BI via sprite:
    // import spritesUrl from 'bootstrap-italia/dist/svg/sprites.svg?url'

    declare global { interface Window { bootstrap: any } }

    const store = useStore()
    const router = useRouter()

    const username = computed(() => store.state.username ?? '')
    const ruolo = computed(() => {
        switch (username.value.toLowerCase()) {
            case 'pippo': return 'Proponente'
            case 'topolino': return 'Ente'
            case 'minny': return 'Autorità competente'
            case 'paperino': return 'Utente community'
            default: return 'Utente'
        }
    })
    const tooltipText = computed(() => `Sei autenticato con il ruolo di ${ruolo.value}`)
    const label = computed(() => username.value || 'Utente')

    const avatarBtnRef = ref<HTMLElement | null>(null)
    let tooltipInstance: any = null

    function toggleTooltip() {
        if (!tooltipInstance) return
        const isVisible = avatarBtnRef.value?.getAttribute('aria-describedby')
        isVisible ? tooltipInstance.hide() : tooltipInstance.show()
    }

    onMounted(() => {
        if (avatarBtnRef.value && window.bootstrap) {
            tooltipInstance = new window.bootstrap.Tooltip(avatarBtnRef.value, {
                title: tooltipText.value,
                placement: 'left',
                trigger: 'manual',
                customClass: 'text-wrap'
            })
        }
    })

    watch(tooltipText, (val) => {
        if (tooltipInstance) {
            tooltipInstance.setContent({ '.tooltip-inner': val })
        }
    })

    onBeforeUnmount(() => {
        tooltipInstance?.dispose()
        tooltipInstance = null
    })

    const goToAccount = () => router.push('/account')
    const goToMessages = () => router.push('/messaggi')
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
</script>

<style scoped>
    .cursor-pointer {
        cursor: pointer;
    }

    .fw-medium {
        font-weight: 500;
    }
</style>
``
