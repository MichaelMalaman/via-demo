
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
                                                            size="xs"></PopoverExplain>

                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-help-circle"
                                                            color="light"
                                                            title="Come è stata generata"
                                                            text="Campi compilati a partire dai metadati di progetto e da modelli interni; formattazione conforme allo stile VIA."
                                                            placement="bottom"
                                                            outline
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
                                                            title="Perché c’è questa sezione"
                                                            text="Serve a chiarire scopo e campo di applicazione del documento, come previsto dal quadro normativo applicabile."
                                                            placement="top"
                                                            outline
                                                            size="xs">Perché</PopoverExplain>

                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-help-circle"
                                                            color="primary"
                                                            title="Come è stata compilata"
                                                            text="L’AI ha estratto riferimenti normativi e obiettivi chiave dal prompt e dai modelli interni, assicurando coerenza con la struttura VIA."
                                                            placement="top"
                                                            outline
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
                                                            title="Perché descrivere il progetto"
                                                            text="La descrizione consente di comprendere scala, caratteristiche tecniche e fasi progettuali, fondamentali per la pre‑valutazione degli impatti."
                                                            placement="top"
                                                            outline
                                                            size="xs">Perché</PopoverExplain>

                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-help-circle"
                                                            color="secondary"
                                                            title="Come è stata compilata"
                                                            text="Aggregazione di capitolato e scheda tecnica; normalizzazione di potenza, superfici e cronoprogramma secondo schemi standard."
                                                            placement="top"
                                                            outline
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
                                                            title="Perché evidenziare il riuso"
                                                            text="Il riuso dell’area attenua il consumo di suolo e costituisce elemento favorevole nella valutazione di compatibilità."
                                                            placement="top"
                                                            outline
                                                            size="xs">Perché</PopoverExplain>

                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-help-circle"
                                                            color="info"
                                                            title="Come è stata prodotta la nota"
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
                                                            title="Perché inquadrare il territorio"
                                                            text="Supporta l’analisi di coerenza localizzativa e la verifica preliminare di possibili interferenze con aree sensibili."
                                                            placement="top"
                                                            outline
                                                            size="xs">Perché</PopoverExplain>

                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-help-circle"
                                                            color="success"
                                                            title="Come sono stati popolati i dati"
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
                                                            title="Perché descrivere le componenti"
                                                            text="Individua i recettori ambientali potenzialmente esposti e guida la definizione delle misure di mitigazione."
                                                            placement="top"
                                                            outline
                                                            size="xs">Perché</PopoverExplain>

                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-help-circle"
                                                            color="success"
                                                            title="Come sono stati compilati i punti"
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
                                                            title="Perché valutare gli impatti di cantiere"
                                                            text="Consente di anticipare criticità operative e dimensionare le misure di prevenzione/mitigazione."
                                                            placement="top"
                                                            outline
                                                            size="xs">Perché</PopoverExplain>

                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-help-circle"
                                                            color="warning"
                                                            title="Come sono stati stimati"
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
                                                            title="Perché valutare l’esercizio"
                                                            text="Definisce eventuali effetti residui nel lungo periodo e verifica l’adeguatezza dei controlli."
                                                            placement="top"
                                                            outline
                                                            size="xs">Perché</PopoverExplain>

                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-help-circle"
                                                            color="warning"
                                                            title="Come sono stati valutati"
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
                                                            title="Perché indicare i rischi"
                                                            text="Supporta la decisione di assoggettabilità e orienta priorità di approfondimento."
                                                            placement="top"
                                                            outline
                                                            size="xs">Perché</PopoverExplain>

                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-help-circle"
                                                            color="danger"
                                                            title="Come sono stati sintetizzati"
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
                                                            title="Perché definire le misure"
                                                            text="Riduce i rischi individuati e dimostra la capacità di controllo nel cantiere e nell’esercizio."
                                                            placement="top"
                                                            outline
                                                            size="xs">Perché</PopoverExplain>

                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-help-circle"
                                                            color="success"
                                                            title="Come sono state proposte"
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
                                                            title="Perché concludere in questo modo"
                                                            text="Riassume gli esiti della pre‑valutazione e rende esplicite le raccomandazioni per l’autorità competente."
                                                            placement="top"
                                                            outline
                                                            size="xs">Perché</PopoverExplain>

                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-help-circle"
                                                            color="dark"
                                                            title="Come è stata costruita la sintesi"
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
                                                            title="Perché elencare le fonti"
                                                            text="Garantisce trasparenza e tracciabilità delle informazioni riportate nel documento."
                                                            placement="top"
                                                            outline
                                                            size="xs">Perché</PopoverExplain>

                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-help-circle"
                                                            color="secondary"
                                                            title="Come sono state riportate"
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

                <div class="card border p-4">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <h4 class="mb-0">Checklist VIA – Parti obbligatorie</h4>
                        <button class="btn btn-primary btn-sm d-inline-flex align-items-center" type="button">
                            Valida checklist
                        </button>
                    </div>
                    <!-- … elenco rimasto invariato … -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import PopoverExplain from '@/components/PopoverExplain.vue'

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
</style>
