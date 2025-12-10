
<template>
    <v-container class="fill-height d-flex justify-center align-center bg-primary">
        <v-sheet elevation="4" class="pa-4 w-100">
            <v-row class="w-100" align="center" justify="center">
                <!-- Blocco centrale -->
                <v-col cols="8" class="d-flex justify-center">
                    <v-sheet elevation="2" class="pa-6 rounded-lg text-center">

                        <v-container >
                            <v-row no-gutters>
                                <v-col>
                                    <v-sheet class="pa-2 ma-2">

                                        <!-- Header documento -->
                                        <div class="text-center">
                                            <h1 class="doc-title">VALUTAZIONE DELL’IMPATTO AMBIENTALE</h1>
                                            <h2 class="doc-subtitle">IMPIANTO FOTOVOLTAICO</h2>
                                            <h3 class="doc-section-title mt-2">ANALISI DEL TERRENO</h3>
                                            <div class="doc-date mt-3">Aprile 2024</div>
                                        </div>
                                    </v-sheet>
                                </v-col>
                            </v-row>
                            <v-row no-gutters>
                                <v-col>
                                    <v-sheet class="pa-2 ma-2">

                                        <!-- Sezione 1 -->
                                        <div class="mt-8">
                                            <div class="section-heading">1. INTRODUZIONE</div>
                                            <p class="doc-paragraph">
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus
                                                ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum.
                                                Praesent mauris. Fusce nec tellus sed augue semper porta.
                                            </p>
                                        </div>

                                    </v-sheet>
                                </v-col>
                                <v-col>
                                    <v-sheet class="pa-2 ma-2">

                                        <div class="section-heading">2. CARATTERISTICHE GEOLOGICHE</div>

                                        <v-row class="mt-3" align="start" no-gutters>
                                            <!-- Tabella Parametro/Valore -->
                                            <v-col>
                                                <v-table class="doc-table" density="comfortable">
                                                    <thead>
                                                        <tr>
                                                            <th class="text-left">Parametro</th>
                                                            <th class="text-left">Valore</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>pH</td>
                                                            <td>6.8</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Permeabilità</td>
                                                            <td>Moderato</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Tessitura del suolo</td>
                                                            <td>Franco sabbioso</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Sostanza organica</td>
                                                            <td>2,3%</td>
                                                        </tr>
                                                    </tbody>
                                                </v-table>
                                            </v-col>


                                        </v-row>




                                    </v-sheet>
                                </v-col>

                                <v-responsive width="100%"></v-responsive>

                                <v-col>

                                        <!-- Capitolo 3 -->
                                        <v-sheet  class="pa-2 ma-2" elevation="1">
                                            <h3 class="text-h6 mb-2">3. Uso attuale del suolo</h3>
                                            <p>
                                                L’area di progetto è attualmente destinata a colture agricole estensive con rotazioni stagionali.
                                                Non sono presenti insediamenti permanenti; accesso tramite strade poderali.
                                            </p>

                                            <v-list density="compact" class="mt-3">
                                                <v-list-item title="Destinazione prevalente: agricola" />
                                                <v-list-item title="Uso secondario: fasce inerbite" />
                                                <v-list-item title="Accessibilità: viabilità rurale" />
                                            </v-list>



                                            <v-alert type="info" variant="tonal" class="mt-3">
                                                Compatibile con attività di cantiere temporanee.
                                            </v-alert>
                                        </v-sheet>

                                </v-col>

                                <v-col>




                                        <!-- Capitolo 4 -->
                                        <v-sheet  class="pa-2 ma-2" elevation="1">
                                            <h3 class="text-h6 mb-2">4. Vincoli ambientali e paesaggistici</h3>
                                            <p>
                                                Non vi sono vincoli diretti, ma occorre rispettare fasce di tutela idraulica e prescrizioni paesaggistiche.
                                            </p>

                                            <v-list density="compact" class="mt-3">
                                                <v-list-item title="Fascia di rispetto corso d’acqua" />
                                                <v-list-item title="Verifica compatibilità paesaggistica" />
                                                <v-list-item title="Presenza elettrodotto MT" />
                                            </v-list>

                                            <v-data-table :headers="[
          { title: 'Vincolo', key: 'vincolo' },
          { title: 'Dettaglio', key: 'dettaglio' }
        ]"
                                                          :items="[
          { vincolo: 'Paesaggio rurale', dettaglio: 'Schermature a verde' },
          { vincolo: 'Corso d’acqua', dettaglio: 'Fascia di rispetto' }
        ]"
                                                          hide-default-footer
                                                          class="mt-4" />

                                            <v-alert type="warning" variant="tonal" class="mt-3">
                                                Prevedere schermature a verde per mitigare l’impatto visivo.
                                            </v-alert>
                                        </v-sheet>



                                </v-col>
                            </v-row>
                            <v-row no-gutters>
                                <vcol>
                                    <!-- Capitolo 5 -->
                                    <v-sheet  class="pa-2 ma-2" elevation="1">
                                        <h3 class="text-h6 mb-2">5. Rischi idrogeologici</h3>
                                        <p>
                                            Pericolosità idraulica bassa, assenza di frane. Possibili ristagni temporanei in caso di piogge intense.
                                        </p>

                                        <v-list density="compact" class="mt-3">
                                            <v-list-item title="Pericolosità idraulica: bassa" />
                                            <v-list-item title="Pericolosità da frana: nulla" />
                                            <v-list-item title="Mitigazioni: drenaggi leggeri" />
                                        </v-list>

                                        <v-data-table :headers="[
          { title: 'Aspetto', key: 'aspetto' },
          { title: 'Valutazione', key: 'valutazione' }
        ]"
                                                      :items="[
          { aspetto: 'Idraulico', valutazione: 'Basso rischio' },
          { aspetto: 'Frane', valutazione: 'Assente' }
        ]"
                                                      hide-default-footer
                                                      class="mt-4" />

                                        <v-alert type="success" variant="tonal" class="mt-3">
                                            Compatibilità idrogeologica positiva.
                                        </v-alert>
                                    </v-sheet>
                                </vcol>
                                <v-col></v-col>
                            </v-row>
                        </v-container>

                    </v-sheet>
                </v-col>

                <!-- Colonna destra con pulsanti -->
                <v-col cols="4" class="d-flex flex-column align-center justify-center gap-4">
                    <v-btn color="primary" block @click="openSnack('Hai cliccato il primo pulsante', 'primary')">
                        Primo Pulsante
                    </v-btn>

                    <v-btn color="secondary" block @click="openSnack('Hai cliccato il secondo pulsante', 'secondary')">
                        Secondo Pulsante
                    </v-btn>

                    <v-btn color="error" block @click="openSnack('Hai cliccato il terzo pulsante', 'error')">
                        Terzo Pulsante
                    </v-btn>
                </v-col>
            </v-row>

            <!-- Snackbar (puoi metterla anche più in alto o in fondo alla pagina) -->
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

    /** Stato snackbar: DEVE esistere prima che il template lo usi */
    const snackbar = ref<{ show: boolean; message: string; color: string }>({
        show: false,
        message: '',
        color: 'primary',
    })

    function openSnack(message: string, color: string = 'primary') {
        snackbar.value = { show: true, message, color }
    }
</script>

<style scoped>
    .bg-primary {
        background: #1976d2; /* solo per vedere meglio il contrasto */
    }

    .rounded-lg {
        border-radius: 12px;
    }

    .gap-4 > * + * {
        margin-top: 16px;
    }
</style>
