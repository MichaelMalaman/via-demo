
<template>
    <div class="d-flex align-center">
        <v-tooltip v-model="showTooltip" location="start">
            <template #activator="{ props }">
                <v-icon v-bind="props"
                        size="56"
                        class="cursor-pointer;color:white"
                        @click="toggleTooltip">mdi-account-circle</v-icon>
            </template>
            <span>{{ tooltipText }}</span>
        </v-tooltip>

        <span class="ml-4 font-weight-medium">{{ label }}</span>
    </div>
</template>

<script setup lang="ts">

    import { ref, computed } from 'vue'         // importa computed

    import { useStore } from 'vuex'

    const store = useStore()

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

    // Log corretto del valore (usa .value)
    console.log('username:', username.value)
</script>



<style scoped>
    .cursor-pointer {
        cursor: pointer;
    }
</style>
