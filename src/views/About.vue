
<template>
    <v-container class="text-center">
        <h1>Menu pagine solo per DEV</h1>
        <v-btn color="secondary" @click="$router.push('/')">Torna alla Home</v-btn>
        <v-btn color="secondary" @click="$router.push('/dashboardProponente')">DashboardProponente</v-btn>
        <v-btn color="secondary" @click="$router.push('/authCIE')">EntraConCIE</v-btn>
        <v-btn color="secondary" @click="$router.push('/singleProjectDocumentsView')">SingleProjectDocumentsView</v-btn>
        <v-btn color="secondary" @click="$router.push('/formPratica')">Form nuov pratica</v-btn>
    </v-container>



    <template>
        <v-card>
            <v-card-title>Gestione Webcam</v-card-title>
            <v-card-text>
                <v-select :items="cameraOptions" v-model="selectedCamera" label="Seleziona Webcam" />
                <v-btn @click="startCamera">Avvia</v-btn>
                <v-btn @click="stopCamera">Stop</v-btn>
                <video ref="video" autoplay playsinline style="width: 100%;"></video>
            </v-card-text>
        </v-card>
    </template>




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
