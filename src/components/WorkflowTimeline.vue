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
                            <!-- Header + Stepper di sintesi stato corrente -->
                            <header class="mb-3">
                                <h2 class="h5 mb-2">Cronologia approvazione</h2>

                                <!-- Stepper solo-intestazione (sintesi fasi) -->
                                <div class="steppers">
                                    <div class="steppers-header">
                                        <ul>
                                            <li :class="{ confirmed: currentStepIndex > 0 }">
                                                Invio
                                                <svg class="icon"><use :href="`${spritesHref}#it-arrow-right`"></use></svg>

                                            </li>

                                            <li :class="{ confirmed: currentStepIndex > 1, active: currentStepIndex === 1 }">
                                                Revisione
                                                <svg class="icon"><use :href="`${spritesHref}#it-arrow`"></use></svg>
                                            </li>

                                            <li :class="{ active: currentStepIndex >= 2 }">
                                                Decisione
                                                <span v-if="currentStepIndex >= 2" class="visually-hidden">Attivo</span>
                                            </li>
                                        </ul>
                                        <span class="steppers-index" aria-hidden="true">{{ stepperIndexLabel }}</span>
                                    </div>
                                </div>
                            </header>

                            <!-- FILTRI (opzionali) -->
                            <div class="d-flex gap-2 align-items-center flex-wrap mb-3">
                                <button class="btn btn-sm"
                                        :class="filterStatus ? 'btn-outline-primary' : 'btn-primary'"
                                        @click="filterStatus = ''">
                                    Tutti
                                </button>

                                <button class="btn btn-sm btn-outline-secondary" @click="filterStatus = 'inviato'">
                                    <span class="badge bg-secondary me-1" aria-hidden="true">●</span> Inviato
                                </button>

                                <button class="btn btn-sm btn-outline-warning" @click="filterStatus = 'in_revisione'">
                                    <span class="badge bg-warning text-dark me-1" aria-hidden="true">●</span> In revisione
                                </button>

                                <button class="btn btn-sm btn-outline-success" @click="filterStatus = 'approvato'">
                                    <span class="badge bg-success me-1" aria-hidden="true">●</span> Approvato
                                </button>

                                <button class="btn btn-sm btn-outline-danger" @click="filterStatus = 'respinto'">
                                    <span class="badge bg-danger me-1" aria-hidden="true">●</span> Respinto
                                </button>
                            </div>

                            <!-- TIMELINE -->
                            <div class="it-timeline-wrapper">
                                <div class="row">
                                    <div class="col-12" v-for="(ev, idx) in filteredEvents" :key="ev.id">

                                        <div class="timeline-element">
                                            <!-- Etichetta 'Oggi' quando l'evento è il più recente -->
                                            <span v-if="idx === 0 && isToday(ev.date)" class="it-now-label d-none d-lg-flex">Oggi</span>

                                            <!-- PIN della timeline (passato/presente/futuro) -->
                                            <h3 class="it-pin-wrapper" :class="pinClass(ev, idx)">
                                                <div class="pin-icon">
                                                    <svg class="icon" role="img">
                                                        <title>{{ pinTitle(ev.status) }}</title>
                                                        <use :href="iconHref(ev.status)"></use></svg></div>
                               <div class="pin-text">
                <span>{{ formatMonthYear(ev.date) }}</span>
              </div>
                                            </h3>

                                            <!-- CARD contenuto dell'evento (nuovo componente .it-card) -->
                                            <article class="it-card rounded shadow-sm border">
                                                <!-- Titolo / azione -->
                                                <h4 class="it-card-title">
                                                    <a :href="titleFor(ev)">{{ titleFor(ev) }}</a>
                                                </h4>

                                                <!-- Body con avatar, metadati e commento -->
                                                <div class="it-card-body">
                                                    <div class="d-flex align-items-center justify-content-between gap-3 mb-2">
                                                        <!-- Avatar + anagrafica -->
                                                        <div class="d-flex align-items-center gap-2">
                                                            <!-- Avatar (BI) -->
                                                            <div class="avatar size-sm" v-if="ev.actor.avatar">
                                                                AVATER
                                                            </div>
                                                            <div class="avatar size-sm" v-else aria-hidden="true">
                                                                <!-- fallback icona utente -->
                                                                <svg class="icon"><use :href="`${spritesHref}#it-arrow-left`"></use></svg>

                                                                <span class="visually-hidden">{{ ev.actor.name }}</span>
                                                            </div>

                                                            <div class="d-flex flex-column">
                                                                <strong>{{ ev.actor.name }}</strong>
                                                                <small class="text-secondary">{{ ev.actor.role }}</small>
                                                            </div>
                                                        </div>

                                                        <!-- Stato -->
                                                        <span class="badge" :class="statusBadgeClass(ev.status)">
                                                            {{ statusLabel(ev.status) }}

                                                        </span>
                                                    </div>

                                                    <!-- Commento (se presente) -->
                                                    <p v-if="ev.comment" class="it-card-text mb-0">{{ ev.comment }}</p>
                                                </div>

                                                <!-- Footer: data/ora -->
                                                <footer class="it-card-related it-card-footer">
                                                    <time class="it-card-date" :datetime="ev.date">
                                                        {{ formatDateTime(ev.date) }}
                                                    </time>
                                                </footer>
                                            </article>
                                        </div>

                                    </div>
                                </div>
                            </div>













                    </div>

                    <div class="modal-footer">
                        <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Chiudi</button>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
    import spritesUrl from 'bootstrap-italia/dist/svg/sprites.svg?url'
    const spritesHref = spritesUrl


import { computed, reactive, ref } from 'vue'

    /**
     * MOCK DATI: cronologia eventi (più recente per primo).
     * Adatta le proprietà alle tue API.
     */
    const events = reactive([
        {
            id: 5,
            status: 'approvato',
            date: new Date().toISOString(),
            actor: { name: 'Giulia Neri', role: 'Responsabile approvazioni', avatar: 'https://i.pravatar.cc/64?img=5' },
            comment: 'Approvazione finale del componente.'
        },
        {
            id: 4,
            status: 'in_revisione',
            date: '2025-12-17T09:30:00+01:00',
            actor: { name: 'Luca Bianchi', role: 'Revisore tecnico', avatar: 'https://i.pravatar.cc/64?img=12' },
            comment: 'Revisionati test e documentazione.'
        },
        {
            id: 3,
            status: 'in_revisione',
            date: '2025-12-16T16:00:00+01:00',
            actor: { name: 'Luca Bianchi', role: 'Revisore tecnico', avatar: 'https://i.pravatar.cc/64?img=12' },
            comment: 'Richieste piccole modifiche di stile.'
        },
        {
            id: 2,
            status: 'inviato',
            date: '2025-12-16T10:12:00+01:00',
            actor: { name: 'Mario Rossi', role: 'Richiedente', avatar: 'https://i.pravatar.cc/64?img=3' },
            comment: 'Inviata richiesta di approvazione del componente.'
        },
        {
            id: 1,
            status: 'inviato',
            date: '2025-12-15T18:45:00+01:00',
            actor: { name: 'Mario Rossi', role: 'Richiedente', avatar: 'https://i.pravatar.cc/64?img=3' },
            comment: 'Bozza salvata e validata.'
        }
    ])

    /* Filtri */
    const filterStatus = ref('') // '', 'inviato', 'in_revisione', 'approvato', 'respinto'
    const filteredEvents = computed(() =>
        filterStatus.value ? events.filter(e => e.status === filterStatus.value) : events
    )

    /* Stepper: calcolo dello step corrente (0: Invio, 1: Revisione, 2: Decisione) */
    const currentStepIndex = computed(() => {
        const hasDecision = filteredEvents.value.some(e => ['approvato', 'respinto'].includes(e.status))
        if (hasDecision) return 2
        const inReview = filteredEvents.value.some(e => e.status === 'in_revisione')
        if (inReview) return 1
        return 0
    })
    const stepperIndexLabel = computed(() => {
        // etichetta tipo "2/3" dove 3 = numero totale step
        const total = 3
        return `${Math.min(currentStepIndex.value + 1, total)}/${total}`
    })

    /* Helpers UI */
    const isToday = (iso) => {
        const d = new Date(iso)
        const today = new Date()
        return (
            d.getFullYear() === today.getFullYear() &&
            d.getMonth() === today.getMonth() &&
            d.getDate() === today.getDate()
        )
    }

    const formatDateTime = (iso) =>
        new Date(iso).toLocaleString('it-IT', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })

    const formatMonthYear = (iso) =>
        new Date(iso).toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })

    const statusLabel = (s) =>
    ({
        inviato: 'Inviato',
        in_revisione: 'In revisione',
        approvato: 'Approvato',
        respinto: 'Respinto'
    }[s] || s)

    const statusBadgeClass = (s) =>
    ({
        inviato: 'bg-secondary',
        in_revisione: 'bg-warning text-dark',
        approvato: 'bg-success',
        respinto: 'bg-danger'
    }[s] || 'bg-secondary')

    const pinTitle = (s) =>
    ({
        inviato: 'Invio',
        in_revisione: 'Revisione',
        approvato: 'Approvazione',
        respinto: 'Rifiuto'
    }[s] || 'Evento')

    /* Selettori icone (sprite SVG di Bootstrap Italia) */
    const iconHref = (s) => {
        const base = '/bootstrap-italia/dist/svg/sprites.svg#'
        switch (s) {
            case 'approvato':
                return base + 'it-check'
            case 'respinto':
                return base + 'it-close'
            case 'in_revisione':
                return base + 'it-search'
            case 'inviato':
                return base + 'it-mail'
            default:
                return base + 'it-flag'
        }
    }

    /* Varianti PIN (passato/presente/futuro) */
    const pinClass = (ev, index) => {
        // L'evento più recente è "presente" (it-now); gli altri passati (it-evidence)
        if (index === 0) return 'it-now'
        return 'it-evidence'
    }

    /* Titolo card per evento */
    const titleFor = (ev) => {
        switch (ev.status) {
            case 'approvato':
                return 'Componente approvato'
            case 'respinto':
                return 'Componente respinto'
            case 'in_revisione':
                return 'In revisione'
            case 'inviato':
                return 'Richiesta inviata'
            default:
                return 'Aggiornamento'
        }
    }

``

    // Nessun JS necessario: tutto è gestito da Bootstrap Italia via data-attributes
</script>

<style scoped>
    /* Opzionale: se qualche stile locale interferisce con le animazioni */
    .modal.show {
        display: block; /* garantisce la visibilità quando show è  display: block; /* garantisce la visibilità quando show è presente */
    }
</style>