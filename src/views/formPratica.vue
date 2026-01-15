
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
                    <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-arrow-left`"></use></svg>
                    <span class="ms-2">Indietro</span>
                </button>
            </div>

            <!-- Pulsante destro -->
            <div class="col-6 d-flex justify-content-end">

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
                                    <h2 class="mb-2">STUDIO PRELIMINARE AMBIENTALE</h2>
                                    <p><strong>Progetto:</strong> Realizzazione di un impianto fotovoltaico su area industriale dismessa</p>
                                    <p><strong>Proponente:</strong> [Nome Azienda]</p>
                                    <p><strong>Localizzazione:</strong> Comune di [Localit &agrave], Provincia di [Provincia]</p>
                                    <p><strong>Data:</strong> Novembre 2025</p>
                                </div>
                            </div>
                        </div>

                        <!-- MAIN CONTENT -->
                        <div class="row">
                            <div class="col-12">
                                <div class="card p-4">
                                    <h3>1. Introduzione e Obiettivi</h3>
                                    <p>
                                        Lo Studio Preliminare Ambientale è redatto ai sensi dell’art. 19 del D.Lgs. 152/2006 e successive modifiche,
                                        con lo scopo di verificare l’assoggettabilit &agrave del progetto alla procedura di Valutazione di Impatto Ambientale (VIA).
                                        <br><strong>Obiettivo principale:</strong> fornire una descrizione sintetica ma completa del progetto e delle sue interazioni con l’ambiente,
                                        individuando rischi potenziali e misure di mitigazione.
                                    </p>

                                    <h3>2. Descrizione del Progetto</h3>
                                    <p>
                                        Il progetto prevede la realizzazione di un impianto fotovoltaico da 5 MW su un’area industriale dismessa di circa 10 ettari.
                                    </p>
                                    <ul>
                                        <li>Installazione di moduli fotovoltaici su strutture fisse orientate a sud.</li>
                                        <li>Collegamento alla rete elettrica tramite cabina di trasformazione.</li>
                                        <li>Durata del cantiere: 6 mesi.</li>
                                        <li>Fase operativa: 25 anni.</li>
                                    </ul>
                                    <p><em>Suggerimento:</em> evidenziare la natura di riuso dell’area, che riduce il consumo di suolo vergine.</p>

                                    <h3>3. Contesto Ambientale</h3>
                                    <h4>3.1 Quadro territoriale</h4>
                                    <ul>
                                        <li>Area classificata come zona industriale dismessa, priva di vincoli paesaggistici diretti.</li>
                                        <li>Presenza di rete Natura 2000 a 3 km (potenziale rischio di interferenza indiretta).</li>
                                    </ul>
                                    <h4>3.2 Componenti ambientali</h4>
                                    <ul>
                                        <li>Suolo e sottosuolo: contaminazione residua da precedenti attività industriali.</li>
                                        <li>Atmosfera: qualità dell’aria nella norma, ma rischio di polveri durante il cantiere.</li>
                                        <li>Idrologia: falda superficiale a 5 m di profondità.</li>
                                        <li>Flora e fauna: assenza di specie protette nell’area, ma corridoi ecologici nelle vicinanze.</li>
                                    </ul>

                                    <h3>4. Analisi Preliminare degli Impatti</h3>
                                    <h4>4.1 Fase di cantiere</h4>
                                    <ul>
                                        <li>Emissioni di polveri e rumore → rischio moderato.</li>
                                        <li>Movimentazione terre e rocce da scavo → rischio di contaminazione se non gestita correttamente.</li>
                                    </ul>
                                    <h4>4.2 Fase operativa</h4>
                                    <ul>
                                        <li>Impatto visivo: basso, grazie alla localizzazione in area industriale.</li>
                                        <li>Consumo di suolo: nullo, trattandosi di riuso.</li>
                                        <li>Effetti sulla fauna: trascurabili, ma monitoraggio consigliato.</li>
                                    </ul>
                                    <p><em>Suggerimento:</em> inserire una checklist di verifica per ogni fase (cantiere, esercizio, dismissione).</p>

                                    <h3>5. Indicazioni di Rischio Ambientale</h3>
                                    <ul>
                                        <li>Rischio idrogeologico: basso, ma verificare compatibilità con il Piano di Assetto Idrogeologico (PAI).</li>
                                        <li>Rischio paesaggistico: minimo, ma valutare coerenza con il Piano Paesaggistico Territoriale Regionale (PPTR).</li>
                                        <li>Rischio su habitat protetti: basso, ma obbligo di Valutazione di Incidenza se interferenze con siti Natura 2000.</li>
                                    </ul>
                                    <p><em>Suggerimento:</em> utilizzare dati GIS per mappare vincoli e criticità.</p>

                                    <h3>6. Misure di Mitigazione</h3>
                                    <ul>
                                        <li>Polveri e rumore: impiego di barriere temporanee e sistemi di abbattimento polveri.</li>
                                        <li>Gestione terre e rocce: smaltimento conforme al D.Lgs. 152/2006.</li>
                                        <li>Monitoraggio ambientale: piano di controllo annuale su suolo, aria e biodiversità.</li>
                                    </ul>

                                    <h3>7. Conclusioni</h3>
                                    <p>
                                        Il progetto, per caratteristiche e localizzazione, presenta impatti ambientali contenuti e rischi gestibili con le misure proposte. Si raccomanda:
                                    </p>
                                    <ul>
                                        <li>Verifica di assoggettabilità a VIA presso l’autorità competente.</li>
                                        <li>Aggiornamento periodico dello SPA in caso di modifiche progettuali.</li>
                                    </ul>
                                    <p>✅ Checklist allegata</p>
                                    <ul>
                                        <li>Conformità normativa (D.Lgs. 152/2006, Direttiva 2014/52/UE).</li>
                                        <li>Analisi vincoli territoriali.</li>
                                        <li>Piano di mitigazione approvato.</li>
                                    </ul>

                                    <h4>Fonti consultate:</h4>
                                    <ul>
                                        <li>Guida alla compilazione dello Studio Preliminare Ambientale – Regione Lazio [regione.lazio.it]</li>
                                        <li>Indirizzi per la predisposizione dello SPA – Regione Campania [viavas.reg...ampania.it]</li>
                                        <li>Studio preliminare ambientale – Umbria [regione.umbria.it]</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div> <!-- /bg section -->
                </div>
            </div>

            <!-- RIGHT COLUMN -->
            <div class="col-12 col-lg-4 p-4">
                <!-- AI Helper -->
                <div class="card border p-4 mb-4">
                    <h4>AI Helper</h4>
                    <button class="btn btn-primary w-100 mb-2" type="button">GENERA NUOVA BOZZA</button>
                    <button class="btn btn-secondary w-100 mb-2" type="button">VERIFICA COMPLETEZZA DEI CAMPI</button>
                    <button class="btn btn-success w-100" type="button">VALIDAZIONE NORMATIVA</button>
                </div>

                <!-- Checklist VIA - Parti obbligatorie -->
                <div class="card border p-4">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <h4 class="mb-0">Checklist VIA – Parti obbligatorie</h4>
                        <button class="btn btn-primary btn-sm d-inline-flex align-items-center" type="button">
                            <!-- icona opzionale -->
                            <!-- <svg class="icon me-2" style="width:16px;height:16px;">spritesUrl + </use></svg> -->
                            Valida checklist
                        </button>
                    </div>

                    <!-- Lista dei 9 punti -->
                    <ul class="list-group list-group-flush">
                        <!-- 1 -->
                        <li class="list-group-item d-flex align-items-start justify-content-between">
                            <div>
                                <div class="fw-semibold">1. Informazioni generali sul progetto</div>
                                <small class="text-muted">Titolo, proponente, localizzazione, data, obiettivi</small>
                            </div>
                            <span class="badge text-bg-success align-self-start">Completo</span>
                        </li>
                        <!-- 2 -->
                        <li class="list-group-item d-flex align-items-start justify-content-between">
                            <div>
                                <div class="fw-semibold">2. Descrizione del progetto</div>
                                <small class="text-muted">Caratteristiche tecniche, fasi, alternative, tecnologie</small>
                            </div>
                            <span class="badge text-bg-success align-self-start">Completo</span>
                        </li>
                        <!-- 3 -->
                        <li class="list-group-item d-flex align-items-start justify-content-between">
                            <div>
                                <div class="fw-semibold">3. Contesto ambientale</div>
                                <small class="text-muted">Quadro territoriale, vincoli, componenti ambientali</small>
                            </div>
                            <span class="badge text-bg-warning text-dark align-self-start">Parziale</span>
                        </li>
                        <!-- 4 -->
                        <li class="list-group-item d-flex align-items-start justify-content-between">
                            <div>
                                <div class="fw-semibold">4. Analisi degli impatti</div>
                                <small class="text-muted">Diretti/indiretti, cumulativi, per fase, indicatori</small>
                            </div>
                            <span class="badge text-bg-warning text-dark align-self-start">Parziale</span>
                        </li>
                        <!-- 5 -->
                        <li class="list-group-item d-flex align-items-start justify-content-between">
                            <div>
                                <div class="fw-semibold">5. Misure di mitigazione e compensazione</div>
                                <small class="text-muted">Polveri/rumore, terre e rocce, compensazioni, monitoraggi</small>
                            </div>
                            <span class="badge text-bg-success align-self-start">Completo</span>
                        </li>
                        <!-- 6 -->
                        <li class="list-group-item d-flex align-items-start justify-content-between">
                            <div>
                                <div class="fw-semibold">6. Normativa e conformità</div>
                                <small class="text-muted">D.Lgs. 152/2006, Dir. 2014/52/UE, pianificazione (PAI/PPTR)</small>
                            </div>
                            <span class="badge text-bg-success align-self-start">Completo</span>
                        </li>
                        <!-- 7 -->
                        <li class="list-group-item d-flex align-items-start justify-content-between">
                            <div>
                                <div class="fw-semibold">7. Piano di monitoraggio</div>
                                <small class="text-muted">Indicatori, frequenze, metodi, responsabilità, reporting</small>
                            </div>
                            <span class="badge text-bg-danger align-self-start">Mancante</span>
                        </li>
                        <!-- 8 -->
                        <li class="list-group-item d-flex align-items-start justify-content-between">
                            <div>
                                <div class="fw-semibold">8. Sintesi non tecnica</div>
                                <small class="text-muted">Riassunto chiaro per il pubblico e stakeholder</small>
                            </div>
                            <span class="badge text-bg-secondary align-self-start">Da redigere</span>
                        </li>
                        <!-- 9 -->
                        <li class="list-group-item d-flex align-items-start justify-content-between">
                            <div>
                                <div class="fw-semibold">9. Allegati obbligatori</div>
                                <small class="text-muted">Cartografie/GIS, relazioni tecniche, tabelle/calcoli, foto</small>
                            </div>
                            <span class="badge text-bg-secondary align-self-start">In raccolta</span>
                        </li>
                    </ul>

                    <!-- legenda stati -->
                    <hr class="my-4" />
                    <div class="d-flex flex-wrap gap-2">
                        <span class="badge text-bg-success">Completo</span>
                        <span class="badge text-bg-warning text-dark">Parziale</span>
                        <span class="badge text-bg-danger">Mancante</span>
                        <span class="badge text-bg-secondary">Da redigere / In raccolta</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useRouter } from 'vue-router'
    const router = useRouter()
    import spritesUrl from 'bootstrap-italia/dist/svg/sprites.svg?url'
    const spritesHref = spritesUrl

    function goTo(path: string) {
        router.push(path)
    }
</script>

<style scoped>
    h2, h3, h4 {
        font-weight: bold;
    }

    </style>
