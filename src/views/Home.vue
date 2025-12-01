<!--pagina per selezionare il metodo di login spid o CIE-->
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
                        <v-container class="bg-surface-variant">
                            <v-row no-gutters>
                                <v-col>
                                    <v-sheet class="pa-2 ma-2">
                                        <meta charset="UTF-8">
                                        <p>


                                            SPID, il Sistema Pubblico di Identit&agrave; Digitale, &egrave; il sistema di accesso che consente di utilizzare, con un'identit&agrave; digitale unica, i servizi online della Pubblica Amministrazione e dei privati accreditati.
                                            Se sei gi&agrave; in possesso di un'identit&agrave; digitale, accedi con le credenziali del tuo gestore.
                                            Se non hai ancora un'identit&agrave; digitale, richiedila ad uno dei gestori.


                                        </p>


                                    </v-sheet>
                                </v-col>

                                <v-responsive width="100%"></v-responsive>

                                <v-col>
                                    <v-sheet class="pa-2 ma-2">
                                        <ul class="no-bullets"><li><a href="#">Maggiori informazioni su SPID</a></li><li><a href="#">Non hai lo SPID?</a></li><li><a href="#">Serve aiuto?</a></li></ul>
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
                                        .v-col-auto
                                        LOGHI
                                        .v-col-auto
                                    </v-sheet>
                                </v-col>
                            </v-row>
                        </v-container>

                    </v-tabs-window-item>
                    <v-tabs-window-item value="two">
                        <v-container >
                            <v-row no-gutters>
                                <v-col>
                                    <v-sheet class="pa-2 ma-2">
                                        <meta charset="UTF-8">
                                        <p>


                                            SPID, il Sistema Pubblico di Identit&agrave; Digitale, &egrave; il sistema di accesso che consente di utilizzare, con un'identit&agrave; digitale unica, i servizi online della Pubblica Amministrazione e dei privati accreditati.
                                            Se sei gi&agrave; in possesso di un'identit&agrave; digitale, accedi con le credenziali del tuo gestore.
                                            Se non hai ancora un'identit&agrave; digitale, richiedila ad uno dei gestori.


                                        </p>


                                    </v-sheet>
                                </v-col>

                                <v-responsive width="100%"></v-responsive>

                                <v-col>
                                    <v-sheet class="pa-2 ma-2">
                                        <ul class="no-bullets"><li><a href="#">Maggiori informazioni su SPID</a></li><li><a href="#">Non hai lo SPID?</a></li><li><a href="#">Serve aiuto?</a></li></ul>
                                    </v-sheet>
                                </v-col>

                                <v-col>
                                    <v-sheet class="pa-2 ma-2 ">


                                        <v-btn color="#0066CC"
                                               class="d-flex align-center pa-0"
                                               style="height: 80px; width: 260px;">
                                            <!-- Parte sinistra: icona in cerchio -->
                                            <div class="d-flex align-center justify-center" style="width: 56px; background-color: white; border-radius: 50%;">
                                                <v-icon color="#0066CC" size="32">mdi-account</v-icon>
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
                                        .v-col-auto
                                        LOGHI
                                        .v-col-auto
                                    </v-sheet>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-tabs-window-item>

                </v-tabs-window>
            </v-sheet>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
    import { ref } from 'vue'

    // Definisci la variabile tab
    const tab = ref('one') // valore iniziale
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
