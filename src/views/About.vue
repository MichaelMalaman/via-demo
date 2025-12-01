
<template>
    <v-container class="text-center">
        <h1>Menu pagine solo per DEV</h1>
        <v-btn color="secondary" @click="$router.push('/')">Torna alla Home</v-btn>
        <v-btn color="secondary" @click="$router.push('/dashboardProponente')">DashboardProponente</v-btn>
        <v-btn color="secondary" @click="$router.push('/authCIE')">EntraConCIE</v-btn>
        <v-btn color="secondary" @click="$router.push('/authSPID')">EntraConSPID</v-btn>
        <v-btn color="secondary" @click="$router.push('/singleProjectDocumentsView')">SingleProjectDocumentsView</v-btn>
        <v-btn color="secondary" @click="$router.push('/formPratica')">Form nuov pratica</v-btn>



    </v-container>
</template>

<script>
    export default {
        name: 'About'
    }
</script>

<style scoped>
    h1 {
        margin-top: 50px;
    }
</style>
