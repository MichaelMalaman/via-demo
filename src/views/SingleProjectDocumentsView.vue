
<template>
    <div class="container-fluid px-4">

        <!-- BARRA AZIONI -->
        <div class="row align-items-center mt-4 mb-4">

            <div class="col-6 d-flex justify-content-start">
                <button class="btn btn-outline-primary btn-back bg-white d-inline-flex align-items-center action-btn"
                        @click="goToDashboard">
                    <svg class="icon"><use :href="`${spritesHref}#it-arrow-left`"></use></svg>
                    Indietro
                </button>
            </div>

            <div class="col-6 d-flex justify-content-end">
                <UploadDocument />
            </div>
        </div>





        <div class="accordion accordion-background-active" id="accordionFiltri">
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingFiltri">
                    <button class="accordion-button"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseFiltri"
                            aria-expanded="true"
                            aria-controls="collapseFiltri">
                        Filtri
                    </button>
                </h2>

                <div id="collapseFiltri"
                     class="accordion-collapse collapse show"
                     role="region"
                     aria-labelledby="headingFiltri"
                     data-bs-parent="#accordionFiltri">

                    <div class="accordion-body">




                        <div class="filters-row d-flex align-items-end gap-3 flex-wrap">

                            <!-- Nome progetto -->
                            <div class="filter-equal flex-fill">
                                <label class="form-label fw-semibold">Nome progetto</label>
                                <input v-model="searchNome"
                                       type="text"
                                       class="form-control"
                                       placeholder="Digita per cercare (nome o ente)..." />
                            </div>

                            <!-- Data dal -->
                            <div class="filter-equal flex-fill">
                                <label class="form-label fw-semibold">Data dal</label>
                                <input v-model="dataDal" type="date" class="form-control" />
                            </div>

                            <!-- Data al -->
                            <div class="filter-equal flex-fill">
                                <label class="form-label fw-semibold">Data al</label>
                                <input v-model="dataAl" type="date" class="form-control" />
                            </div>

                            <!-- Stato pratica -->
                            <div class="filter-equal flex-fill">
                                <label class="form-label fw-semibold">Stato pratica</label>
                                <select v-model="statoPratica" class="form-select">
                                    <option :value="null">Tutti</option>
                                    <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
                                </select>
                            </div>

                            <!-- Reset -->
                            <div class="filter-equal flex-fill">
                                <button class="btn btn-outline-secondary w-100 reset-btn"
                                        @click="resetFiltri">
                                    Reset filtri
                                </button>
                            </div>

                        </div>

                        <!-- Badge -->
                        <div class="filters-bottom mt-3">
                            <span class="badge rounded-pill bg-primary text-white px-3 py-2">
                                Mostrati {{ shownCount }} di {{ totalCount }}
                            </span>
                        </div>



                    </div>

                </div>
            </div>
        </div>






        <!-- TABELLA DOCUMENTI -->
        <div class="table-responsive shadow-sm">
            <table class="table table-hover align-middle">

                <thead class="table-dark">
                    <tr>
                        <th scope="col"
                            role="button"
                            @click="setSort('nomeFile')">
                            NOME FILE
                            <svg class="icon"><use :href="`${spritesHref}#it-arrow-${sortDir}`"></use></svg>


                        </th>

                        <th scope="col"
                            role="button"
                            @click="setSort('dataUltimaModifica')">
                            DATA ULTIMA MODIFICA
                            <svg class="icon"><use :href="`${spritesHref}#it-arrow-${sortDir}`"></use></svg>
                        </th>

                        <th scope="col"
                            role="button"
                            @click="setSort('statoPratica')">
                            STATO PRATICA
                            <svg class="icon"><use :href="`${spritesHref}#it-arrow-${sortDir}`"></use></svg>
                        </th>

                        <th scope="col"
                            role="button"
                            @click="setSort('size')">
                            SIZE
                            <svg class="icon"><use :href="`${spritesHref}#it-arrow-${sortDir}`"></use></svg>
                        </th>

                        <th scope="col" class="text-end">FUNZIONI</th>
                    </tr>
                </thead>


                <tbody>
                    <tr v-for="(item, index) in sortedItems"
                        :key="item.id || index"
                        :class="index % 2 === 0 ? 'bg-light' : 'bg-light2'">

                        <td>
                            <DownloadSimulator :filename="item.nomeFile"
                                               :content="testo"
                                               :mime-type="item.tipoFile" />
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
                                <svg class="icon"><use :href="`${spritesHref}#it-delete`"></use></svg>
                            </DeleteItemButton>
                        </td>
                    </tr>

                    <tr v-if="!filteredItems.length">
                        <td colspan="5" class="text-center text-secondary py-4">
                            Nessun risultato
                        </td>
                    </tr>
                </tbody>

            </table>
        </div>



        <!-- TOAST -->
        <div class="toast position-fixed top-0 end-0 m-3"
             role="alert"
             aria-live="assertive"
             aria-atomic="true"
             ref="toastRef">
            <div class="toast-header" :class="toastHeaderClass">
                <strong class="me-auto">Notifica</strong>
                <button type="button"
                        class="btn-close"
                        @click="snackbar.show = false"></button>
            </div>
            <div class="toast-body" :class="toastBodyClass">
                {{ snackbar.message }}
            </div>
        </div>

    </div>
</template>


<script setup lang="ts">
    import { useRouter } from 'vue-router'
    import { useStore } from 'vuex'

    import { ref, computed, watch, onMounted, nextTick } from 'vue'

    import { Tooltip, Modal, Toast } from 'bootstrap-italia'

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


    const searchNome = computed<string | null>({
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
            console.log("setFilters", store.state.filters)
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


    //ordinamento tabella


    import { computed, onMounted, nextTick, ref } from 'vue'

    type SortKey = 'nomeFile' | 'dataUltimaModifica' | 'statoPratica' | 'size'
    type SortDir = 'up' | 'desc'

    const sortKey = ref<SortKey>('dataUltimaModifica') // default: ordina per data
    const sortDir = ref<SortDir>('desc')               // default: più recenti prima

    function setSort(key: SortKey) {
        if (sortKey.value === key) {
            sortDir.value = sortDir.value === 'up' ? 'desc' : 'up'
        } else {
            sortKey.value = key
            sortDir.value = 'up'
        }
    }



    function safeLower(s: string | null | undefined): string {
        return (s ?? '').toString().trim().toLowerCase()
    }

    function parseSize(val: string | number | null | undefined): number {
        // Se val è "1.2 MB" o "850 KB" normalizza in byte, altrimenti tenta Number
        if (typeof val === 'number') return val
        if (typeof val !== 'string') return 0
        const trimmed = val.trim()
        const m = trimmed.match(/^([\d.,]+)\s*(kb|mb|gb|b)?$/i)
        if (!m) {
            const n = Number(trimmed.replace(/[^\d.-]/g, ''))
            return isNaN(n) ? 0 : n
        }
        const num = Number(m[1].replace(',', '.'))
        const unit = (m[2] || 'b').toLowerCase()
        const factor = unit === 'gb' ? 1024 ** 3 : unit === 'mb' ? 1024 ** 2 : unit === 'kb' ? 1024 : 1
        const n = num * factor
        return isNaN(n) ? 0 : n
    }

    function compareByKey(a: Item, b: Item, key: SortKey): number {
        switch (key) {
            case 'nomeFile': {
                return safeLower(a.nomeFile).localeCompare(safeLower(b.nomeFile))
            }
            case 'statoPratica': {
                return safeLower(a.statoPratica || '').localeCompare(safeLower(b.statoPratica || ''))
            }
            case 'dataUltimaModifica': {
                const dA = parseDDMMYYYY(a.dataUltimaModifica) ?? new Date(0)
                const dB = parseDDMMYYYY(b.dataUltimaModifica) ?? new Date(0)
                return dA.getTime() - dB.getTime()
            }
            case 'size': {
                return parseSize(a.size) - parseSize(b.size)
            }
        }
    }

    const sortedItems = computed<Item[]>(() => {
        const items = filteredItems.value.slice()
        const dir = sortDir.value === 'up' ? 1 : -1
        const key = sortKey.value
        return items.sort((a, b) => compareByKey(a, b, key) * dir)
    })



    // ---- Toast ----
    const toastRef = ref<HTMLElement | null>(null)
    const snackbar = ref<{ show: boolean; message: string; color: string }>({
        show: false,
        message: '',
        color: 'success',
    })

    function showSnack(message: string, color: string = 'success') {
        snackbar.value = { show: true, message, color }
    }

    const toastHeaderClass = computed(() => {
        switch (snackbar.value.color) {
            case 'error': return 'bg-danger text-white'
            case 'success': return 'bg-success text-white'
            case 'warning': return 'bg-warning'
            default: return 'bg-primary text-white'
        }
    })
    const toastBodyClass = computed(() => {
        switch (snackbar.value.color) {
            case 'error': return 'bg-danger-subtle text-danger'
            case 'success': return 'bg-success-subtle text-success'
            case 'warning': return 'bg-warning-subtle text-warning'
            default: return ''
        }
    })

    // Toast show/hide
    watch(() => snackbar.value.show, (show) => {
        if (!toastRef.value) return
        const toast = Toast.getOrCreateInstance(toastRef.value, { delay: 2500 })
        show ? toast.show() : toast.hide()
    })


    /* ======================
     * Badge conteggi
     * ====================== */
    const shownCount = computed(() => filteredItems.value.length)
    const totalCount = computed(() => currentItems.value.length)


</script>

<style scoped>

    /* Wrapper */
    .filters-wrapper {
        background: #fff;
        border: 1px solid #d9dce1;
        border-radius: 8px;
        padding: 1.2rem 1.5rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.07);
    }

    /* Griglia filtri 2x2 */
    .filters-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: auto auto;
        gap: 0.5rem;
        align-items: center;
    }

    /* Reset su due righe */
    .reset-col {
        grid-column: 3;
        grid-row: 1 / span 2;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    .reset-btn {
        height: 48px;
        padding: 0 24px;
        border-radius: 6px !important;
        font-weight: 500;
    }

    /* Tabella alternata */
    .table tbody tr.bg-light {
        background-color: #fafafa !important;
    }

    .table tbody tr.bg-light2 {
        background-color: #f0f0f0 !important;
    }

    .table tbody tr:hover {
        background-color: #eef4ff !important;
        transition: .15s;
    }



    /* Pulsanti FUNZIONI */
    .DeleteItemButton .btn {
        border-radius: 6px !important;
        width: 36px !important;
        height: 36px !important;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-width: 2px !important;
    }

        .DeleteItemButton .btn:hover {
            background-color: #c62828 !important;
            border-color: #8b0000 !important;
        }

    .DeleteItemButton svg {
        width: 16px;
        height: 16px;
        color: #c62828 !important;
    }

    .DeleteItemButton .btn:hover svg {
        color: white !important;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .filters-grid {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
        }

        .reset-col {
            grid-column: 1 !important;
            grid-row: auto !important;
            justify-content: flex-start;
            margin-top: .5rem;
        }
    }

</style>
