
<template>
    <!--
      PAGINA NOTIFICHE (Mock data da unico JSON)
      ------------------------------------------
      - Colonna sinistra: elenco documenti con badge "Categoria" (colori diversi) e "Stato" (colori per fase)
      - Centro: dettagli documento + timeline eventi
      - Pannello "Nuovo evento" rimosso: questa pagina ora è sola lettura + azioni rapide
    -->
    <div class="container-fluid py-3">
        <div class="row g-3">
            <!-- =========================
                 COLONNA SINISTRA: LISTA
                 ========================= -->
            <aside class="col-12 col-lg-4 col-xl-3">
                <div class="card shadow-sm">
                    <div class="card-header">
                        <!-- Ricerca semplice su titolo/sottotitolo -->
                        <div class="input-group" role="search" aria-label="Cerca documenti o notifiche">
                            <span class="input-group-text bg-white border-end-0">
                                <span class="icon it-search" aria-hidden="true"></span>
                            </span>
                            <input type="search"
                                   class="form-control border-start-0"
                                   placeholder="Cerca documenti o notifiche"
                                   v-model="state.search"
                                   aria-label="Campo di ricerca documenti" />
                        </div>

                        <!-- Filtri per stato e categoria (aiutano a mettere a fuoco) -->
                        <div class="mt-2 d-flex gap-2 flex-wrap">
                            <select class="form-select form-select-sm w-auto" v-model="state.filterStatus" aria-label="Filtra per stato">
                                <option value="">Tutti gli stati</option>
                                <option value="uploaded">Caricato</option>
                                <option value="in_review">In revisione</option>
                                <option value="approved">Approvato</option>
                                <option value="published">Pubblicato</option>
                                <option value="error">Errore</option>
                                <option value="comment">Commento</option>
                            </select>

                            <select class="form-select form-select-sm w-auto" v-model="state.filterCategory" aria-label="Filtra per categoria">
                                <option value="">Tutte le categorie</option>
                                <option value="Obbligatorio">Obbligatorio</option>
                                <option value="Facoltativo">Facoltativo</option>
                            </select>

                            <button class="btn btn-outline-secondary btn-sm" type="button" @click="resetFilters" aria-label="Azzera filtri">
                                <span class="icon it-reload" aria-hidden="true"></span> Reset
                            </button>
                        </div>
                    </div>

                    <!-- Elenco documenti (tutte le informazioni provengono da JSON) -->
                    <div class="list-group list-group-flush">
                        <button v-for="d in filteredDocuments"
                                :key="d.id"
                                class="list-group-item list-group-item-action d-flex justify-content-between"
                                :class="{ active: d.id === state.activeDocumentId }"
                                type="button"
                                @click="openDocument(d.id)"
                                :aria-pressed="d.id === state.activeDocumentId"
                                :title="`Apri ${d.title}`">
                            <div class="d-flex align-items-center gap-3">
                                <div>
                                    <!-- Titolo + badge categoria (colori dedicati) -->
                                    <div class="fw-semibold d-flex align-items-center gap-2">
                                        {{ d.title }}
                                        <span v-if="d.category"
                                              class="badge rounded-pill ms-2 align-middle"
                                              :class="categoryBadge(d.category)">
                                            {{ d.category }}
                                        </span>
                                    </div>

                                    <!-- Sottotitolo + ultimo editor human-like -->
                                    <small class="text-secondary d-block">
                                        {{ d.subtitle }}
                                        <span v-if="lastEditor(d).name">
                                            <br /><strong>Ultimo editor:</strong> {{ lastEditor(d).name }}
                                        </span>
                                    </small>

                                    <!-- Stato workflow (colori per ogni stato) -->
                                    <span class="badge rounded-pill mt-1" :class="statusBadgeClass(d.status)">
                                        <span :class="statusVariant(d.status).icon" class="me-1" aria-hidden="true"></span>
                                        {{ statusLabel(d.status) }}
                                    </span>
                                </div>
                            </div>

                            <!-- Lato destro: aggiornamento + non letti -->
                            <div class="text-end">
                                <small class="text-secondary d-block">{{ d.lastUpdate }}</small>
                                <span v-if="d.unread" class="badge bg-primary" aria-label="Notifiche non lette">{{ d.unread }}</span>
                            </div>
                        </button>
                    </div>
                </div>
            </aside>

            <!-- =========================
                 CENTRO: DETTAGLIO + TIMELINE
                 ========================= -->
            <section class="col-12 col-lg-8 col-xl-9">
                <!-- 9 colonne: sfruttiamo lo spazio del pannello rimosso -->
                <div class="card shadow-sm h-100">
                    <div class="card-header d-flex align-items-center justify-content-between">
                        <h6 class="mb-0">
                            {{ activeDocument?.title || 'Seleziona un documento' }}
                        </h6>
                        <div class="d-flex align-items-center gap-2" v-if="activeDocument">
                            <span class="badge rounded-pill" :class="statusBadgeClass(activeDocument.status)">
                                <span :class="statusVariant(activeDocument.status).icon" class="me-1" aria-hidden="true"></span>
                                {{ statusLabel(activeDocument.status) }}
                            </span>
                            <small class="text-secondary">
                                Ultimo aggiornamento: {{ activeDocument.lastUpdate }}
                            </small>
                        </div>
                    </div>

                    <div class="card-body p-0 d-flex flex-column" style="height: 75vh;">
                        <!-- Metadati sintetici del documento (solo lettura) -->
                        <div v-if="activeDocument" class="p-3 border-bottom bg-white">
                            <div class="d-flex flex-wrap gap-3">
                                <div class="border rounded-3 p-2">
                                    <small class="text-secondary d-block">Owner</small>
                                    <span class="fw-semibold">{{ activeDocument.owner }}</span>
                                </div>
                                <div class="border rounded-3 p-2">
                                    <small class="text-secondary d-block">Repository</small>
                                    <span class="fw-semibold">{{ activeDocument.repository }}</span>
                                </div>
                                <div class="border rounded-3 p-2">
                                    <small class="text-secondary d-block">Versione</small>
                                    <span class="fw-semibold">{{ activeDocument.version }}</span>
                                </div>
                                <div class="border rounded-3 p-2">
                                    <small class="text-secondary d-block">Apri il Documento</small>


                                    <div v-if="activeDocument" class="p-3  bg-white">
                                        <div class="d-flex flex-wrap gap-3">
                                            <div class=" p-2">
                                                <small class="text-secondary d-block">Owner</small>
                                                <span class="fw-semibold">{{ activeDocument.owner }}</span>
                                            </div>
                                            <div class=" p-2">
                                                <small class="text-secondary d-block">Repository</small>
                                                <span class="fw-semibold">{{ activeDocument.repository }}</span>
                                            </div>
                                            <div class=" p-2">
                                                <small class="text-secondary d-block">Versione</small>
                                                <span class="fw-semibold">{{ activeDocument.version }}</span>
                                            </div>

                                            <!-- Apri il Documento (trigger modale) -->
                                            <div class=" p-2">
                                                <small class="text-secondary d-block">Apri il documento</small>
                                                <button class="btn btn-outline-primary d-inline-flex align-items-center gap-2 mt-1"
                                                        type="button"
                                                        :disabled="!activeDocument"
                                                        :aria-disabled="!activeDocument"
                                                        :title="`Apri '${activeDocument?.title || ''}' in modale`"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#fakeDocModal">
                                                    <svg class="icon">
                                                        <use :href="`${spritesHref}#it-file`"></use>
                                                    </svg>
                                                    <span>Apri</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>

                        <!-- Timeline eventi (scrollabile) -->
                        <div ref="timelineContainer" class="flex-grow-1 overflow-auto p-3 bg-light" aria-label="Timeline eventi documento">
                            <template v-if="activeDocument">
                                <ul class="timeline list-unstyled">
                                    <li v-for="ev in activeDocument.events" :key="ev.id" class="mb-3">
                                        <div class="d-flex align-items-start gap-3">
                                            <div class="rounded-circle d-flex align-items-center justify-content-center"
                                                 :class="statusVariant(ev.type).dotClass"
                                                 style="width: 28px; height: 28px;"
                                                 aria-hidden="true">
                                                <span :class="statusVariant(ev.type).icon"></span>
                                            </div>
                                            <div class="p-2 rounded-3 bg-white border flex-grow-1">
                                                <div class="d-flex justify-content-between">
                                                    <div class="fw-semibold">{{ eventTitle(ev.type) }}</div>
                                                    <small class="text-secondary">{{ ev.time }}</small>
                                                </div>
                                                <div class="mt-1" style="word-break: break-word;">{{ ev.message }}</div>

                                                <!-- Metadati extra evento (se presenti) -->
                                                <div v-if="ev.meta && Object.keys(ev.meta).length" class="mt-2">
                                                    <small class="text-secondary">Dettagli:</small>
                                                    <ul class="mb-0">
                                                        <li v-for="(val, key) in ev.meta" :key="key">
                                                            <small><strong>{{ key }}:</strong> {{ val }}</small>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </template>
                            <div v-else class="text-center text-secondary mt-5">
                                Seleziona un documento per vedere le notifiche di stato.
                            </div>
                        </div>

                        <!-- Azioni rapide -->
                        <div class="border-top p-3 d-flex gap-2" v-if="activeDocument">
                            <button class="btn btn-outline-primary" type="button" @click="markAllRead(activeDocument.id)">
                                <span class="icon it-check me-1" aria-hidden="true"></span> Segna notifiche come lette
                            </button>
                            <button class="btn btn-outline-secondary" type="button" @click="simulateIncomingEvent(activeDocument.id)">
                                <span class="icon it-reload me-1" aria-hidden="true"></span> Simula aggiornamento
                            </button>
                        </div>
                    </div>
                </div>




                <!-- MODALE: Documento finto -->
                <div class="modal fade"
                     id="fakeDocModal"
                     tabindex="-1"
                     aria-labelledby="fakeDocModalLabel"
                     aria-hidden="true">
                    <div class="modal-dialog modal-xl modal-dialog-scrollable">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title d-flex align-items-center gap-2" id="fakeDocModalLabel">
                                    <svg class="icon">
                                        <use :href="`${spritesHref}#it-file`"></use>
                                    </svg>
                                    <span>
                                        {{ activeDocument?.title || 'Documento' }}
                                        <small class="text-secondary d-block fw-normal">
                                            {{ activeDocument?.subtitle }} — v{{ activeDocument?.version || '—' }}
                                        </small>
                                    </span>
                                </h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Chiudi"></button>
                            </div>

                            <div class="modal-body">
                                <!-- Documento finto: corpo leggibile -->
                                <article class="prose">
                                    <h6>Abstract</h6>
                                    <p>
                                        Questo è un <strong>documento finto</strong> mostrato a scopo dimostrativo.
                                        Serve per verificare l’esperienza di apertura in modale e la leggibilità
                                        dei contenuti senza navigare verso repository esterni.
                                    </p>

                                    <h6>Contesto</h6>
                                    <p>
                                        Repository: <strong>{{ activeDocument?.repository || '—' }}</strong> —
                                        Owner: <strong>{{ activeDocument?.owner || '—' }}</strong> —
                                        Ultimo aggiornamento: <strong>{{ activeDocument?.lastUpdate || '—' }}</strong>
                                    </p>

                                    <h6>Estratto (mock)</h6>
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
                                        efficitur, arcu ac hendrerit gravida, justo ante bibendum velit, a
                                        laoreet arcu enim a sem. Donec vel dui at mauris tempus cursus.
                                    </p>

                                    <h6>Ultimi eventi</h6>
                                    <ul>
                                        <li v-for="ev in (activeDocument?.events || []).slice(-3)" :key="ev.id">
                                            <strong>{{ eventTitle(ev.type) }}</strong> — {{ ev.time }}:
                                            <span>{{ ev.message }}</span>
                                        </li>
                                    </ul>
                                </article>

                                <!-- (Opzionale) Preview grezza tipo 'document viewer' -->
                                <div class="mt-3">
                                    <small class="text-secondary d-block">Preview semplificata</small>
                                    <div class="border rounded-3 p-3 bg-light">
                                        <pre class="mb-0" style="white-space: pre-wrap;">
Titolo: {{ activeDocument?.title }}
Stato:  {{ statusLabel(activeDocument?.status) }}
Owner:  {{ activeDocument?.owner }}
Repo:   {{ activeDocument?.repository }}
Ver.:   {{ activeDocument?.version }}

Contenuto fittizio:
- Sezione 1: Introduzione
- Sezione 2: Metodologia
- Sezione 3: Risultati preliminari
- Sezione 4: Conclusioni
            </pre>
                                    </div>
                                </div>
                            </div>

                            <div class="modal-footer">
                                <!-- Azioni contestuali -->
                                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                                    Chiudi
                                </button>
                                <button type="button"
                                        class="btn btn-primary"
                                        @click="simulateIncomingEvent(activeDocument?.id)">
                                    <span class="icon it-reload me-1" aria-hidden="true"></span> Simula aggiornamento
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


            </section>

        </div>
    </div>
</template>

<script setup>
    import spritesUrl from 'bootstrap-italia/dist/svg/sprites.svg?url'
    const spritesHref = spritesUrl
    /*
      SCRIPT (human-like, pulito)
      ---------------------------
      - Legge tutto da un unico JSON (mock) per mostrare casi realistici.
      - RIMOSSE TUTTE LE PARTI NON USATE (form/watchers/addEvent/bumpVersion ecc.).
      - Manteniamo: filtri, open, segna lette, simulazione evento, timeline, badge.
    */
    import { reactive, ref, computed, nextTick } from 'vue'

    /** 1) MOCK JSON UNICO con variabilità */
    const MOCK_NOTIFICATIONS = {
        generatedAt: '2026-01-13T10:15:00+01:00',
        documents: [
            {
                id: 301,
                title: 'Relazione tecnica principale',
                category: 'Obbligatorio',
                subtitle: 'Archivio · Progetto A / Valutazioni',
                unread: 2,
                lastUpdate: '10:12',
                status: 'in_review',
                owner: 'Andrea Cozzolino',
                repository: 'SharePoint',
                version: '1.3.0',
                events: [
                    { id: 'e-301-1', type: 'uploaded', time: '09:40', message: 'Documento caricato.', meta: { updatedBy: 'Andrea Cozzolino' } },
                    { id: 'e-301-2', type: 'in_review', time: '10:05', message: 'Revisione avviata dal Team Legale.', meta: { updatedBy: 'Team Legale', due: '11:00' } },
                    { id: 'e-301-3', type: 'comment', time: '10:12', message: 'Richiesta integrazione al capitolo 4.', meta: { updatedBy: 'Team Legale' } }
                ]
            },
            {
                id: 302,
                title: 'Quadro normativo e pianificazione',
                category: 'Obbligatorio',
                subtitle: 'Archivio · Progetto A / Normativa',
                unread: 0,
                lastUpdate: '09:31',
                status: 'approved',
                owner: 'Team Progetto A',
                repository: 'SharePoint',
                version: '2.0.0',
                events: [
                    { id: 'e-302-1', type: 'uploaded', time: '09:10', message: 'Caricato aggiornamento 2.0.', meta: { updatedBy: 'Team Progetto A' } },
                    { id: 'e-302-2', type: 'in_review', time: '09:20', message: 'Verifica requisiti ambientali.', meta: { updatedBy: 'Team QA' } },
                    { id: 'e-302-3', type: 'approved', time: '09:31', message: 'Documento approvato.', meta: { updatedBy: 'Giuseppe Perrone', approver: 'Giuseppe Perrone' } }
                ]
            },
            {
                id: 303,
                title: 'Analisi ambientale',
                category: 'Obbligatorio',
                subtitle: 'Archivio · Progetto B / Ambiente',
                unread: 1,
                lastUpdate: '08:06',
                status: 'error',
                owner: 'Compliance Office',
                repository: 'SharePoint',
                version: '0.9.0',
                events: [
                    { id: 'e-303-1', type: 'uploaded', time: '07:50', message: 'Bozza iniziale caricata.', meta: { updatedBy: 'Compliance Office' } },
                    { id: 'e-303-2', type: 'error', time: '08:06', message: 'Errore: campi obbligatori mancanti (Sezione 3.1).', meta: { updatedBy: 'Sistema', field: 'Sezione 3.1' } }
                ]
            },
            {
                id: 304,
                title: 'Analisi degli impatti',
                category: 'Obbligatorio',
                subtitle: 'Archivio · Progetto B / Impatti',
                unread: 0,
                lastUpdate: '11:22',
                status: 'published',
                owner: 'Michael Malaman',
                repository: 'Teams',
                version: '1.5.2',
                events: [
                    { id: 'e-304-1', type: 'uploaded', time: '10:00', message: 'Documento caricato su Teams.', meta: { updatedBy: 'Michael Malaman' } },
                    { id: 'e-304-2', type: 'in_review', time: '10:30', message: 'Revisione in corso.', meta: { updatedBy: 'Revisori Esterni' } },
                    { id: 'e-304-3', type: 'approved', time: '11:00', message: 'Approvazione interna completata.', meta: { updatedBy: 'Revisori Interni' } },
                    { id: 'e-304-4', type: 'published', time: '11:22', message: 'Pubblicato nel repository ufficiale.', meta: { updatedBy: 'Michael Malaman' } }
                ]
            },
            {
                id: 305,
                title: 'Misure di mitigazione e compensazione',
                category: 'Obbligatorio',
                subtitle: 'Archivio · Progetto C / Mitigazioni',
                unread: 0,
                lastUpdate: '—',
                status: '',
                owner: '—',
                repository: '',
                version: '',
                events: []
            },
            {
                id: 306,
                title: 'Sintesi non tecnica',
                category: 'Obbligatorio',
                subtitle: 'Archivio · Progetto C / Sintesi',
                unread: 0,
                lastUpdate: '10:55',
                status: 'uploaded',
                owner: 'Michael Malaman',
                repository: 'SharePoint',
                version: '1.0.0',
                events: [
                    { id: 'e-306-1', type: 'uploaded', time: '10:55', message: 'Prima versione caricata.', meta: { updatedBy: 'Michael Malaman' } }
                ]
            },
            {
                id: 401,
                title: 'Cartografie e mappe GIS',
                category: 'Facoltativo',
                subtitle: 'Archivio · Progetto A / GIS',
                unread: 0,
                lastUpdate: '09:15',
                status: 'approved',
                owner: 'Team GIS',
                repository: 'GitHub',
                version: '3.2.1',
                events: [
                    { id: 'e-401-1', type: 'uploaded', time: '08:40', message: 'Caricate mappe aggiornate.', meta: { updatedBy: 'Team GIS' } },
                    { id: 'e-401-2', type: 'approved', time: '09:15', message: 'Convalida cartografica ok.', meta: { updatedBy: 'QA Cartografia' } }
                ]
            },
            {
                id: 402,
                title: 'Planimetrie e sezioni',
                category: 'Facoltativo',
                subtitle: 'Archivio · Progetto B / Elaborati',
                unread: 0,
                lastUpdate: '—',
                status: '',
                owner: '—',
                repository: '',
                version: '',
                events: []
            },
            {
                id: 403,
                title: 'Fotoinserimenti e rendering',
                category: 'Facoltativo',
                subtitle: 'Archivio · Progetto B / Visual',
                unread: 1,
                lastUpdate: '12:05',
                status: 'in_review',
                owner: 'Visual Lab',
                repository: 'Teams',
                version: '0.8.4',
                events: [
                    { id: 'e-403-1', type: 'uploaded', time: '11:20', message: 'Render preliminari caricati.', meta: { updatedBy: 'Visual Lab' } },
                    { id: 'e-403-2', type: 'error', time: '11:45', message: 'Texture mancanti in due viste.', meta: { updatedBy: 'Validator', views: 2 } },
                    { id: 'e-403-3', type: 'in_review', time: '12:05', message: 'Revisione problemi di texture.', meta: { updatedBy: 'Visual Lab' } }
                ]
            },
            {
                id: 404,
                title: 'Tabelle e calcoli',
                category: 'Facoltativo',
                subtitle: 'Archivio · Progetto C / Modelli',
                unread: 0,
                lastUpdate: '08:18',
                status: 'uploaded',
                owner: 'Data Office',
                repository: 'SharePoint',
                version: '1.1.0',
                events: [
                    { id: 'e-404-1', type: 'uploaded', time: '08:18', message: 'Caricate nuove tabelle di output.', meta: { updatedBy: 'Data Office' } }
                ]
            },
            {
                id: 405,
                title: 'Relazioni specialistiche',
                category: 'Facoltativo',
                subtitle: 'Archivio · Progetto A / Studi specialistici',
                unread: 0,
                lastUpdate: '13:04',
                status: 'published',
                owner: 'Studio Tecnico Alpha',
                repository: 'SharePoint',
                version: '2.3.0',
                events: [
                    { id: 'e-405-1', type: 'uploaded', time: '12:20', message: 'Caricate relazioni aggiornate.', meta: { updatedBy: 'Studio Tecnico Alpha' } },
                    { id: 'e-405-2', type: 'approved', time: '12:45', message: 'Approvazione completata.', meta: { updatedBy: 'Comitato Scientifico' } },
                    { id: 'e-405-3', type: 'published', time: '13:04', message: 'Pubblicate in repository.', meta: { updatedBy: 'Studio Tecnico Alpha' } }
                ]
            }
        ]
    }

    /** 2) STATO REATTIVO DELL’APP (tutto deriva dal mock JSON) */
    const state = reactive({
        search: '',
        filterStatus: '',
        filterCategory: '',
        documents: loadDocumentsFromJson(MOCK_NOTIFICATIONS),
        activeDocumentId: null
    })

    /** 3) Ref per scorrere la timeline alla fine quando serve */
    const timelineContainer = ref(null)

    /** Documento attualmente selezionato (comodo per il pannello centrale) */
    const activeDocument = computed(() =>
        state.documents.find(d => d.id === state.activeDocumentId)
    )

    /** Elenco documenti filtrato per testo, stato e categoria */
    const filteredDocuments = computed(() => {
        const q = state.search.trim().toLowerCase()
        const s = state.filterStatus
        const c = state.filterCategory

        return state.documents.filter(d => {
            const matchesText =
                !q ||
                d.title.toLowerCase().includes(q) ||
                (d.subtitle && d.subtitle.toLowerCase().includes(q))
            const matchesStatus = !s || d.status === s
            const matchesCat = !c || d.category === c
            return matchesText && matchesStatus && matchesCat
        })
    })

    /* === ACTIONS: interazioni dell’utente con la UI === */

    /** Apre un documento (e azzera le sue notifiche non lette) */
    function openDocument(id) {
        state.activeDocumentId = id
        const doc = state.documents.find(d => d.id === id)
        if (doc) doc.unread = 0
    }

    /** Azzera tutti i filtri con un click */
    function resetFilters() {
        state.search = ''
        state.filterStatus = ''
        state.filterCategory = ''
    }

    /** Segna tutte le notifiche del documento come lette */
    function markAllRead(id) {
        const doc = state.documents.find(d => d.id === id)
        if (doc) doc.unread = 0
    }

    /** Simula l’arrivo di un nuovo evento (utile per test visual e scorrimento) */
    function simulateIncomingEvent(id) {
        const doc = state.documents.find(d => d.id === id)
        if (!doc) return

        const nowLabel = nowHHMM()
        const next = nextStatus(doc.status) // ciclo semplice per demo
        const eventId = 'local-' + Math.random().toString(36).slice(2)

        doc.events.push({
            id: eventId,
            type: next,
            time: nowLabel,
            message: eventMessage(next, doc.title),
            meta: { updatedBy: lastEditor(doc).name || 'Sistema' }
        })

        doc.status = next
        doc.lastUpdate = nowLabel
        doc.unread = (doc.unread || 0) + 1

        nextTick(scrollToBottom)
    }

    /* === SUPPORTO: colori/icone/testi per label e timeline === */

    /** Badge categoria: Obbligatorio → rosso; Facoltativo → azzurro; fallback → grigio */
    function categoryBadge(category) {
        if (category === 'Obbligatorio') return 'bg-danger text-white'
        if (category === 'Facoltativo') return 'bg-info text-dark'
        return 'bg-secondary text-white'
    }

    /** Badge stato (palette leggibile per ogni fase) */
    function statusBadgeClass(status) {
        switch (status) {
            case 'uploaded': return 'bg-info text-dark'
            case 'in_review': return 'bg-warning text-dark'
            case 'approved': return 'bg-success text-white'
            case 'published': return 'bg-primary text-white'
            case 'error': return 'bg-danger text-white'
            case 'comment': return 'bg-secondary text-white'
            default: return 'bg-light text-dark border'
        }
    }

    /** Ultimo editor: cerchiamo a ritroso un evento con meta.updatedBy; fallback: owner */
    function lastEditor(doc) {
        if (!doc || !Array.isArray(doc.events)) return { name: '' }
        for (let i = doc.events.length - 1; i >= 0; i--) {
            const e = doc.events[i]
            const editor = e?.meta?.updatedBy
            if (editor && typeof editor === 'string' && editor.trim().length) {
                return { name: editor.trim() }
            }
        }
        if (doc.owner && doc.owner !== '—') return { name: doc.owner }
        return { name: '' }
    }

    /* === UTILITIES di base === */

    /** Porta la timeline all’ultima riga (ci aspettiamo di vedere l’evento appena aggiunto) */
    function scrollToBottom() {
        const el = timelineContainer.value
        if (el) el.scrollTop = el.scrollHeight
    }

    /** Piccolo “workflow” fittizio per la demo (ciclo di stati) */
    function nextStatus(current) {
        switch (current) {
            case 'uploaded': return 'in_review'
            case 'in_review': return 'approved'
            case 'approved': return 'published'
            case 'published': return 'in_review' // esempio: riapertura in revisione
            case 'error': return 'in_review'
            default: return 'in_review'
        }
    }

    /** Messaggi “umani” coerenti con il tipo di evento */
    function eventMessage(type, title) {
        switch (type) {
            case 'uploaded': return `Nuovo caricamento rilevato per "${title}".`
            case 'in_review': return `Revisione avviata su "${title}".`
            case 'approved': return `Documento "${title}" approvato.`
            case 'published': return `Documento "${title}" pubblicato.`
            case 'error': return `Errore sul documento "${title}".`
            case 'comment': return `Nuovo commento su "${title}".`
            default: return `Aggiornamento: ${type}`
        }
    }

    /** Etichette localizzate per lo stato (UI-friendly) */
    function statusLabel(s) {
        return ({
            uploaded: 'Caricato',
            in_review: 'In revisione',
            approved: 'Approvato',
            published: 'Pubblicato',
            error: 'Errore',
            comment: 'Commento'
        }[s]) || s
    }

    /** Mappa icone e dot della timeline per ciascun tipo di evento */
    function statusVariant(s) {
        const map = {
            uploaded: { icon: 'icon it-file', dotClass: 'bg-info text-white' },
            in_review: { icon: 'icon it-edit', dotClass: 'bg-warning text-dark' },
            approved: { icon: 'icon it-check', dotClass: 'bg-success text-white' },
            published: { icon: 'icon it-folder', dotClass: 'bg-primary text-white' },
            error: { icon: 'icon it-close', dotClass: 'bg-danger text-white' },
            comment: { icon: 'icon it-comment', dotClass: 'bg-secondary text-white' }
        }
        return map[s] || { icon: 'icon it-info', dotClass: 'bg-secondary text-white' }
    }

    /** Titolo sintetico per la timeline in base al tipo di evento */
    function eventTitle(type) {
        return ({
            uploaded: 'Documento caricato',
            in_review: 'Revisione avviata',
            approved: 'Approvato',
            published: 'Pubblicato',
            error: 'Errore',
            comment: 'Nuovo commento'
        }[type]) || 'Aggiornamento'
    }

    /** Orario corrente in formato HH:MM */
    function nowHHMM() {
        const now = new Date()
        return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    }

    /** Carica e normalizza i documenti a partire dal JSON sorgente */
    function loadDocumentsFromJson(json) {
        if (!json || !Array.isArray(json.documents)) return []
        return json.documents.map((raw) => ({
            id: raw.id ?? Math.floor(Math.random() * 100000),
            title: raw.title || 'Documento senza titolo',
            category: raw.category || 'Facoltativo',
            subtitle: raw.subtitle || 'Archivio · Non specificato',
            unread: Number.isFinite(raw.unread) ? raw.unread : 0,
            lastUpdate: raw.lastUpdate || '—',
            status: raw.status || '',   // '' = non presente
            owner: raw.owner || '—',
            repository: raw.repository || '',
            version: raw.version || '',
            events: Array.isArray(raw.events) ? raw.events : []
        }))
    }

    /** Selezioniamo il primo documento disponibile all’avvio */
    state.activeDocumentId = state.documents[0]?.id ?? null

    // OPZIONALE: apertura programmatica
    // import { Modal } from 'bootstrap' // se esponi 'bootstrap' via bundler

    function openFakeDocModal() {
        const el = document.getElementById('fakeDocModal')
        if (!el) return
        const modal = Modal.getOrCreateInstance(el)
        modal.show()
    }

</script>

<style scoped>
        /* Timeline essenziale (semplice e leggibile) */
        .timeline li {
            position: relative;
            padding-left: 0.5rem;
        }

        /* (Opzionale) Accent visivo sulla categoria nella list-group
       .list-group-item[data-category="Obbligatorio"] { border-left: 4px solid #dc3545; }
       .list-group-item[data-category="Facoltativo"]  { border-left: 4px solid #0dcaf0; }
        */


    /* Migliora la leggibilità del corpo del “documento finto” */
    .prose h6 {
        margin-top: .75rem;
        margin-bottom: .25rem;
    }

    .prose p, .prose ul {
        margin-bottom: .5rem;
    }

</style>
