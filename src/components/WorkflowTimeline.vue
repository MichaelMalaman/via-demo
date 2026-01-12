<!-- ModalExample.vue -->
<template>
    <!-- Bottone che apre la modale -->
    <button type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#extraLargeModal">
        <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-clock`"></use></svg>
    </button>

    <!-- Teleport nel body per evitare problemi di stacking/z-index -->
    <Teleport to="body">
        <div class="modal fade"
             id="extraLargeModal"
             tabindex="-1"
             aria-labelledby="extraLargeModalLabel"
             aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title h5" id="extraLargeModalLabel">Stato approvazione del documento</h2>
                        <button type="button"
                                class="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Chiudi finestra modale"></button>
                    </div>

                    <div class="modal-body">

                        <div class="timeline-wrapper">


                            <div class="timeline-track">


                                <!--  ICONA INIZIO LINEA (centrata sulla traccia) -->
                                <div class="timeline-cap timeline-cap-start d-none d-md-flex">
                                    <!-- TODO: icona inizio -->
                                    <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-star-outline`"></use></svg>

                                </div>


                                <div class="row gx-0">
                                    <div class="col-12" v-for="ev in events" :key="ev.id">
                                        <!-- Ogni evento: griglia a tre colonne da md in su -->
                                        <div class="timeline-item tl-grid">

                                            <!-- Etichetta 'Oggi' se la data è odierna -->
                                            <span v-if="isToday(ev.date)" class="tl-today-label d-none d-lg-inline">Oggi</span>

                                            <!-- SINISTRA: card se alignLeft === true -->
                                            <div class="tl-left d-none d-md-block">
                                                <article v-if="ev.alignLeft" class="card shadow-sm border-0 tl-card">
                                                    <div class="card-body">
                                                        <!-- TODO: icona/avatar (aggiungerai tu, es. <svg class="icon">...</svg>) -->
                                                        <h4 class="h6 mb-1">{{ ev.title ?? 'Aggiornamento' }}</h4>
                                                        <p v-if="ev.comment" class="mb-2">{{ ev.comment }}</p>
                                                        <small class="text-secondary">
                                                            <time :datetime="ev.date">{{ formatDateTime(ev.date) }}</time>
                                                        </small>
                                                    </div>
                                                </article>
                                            </div>

                                            <!-- PIN centrale (semplice) -->
                                            <div class="tl-pin">
                                                <div class="pin">
                                                    <!-- TODO: icona del PIN (aggiungerai tu, es. <svg class="icon">...</svg>) -->
                                                    <span class="pin-text">{{ formatMonthYear(ev.date) }}</span>
                                                </div>
                                            </div>

                                            <!-- DESTRA: card se alignLeft === false -->
                                            <div class="tl-right d-none d-md-block">
                                                <article v-if="!ev.alignLeft" class="card shadow-sm border-0 tl-card">
                                                    <div class="card-body">
                                                        <!-- TODO: icona/avatar (aggiungerai tu, es. <svg class="icon">...</svg>) -->
                                                        <h4 class="h6 mb-1">{{ ev.title ?? 'Aggiornamento' }}</h4>
                                                        <p v-if="ev.comment" class="mb-2">{{ ev.comment }}</p>
                                                        <small class="text-secondary">
                                                            <time :datetime="ev.date">{{ formatDateTime(ev.date) }}</time>
                                                        </small>
                                                    </div>
                                                </article>
                                            </div>

                                            <!-- MOBILE: card sotto il PIN (ignora alignLeft per leggibilità) -->
                                            <div class="tl-mobile d-block d-md-none">
                                                <article class="card shadow-sm border-0 tl-card mt-2">
                                                    <div class="card-body">
                                                        <!-- TODO: icona/avatar (aggiungerai tu) -->
                                                        <h4 class="h6 mb-1">{{ ev.title ?? 'Aggiornamento' }}</h4>
                                                        <p v-if="ev.comment" class="mb-2">{{ ev.comment }}</p>
                                                        <small class="text-secondary">
                                                            <time :datetime="ev.date">{{ formatDateTime(ev.date) }}</time>
                                                        </small>
                                                    </div>
                                                </article>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                <!-- ICONA FINE LINEA (centrata sulla traccia) -->
                                <div class="timeline-cap timeline-cap-end d-none d-md-flex">
                                    <!-- TODO: icona fine -->
                                    <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-star-full`"></use></svg>

                                </div>

                            </div>

                            </div>

                        </div>


                    <div class="modal-footer">
                        <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Chiudi</button>
                        <button class="btn btn-primary">Azione</button>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
    import spritesUrl from 'bootstrap-italia/dist/svg/sprites.svg?url'
    const spritesHref = spritesUrl

    type TimelineEvent = {
        id: number | string;
        date: string;
        title?: string;
        comment?: string;
        alignLeft: boolean;
    }


    // ⭐️ Qui dichiari il tuo JSON (mock) direttamente nel componente

    const events = [
        {
            id: 13,
            date: '2024-12-21T09:00:00+01:00',
            title: 'Inviato',
            comment: 'test',
            alignLeft: true
        },
        {
            id: 12,
            date: '2024-12-21T09:00:00+01:00',
            title: 'Inviato',
            comment: 'Il proponente ha caricato la Relazione tecnica principale e la Sintesi non tecnica per avvio iter VIA.',
            alignLeft: true
        },
        {
            id: 11,
            date: '2025-01-21T15:20:00+01:00',
            title: 'In revisione',
            comment: 'Verifica formale dei file: estensioni, integrità e leggibilità. Richiesto indice dei capitoli nella Relazione.',
            alignLeft: false
        },
        {
            id: 10,
            date: '2025-02-22T10:30:00+01:00',
            title: 'In revisione',
            comment: 'Controllo Quadro normativo: presenza riferimenti a D.Lgs. 152/2006 e Direttiva 2014/52/UE, PAI/PPTR.',
            alignLeft: true
        },
        {
            id: 9,
            date: '2025-03-22T16:45:00+01:00',
            title: 'In revisione',
            comment: 'Analisi ambientale: coerenza dei dati su suolo, aria, acqua, flora/fauna; richiesta fonti e anni di rilievo.',
            alignLeft: false
        },
        {
            id: 8,
            date: '2025-04-23T09:15:00+01:00',
            title: 'In revisione',
            comment: 'Cartografie e mappe GIS: verificate proiezioni e layer; richiesto shapefile dei vincoli Natura 2000.',
            alignLeft: true
        },
        {
            id: 7,
            date: '2025-05-23T12:00:00+01:00',
            title: 'In revisione',
            comment: 'Planimetrie e sezioni: controllo layout impianto, opere accessorie; richiesta scale e nord grafico.',
            alignLeft: false
        },
        {
            id: 6,
            date: '2025-06-23T15:30:00+01:00',
            title: 'In revisione',
            comment: 'Analisi degli impatti: verificati impatti per fase (cantiere/esercizio/dismissione) e indicatori misurabili.',
            alignLeft: true
        },
        {
            id: 5,
            date: '2025-07-24T09:00:00+01:00',
            title: 'In revisione',
            comment: 'Misure di mitigazione/compensazione: controllata adeguatezza; richiesto piano di monitoraggio dettagliato.',
            alignLeft: false
        },
        {
            id: 4,
            date: '2025-08-24T11:20:00+01:00',
            title: 'In revisione',
            comment: 'Tabelle e calcoli: verifica unità di misura, rumore/emissioni; richiesta allegare fogli di calcolo editabili.',
            alignLeft: true
        },
        {
            id: 3,
            date: '2025-09-24T14:40:00+01:00',
            title: 'In revisione',
            comment: 'Relazioni specialistiche: controllata presenza VINCA (se pertinente) e studi idrogeologici/geologici.',
            alignLeft: false
        },
        {
            id: 2,
            date: '2025-10-24T17:30:00+01:00',
            title: 'Respinto',
            comment: 'Iter sospeso: mancano allegati GIS dei vincoli e il piano di monitoraggio; richiesto invio integrazioni.',
            alignLeft: true
        },
        {
            id: 1,
            date: '2025-11-25T10:00:00+01:00',
            title: 'Approvato',
            comment: 'Pratica validata: documentazione completa e coerente; pubblicare avviso e avviare monitoraggi previsti.',
            alignLeft: false
        }
    ]


    /** Helpers di formattazione */
    function isToday(iso: string) {
        const d = new Date(iso); const t = new Date()
        return d.getFullYear() === t.getFullYear() &&
            d.getMonth() === t.getMonth() &&
            d.getDate() === t.getDate()
    }
    function formatDateTime(iso: string) {
        return new Date(iso).toLocaleString('it-IT', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        })
    }
    function formatMonthYear(iso: string) {
        return new Date(iso).toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })
    }


</script>


<style scoped>

    
/* Wrapper base: già presente */
.timeline-wrapper { position: relative; }

/* 🔧 Nuova "rotaia" verticale continua */
@media (min-width: 768px) {
  .timeline-track {
    position: relative;
    /* opzionale: dare un po' di spazio sopra/sotto
       così la linea esce leggermente dai pin */
    padding: 0.75rem 0;
  }

  .timeline-track::before {
    content: '';
    position: absolute;
    top: 0;             /* parte dall'inizio del contenitore */
    bottom: 0;          /* arriva fino alla fine */
    left: 50%;          /* centrata */
    width: 2px;
    transform: translateX(-50%);
    background: var(--bs-gray-300, #dee2e6);
    z-index: 0;         /* sotto ai pin */
  }

  /* La tua grid: invariata */
  .tl-grid {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    column-gap: 1rem;
    align-items: start;
    position: relative;
  }
  .tl-left  { grid-column: 1; }
  .tl-pin   { grid-column: 2; display: flex; justify-content: center; position: relative; z-index: 1; }
  .tl-right { grid-column: 3; }

  /* ❌ Disattiva la vecchia linea "a pezzi" su ogni item */
  .tl-pin::before {
    content: none !important;
  }
}

/* Pin e card: come già avevi */
.pin {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  padding: .25rem .5rem;
  border-radius: .5rem;
  background: var(--bs-light, #f8f9fa);
  border: 1px solid var(--bs-gray-300, #dee2e6);
  position: relative;
  z-index: 1; /* sopra la linea continua */
}
.pin-text { font-size: .875rem; color: var(--bs-secondary-color, #6c757d); }
.tl-card  { max-width: 520px; }

/* Etichetta 'Oggi' (se usi quella) */
.tl-today-label {
  position: absolute;
  right: 50%;
  transform: translateX(50%);
  top: -1.25rem;
  font-weight: 600;
  color: var(--bs-primary, #0d6efd);
}

        /* Wrapper base */
        .timeline-wrapper {
            position: relative;
        }

        /* Da md in su: grid 3 colonne [sx | pin | dx] */
        @media (min-width: 768px) {
            .tl-grid {
                display: grid;
                grid-template-columns: 1fr auto 1fr; /* sinistra | pin | destra */
                column-gap: 1rem;
                align-items: start;
                position: relative;
            }

            .tl-left {
                grid-column: 1;
            }

            .tl-pin {
                grid-column: 2;
                display: flex;
                justify-content: center;
                position: relative;
            }

            .tl-right {
                grid-column: 3;
            }

            /* Linea verticale centrale (decorativa) dietro ai pin */
            .tl-pin::before {
                content: '';
                position: absolute;
                top: -0.75rem;
                bottom: -0.75rem;
                left: 50%;
                width: 2px;
                transform: translateX(-50%);
                background: var(--bs-gray-300, #dee2e6);
                z-index: 0;
            }
        }

        /* Pin semplice */
        .pin {
            display: inline-flex;
            align-items: center;
            gap: .5rem;
            padding: .25rem .5rem;
            border-radius: .5rem;
            background: var(--bs-light, #f8f9fa);
            border: 1px solid var(--bs-gray-300, #dee2e6);
            position: relative;
            z-index: 1; /* sopra la linea */
        }

        .pin-text {
            font-size: .875rem;
            color: var(--bs-secondary-color, #6c757d);
        }

        /* Card laterali */
        .tl-card {
            max-width: 520px;
        }

        /* Etichetta 'Oggi' (desktop) */
        .tl-today-label {
            position: absolute;
            right: 50%;
            transform: translateX(50%);
            top: -1.25rem;
            font-weight: 600;
            color: var(--bs-primary, #0d6efd);
        }


    /* Wrapper base: già presente */
    .timeline-wrapper {
        position: relative;
    }

    /* 🔧 Nuova "rotaia" verticale continua */
    @media (min-width: 768px) {
        .timeline-track {
            position: relative;
            /* opzionale: dare un po' di spazio sopra/sotto
       così la linea esce leggermente dai pin */
            padding: 0.75rem 0;
        }

            .timeline-track::before {
                content: '';
                position: absolute;
                top: 0; /* parte dall'inizio del contenitore */
                bottom: 0; /* arriva fino alla fine */
                left: 50%; /* centrata */
                width: 2px;
                transform: translateX(-50%);
                background: var(--bs-gray-300, #dee2e6);
                z-index: 0; /* sotto ai pin */
            }

        /* La tua grid: invariata */
        .tl-grid {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            column-gap: 1rem;
            align-items: start;
            position: relative;
        }

        .tl-left {
            grid-column: 1;
        }

        .tl-pin {
            grid-column: 2;
            display: flex;
            justify-content: center;
            position: relative;
            z-index: 1;
        }

        .tl-right {
            grid-column: 3;
        }

        /* ❌ Disattiva la vecchia linea "a pezzi" su ogni item */
        .tl-pin::before {
            content: none !important;
        }
    }

    /* Pin e card: come già avevi */
    .pin {
        display: inline-flex;
        align-items: center;
        gap: .5rem;
        padding: .25rem .5rem;
        border-radius: .5rem;
        background: var(--bs-light, #f8f9fa);
        border: 1px solid var(--bs-gray-300, #dee2e6);
        position: relative;
        z-index: 1; /* sopra la linea continua */
    }

    .pin-text {
        font-size: .875rem;
        color: var(--bs-secondary-color, #6c757d);
    }

    .tl-card {
        max-width: 520px;
    }

    /* Etichetta 'Oggi' (se usi quella) */
    .tl-today-label {
        position: absolute;
        right: 50%;
        transform: translateX(50%);
        top: -1.25rem;
        font-weight: 600;
        color: var(--bs-primary, #0d6efd);
    }



    @media (min-width: 768px) {
        /* wrapper della linea continua: già presente nel tuo file */
        .timeline-track {
            position: relative;
            padding: 0.75rem 0; /* dà spazio per le cap sopra/sotto */
        }

            .timeline-track::before {
                content: '';
                position: absolute;
                top: 0;
                bottom: 0;
                left: 50%;
                width: 2px;
                transform: translateX(-50%);
                background: var(--bs-gray-300, #dee2e6);
                z-index: 0;
            }

        /* --- CAPs (icone di inizio/fine) --- */
        .timeline-cap {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            z-index: 2; /* sopra la linea */
            /* “pill” di sfondo per rendere leggibile l’icona */
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 999px;
            background: var(--bs-light, #f8f9fa);
            border: 1px solid var(--bs-gray-300, #dee2e6);
            box-shadow: 0 1px 2px rgba(0,0,0,.06);
        }

        .timeline-cap-start {
            top: -0.5rem;
        }
        /* appena sopra l’inizio linea */
        .timeline-cap-end {
            bottom: -0.5rem;
        }
        /* appena sotto la fine linea */

        /* dimensiona l’icona */
        .timeline-cap .icon {
            width: 18px;
            height: 18px;
        }
    }

    /* Mobile: se vuoi mostrarle anche su mobile, rimuovi d-none d-md-flex nel template
   e puoi aggiungere un leggero offset diverso per XS/SM se serve. */



</style>
