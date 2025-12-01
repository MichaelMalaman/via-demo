<!--pagina per selezionare il metodo di login spid o CIE-->

<template>
    <v-container class="fill-height d-flex justify-center align-center bg-primary">
        <v-card class="pa-0 w-70 h-70">
            <v-sheet elevation="4">
                <v-container class="py-8">
                    <!-- Titolo -->
                    <v-row>
                        <v-col cols="12" md="8">
                            <p class="text-subtitle-2 font-weight-bold">
                                RICHIESTA D'ACCESSO CIE - LIVELLO 2
                            </p>
                        </v-col>
                    </v-row>

                    <!-- Sezione principale -->
                    <v-row class="justify-center align-stretch" dense>
                        <!-- Card credenziali -->
                        <v-col cols="6" md="6">
                            <v-card class="d-flex flex-column" style="height: 100%">
                                <v-card-title class="text-h6">
                                    Entra con le tue credenziali CIE
                                </v-card-title>
                                <v-card-text>
                                    <v-form>
                                        <v-text-field label="Numero CIE o Codice fiscale o Email" autocomplete="username"/>
                                        <v-text-field label="Password" type="password"  autocomplete="current-password"/>
                                        <p class="text-body-2 mt-2">
                                            Hai dimenticato la password?
                                            <strong>#Richiedine una nuova</strong>
                                        </p>
                                        <v-row class="mt-4" dense>
                                            <v-col cols="6">
                                                <v-btn variant="outlined" block>Annulla</v-btn>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-btn color="primary" block>Procedi</v-btn>
                                            </v-col>
                                        </v-row>
                                        <p class="text-body-2 mt-4">
                                            Non hai ancora attivato le credenziali CIE?
                                            <strong>#Attivale ora</strong>
                                        </p>
                                    </v-form>
                                </v-card-text>
                            </v-card>
                        </v-col>

                        <!-- Card QR -->
                        <v-col cols="6" md="6">
                            <v-card class="d-flex flex-column" style="height: 100%">
                                <v-card-title class="text-h6">Entra con App CieID</v-card-title>
                                <v-card-text class="d-flex flex-column justify-center align-center">
                                    <p>Apri l'App CieID ed inquadra il QR Code.</p>
                                    <div class="text-center my-6">
                                        <!-- QR Code casuale -->
                                        <v-img :src="qrUrl"
                                               alt="QR Code"></v-img>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>

                    <!-- Card lettura carta -->
                    <v-row class="mt-6">
                        <v-col cols="12">
                            <v-card>
                                <v-card-title class="text-h6">Entra con lettura carta</v-card-title>
                                <v-card-text>
                                    <p>
                                        Puoi entrare con la lettura della Carta (livello 3) da smartphone NFC o PC con lettore smart card.
                                        <br /><br />
                                        <strong>#Scopri di più</strong>
                                    </p>
                                    <v-btn color="primary" block class="mt-4">Entra con lettura carta</v-btn>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
            </v-sheet>
        </v-card>
    </v-container>
</template>



<style scoped>
    .w-70 {
        width: 70%;
    }

    .h-70 {
        min-height: 70%;
    }
</style>


<script setup lang="ts">
    import { ref } from 'vue'

    // Definisci la variabile tab
    const tab = ref('one') // valore iniziale
    const qrUrl = ref(`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${Math.random()}`)

</script>

<style scoped>
    h1 {
        margin-top: 50px;
    }

    .no-bullets {
        list-style-type: none; /* rimuove i pallini */
        padding-left: 0; /* elimina il padding di default */
    }
</style>
