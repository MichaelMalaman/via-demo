
<template>
    <!-- container principale con sfondo -->
    <div class="container-fluid p-4" style="background-color:#e3f2fd;">
        <!-- Barra azioni -->
        <div class="row align-items-center mt-4 mb-4">
            <!-- Pulsante sinistro -->
            <div class="col-6 d-flex justify-content-start">
                <button class="btn btn-outline-primary bg-white d-inline-flex align-items-center"
                        @click="goTo('/dashboard')"
                        style="height: 50px;">
                    <svg class="icon"><use :href="`${spritesHref}#it-arrow-left`" /></svg>
                    <span class="ms-2">Indietro</span>
                </button>
            </div>

            <!-- Pulsante destro -->
            <div class="col-6 d-flex justify-content-end">
                <!-- spazio azioni -->
            </div>
        </div>

        <div class="row">
            <!-- LEFT COLUMN -->
            <div class="col-12 col-lg-8 p-4">
                <div class="card border p-4">
                    <!-- sezione contenuti con sfondo grigio chiaro -->
                    <div class="p-4" style="background-color:#f5f5f5;">

                        <!-- HEADER -->
                        <div class="row">
                            <div class="col-12">
                                <div class="card p-4 text-white" style="background-color:#1565c0;">
                                    <div class="d-flex align-items-center justify-content-between">
                                        <h2 class="mb-2">STUDIO PRELIMINARE AMBIENTALE</h2>
                                        <!-- Explainability pack allineato a destra del titolo -->
                                        <span class="explain-pack">
                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-info-circle"
                                                            color="light"
                                                            text="Fornisce il frontespizio con dati minimi (progetto, proponente, localizzazione, data) secondo gli schemi di presentazione VIA."
                                                            placement="bottom"
                                                            outline
                                                            :iconOnly="true"
                                                            size="xs" />
                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-help-circle"
                                                            color="light"
                                                            text="Campi compilati a partire dai metadati di progetto e da modelli interni; formattazione conforme allo stile VIA."
                                                            placement="bottom"
                                                            outline
                                                            :iconOnly="true"
                                                            size="xs">Come</PopoverExplain>
                                        </span>
                                    </div>

                                    <p><strong>Progetto:</strong> Realizzazione di un impianto fotovoltaico su area industriale dismessa</p>
                                    <p><strong>Proponente:</strong> [Nome Azienda]</p>
                                    <p><strong>Localizzazione:</strong> Comune di [Località], Provincia di [Provincia]</p>
                                    <p><strong>Data:</strong> Novembre 2025</p>
                                </div>
                            </div>
                        </div>

                        <!-- MAIN CONTENT -->
                        <div class="row">
                            <div class="col-12">
                                <div class="card p-4">

                                    <!-- 1. Introduzione e Obiettivi -->
                                    <h3 class="mb-0">1. Introduzione e Obiettivi</h3>
                                    <p class="mt-2">
                                        Lo Studio Preliminare Ambientale è redatto ai sensi dell’art. 19 del D.Lgs. 152/2006 e successive modifiche,
                                        con lo scopo di verificare l’assoggettabilità del progetto alla procedura di Valutazione di Impatto Ambientale (VIA).
                                        <br><strong>Obiettivo principale:</strong> fornire una descrizione sintetica del progetto e delle sue interazioni con l’ambiente,
                                        individuando rischi potenziali e misure di mitigazione.

                                        <span class="explain-pack">
                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-info-circle"
                                                            color="primary"
                                                            text="Serve a chiarire scopo e campo di applicazione del documento, come previsto dal quadro normativo applicabile."
                                                            placement="top"
                                                            outline
                                                            :iconOnly="true"
                                                            size="xs">Perché</PopoverExplain>

                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-help-circle"
                                                            color="primary"
                                                            text="L’AI ha estratto riferimenti normativi e obiettivi chiave dal prompt e dai modelli interni, assicurando coerenza con la struttura VIA."
                                                            placement="top"
                                                            outline
                                                            :iconOnly="true"
                                                            size="xs">Come</PopoverExplain>
                                        </span>
                                    </p>

                                    <!-- 2. Descrizione del Progetto -->
                                    <h3 class="mt-4 mb-0">2. Descrizione del Progetto</h3>
                                    <p class="mt-2">
                                        Il progetto prevede la realizzazione di un impianto fotovoltaico da 5 MW su un’area industriale dismessa di circa 10 ettari.
                                        <span class="explain-pack">
                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-info-circle"
                                                            color="secondary"
                                                            text="La descrizione consente di comprendere scala, caratteristiche tecniche e fasi progettuali, fondamentali per la pre‑valutazione degli impatti."
                                                            placement="top"
                                                            outline
                                                            :iconOnly="true"
                                                            size="xs">Perché</PopoverExplain>

                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-help-circle"
                                                            color="secondary"
                                                            text="Aggregazione di capitolato e scheda tecnica; normalizzazione di potenza, superfici e cronoprogramma secondo schemi standard."
                                                            placement="top"
                                                            outline
                                                            :iconOnly="true"
                                                            size="xs">Come</PopoverExplain>
                                        </span>
                                    </p>
                                    <ul>
                                        <li>Installazione di moduli fotovoltaici su strutture fisse orientate a sud.</li>
                                        <li>Collegamento alla rete elettrica tramite cabina di trasformazione.</li>
                                        <li>Durata del cantiere: 6 mesi.</li>
                                        <li>Fase operativa: 25 anni.</li>
                                    </ul>

                                    <p class="mt-2">
                                        <em>Suggerimento:</em> evidenziare la natura di riuso dell’area, che riduce il consumo di suolo vergine.
                                        <span class="explain-pack">
                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-info-circle"
                                                            color="info"
                                                            :iconOnly="true"
                                                            text="Il riuso dell’area attenua il consumo di suolo e costituisce elemento favorevole nella valutazione di compatibilità."
                                                            placement="top"
                                                            outline
                                                            size="xs">Perché</PopoverExplain>

                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-help-circle"
                                                            color="info"
                                                            :iconOnly="true"
                                                            text="Confronto tra destinazione urbanistica dell’area e linee guida VIA; inserimento automatico della nota nel punto opportuno."
                                                            placement="top"
                                                            outline
                                                            size="xs">Come</PopoverExplain>
                                        </span>
                                    </p>

                                    <!-- 3. Contesto Ambientale -->
                                    <h3 class="mt-4 mb-0">3. Contesto Ambientale</h3>
                                    <h4 class="mt-2 mb-0">3.1 Quadro territoriale</h4>
                                    <ul class="mt-2">
                                        <li>Area classificata come zona industriale dismessa, priva di vincoli paesaggistici diretti.</li>
                                        <li>Presenza di rete Natura 2000 a 3 km (potenziale rischio di interferenza indiretta).</li>
                                    </ul>
                                    <p class="mt-2">
                                        <span class="explain-pack">
                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-info-circle"
                                                            color="success"
                                                            :iconOnly="true"
                                                            text="Supporta l’analisi di coerenza localizzativa e la verifica preliminare di possibili interferenze con aree sensibili."
                                                            placement="top"
                                                            outline
                                                            size="xs">Perché</PopoverExplain>

                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-help-circle"
                                                            color="success"
                                                            :iconOnly="true"
                                                            text="Consultazione di layer GIS e repertori territoriali; estrazione di distanze chiave e sintesi degli elementi rilevanti."
                                                            placement="top"
                                                            outline
                                                            size="xs">Come</PopoverExplain>
                                        </span>
                                    </p>

                                    <h4 class="mt-2 mb-0">3.2 Componenti ambientali</h4>
                                    <ul class="mt-2">
                                        <li>Suolo e sottosuolo: contaminazione residua da precedenti attività industriali.</li>
                                        <li>Atmosfera: qualità dell’aria nella norma, con potenziale incremento di polveri in fase di cantiere.</li>
                                        <li>Idrologia: falda superficiale a 5 m di profondità.</li>
                                        <li>Flora e fauna: assenza di specie protette nell’area, corridoi ecologici nelle vicinanze.</li>
                                    </ul>
                                    <p class="mt-2">
                                        <span class="explain-pack">
                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-info-circle"
                                                            color="success"
                                                            :iconOnly="true"
                                                            text="Individua i recettori ambientali potenzialmente esposti e guida la definizione delle misure di mitigazione."
                                                            placement="top"
                                                            outline
                                                            size="xs">Perché</PopoverExplain>

                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-help-circle"
                                                            color="success"
                                                            :iconOnly="true"
                                                            text="Raccolta di dati disponibili (report pregressi, banche dati) e sintesi assistita per ogni componente."
                                                            placement="top"
                                                            outline
                                                            size="xs">Come</PopoverExplain>
                                        </span>
                                    </p>

                                    <!-- 4. Analisi Preliminare degli Impatti -->
                                    <h3 class="mt-4 mb-0">4. Analisi Preliminare degli Impatti</h3>
                                    <h4 class="mt-2 mb-0">4.1 Fase di cantiere</h4>
                                    <ul class="mt-2">
                                        <li>Emissioni di polveri e rumore → rischio moderato.</li>
                                        <li>Movimentazione terre e rocce da scavo → rischio di contaminazione se mal gestita.</li>
                                    </ul>
                                    <p class="mt-2">
                                        <span class="explain-pack">
                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-info-circle"
                                                            color="warning"
                                                            :iconOnly="true"
                                                            text="Consente di anticipare criticità operative e dimensionare le misure di prevenzione/mitigazione."
                                                            placement="top"
                                                            outline
                                                            size="xs">Perché</PopoverExplain>

                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-help-circle"
                                                            color="warning"
                                                            :iconOnly="true"
                                                            text="L’AI applica una tassonomia di impatti per fase e assegna livelli di rischio in base a tipologia e contesto."
                                                            placement="top"
                                                            outline
                                                            size="xs">Come</PopoverExplain>
                                        </span>
                                    </p>

                                    <h4 class="mt-2 mb-0">4.2 Fase operativa</h4>
                                    <ul class="mt-2">
                                        <li>Impatto visivo: basso, coerente con il contesto industriale.</li>
                                        <li>Consumo di suolo: nullo, trattandosi di riuso.</li>
                                        <li>Effetti sulla fauna: trascurabili, con monitoraggio consigliato.</li>
                                    </ul>
                                    <p class="mt-2">
                                        <span class="explain-pack">
                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-info-circle"
                                                            color="warning"
                                                            :iconOnly="true"
                                                            text="Definisce eventuali effetti residui nel lungo periodo e verifica l’adeguatezza dei controlli."
                                                            placement="top"
                                                            outline
                                                            size="xs">Perché</PopoverExplain>

                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-help-circle"
                                                            color="warning"
                                                            :iconOnly="true"
                                                            text="Confronto con casistica analoga e criteri interni; attribuzione di impatto residuale e raccomandazione di monitoraggio."
                                                            placement="top"
                                                            outline
                                                            size="xs">Come</PopoverExplain>
                                        </span>
                                    </p>

                                    <!-- 5. Indicazioni di Rischio Ambientale -->
                                    <h3 class="mt-4 mb-0">5. Indicazioni di Rischio Ambientale</h3>
                                    <ul class="mt-2">
                                        <li>Rischio idrogeologico: basso, da verificare con PAI.</li>
                                        <li>Rischio paesaggistico: minimo, coerenza con PPTR.</li>
                                        <li>Rischio su habitat protetti: basso, possibile VINCA se interferenze con Natura 2000.</li>
                                    </ul>
                                    <p class="mt-2">
                                        <span class="explain-pack">
                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-info-circle"
                                                            color="danger"
                                                            :iconOnly="true"
                                                            text="Supporta la decisione di assoggettabilità e orienta priorità di approfondimento."
                                                            placement="top"
                                                            outline
                                                            size="xs">Perché</PopoverExplain>

                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-help-circle"
                                                            color="danger"
                                                            :iconOnly="true"
                                                            text="Classificazione dei rischi su base normativa e territoriale; riepilogo automatico dei punti di attenzione."
                                                            placement="top"
                                                            outline
                                                            size="xs">Come</PopoverExplain>
                                        </span>
                                    </p>

                                    <!-- 6. Misure di Mitigazione -->
                                    <h3 class="mt-4 mb-0">6. Misure di Mitigazione</h3>
                                    <ul class="mt-2">
                                        <li>Polveri e rumore: barriere temporanee e sistemi di abbattimento.</li>
                                        <li>Terre e rocce: gestione conforme al D.Lgs. 152/2006.</li>
                                        <li>Monitoraggio: controlli periodici su suolo, aria e biodiversità.</li>
                                    </ul>
                                    <p class="mt-2">
                                        <span class="explain-pack">
                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-info-circle"
                                                            color="success"
                                                            :iconOnly="true"
                                                            text="Riduce i rischi individuati e dimostra la capacità di controllo nel cantiere e nell’esercizio."
                                                            placement="top"
                                                            outline
                                                            size="xs">Perché</PopoverExplain>

                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-help-circle"
                                                            color="success"
                                                            :iconOnly="true"
                                                            text="Selezione da libreria di misure standard e suggerimenti AI sulla base della tipologia d’intervento e del contesto."
                                                            placement="top"
                                                            outline
                                                            size="xs">Come</PopoverExplain>
                                        </span>
                                    </p>

                                    <!-- 7. Conclusioni -->
                                    <h3 class="mt-4 mb-0">7. Conclusioni</h3>
                                    <p class="mt-2">
                                        Il progetto presenta impatti contenuti e rischi gestibili con le misure proposte; si raccomandano la verifica di assoggettabilità e l’aggiornamento dello SPA in caso di modifiche.

                                        <span class="explain-pack">
                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-info-circle"
                                                            color="dark"
                                                            :iconOnly="true"
                                                            text="Riassume gli esiti della pre‑valutazione e rende esplicite le raccomandazioni per l’autorità competente."
                                                            placement="top"
                                                            outline
                                                            size="xs">Perché</PopoverExplain>

                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-help-circle"
                                                            color="dark"
                                                            :iconOnly="true"
                                                            text="Raccolta dei punti chiave dalle sezioni precedenti e verifica di coerenza interna tramite regole di controllo."
                                                            placement="top"
                                                            outline
                                                            size="xs">Come</PopoverExplain>
                                        </span>
                                    </p>

                                    <!-- Fonti consultate -->
                                    <h4 class="mt-3 mb-0">Fonti consultate:</h4>
                                    <ul class="mt-2">
                                        <li>Guida alla compilazione dello Studio Preliminare Ambientale – Regione Lazio</li>
                                        <li>Indirizzi per la predisposizione dello SPA – Regione Campania</li>
                                        <li>Studio preliminare ambientale – Umbria</li>
                                    </ul>
                                    <p class="mt-2">
                                        <span class="explain-pack">
                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-info-circle"
                                                            color="secondary"
                                                            :iconOnly="true"
                                                            text="Garantisce trasparenza e tracciabilità delle informazioni riportate nel documento."
                                                            placement="top"
                                                            outline
                                                            size="xs">Perché</PopoverExplain>

                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-help-circle"
                                                            color="secondary"
                                                            :iconOnly="true"
                                                            text="Raccolta e normalizzazione dei riferimenti; formattazione omogenea per consultazione rapida."
                                                            placement="top"
                                                            outline
                                                            size="xs">Come</PopoverExplain>
                                        </span>
                                    </p>

                                </div>
                            </div>
                        </div>
                    </div> <!-- /bg section -->
                </div>
            </div>

            <!-- RIGHT COLUMN -->
            <div class="col-12 col-lg-4 p-4">
                <div class="card border p-4 mb-4">
                    <h4>AI Helper</h4>
                    <button class="btn btn-primary w-100 mb-2" type="button">GENERA NUOVA BOZZA</button>
                    <button class="btn btn-secondary w-100 mb-2" type="button">VERIFICA COMPLETEZZA DEI CAMPI</button>
                    <button class="btn btn-success w-100" type="button">VALIDAZIONE NORMATIVA</button>
                </div>

                <!--  CHECKLIST CON VALIDAZIONE FINTA -->
                <div class="card border p-4">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <h4 class="mb-0">Checklist VIA – Parti obbligatorie</h4>
                        <div>
                            <!-- Toggle Seleziona/Deseleziona tutto -->
                            <button class="btn btn-outline-secondary btn-sm"
                                    type="button"
                                    @click="toggleSelectAll"
                                    :disabled="isValidating">
                                {{ selectAllLabel }}
                            </button>

                            <!-- Reset stati -->
                            <button class="btn btn-outline-secondary btn-sm"
                                    type="button"
                                    @click="resetStatuses"
                                    :disabled="isValidating || !hasAnyStatus"
                                    title="Azzera gli esiti (mantiene le selezioni)">
                                Reset
                            </button>

                            <button class="btn btn-primary btn-sm d-inline-flex align-items-center"
                                    type="button"
                                    @click="validateChecklist"
                                    :disabled="isValidating || selectedCount === 0">
                                <span v-if="isValidating" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                <span>{{ isValidating ? 'Validazione…' : 'Valida checklist' }}</span>
                            </button>
                        </div>

                        </div>

                        <small class="text-muted d-block mb-3">
                            Seleziona i punti da validare. La verifica produrrà esiti casuali (OK / Da rivedere / Mancante).
                        </small>

                        <ul class="list-unstyled mt-2">
                            <li v-for="item in checklist" :key="item.id"
                                class="check-item p-2 rounded mb-1"
                                :class="statusClass(item.status)">
                                <div class="d-flex align-items-start">
                                    <input class="form-check-input mt-1 me-2"
                                           type="checkbox"
                                           v-model="item.selected"
                                           :disabled="isValidating" />

                                    <div class="flex-grow-1">
                                        <div class="d-flex align-items-center">
                                            <span class="item-label">{{ item.label }}</span>

                                            <!-- Stato a destra -->
                                            <span class="ms-auto d-inline-flex align-items-center status-badge" v-if="item.status !== 'idle'">
                                                <!-- loading -->
                                                <span v-if="item.status === 'loading'"
                                                      class="spinner-border spinner-border-sm text-primary me-1"
                                                      role="status"
                                                      aria-hidden="true"></span>
                                                <small v-if="item.status === 'loading'" class="text-primary">Verifica…</small>

                                                <!-- ok -->
                                                <template v-else-if="item.status === 'ok'">
                                                    <svg class="icon text-success me-1"><use :href="`${spritesHref}#it-check-circle`" /></svg>
                                                    <small class="text-success">OK</small>
                                                </template>

                                                <!-- warn -->
                                                <template v-else-if="item.status === 'warn'">
                                                    <svg class="icon text-warning me-1"><use :href="`${spritesHref}#it-warning`" /></svg>
                                                    <small class="text-warning">Da rivedere</small>
                                                </template>

                                                <!-- error -->
                                                <template v-else-if="item.status === 'error'">
                                                    <!-- uso la stessa icona triangolo ma rossa -->
                                                    <svg class="icon text-danger me-1"><use :href="`${spritesHref}#it-warning`" /></svg>
                                                    <small class="text-danger">Mancante</small>
                                                </template>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>

                        <!-- Piccolo promemoria sul conteggio -->
                        <div class="mt-3 d-flex justify-content-between small text-muted">
                            <span>Selezionati: {{ selectedCount }}</span>
                            <span v-if="!isValidating && selectedCount === 0">Seleziona almeno un elemento</span>
                        </div>
                    </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import PopoverExplain from '@/components/PopoverExplain.vue'
    import { reactive, ref, computed } from 'vue'
    import { useRouter } from 'vue-router'

    const router = useRouter()

    import spritesUrl from 'bootstrap-italia/dist/svg/sprites.svg?url'
    const spritesHref = spritesUrl

    function goTo(path: string) {
        router.push(path)
    }

    /** ====== CHECKLIST LOGIC (mock) ====== */

    type Status = 'idle' | 'loading' | 'ok' | 'warn' | 'error'
    interface ChecklistItem {
        id: string
        label: string
        selected: boolean
        status: Status
    }

    // Punti della checklist (derivati dai titoli/contenuti del documento)
    const checklist = reactive<ChecklistItem[]>([
        { id: '1.1', label: 'Obiettivo dello SPA definito', selected: false, status: 'idle' },
        { id: '1.2', label: 'Riferimenti normativi indicati', selected: false, status: 'idle' },
        { id: '1.3', label: 'Descrizione sintetica del progetto', selected: false, status: 'idle' },
        { id: '1.4', label: 'Interazioni ambientali individuate', selected: false, status: 'idle' },

        { id: '2.1', label: 'Descrizione tecnica impianto', selected: false, status: 'idle' },
        { id: '2.2', label: 'Localizzazione e cartografia', selected: false, status: 'idle' },
        { id: '2.3', label: 'Cronoprogramma cantiere/esercizio', selected: false, status: 'idle' },
        { id: '2.4', label: 'Infrastrutture correlate', selected: false, status: 'idle' },

        { id: '3.1', label: 'Destinazione d’uso e stato dell’area', selected: false, status: 'idle' },
        { id: '3.2', label: 'Verifica vincoli ambientali/paesaggistici', selected: false, status: 'idle' },
        { id: '3.3', label: 'Distanze da aree sensibili', selected: false, status: 'idle' },

        { id: '3.4', label: 'Suolo e sottosuolo', selected: false, status: 'idle' },
        { id: '3.5', label: 'Atmosfera / qualità dell’aria', selected: false, status: 'idle' },
        { id: '3.6', label: 'Idrologia', selected: false, status: 'idle' },
        { id: '3.7', label: 'Flora e fauna', selected: false, status: 'idle' },

        { id: '4.1', label: 'Impatti su aria/rumore (cantiere)', selected: false, status: 'idle' },
        { id: '4.2', label: 'Gestione terre e rocce da scavo', selected: false, status: 'idle' },
        { id: '4.3', label: 'Impatto visivo (esercizio)', selected: false, status: 'idle' },
        { id: '4.4', label: 'Consumo di suolo (esercizio)', selected: false, status: 'idle' },
        { id: '4.5', label: 'Effetti su fauna/ecosistemi', selected: false, status: 'idle' },

        { id: '5.1', label: 'Rischio idrogeologico', selected: false, status: 'idle' },
        { id: '5.2', label: 'Rischio paesaggistico', selected: false, status: 'idle' },
        { id: '5.3', label: 'Rischio habitat protetti / Natura 2000', selected: false, status: 'idle' },

        { id: '6.1', label: 'Misure per aria/rumore', selected: false, status: 'idle' },
        { id: '6.2', label: 'Misure per suolo/acque', selected: false, status: 'idle' },
        { id: '6.3', label: 'Misure per biodiversità', selected: false, status: 'idle' },
        { id: '6.4', label: 'Piano di monitoraggio', selected: false, status: 'idle' },

        { id: '7.1', label: 'Sintesi degli impatti', selected: false, status: 'idle' },
        { id: '7.2', label: 'Raccomandazioni finali', selected: false, status: 'idle' }
    ])

    const isValidating = ref(false)
    const selectedCount = computed(() => checklist.filter(i => i.selected).length)

    function statusClass(status: Status) {
        return {
            'status-idle': status === 'idle',
            'status-loading': status === 'loading',
            'status-ok': status === 'ok',
            'status-warn': status === 'warn',
            'status-error': status === 'error'
        }
    }

    function uniformOutcome(): Status {
        // esito uniforme su 3 stati finali (ok/warn/error)
        const r = Math.floor(Math.random() * 3)
        return (['ok', 'warn', 'error'] as const)[r]
    }

    function delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    async function validateChecklist() {
        if (isValidating.value) return
        const toCheck = checklist.filter(i => i.selected)
        if (!toCheck.length) return

        isValidating.value = true

        // reset stato degli elementi selezionati
        toCheck.forEach(i => { i.status = 'idle' })

        // sequenziale: uno dopo l’altro
        for (const item of toCheck) {
            item.status = 'loading'
            await delay(600) // tempo finto per “loading”
            item.status = uniformOutcome()
        }

        isValidating.value = false
    }

    //seleziona / deseleziona tutto

    const allSelected = computed(() => checklist.length > 0 && checklist.every(i => i.selected))
    const anySelected = computed(() => checklist.some(i => i.selected))
    const selectAllLabel = computed(() => (allSelected.value ? 'Deseleziona tutto' : 'Seleziona tutto'))

    const hasAnyStatus = computed(() => checklist.some(i => i.status !== 'idle'))

    function toggleSelectAll() {
        const target = !allSelected.value
        checklist.forEach(i => {
            i.selected = target
        })
    }

    function resetStatuses() {
        checklist.forEach(i => {
            i.status = 'idle'
        })
    }

</script>

<style scoped>
    h2, h3, h4 {
        font-weight: bold;
    }

    /* Pacchetto di due pulsanti Explainability sempre allineato a destra */
    .explain-pack {
        float: right;
        display: inline-flex;
        gap: .5rem;
        margin-left: .5rem;
    }

    /* Clear del float per evitare sovrapposizioni */
    p::after, h3::after, h4::after, ul::after {
        content: "";
        display: block;
        clear: both;
    }

    /* Dimensioni icona standard BI nei bottoni */
    .icon {
        width: 16px;
        height: 16px;
    }

    /* ======= Checklist styles ======= */
    .check-item {
        background-color: #fff;
        border-left: 4px solid transparent;
        transition: background-color .2s ease, border-color .2s ease;
    }

    /* loading */
    .status-loading {
        background-color: #e7f1ff; /* azzurrino */
        border-left-color: var(--bs-primary);
    }

    /* ok */
    .status-ok {
        background-color: #e6f4ea; /* verdino */
        border-left-color: var(--bs-success);
    }

    /* warn */
    .status-warn {
        background-color: #fff7e6; /* giallino */
        border-left-color: var(--bs-warning);
    }

    /* error */
    .status-error {
        background-color: #fde7e9; /* rosato */
        border-left-color: var(--bs-danger);
    }

    /* idle (nessun colore) */
    .status-idle {
        background-color: #fff;
        border-left-color: transparent;
    }

    .item-label {
        line-height: 1.25;
    }

    .status-badge small {
        font-weight: 600;
    }
</style>
