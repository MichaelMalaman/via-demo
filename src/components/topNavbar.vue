
<template>
  <!-- Header semplice in stile Bootstrap Italia -->
  <header class="it-header-wrapper">
    <div class="it-header-center-wrapper bg-primary-custom"
         role="navigation"
         aria-label="Barra applicazione">
      <div class="container">
        <div
          class="it-header-center-content-wrapper d-flex align-items-center justify-content-between py-1"
        >
          <!-- Titolo brand -->
          <button
            type="button"
            class="btn btn-link text-white text-decoration-none fw-bold px-0 brand-via"
            @click="goAbout"
            aria-label="Vai alla pagina About"
          >
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

/* ↓ Riduci altezza header: min-height + padding più contenuto */
.it-header-center-wrapper {

  min-height: 30px; /* prima era 48px */

}


.it-header-center-content-wrapper {
  padding-top: 0.25rem !important;  
  padding-bottom: 0.25rem !important;
}

.brand-via {
  font-size: 4rem; 
  line-height: 1.1;   
  letter-spacing: 0.02em; 
}

/* Assicura buon allineamento verticale dei contenuti */
.it-header-center-content-wrapper > * {
  line-height: 1.2;
}
</style>
