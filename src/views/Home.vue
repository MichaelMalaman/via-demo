
<template>
    <!-- Frame a tutta viewport -->
    <v-container class="app-frame d-flex justify-center align-center bg-primary px-10" fluid>
        <!-- Card centrale con dimensioni determinate -->
        <v-sheet class="app-card" elevation="4">
            <!-- Tabs -->
            <v-tabs v-model="tab" color="primary">
                <v-tab value="one">SPID</v-tab>
                <v-tab value="two">CIE</v-tab>
            </v-tabs>

            <v-divider />

            <!-- Finestra dei tab: occupa tutto lo spazio verticale della card -->
            <v-tabs-window v-model="tab" class="tabs-window h-100" :touch="false">
                <!-- TAB SPID -->
                <v-tabs-window-item value="one" class="h-100">
                    <!-- Contenuto scrollabile -->
                    <div class="tab-scroll">
                        <v-row no-gutters>
                            <v-col>
                                <v-sheet class="pa-2 ma-2">
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
                                        <li><a href="#">## Maggiori informazioni su SPID</a></li>
                                        <li><a href="#">## #Non hai lo SPID?</a></li>
                                        <li><a href="#">## #Serve aiuto?</a></li>
                                    </ul>
                                </v-sheet>
                            </v-col>

                            <v-col>
                                <v-btn color="#0066CC"
                                       class="d-flex align-center pa-0"
                                       style="height: 80px; width: 260px;">
                                    <!-- Parte sinistra: icona in cerchio -->
                                    <div class="d-flex align-center justify-center"
                                         style="width: 56px; background-color: white; border-radius: 50%;">
                                        <v-icon color="#0066CC" size="70">mdi-account</v-icon>
                                    </div>

                                    <!-- Linea di separazione -->
                                    <div style="width: 1px; background-color: white; margin: 0 12px;"></div>

                                    <!-- Testo -->
                                    <span class="text-white font-weight-bold">Entra con SPID</span>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </div>
                </v-tabs-window-item>

                <!-- TAB CIE -->
                <v-tabs-window-item value="two" class="h-100">
                    <div class="tab-scroll">
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
                            <v-col cols="12" md="6">
                                <h2 class="text-h6">Entra con le tue credenziali CIE</h2>

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
                            </v-col>

                            <!-- Card QR -->
                            <v-col cols="12" md="6">
                                <span class="text-h6">Entra con App CieID</span>
                                <span class="d-flex flex-column justify-center align-center"></span>

                                <div class="d-flex justify-center my-4">
                                <v-img :src="qrUrl" width="220px" height="220px"></v-img>

                                </div>

                                <p>Apri l'App CieID ed inquadra il QR Code.</p>
                            </v-col>
                        </v-row>
                        <v-divider class="mt-10"></v-divider>

                        <!-- Card lettura carta -->
                        <v-row class="mt-6">
                            <v-col cols="12">
                                <span class="text-h6">Entra con lettura carta</span>
                                <p>
                                    Puoi entrare con la lettura della Carta (livello 3) da smartphone NFC o PC con lettore smart card.
                                    <br /><br />
                                    <strong>#Scopri di più</strong>
                                </p>
                                <v-btn color="primary" block class="mt-4">Entra con lettura carta</v-btn>
                            </v-col>
                        </v-row>
                    </div>
                </v-tabs-window-item>
            </v-tabs-window>

            <!-- Snackbar -->
            <v-snackbar v-model="snackbar.show" :timeout="3000" :color="snackbar.color">
                {{ snackbar.message }}
                <template #actions>
                    <v-btn variant="text" @click="snackbar.show = false">Chiudi</v-btn>
                </template>
            </v-snackbar>
        </v-sheet>
    </v-container>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { useStore } from 'vuex'
    import { useRouter } from 'vue-router'

    const tab = ref<'one' | 'two'>('one')

    const qrUrl ='https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=0.11978395002270947'

    const router = useRouter()
    const usernameInput = ref('')

    const store = useStore()
    const snackbar = ref<{ show: boolean; message: string; color: string }>({
        show: false,
        message: '',
        color: 'error'
    })

    function showSnack(message: string, color: string = 'error') {
        snackbar.value = { show: true, message, color }
    }

    const salvaUsername = () => {
        store.commit('setUsername', usernameInput.value)
        console.log('Username salvato:', store.state.username)
        router.push({ name: 'dashboard' })
    }
</script>

<style scoped>
    /* --- FRAME --- */
    /* blocca l'altezza/larghezza rispetto al dispositivo */
    .app-frame {
        height: 100vh;
        width: 100vw;
    }

    /* --- CARD --- */
    /* card centrale: dimensione deterministica + layout verticale */
    .app-card {
        /* scegli un layout: fisso o responsive con max-width */
        max-width: 960px; /* card “desktop” centrata */
        width: 100%;
        height: 80vh; /* blocca l’altezza del contenuto */
        margin: 0 auto;
        display: flex;
        flex-direction: column;
    }

    /* la finestra dei tab deve riempire la card */
    .tabs-window {
        flex: 1 1 auto;
        min-height: 0; /* crucial per abilitare lo scroll del figlio */
    }

    /* contenuto dei tab scrollabile, non cambia l'altezza del frame */
    .tab-scroll {
        height: 100%;
        overflow: auto;
        padding: 16px;
    }

    /* utilità originali */
    .no-bullets {
        list-style: none;
        padding: 0;
    }

    /* opzionale: evita salti di layout con immagini variabili */
    .v-img {
        border-radius: 4px;
    }
</style>
