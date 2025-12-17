
<template>
    <!-- Frame a tutta viewport, centrato, con sfondo primario -->
    <div class="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-primary-custom">
        <!-- Card principale (elevazione 4) -->
        <div class="card shadow p-4 w-100">
            <div class="row w-100 align-items-center justify-content-center">
                <!-- Blocco centrale -->
                <div class="col-12 col-lg-8 d-flex justify-content-center">
                    <!-- Card interna (elevazione 2), centrata e arrotondata -->
                    <div class="card shadow-sm p-4 rounded-3 text-center w-100">
                        <div class="container">
                            <div class="row g-0">
                                <div class="col">
                                    <div class="p-2 m-2">
                                        <!-- Header documento -->
                                        <div class="text-center">
                                            <h1 class="doc-title">VALUTAZIONE DELL’IMPATTO AMBIENTALE</h1>
                                            <h2 class="doc-subtitle">IMPIANTO FOTOVOLTAICO</h2>
                                            <h3 class="doc-section-title mt-2">ANALISI DEL TERRENO</h3>
                                            <div class="doc-date mt-3">Aprile 2024</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row g-0">
                                <div class="col">
                                    <div class="p-2 m-2 text-start">
                                        <!-- Sezione 1 -->
                                        <div class="mt-4">
                                            <div class="section-heading">1. INTRODUZIONE</div>
                                            <p class="doc-paragraph">
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus
                                                ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum.
                                                Praesent mauris. Fusce nec tellus sed augue semper porta.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div class="col">
                                    <div class="p-2 m-2 text-start">
                                        <!-- Sezione 2 -->
                                        <div class="section-heading">2. CARATTERISTICHE GEOLOGICHE</div>

                                        <div class="row mt-3 g-0 align-items-start">
                                            <!-- Tabella Parametro/Valore -->
                                            <div class="col">
                                                <div class="table-responsive">
                                                    <table class="table table-sm align-middle doc-table">
                                                        <thead>
                                                            <tr>
                                                                <th class="text-start">Parametro</th>
                                                                <th class="text-start">Valore</th>
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
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Separatore full width (equivalente di v-responsive width="100%") -->
                                <div class="w-100"></div>

                                <div class="col">
                                    <!-- Capitolo 3 -->
                                    <div class="p-2 m-2 shadow-sm rounded-3 text-start">
                                        <h3 class="h6 mb-2">3. Uso attuale del suolo</h3>
                                        <p>
                                            L’area di progetto è attualmente destinata a colture agricole estensive con rotazioni stagionali.
                                            Non sono presenti insediamenti permanenti; accesso tramite strade poderali.
                                        </p>

                                        <ul class="list-group list-group-flush mt-3">
                                            <li class="list-group-item">Destinazione prevalente: agricola</li>
                                            <li class="list-group-item">Uso secondario: fasce inerbite</li>
                                            <li class="list-group-item">Accessibilità: viabilità rurale</li>
                                        </ul>

                                        <div class="alert alert-info mt-3 mb-0" role="alert">
                                            Compatibile con attività di cantiere temporanee.
                                        </div>
                                    </div>
                                </div>

                                <div class="col">
                                    <!-- Capitolo 4 -->
                                    <div class="p-2 m-2 shadow-sm rounded-3 text-start">
                                        <h3 class="h6 mb-2">4. Vincoli ambientali e paesaggistici</h3>
                                        <p>
                                            Non vi sono vincoli diretti, ma occorre rispettare fasce di tutela idraulica e prescrizioni paesaggistiche.
                                        </p>

                                        <ul class="list-group list-group-flush mt-3">
                                            <li class="list-group-item">Fascia di rispetto corso d’acqua</li>
                                            <li class="list-group-item">Verifica compatibilità paesaggistica</li>
                                            <li class="list-group-item">Presenza elettrodotto MT</li>
                                        </ul>

                                        <div class="table-responsive mt-4">
                                            <table class="table table-sm align-middle">
                                                <thead>
                                                    <tr>
                                                        <th>Vincolo</th>
                                                        <th>Dettaglio</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Paesaggio rurale</td>
                                                        <td>Schermature a verde</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Corso d’acqua</td>
                                                        <td>Fascia di rispetto</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <div class="alert alert-warning mt-3 mb-0" role="alert">
                                            Prevedere schermature a verde per mitigare l’impatto visivo.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row g-0">
                                <div class="col">
                                    <!-- Capitolo 5 -->
                                    <div class="p-2 m-2 shadow-sm rounded-3 text-start">
                                        <h3 class="h6 mb-2">5. Rischi idrogeologici</h3>
                                        <p>
                                            Pericolosità idraulica bassa, assenza di frane. Possibili ristagni temporanei in caso di piogge intense.
                                        </p>

                                        <ul class="list-group list-group-flush mt-3">
                                            <li class="list-group-item">Pericolosità idraulica: bassa</li>
                                            <li class="list-group-item">Pericolosità da frana: nulla</li>
                                            <li class="list-group-item">Mitigazioni: drenaggi leggeri</li>
                                        </ul>

                                        <div class="table-responsive mt-4">
                                            <table class="table table-sm align-middle">
                                                <thead>
                                                    <tr>
                                                        <th>Aspetto</th>
                                                        <th>Valutazione</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Idraulico</td>
                                                        <td>Basso rischio</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Frane</td>
                                                        <td>Assente</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <div class="alert alert-success mt-3 mb-0" role="alert">
                                            Compatibilità idrogeologica positiva.
                                        </div>
                                    </div>
                                </div>
                                <div class="col"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Colonna destra con pulsanti -->
                <div class="col-12 col-lg-4 d-flex flex-column align-items-center justify-content-center gap-4">
                    <button class="btn btn-primary w-100" @click="openSnack('Hai cliccato il primo pulsante', 'primary')">
                        Primo Pulsante
                    </button>

                    <button class="btn btn-secondary w-100" @click="openSnack('Hai cliccato il secondo pulsante', 'secondary')">
                        Secondo Pulsante
                    </button>

                    <button class="btn btn-danger w-100" @click="openSnack('Hai cliccato il terzo pulsante', 'error')">
                        Terzo Pulsante
                    </button>
                </div>
            </div>

            <!-- Toast (replacement di v-snackbar) -->
            <div class="toast position-fixed top-0 end-0 m-3"
                 role="alert"
                 aria-live="assertive"
                 aria-atomic="true"
                 ref="toastRef">
                <div class="toast-header" :class="toastHeaderClass">
                    <strong class="me-auto">Notifica</strong>
                    <button type="button"
                            class="btn-close"
                            data-bs-dismiss="toast"
                            aria-label="Chiudi"
                            @click="snackbar.show = false"></button>
                </div>
                <div class="toast-body" :class="toastBodyClass">
                    {{ snackbar.message }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, watch } from 'vue'

    // Stato snackbar → Toast Bootstrap Italia
    const snackbar = ref<{ show: boolean; message: string; color: string }>({
        show: false,
        message: '',
        color: 'primary',
    })

    function openSnack(message: string, color: string = 'primary') {
        snackbar.value = { show: true, message, color }
    }

    // Bootstrap bundle è caricato globalmente (main.ts)
    declare global { interface Window { bootstrap: any } }

    // Toast ref + mappatura colori
    const toastRef = ref<HTMLElement | null>(null)

    const toastHeaderClass = computed(() => {
        switch (snackbar.value.color) {
            case 'error': return 'bg-danger text-white'
            case 'success': return 'bg-success text-white'
            case 'warning': return 'bg-warning'
            case 'secondary': return 'bg-secondary text-white'
            default: return 'bg-primary text-white'
        }
    })

    const toastBodyClass = computed(() => {
        switch (snackbar.value.color) {
            case 'error': return 'bg-danger-subtle text-danger'
            case 'success': return 'bg-success-subtle text-success'
            case 'warning': return 'bg-warning-subtle text-warning'
            case 'secondary': return 'bg-secondary-subtle text-secondary'
            default: return ''
        }
    })

    // Mostra/nasconde toast quando cambia snackbar.show
    watch(() => snackbar.value.show, (show) => {
        if (!toastRef.value || !window.bootstrap) return
        const toast = window.bootstrap.Toast.getOrCreateInstance(toastRef.value, { delay: 3000 })
        show ? toast.show() : toast.hide()
    })
</script>

<style scoped>
    /* colore primario custom (equivalente al bg di Vuetify) */
    .bg-primary-custom {
        background: #1976d2; /* come nel tuo style */
    }

    .rounded-3 {
        border-radius: 0.75rem;
    }

    /* gap verticale personalizzato (simile alla tua .gap-4) */
    .gap-4 > * + * {
        margin-top: 16px;
    }

    /* tipografia documentale */
    h1.doc-title {
        font-weight: 700;
        font-size: 1.75rem;
    }

    h2.doc-subtitle {
        font-weight: 600;
        font-size: 1.25rem;
    }

    h3.doc-section-title, .section-heading {
        font-weight: 600;
    }

    .doc-paragraph {
        font-size: 1rem;
        line-height: 1.5;
    }

    /* tabella documentale */
    .doc-table thead th {
        font-weight: 600;
    }
</style>