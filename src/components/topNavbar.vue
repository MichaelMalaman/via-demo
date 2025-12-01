<script setup lang="ts">
        import AvatarWithTooltip from './avatarWithTooltip.vue'

    import { ref } from 'vue'


    const count = ref(0)
</script>

<template>

    <v-app-bar color="#0066CC" >
        <!-- Logo / Testo a sinistra -->
        <v-app-bar-title @click="$router.push('/about')" class="font-weight-bold">
             VIA
            
        </v-app-bar-title>

        <v-spacer />

        <AvatarWithTooltip />

    </v-app-bar>
</template>


<style scoped>

 
</style>
