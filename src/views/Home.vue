<!-- pagina per selezionare il metodo di login spid o CIE -->
<template>
    <v-container class="fill-height d-flex justify-center align-center bg-primary">

        <v-card class=" pa-0 w-70 h-70">
            <v-sheet elevation="4">
                <!-- Tabs con v-model -->
                <v-tabs v-model="tab" color="primary">
                    <v-tab value="one">SPID</v-tab>
                    <v-tab value="two">CIE</v-tab>
                </v-tabs>

                <v-divider></v-divider>

                <!-- Contenuto delle tabs -->
                <v-tabs-window v-model="tab">
                    <v-tabs-window-item value="one">
                        <v-container>
                            <v-row no-gutters>
                                <v-col>
                                    <v-sheet class="pa-2 ma-2">
                                        <meta charset="UTF-8">
                                        <p>
                                            SPID, il Sistema Pubblico di Identità Digitale, è il sistema di accesso che consente di utilizzare,
                                            con un'identità digitale unica, i servizi online della Pubblica Amministrazione e dei privati accreditati.
                                            Se sei già in possesso di un'identità digitale, accedi con le credenziali del tuo gestore.
                                            Se non hai ancora un'identità digitale, richiedila ad uno dei gestori.
                                        </p>
                                    </v-sheet>
                                </v-col>

                                <v-responsive width="100%"></v-responsive>

                                <v-col>
                                    <v-sheet class="pa-2 ma-2">
                                        <ul class="no-bullets">
                                            <li><a href="#"> Maggiori informazioni su SPID</a></li>
                                            <li><a href="#"> #Non hai lo SPID?</a></li>
                                            <li><a href="#"> #Serve aiuto?</a></li>
                                        </ul>
                                    </v-sheet>
                                </v-col>

                                <v-col>
                                    <v-sheet class="pa-2 ma-2 ">
                                        <v-btn color="#0066CC"
                                               class="d-flex align-center pa-0"
                                               style="height: 80px; width: 260px;">
                                            <!-- Parte sinistra: icona in cerchio -->
                                            <div class="d-flex align-center justify-center" style="width: 56px; background-color: white; border-radius: 50%;">
                                                <v-icon color="#0066CC" size="70">mdi-account</v-icon>
                                            </div>

                                            <!-- Linea di separazione -->
                                            <div style="width: 1px; background-color: white; margin: 0 12px;"></div>

                                            <!-- Testo -->
                                            <span class="text-white font-weight-bold">Entra con SPID</span>
                                        </v-btn>
                                    </v-sheet>
                                </v-col>

                                <v-responsive width="100%"></v-responsive>

                                <v-col>
                                    <v-sheet class="pa-2 ma-2">
                                    </v-sheet>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-tabs-window-item>

                    <v-tabs-window-item value="two">
                        <v-container class="fill-height d-flex justify-center align-center">
                            <v-card class="pa-0 w-70 fixed-min-height">
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
                                                <v-card class="d-flex flex-column fixed-min-height">
                                                    <v-card-title class="text-h6">
                                                        Entra con le tue credenziali CIE
                                                    </v-card-title>
                                                    <v-card-text>
                                                        <v-form>
                                                            <v-text-field v-model="usernameInput"
                                                                          label="Numero CIE o Codice fiscale o Email"
                                                                          autocomplete="username" />
                                                            <v-text-field label="Password"
                                                                          type="password"
                                                                          autocomplete="current-password" />
                                                            <p class="text-body-2 mt-2">
                                                                Hai dimenticato la password?
                                                                <strong>#Richiedine una nuova</strong>
                                                            </p>
                                                            <v-row class="mt-4" dense>
                                                                <v-col cols="6">
                                                                    <v-btn variant="outlined" block>Annulla</v-btn>
                                                                </v-col>
                                                                <v-col cols="6">
                                                                    <v-btn @click="salvaUsername()" color="primary" block>Procedi</v-btn>
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
                                                <v-card class="d-flex flex-column fixed-min-height">
                                                    <v-card-title class="text-h6">Entra con App CieID</v-card-title>
                                                    <v-card-text class="d-flex flex-column justify-center align-center">
                                                        <p>Apri l'App CieID ed inquadra il QR Code.</p>
                                                        <div class="text-center my-6">
                                                            <!-- QR Code casuale -->
                                                            <v-img>qrUrl</v-img>
                                                        </div>
                                                    </v-card-text>
                                                </v-card>
                                            </v-col>
                                        </v-row>

                                        <!-- Card lettura carta -->
                                        <v-row class="mt-6">
                                            <v-col cols="12">
                                                <v-card class="fixed-min-height">
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
                    </v-tabs-window-item>
                </v-tabs-window>

                <!-- ✅ Snackbar: utente non trovato -->
                <v-snackbar v-model="snackbar.show" :timeout="3000" :color="snackbar.color">
                    {{ snackbar.message }}
                    <template #actions>
                        <v-btn variant="text" @click="snackbar.show = false">Chiudi</v-btn>
                    </template>
                </v-snackbar>
            </v-sheet>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">

    import { ref } from 'vue'
    import { useStore } from 'vuex'
    import { useRouter } from 'vue-router'

    // Tab
    const tab = ref('one') // valore iniziale

    // QR
    const qrUrl = ref(`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${Math.random()}`)

    // Router
    const router = useRouter()

    // Campo username
    const usernameInput = ref('')

    // Vuex
    const store = useStore()

    // Snackbar stato
    const snackbar = ref<{ show: boolean; message: string; color: string }>({
        show: false,
        message: '',
        color: 'error', // rosso di default per gli errori
    })
    function showSnack(message: string, color: string = 'error') {
        snackbar.value = { show: true, message, color }
    }

    // Salva e instrada
    const salvaUsername = () => {
        store.commit('setUsername', usernameInput.value)
        console.log('Username salvato:', store.state.username)
        router.push({ name: 'dashboard' })

    }


</script>

<style scoped>
    h1 {
        margin-top: 50px;
    }

    .no-bullets {
        list-style-type: none; /* rimuove i pallini */
        padding-left: 0; /* elimina il padding di default */
    }

    .fixed-min-height {
        min-height: 600px;
    }
</style>