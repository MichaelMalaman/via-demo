
<template>
    <!-- Header semplice in stile Bootstrap Italia -->
    <header class="it-header-wrapper">
        <div class="it-header-center-wrapper bg-primary-custom"
             role="navigation"
             aria-label="Barra applicazione">
            <div class="container">
                <div class="it-header-center-content-wrapper d-flex align-items-center justify-content-between py-1">
                    <!-- Titolo brand -->
                    <button type="button"
                            class="btn btn-link text-white text-decoration-none fw-bold px-0"
                            @click="goAbout"
                            aria-label="Vai alla pagina About">
                        VIA
                    </button>

                    <!-- Spacer + Avatar -->
                    <div class="d-flex align-items-center ms-auto">
                        <AvatarWithTooltip v-if="!isHome" class="ps-2" />
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
    import AvatarWithTooltip from './avatarWithTooltip.vue'
    import { computed } from 'vue'
    import { useRoute, useRouter } from 'vue-router'

    const route = useRoute()
    const router = useRouter()

    // true se siamo sulla route 'Home'
    const isHome = computed(() => route.name === 'Home')

    // click su brand
    function goAbout() {
        router.push('/about')
    }
</script>

<style scoped>
    /* Colore primario custom come nel tuo Vuetify: #0066CC */
    .bg-primary-custom {
        background-color: #0066CC;
    }

    /* Allineamenti e dimensioni minime per l'header */
    .it-header-center-wrapper {
        /* opzionale: alza leggermente l'altezza per somigliare a v-app-bar con pa-1 */
        min-height: 48px;
    }

    /* Pulsante brand “VIA” stile testuale */
    .btn-link {
        font-size: 1.125rem; /* ~18px */
        line-height: 1;
    }
</style>
