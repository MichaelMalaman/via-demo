
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
    import { ref } from 'vue'

    const showTooltip = ref(false)
    const tooltipText = 'Sei autenticato con il ruolo di Proponente'
    const label = 'Mario Rossi'

    const toggleTooltip = () => {
        showTooltip.value = !showTooltip.value
    }
</script>

<style scoped>
    .cursor-pointer {
        cursor: pointer;
    }
</style>
