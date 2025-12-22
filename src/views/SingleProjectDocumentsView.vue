
<template>
    <div class="container-fluid px-4">
        <!-- Barra azioni -->
        <div class="row align-items-center mt-4 mb-4">
            <div class="col-6 d-flex justify-content-start">
                <button class="btn btn-outline-primary bg-white" @click="goToDashboard" style="height: 50px;">
                    <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-arrow-left`"></use></svg>
                </button>
            </div>

            <div class="col-6 d-flex justify-content-end">
                <UploadDocument />
            </div>
        </div>

        <!-- FILTRI IN UNICA RIGA -->
        <div class="filters-toolbar px-3 py-2 d-flex gap-3 align-items-end flex-nowrap overflow-auto">
            <!-- Nome file -->
            <div class="filter-item" style="min-width: 260px; max-width: 320px;">
                <label for="f-nome" class="form-label mb-1">Nome file</label>
                <div class="input-group">
                    <span class="input-group-text bg-white">
                        <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-search`"></use></svg>
                    </span>
                    <input id="f-nome"
                           type="text"
                           class="form-control"
                           v-model="nomeFile"
                           placeholder="Digita per cercare (es. impianto)" />
                    <button class="btn btn-outline-secondary bg-white" type="button" @click="nomeFile = null" >Pulisci</button>
                </div>
            </div>

                <!-- Data Dal -->
                <div class="filter-item" style="min-width: 220px; max-width: 260px;">
                    <!-- v-model diretto sul proxy -->
                    <label for="f-nome" class="form-label mb-1">Data dal</label>

                    <VueDatePickerDal v-model="dataDal" />
                </div>

                <!-- Data Al -->
                <div class="filter-item" style="min-width: 220px; max-width: 260px;">
                    <!-- v-model diretto sul proxy -->
                    <label for="f-nome" class="form-label mb-1">Data al</label>

                    <VueDatePickerAl v-model="dataAl" />
                </div>

                <!-- Stato pratica -->
                <div class="filter-item" style="min-width: 220px; max-width: 260px;">
                    <label for="f-stato" class="form-label mb-1">Stato pratica</label>
                    <div class="input-group">
                        <span class="input-group-text bg-white">
                            <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-file`"></use></svg>
                        </span>
                        <select id="f-stato" class="form-select" v-model="statoPratica">
                            <option :value="null">Tutti</option>
                            <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
                        </select>
                        <button class="btn btn-outline-secondary bg-white" type="button" @click="statoPratica = null">
                            Pulisci
                        </button>
                    </div>
                </div>

                <!-- Badge conteggio + reset -->
                <div class="ms-auto d-flex align-items-center gap-3">
                    <span class="badge rounded-pill">
                        Mostrati {{ filteredItems.length }} di {{ currentItems.length }}
                    </span>
                    <!--button class="btn btn-link text-decoration-none bg-white" @click="resetFilters">Reset filtri</button-->
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
                                    :key="item.id || (item.nomeFile + '_' + index)"
                                    :class="index % 2 === 0 ? 'bg-light' : 'bg-light2'">
                                    <td>
                                        <DownloadSimulator :filename="item.nomeFile" :content="testo" :mime-type="item.tipoFile" />
                                    </td>

                                    <td>
                                        {{ item.dataUltimaModifica }}
                                        <WorkflowTimeline />
                                    </td>

                                    <td>
                                        <span v-if="item.statoPratica === 'chiusa'" class="badge rounded-pill bg-success">
                                            {{ item.statoPratica }}
                                        </span>
                                        <span v-else-if="item.statoPratica === 'respinta'" class="badge rounded-pill bg-danger">
                                            {{ item.statoPratica }}
                                        </span>
                                        <span v-else-if="['in attesa di approvazione','in stato di approvazione'].includes(item.statoPratica || '')"
                                              class="badge rounded-pill bg-warning text-dark">
                                            {{ item.statoPratica }}
                                        </span>
                                        <span v-else>-</span>
                                    </td>

                                    <td>{{ item.size }}</td>
                                    <td class="text-end">
                                        <DeleteItemButton :id="item.id"
                                                          variant="outline-danger"
                                                          size="sm"
                                                          :confirm="true"
                                                          @deleted="onDeleted">
                                            <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-delete`"></use></svg>
                                            Elimina
                                        </DeleteItemButton>
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
    import { computed, onMounted, nextTick } from 'vue'
    import VueDatePickerAl from '../components/VueDatePickerAl.vue'
    import VueDatePickerDal from '../components/VueDatePickerDal.vue'
    import DownloadSimulator from '../components/DownloadSimulator.vue'
    import WorkflowTimeline from '../components/WorkflowTimeline.vue'
    import UploadDocument from '../components/UploadDocument.vue'
    import DeleteItemButton from '../components/DeleteItemButton.vue'
    import spritesUrl from 'bootstrap-italia/dist/svg/sprites.svg?url'

    declare global { interface Window { bootstrap: any } }

    const router = useRouter()
    const store = useStore()
    const spritesHref = spritesUrl

    /* ---------- Tipi ---------- */


    /* ---------- Dati (da Vuex) ---------- */
    const currentItems = computed<Item[]>(() => store.state.items)
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
        if (!s || s.trim() === '') return null
        const d = new Date(s + 'T00:00:00')
        return isNaN(d.getTime()) ? null : d
    }
    const norm = (s: string | null) => (s === '' ? null : s)

    /* ---------- Proxy computed verso Vuex (NO watcher deep) ---------- */
    const nomeFile = computed<string | null>({
        get: () => store.state.filters.nomeFile ?? null,
        set: (v) => {
            store.commit('setFilters', { ...store.state.filters, nomeFile: norm(v) })
        },
    })

    const statoPratica = computed<string | null>({
        get: () => store.state.filters.statoPratica ?? null,
        set: (v) => {
            store.commit('setFilters', { ...store.state.filters, statoPratica: norm(v) })
        },
    })

    const dataDal = computed<string | null>({
        get: () => store.state.filters.dataDal ?? null,
        set: (v) => {
            const dal = norm(v)
            let al = store.state.filters.dataAl ?? null
            const dDal = parseISODate(dal), dAl = parseISODate(al)
            if (dDal && dAl && dDal > dAl) al = dal       // mantieni dal ≤ al
            store.commit('setFilters', { ...store.state.filters, dataDal: dal, dataAl: al })
            console.log("setFilters",store.state.filters)
        },
    })

    const dataAl = computed<string | null>({
        get: () => store.state.filters.dataAl ?? null,
        set: (v) => {
            const al = norm(v)
            let dal = store.state.filters.dataDal ?? null
            const dDal = parseISODate(dal), dAl = parseISODate(al)
            if (dDal && dAl && dDal > dAl) dal = al       // mantieni dal ≤ al
            store.commit('setFilters', { ...store.state.filters, dataDal: dal, dataAl: al })
        },
    })

    /* ---------- Computed: filtraggio ---------- */
    const filtersState = computed(() => store.state.filters)

    const filteredItems = computed<Item[]>(() => {
        const nome = (filtersState.value.nomeFile || '').trim().toLowerCase()
        const stato = (filtersState.value.statoPratica || '').trim().toLowerCase()
        const tokens = nome ? nome.split(/\s+/).filter(Boolean) : []

        const dal = parseISODate(filtersState.value.dataDal)
        const al = parseISODate(filtersState.value.dataAl)

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

    /* ---------- Bootstrap init (Tooltip) ---------- */
    onMounted(async () => {
        // Se il bundle BI non è già stato importato globalmente, caricalo qui.
        if (typeof window !== 'undefined' && !window.bootstrap) {
            await import('bootstrap-italia/dist/js/bootstrap-italia.bundle.min.js')
        }
        await nextTick()
        document
            .querySelectorAll<HTMLElement>('[data-bs-toggle="tooltip"]')
            .forEach(el => new window.bootstrap.Tooltip(el))
    })

    /* ---------- Router ---------- */
    function goToDashboard() { router.push({ name: 'dashboard' }) }

    /* ---------- Callback eliminazione ---------- */
    function onDeleted(id: string) { console.log('Eliminato:', id) }

    /* Contenuto per DownloadSimulator */
    const testo = `Relazione finale progetto
- Sezione A
- Sezione B
© 2025`
</script>

<style scoped>
    /* Toolbar filtri in singola riga con scroll se necessario */
    .filters-toolbar {
        display: flex;
        gap: 12px;
        align-items: center;
        flex-wrap: nowrap;
        overflow-x: auto;
        white-space: nowrap;
    }

        .filters-toolbar .filter-item {
            flex: 0 0 auto;
        }

    /* Tabella a righe alterne */
    .table tbody tr.bg-light {
        background-color: #f9f9f9 !important;
    }

    .table tbody tr.bg-light2 {
        background-color: #a5a5a5 !important;
    }
</style>
