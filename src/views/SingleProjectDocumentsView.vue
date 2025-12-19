
<template>
    <div class="container-fluid px-4">
        <!-- Barra azioni -->
        <div class="row align-items-center mt-4 mb-4">
            <div class="col-6 d-flex justify-content-start">
                <button class="btn btn-outline-primary bg-white" @click="goToDashboard" style="height: 50px;">
                    <svg class="icon"><use :href="`${spritesHref}#it-arrow-left`"></use></svg>
                </button>
            </div>
            <div class="col-6 d-flex justify-content-end">

                <UploadDocument />
            </div>
            </div>



            <!-- Modale eliminazione (sostituisce v-dialog conferma) -->
            <Teleport to="body">
                <div class="modal fade" tabindex="-1" ref="deleteModalRef" aria-hidden="true" role="dialog" aria-labelledby="deleteModalTitle">
                    <div class="modal-dialog modal-sm modal-dialog-centered">
                        <div class="modal-content">

                            <div class="modal-header">
                                <h5 class="modal-title" id="deleteModalTitle">Conferma eliminazione</h5>
                                <!-- delega a Bootstrap la chiusura (gestione ARIA/focus/backdrop) -->
                                <button type="button" class="btn-close" data-bs-dismiss="modal" @click="closeDeleteDialog" aria-label="Chiudi"></button>
                            </div>

                            <div class="modal-body">
                                Sei sicuro di voler cancellare il file
                                <strong>{{ selectedItem?.nomeFile || 'selezionato' }}</strong>?
                            </div>

                            <div class="modal-footer">
                                <button class="btn btn-outline-secondary" data-bs-dismiss="modal" @click="closeDeleteDialog">Annulla</button>
                                <button class="btn btn-danger" @click="confirmDelete">
                                    <svg class="icon"><use :href="`${spritesHref}#it-check`"></use></svg>

                                    Conferma
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </Teleport>

            <!-- FILTRI IN UNICA RIGA (sostituisce v-toolbar, v-text-field, v-select, v-menu+v-date-picker) -->
            <div class="filters-toolbar px-3 py-2 d-flex gap-3 align-items-end flex-nowrap overflow-auto">
                <!-- Nome file -->
                <div class="filter-item" style="min-width: 260px; max-width: 320px;">
                    <label for="f-nome" class="form-label mb-1">Nome file</label>
                    <div class="input-group">
                        <span class="input-group-text bg-white">
                            <svg class="icon"><use :href="`${spritesHref}#it-search`"></use></svg>
                        </span>
                        <input id="f-nome"
                               type="text"
                               class="form-control"
                               v-model="filters.nomeFile"
                               placeholder="Digita per cercare (es. impianto)" />
                        <button class="btn btn-outline-secondary" type="button" @click="filters.nomeFile = null">Pulisci</button>
                    </div>
                </div>

                <!-- Data Dal (BI datepicker) -->
                <div class="filter-item" style="min-width: 220px; max-width: 260px;">
                    <label for="f-dal" class="form-label mb-1">Ultima modifica (dal)</label>
                    <div class="it-datepicker-wrapper">
                        <div class="input-group">
                            <input id="f-dal"
                                   class="form-control"
                                   type="text"
                                   placeholder="aaaa-mm-gg"
                                   v-model="filters.dataDal"
                                   data-bs-toggle="datepicker"
                                   :data-bs-options="JSON.stringify({ format: 'yyyy-MM-dd', weekStart: 1 })"
                                   aria-describedby="f-dal-calendar" />
                            <span class="input-group-text" id="f-dal-calendar">
                                <svg class="icon"><use :href="`${spritesHref}#it-calendar`"></use></svg>

                            </span>
                        </div>
                    </div>
                </div>

                <!-- Data Al (BI datepicker) -->
                <div class="filter-item" style="min-width: 220px; max-width: 260px;">
                    <label for="f-al" class="form-label mb-1">Ultima modifica (al)</label>
                    <div class="it-datepicker-wrapper">
                        <div class="input-group">
                            <input id="f-al"
                                   class="form-control"
                                   type="text"
                                   placeholder="aaaa-mm-gg"
                                   v-model="filters.dataAl"
                                   data-bs-toggle="datepicker"
                                   :data-bs-options="JSON.stringify({ format: 'yyyy-MM-dd', weekStart: 1 })"
                                   aria-describedby="f-al-calendar" />
                            <span class="input-group-text" id="f-al-calendar">
                                <svg class="icon"><use :href="`${spritesHref}#calendar`"></use></svg>
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Stato pratica -->
                <div class="filter-item" style="min-width: 220px; max-width: 260px;">
                    <label for="f-stato" class="form-label mb-1">Stato pratica</label>
                    <div class="input-group">
                        <span class="input-group-text bg-white">
                            <svg class="icon"><use :href="`${spritesHref}#it-arrow-right`"></use></svg>
                        </span>
                        <select id="f-stato" class="form-select" v-model="filters.statoPratica">
                            <option :value="null">Tutti</option>
                            <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
                        </select>
                        <button class="btn btn-outline-secondary bg-white" type="button" @click="filters.statoPratica = null">Pulisci</button>
                    </div>
                </div>

                <!-- Badge conteggio risultati + reset -->
                <div class="ms-auto d-flex align-items-center gap-3">
                    <span class="badge rounded-pill">
                        Mostrati {{ filteredItems.length }} di {{ currentItems.length }}
                    </span>
                    <button class="btn btn-link text-decoration-none bg-white" @click="resetFilters">Reset filtri</button>
                </div>
            </div>

            <!-- Tabella -->
            <div class="row mt-4 mb-4">
                <div class="col-12">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle">
                            <thead class="table-dark">
                                <tr>
                                    <th scope="col">NOME FILE</th>
                                    <th scope="col">DATA ULTIMA MODIFICA</th>
                                    <th scope="col">STATO PRATICA</th>
                                    <th scope="col">SIZE</th>
                                    <th scope="col">FUNZIONI</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in filteredItems"
                                    :key="item.nomeFile + index"
                                    :class="index % 2 === 0 ? 'bg-light' : 'bg-light2'">
                                    <td>
                                        <!-- Azione download simulata -->
                                        <DownloadSimulator :filename="item.nomeFile" :content="testo" :mime-type="item.tipoFile" />
                                    </td>

                                    <td>
                                        {{ item.dataUltimaModifica }}
                                        <WorkflowTimeline />
                                    </td>

                                    <td>
                                        <span v-if="item.statoPratica === 'chiusa' " class="badge rounded-pill bg-success">
                                            {{ item.statoPratica }}
                                        </span>
                                        <span v-else-if="item.statoPratica === 'respinta' " class="badge rounded-pill bg-danger">
                                            {{ item.statoPratica }}
                                        </span>
                                        <span v-else-if="item.statoPratica === 'in attesa di approvazione' " class="badge rounded-pill bg-warning text-dark">
                                            {{ item.statoPratica }}
                                        </span>
                                        <span v-else>-</span>
                                    </td>

                                    <td>{{ item.size }}</td>
                                    <td>
                                        <button class="btn btn-icon btn-outline-danger" @click="openDeleteDialog(item)" aria-label="Elimina">
                                            <svg class="icon"><use :href="`${spritesHref}#it-delete`"></use></svg>
                                        </button>
                                    </td>
                                </tr>

                                <tr v-if="!filteredItems.length">
                                    <td colspan="5" class="text-center text-secondary py-4">Nessun risultato</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
</template>

<script setup lang="ts">
    import { useRouter } from 'vue-router'
    import { useStore } from 'vuex'
    import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

    import DownloadSimulator from '../components/DownloadSimulator.vue'
    import WorkflowTimeline from '../components/WorkflowTimeline.vue'
    import UploadDocument from '../components/UploadDocument.vue'
    import spritesUrl from 'bootstrap-italia/dist/svg/sprites.svg?url'

    declare global { interface Window { bootstrap: any } }

    const router = useRouter()
    const store = useStore()
    const spritesHref = spritesUrl

    /* ---------- Tipi ---------- */
    type Item = {
        nomeFile: string
        dataUltimaModifica: string   // 'DD/MM/YYYY'
        statoPratica?: string
        tipoFile: string
        size: string
        funzioni?: string
    }

    /* ---------- Dati (ora da Vuex) ---------- */
    // lista corrente sempre dal Vuex
    const currentItems = computed<Item[]>(() => store.state.items)

    /* ---------- FILTRI (UI locale + sync con Vuex) ---------- */
    // Manteniamo un ref locale per v-model e lo sincronizziamo con lo store
    const filters = ref<{
        nomeFile: string | null
        dataDal: string | null   // ISO 'YYYY-MM-DD'
        dataAl: string | null
        statoPratica: string | null
    }>({
        nomeFile: store.state.filters.nomeFile ?? null,
        dataDal: store.state.filters.dataDal ?? null,
        dataAl: store.state.filters.dataAl ?? null,
        statoPratica: store.state.filters.statoPratica ?? null
    })

    // Sync locale -> store
    watch(filters, (f) => {
        store.commit('setFilters', { ...f })
    }, { deep: true })

    // Sync store -> locale (in caso altri componenti modifichino i filtri)
    watch(() => store.state.filters, (f) => {
        filters.value = { ...f }
    }, { deep: true })

    function resetFilters() {
        store.dispatch('resetFilters')
        // il watcher store -> locale aggiornerà filters.value
    }

    /* Stati disponibili (dinamici dalla tabella corrente, ora da Vuex getter) */
    const statusOptions = computed<string[]>(() => store.getters.statusOptions)

    /* ---------- Utilità date ---------- */
    function parseDDMMYYYY(s: string): Date | null {
        const parts = s.split('/')
        if (parts.length !== 3) return null
        const [dd, mm, yyyy] = parts.map(Number)
        const d = new Date(yyyy, mm - 1, dd)
        return isNaN(d.getTime()) ? null : d
    }
    function parseISODate(s: string | null): Date | null {
        if (!s) return null
        if (s.trim() === '') return null
        const d = new Date(s + 'T00:00:00')
        return isNaN(d.getTime()) ? null : d
    }

    /* ---------- Coerenza/fix datepicker BI ---------- */
    // Trasforma '' -> null per evitare filtri non voluti
    watch(filters, (f) => {
        if (f.dataDal === '') f.dataDal = null
        if (f.dataAl === '') f.dataAl = null
    }, { deep: true })

    // Mantieni il range: se dal > al, allinea l’altro estremo
    watch(() => filters.value.dataDal, (newDal) => {
        const dal = parseISODate(newDal)
        const al = parseISODate(filters.value.dataAl)
        if (dal && al && dal > al) {
            filters.value.dataAl = newDal
        }
    })
    watch(() => filters.value.dataAl, (newAl) => {
        const dal = parseISODate(filters.value.dataDal)
        const al = parseISODate(newAl)
        if (dal && al && dal > al) {
            filters.value.dataDal = newAl
        }
    })

    /* ---------- Computed: filtraggio (su items dello store + filtri locali) ---------- */
    const filteredItems = computed<Item[]>(() => {
        const nome = (filters.value.nomeFile || '').trim().toLowerCase()
        const stato = (filters.value.statoPratica || '').trim().toLowerCase()
        const tokens = nome ? nome.split(/\s+/).filter(Boolean) : []

        const dal = parseISODate(filters.value.dataDal)
        const al = parseISODate(filters.value.dataAl)

        return currentItems.value.filter(it => {
            const nomeLC = it.nomeFile.toLowerCase()
            const nomeOk = tokens.length ? tokens.every(t => nomeLC.includes(t)) : true

            const dItem = parseDDMMYYYY(it.dataUltimaModifica)
            const dalOk = dal ? (dItem ? dItem >= dal : false) : true
            const alOk = al ? (dItem ? dItem <= al : false) : true

            const statoOk = stato ? (it.statoPratica || '').toLowerCase() === stato : true

            return nomeOk && dalOk && alOk && statoOk
        })
    })

    /* ---------- Dialog eliminazione ---------- */
    const deleteModalRef = ref<HTMLElement | null>(null)
    let deleteModal: any = null
    const selectedItem = ref<Item | null>(null)

    function openDeleteDialog(item: Item) {
        selectedItem.value = item

        // Fallback: crea l'istanza se non esiste ancora
        if (!deleteModal && window.bootstrap && deleteModalRef.value) {
            deleteModal =
                window.bootstrap.Modal.getInstance?.(deleteModalRef.value) ??
                new window.bootstrap.Modal(deleteModalRef.value, { backdrop: 'static' })
        }

        deleteModal?.show()
    }

    function closeDeleteDialog() {
        deleteModal?.hide()
        selectedItem.value = null
    }

    function confirmDelete() {
        if (!selectedItem.value) return
        // delega la rimozione al Vuex (così è globale e reattivo ovunque)
        store.dispatch('deleteItem', selectedItem.value)
        closeDeleteDialog()
    }


    /* Contenuto per DownloadSimulator */
    const testo = `Relazione finale progetto
- Sezione A
- Sezione B
© 2025`

    /* ---------- Router ---------- */
    function goToDashboard() { router.push({ name: 'dashboard' }) }

    /* ---------- Bootstrap init (Modal / Tooltip) ---------- */
    onMounted(async () => {
        if (window.bootstrap) {
            // Attendi che Teleport abbia completato il render nel body
            await nextTick()

            if (deleteModalRef.value) {
                // Inizializzazione robusta (fallback al costruttore)
                deleteModal =
                    window.bootstrap.Modal.getInstance?.(deleteModalRef.value) ??
                    new window.bootstrap.Modal(deleteModalRef.value, { backdrop: 'static' })
            }


            // Attiva i tooltip presenti nella pagina
            document
                .querySelectorAll<HTMLElement>('[data-bs-toggle="tooltip"]')
                .forEach(el => new window.bootstrap.Tooltip(el))
        } else {
            console.warn('Bootstrap Italia bundle non caricato: window.bootstrap è undefined.')
        }
    })

    onBeforeUnmount(() => {
        deleteModal?.dispose?.()
        deleteModal = null

    })
</script>

<style scoped>
    /* Toolbar filtri in singola riga con scroll se necessario */
    .filters-toolbar {
        display: flex;
        gap: 12px;
        align-items: center;
        flex-wrap: nowrap; /* evita andare a capo */
        overflow-x: auto; /* abilita scroll orizzontale se serve */
        white-space: nowrap; /* evita wrap del contenuto */
    }

        .filters-toolbar .filter-item {
            flex: 0 0 auto; /* ogni item mantiene la sua larghezza */
        }

    /* Tabella a righe alterne (già c'è table-hover; aggiungiamo light bg alternato) */
    .table tbody tr.bg-light {
        background-color: #f9f9f9 !important;
    }

    .table tbody tr.bg-light2 {
        background-color: #a5a5a5 !important;
    }


    </style>