
<template>
    <div class="container text-center my-5">
        <h1 class="mb-4">Menu pagine solo per DEV</h1>

        <div class="d-flex flex-wrap justify-content-center gap-2">
            <button type="button" class="btn btn-success" @click="goTo('/')">Torna alla Home</button>
            <button type="button" class="btn btn-success" @click="goTo('/dashboard')">Dashboard</button>
            <button type="button" class="btn btn-success" @click="goTo('/singleProjectDocumentsView')">SingleProjectDocumentsView</button>
            <button type="button" class="btn btn-success" @click="goTo('/formPratica')">Form nuova pratica</button>
            <button type="button" class="btn btn-danger" @click="goTo('/singleFileOpen')">Form pratica</button>
            <button type="button" class="btn btn-danger" @click="goTo('/messages')">Messaggi</button>
            <button type="button" class="btn btn-success" @click="goTo('/newProject')">newProject</button>
            <button type="button" class="btn btn-success" @click="goTo('/Notifications')">Notifications</button>
            <button type="button" class="btn btn-success" @click="goTo('/AreaCommunityCommenti')">AreaCommunityCommenti</button>
            <button type="button" class="btn btn-success" @click="goTo('/AssistenteAnalisiImpatti')">AssistenteAnalisiImpatti</button>
            <button type="button" class="btn btn-success" @click="goTo('/scoping')">scoping</button>
            <button type="button" class="btn btn-success" @click="goTo('/provvedimentoDiConsultazione')">provvedimentoDiConsultazione</button>
            <button type="button" class="btn btn-success" @click="goTo('/AggregazioneESintesi')">AggregazioneESintesi</button>
            <button type="button" class="btn btn-success" @click="goTo('/ControdeduzioniConsultazionePubblica')">ControdeduzioniConsultazionePubblica</button>

        </div>
    </div>
</template>

<script setup lang="ts">
    import { useRouter } from 'vue-router'
    const router = useRouter()

    function goTo(path: string) {
        router.push(path)
    }
</script>

<style scoped>
    h1 {
        margin-top: 50px; /* come nell'originale */
    }

    /* utility per gap quando non si usa Bootstrap 5.3+ */
    .gap-2 {
        gap: .5rem;
    }
</style>
