<template>
    <v-app-bar color="#0066CC" class="pa-1">
        <v-app-bar-title @click="$router.push('/about')" class="font-weight-bold">
            VIA
        </v-app-bar-title>

        <v-spacer />

        <AvatarWithTooltip v-if="!isHome" class="pa-1" />
    </v-app-bar>
</template>



<script setup lang="ts">
    import AvatarWithTooltip from './avatarWithTooltip.vue'
    import { computed } from 'vue'
    import { useRoute } from 'vue-router'

    const route = useRoute()

    // true se siamo sulla route 'home'
    const isHome = computed(() => route.name === 'Home')
</script>