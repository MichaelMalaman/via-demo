
<template>
    <div class="container-fluid px-4">
        <!-- Barra azioni -->
        <div class="row align-items-center mt-4 mb-4">
            <!-- Pulsante sinistro -->
            <div class="col-6 d-flex justify-content-start">
                <button class="btn btn-back btn-outline-primary bg-white d-inline-flex align-items-center"
                        @click="goToHome"
                        style="height: 50px;">
                    <svg class="icon"><use :href="`${spritesHref}#it-arrow-left`"></use></svg>
                    <span class="ms-2">Indietro</span>
                </button>
            </div>

            <!-- Pulsante destro -->
            <div class="col-6 d-flex justify-content-end">
                <button v-if="store.state.username === 'pippo'"
                        class="btn btn-outline-primary bg-white d-inline-flex align-items-center"
                        @click="creaNuovoProgetto"
                        style="height: 50px;">
                    <svg class="icon"><use :href="`${spritesHref}#it-plus-circle`"></use></svg>
                    <span class="ms-2">Crea nuova pratica</span>
                </button>
            </div>
        </div>

        <!-- Filtri -->
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

                            <!-- Stato pratica (aperta/chiusa) -->
                            <div class="filter-equal flex-fill">
                                <label class="form-label fw-semibold">Stato pratica</label>
                                <select v-model="statoPratica" class="form-select">
                                    <option :value="null">Tutti</option>
                                    <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
                                </select>
                            </div>

                            <!-- Reset -->
                            <div class="filter-equal flex-fill">
                                <button class="btn btn-outline-secondary w-100 reset-btn" @click="resetFiltri">
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

        <!-- Unica tabella pratiche (aperte + chiuse) -->
        <div class="table-responsive mt-4">
            <table class="table table-hover align-middle">
                <thead class="table-dark">
                    <tr>
                        <th scope="col"
                            role="button"
                            tabindex="0"
                            :aria-sort="sortKey === 'nomeProgetto' ? (sortDir === 'up' ? 'ascending' : 'descending') : 'none'"
                            @click="setSort('nomeProgetto')"
                            @keyup.enter="setSort('nomeProgetto')"
                            @keyup.space.prevent="setSort('nomeProgetto')">
                            NOME PROGETTO
                            <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-arrow-${sortDir}`"></use></svg>
                        </th>

                        <th scope="col"
                            role="button"
                            tabindex="0"
                            :aria-sort="sortKey === 'dataInizio' ? (sortDir === 'up' ? 'ascending' : 'descending') : 'none'"
                            @click="setSort('dataInizio')"
                            @keyup.enter="setSort('dataInizio')"
                            @keyup.space.prevent="setSort('dataInizio')">
                            DATA INIZIO
                            <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-arrow-${sortDir}`"></use></svg>
                        </th>

                        <th scope="col"
                            role="button"
                            tabindex="0"
                            :aria-sort="sortKey === 'ente' ? (sortDir === 'up' ? 'ascending' : 'descending') : 'none'"
                            @click="setSort('ente')"
                            @keyup.enter="setSort('ente')"
                            @keyup.space.prevent="setSort('ente')">
                            ENTE
                            <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-arrow-${sortDir}`"></use></svg>
                        </th>

                        <th scope="col"
                            role="button"
                            tabindex="0"
                            :aria-sort="sortKey === 'scadenza' ? (sortDir === 'up' ? 'ascending' : 'descending') : 'none'"
                            @click="setSort('scadenza')"
                            @keyup.enter="setSort('scadenza')"
                            @keyup.space.prevent="setSort('scadenza')">
                            SCADENZA
                            <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-arrow-${sortDir}`"></use></svg>
                        </th>

                        <th scope="col">STATO (fase)</th>
                        <th scope="col">TEMPISTICHE CONSEGNA</th>
                        <th scope="col">APER./CHIUSA</th>
                        <th class="text-end">AZIONI</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(item, index) in paginated"
                        :key="String(item.id)"
                        :class="index % 2 === 0 ? 'bg-light' : 'bg-light2'">
                        <td>
                            <span v-if="item.nomeProgetto !== 'IMPIANTO FOTOVOLTAICO'">
                                {{ item.nomeProgetto }}
                            </span>
                            <button v-else
                                    type="button"
                                    class="btn btn-link p-0 text-primary"
                                    @click="goToSingleProjectDocument(item)">
                                {{ item.nomeProgetto }}
                            </button>
                        </td>
                        <td>{{ item.dataInizio }}</td>
                        <td>{{ item.ente }}</td>
                        <td>{{ item.scadenza }}</td>
                        <td>
                            <span class="badge rounded-pill bg-secondary text-white">{{ item.statoFase }}</span>
                        </td>
                        <td>
                            <span class="badge rounded-pill d-inline-flex align-items-center gap-2 px-2 py-1"
                                  :class="`bg-${getSemaforo(item).color} text-${getSemaforo(item).textColor}`"
                                  :title="getSemaforo(item).tooltip"
                                  :aria-label="`Scadenza: ${getSemaforo(item).aria}`">
                                <span class="semaphore-dot me-1" :class="`bg-${getSemaforo(item).dotColor}`" />
                                {{ getSemaforo(item).label }}
                            </span>
                        </td>
                        <td>
                            <span :class="['badge rounded-pill', item.statoChiuso ? 'bg-dark' : 'bg-success']">
                                {{ item.statoChiuso ? 'Chiusa' : 'Aperta' }}
                            </span>
                        </td>
                        <td class="text-end">
                            <DeleteItemButton :id="String(item.id)"
                                              variant="outline-danger"
                                              size="sm"
                                              :confirm="true"
                                              @deleted="onDeleted">
                                <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-delete`"></use></svg>
                            </DeleteItemButton>
                        </td>
                    </tr>

                    <tr v-if="paginated.length === 0">
                        <td colspan="8" class="text-center text-secondary py-4">Nessuna pratica disponibile</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Paginazione -->
        <nav aria-label="Pagine pratiche" class="mt-3">
            <ul class="pagination justify-content-end">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <button class="page-link" @click="setPage(currentPage - 1)" aria-label="Precedente">
                        &laquo;
                    </button>
                </li>
                <li v-for="p in totalPages"
                    :key="'p-' + p"
                    class="page-item"
                    :class="{ active: currentPage === p }">
                    <button class="page-link" @click="setPage(p)">{{ p }}</button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <button class="page-link" @click="setPage(currentPage + 1)" aria-label="Successivo">
                        &raquo;
                    </button>
                </li>
            </ul>
        </nav>

        <!-- TOAST -->
        <div class="toast position-fixed top-0 end-0 m-3"
             role="alert"
             aria-live="assertive"
             aria-atomic="true"
             ref="toastRef">
            <div class="toast-header" :class="toastHeaderClass">
                <strong class="me-auto">Notifica</strong>
                <button type="button" class="btn-close" @click="snackbar.show = false"></button>
            </div>
            <div class="toast-body" :class="toastBodyClass">
                {{ snackbar.message }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, watch, nextTick } from 'vue'
    import { useStore } from 'vuex'
    import { useRouter } from 'vue-router'
    import DeleteItemButton from '../components/DeleteItemButton.vue'
    import spritesUrl from 'bootstrap-italia/dist/svg/sprites.svg?url'
    const spritesHref = spritesUrl

    declare global {
        interface Window { bootstrap: any }
    }

    const router = useRouter()
    const store = useStore()

    /* Tipi */
    type Fase = 'Screening' | 'Scoping' | 'Istruttoria' | 'Consultazione' | 'Provvedimento' | 'Monitoraggio'
    type Item = {
        id: number
        nomeProgetto: string
        dataInizio: string   // 'DD/MM/YYYY'
        ente: string
        scadenza: string     // 'DD/MM/YYYY'
        statoChiuso: boolean
        statoFase: Fase
    }

    /* Dataset (unico, già pronto) */
    const pratiche = ref<Item[]>(
        [
            {
                "id": 1,
                "nomeProgetto": "IMPIANTO FOTOVOLTAICO",
                "dataInizio": "12/03/2022",
                "ente": "REGIONE LOMBARDIA",
                "scadenza": "12/04/2022",
                "statoChiuso": false,
                "statoFase": "Istruttoria"
            },
            {
                "id": 2,
                "nomeProgetto": "IMPIANTO EOLICO",
                "dataInizio": "12/03/2022",
                "ente": "REGIONE LOMBARDIA",
                "scadenza": "12/04/2022",
                "statoChiuso": false,
                "statoFase": "Scoping"
            },
            {
                "id": 3,
                "nomeProgetto": "IMPIANTO BIOESEL",
                "dataInizio": "12/03/2022",
                "ente": "REGIONE LOMBARDIA",
                "scadenza": "12/04/2022",
                "statoChiuso": false,
                "statoFase": "Provvedimento"
            },
            {
                "id": 4,
                "nomeProgetto": "NUOVO STADIO",
                "dataInizio": "12/03/2022",
                "ente": "REGIONE LOMBARDIA",
                "scadenza": "12/04/2022",
                "statoChiuso": false,
                "statoFase": "Screening"
            },
            {
                "id": 5,
                "nomeProgetto": "PARCO GARIBALDI",
                "dataInizio": "12/03/2022",
                "ente": "REGIONE LOMBARDIA",
                "scadenza": "12/04/2022",
                "statoChiuso": false,
                "statoFase": "Monitoraggio"
            },
            {
                "id": 6,
                "nomeProgetto": "NUOVO PARCHEGGIO",
                "dataInizio": "12/03/2022",
                "ente": "REGIONE LOMBARDIA",
                "scadenza": "12/04/2022",
                "statoChiuso": false,
                "statoFase": "Istruttoria"
            },
            {
                "id": 7,
                "nomeProgetto": "PARCO MONTALE",
                "dataInizio": "12/03/2022",
                "ente": "REGIONE LOMBARDIA",
                "scadenza": "12/04/2022",
                "statoChiuso": false,
                "statoFase": "Scoping"
            },
            {
                "id": 8,
                "nomeProgetto": "NUOVA ARENA",
                "dataInizio": "12/03/2022",
                "ente": "REGIONE LOMBARDIA",
                "scadenza": "12/04/2022",
                "statoChiuso": false,
                "statoFase": "Provvedimento"
            },
            {
                "id": 101,
                "nomeProgetto": "IMPIANTO GEOTERMICO",
                "dataInizio": "05/02/2023",
                "ente": "REGIONE PIEMONTE",
                "scadenza": "15/05/2023",
                "statoChiuso": true,
                "statoFase": "Consultazione"
            },
            {
                "id": 102,
                "nomeProgetto": "BONIFICA AREA INDUSTRIALE",
                "dataInizio": "18/07/2022",
                "ente": "REGIONE VENETO",
                "scadenza": "30/09/2022",
                "statoChiuso": true,
                "statoFase": "Consultazione"
            },
            {
                "id": 103,
                "nomeProgetto": "NUOVO PARCO URBANO",
                "dataInizio": "10/01/2024",
                "ente": "COMUNE DI MILANO",
                "scadenza": "20/03/2024",
                "statoChiuso": true,
                "statoFase": "Consultazione"
            },
            {
                "id": 104,
                "nomeProgetto": "IMPIANTO IDROELETTRICO",
                "dataInizio": "22/11/2023",
                "ente": "REGIONE TRENTINO-ALTO ADIGE",
                "scadenza": "15/02/2024",
                "statoChiuso": true,
                "statoFase": "Consultazione"
            },
            {
                "id": 105,
                "nomeProgetto": "RECUPERO DISCARICA",
                "dataInizio": "03/06/2023",
                "ente": "REGIONE EMILIA-ROMAGNA",
                "scadenza": "10/08/2023",
                "statoChiuso": true,
                "statoFase": "Consultazione"
            },
            {
                "id": 106,
                "nomeProgetto": "NUOVA CICLABILE",
                "dataInizio": "12/09/2022",
                "ente": "COMUNE DI TORINO",
                "scadenza": "25/11/2022",
                "statoChiuso": true,
                "statoFase": "Consultazione"
            },
            {
                "id": 107,
                "nomeProgetto": "IMPIANTO BIOMASSA",
                "dataInizio": "08/04/2023",
                "ente": "REGIONE LOMBARDIA",
                "scadenza": "18/06/2023",
                "statoChiuso": true,
                "statoFase": "Consultazione"
            },
            {
                "id": 108,
                "nomeProgetto": "RIQUALIFICAZIONE LAGUNA",
                "dataInizio": "20/08/2023",
                "ente": "REGIONE VENETO",
                "scadenza": "05/10/2023",
                "statoChiuso": true,
                "statoFase": "Consultazione"
            },
            {
                "id": 109,
                "nomeProgetto": "NUOVO CENTRO SPORTIVO",
                "dataInizio": "15/03/2024",
                "ente": "COMUNE DI FIRENZE",
                "scadenza": "30/05/2024",
                "statoChiuso": true,
                "statoFase": "Consultazione"
            },
            {
                "id": 110,
                "nomeProgetto": "IMPIANTO SOLARE TERMICO",
                "dataInizio": "01/07/2023",
                "ente": "REGIONE SICILIA",
                "scadenza": "15/09/2023",
                "statoChiuso": true,
                "statoFase": "Consultazione"
            }
        ]
    )

    /* Filtri */
    const searchNome = ref<string>('')            // testo libero (nomeProgetto / ente)
    const dataDal = ref<string | null>(null)      // 'YYYY-MM-DD'
    const dataAl = ref<string | null>(null)      // 'YYYY-MM-DD'
    const statoPratica = ref<'aperta' | 'chiusa' | null>(null)
    const statusOptions = ['aperta', 'chiusa'] as const

    /* Ordinamento */
    type SortKeyPratiche = 'nomeProgetto' | 'dataInizio' | 'ente' | 'scadenza'
    type SortDir = 'up' | 'down'
    const sortKey = ref<SortKeyPratiche>('dataInizio')
    const sortDir = ref<SortDir>('down')
    function setSort(key: SortKeyPratiche) {
        if (sortKey.value === key) sortDir.value = sortDir.value === 'up' ? 'down' : 'up'
        else { sortKey.value = key; sortDir.value = 'up' }
    }

    /* Utilità */
    function parseDDMMYYYY(s: string): Date | null {
        const parts = s.split('/')
        if (parts.length !== 3) return null
        const [dd, mm, yyyy] = parts.map(Number)
        const d = new Date(yyyy, mm - 1, dd)
        return isNaN(d.getTime()) ? null : d
    }
    function parseISODate(s: string | null | undefined): Date | null {
        if (!s) return null
        const d = new Date(`${s}T00:00:00`)
        return isNaN(d.getTime()) ? null : d
    }
    function safeLower(s: string | null | undefined): string {
        return (s ?? '').toString().trim().toLowerCase()
    }
    function comparePratiche(a: Item, b: Item, key: SortKeyPratiche): number {
        switch (key) {
            case 'nomeProgetto': return safeLower(a.nomeProgetto).localeCompare(safeLower(b.nomeProgetto))
            case 'ente': return safeLower(a.ente).localeCompare(safeLower(b.ente))
            case 'dataInizio': return (parseDDMMYYYY(a.dataInizio)?.getTime() ?? 0) - (parseDDMMYYYY(b.dataInizio)?.getTime() ?? 0)
            case 'scadenza': return (parseDDMMYYYY(a.scadenza)?.getTime() ?? 0) - (parseDDMMYYYY(b.scadenza)?.getTime() ?? 0)
        }
    }

    /* Semaforo scadenze */
    const MS_PER_DAY = 24 * 60 * 60 * 1000
    const sogliaGiallo = 30
    const sogliaRosso = 7
    function daysTo(date: Date): number {
        const today = new Date()
        const start = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        const end = new Date(date.getFullYear(), date.getMonth(), date.getDate())
        return Math.ceil((end.getTime() - start.getTime()) / MS_PER_DAY)
    }
    function getSemaforo(item: Item) {
        const dScad = parseDDMMYYYY(item.scadenza)
        if (!dScad) {
            return {
                color: 'secondary',
                textColor: 'white',
                dotColor: 'secondary',
                label: 'n.d.',
                tooltip: 'Scadenza non disponibile',
                aria: 'non disponibile'
            }
        }
        const diff = daysTo(dScad)
        if (diff < 0) {
            return { color: 'danger', textColor: 'white', dotColor: 'danger', label: 'Scaduta', tooltip: `Scaduta da ${Math.abs(diff)} giorno/i`, aria: 'scaduta' }
        }
        if (diff <= sogliaRosso) {
            return { color: 'danger', textColor: 'white', dotColor: 'danger', label: `${diff}g`, tooltip: `Mancano ${diff} giorno/i alla scadenza`, aria: `mancano ${diff} giorni` }
        }
        if (diff <= sogliaGiallo) {
            return { color: 'warning', textColor: 'dark', dotColor: 'warning', label: `${diff}g`, tooltip: `Mancano ${diff} giorno/i alla scadenza`, aria: `mancano ${diff} giorni` }
        }
        return { color: 'success', textColor: 'white', dotColor: 'success', label: `${diff}g`, tooltip: `Mancano ${diff} giorno/i alla scadenza`, aria: `mancano ${diff} giorni` }
    }

    /* Filtri -> Ordinati -> Paginati */
    const filtered = computed<Item[]>(() => {
        const tokens = searchNome.value.trim().toLowerCase().split(/\s+/).filter(Boolean)
        const dal = parseISODate(dataDal.value)
        const al = parseISODate(dataAl.value)

        return pratiche.value.filter(i => {
            const nomeOk = tokens.length
                ? tokens.every(t => i.nomeProgetto.toLowerCase().includes(t) || i.ente.toLowerCase().includes(t))
                : true

            const dItem = parseDDMMYYYY(i.dataInizio)
            const dalOk = dal ? (dItem ? dItem >= dal : false) : true
            const alOk = al ? (dItem ? dItem <= al : false) : true

            const statoOk = !statoPratica.value
                ? true
                : (statoPratica.value === 'aperta' ? !i.statoChiuso : i.statoChiuso)

            return nomeOk && dalOk && alOk && statoOk
        })
    })

    const sorted = computed<Item[]>(() => {
        const dir = sortDir.value === 'up' ? 1 : -1
        const key = sortKey.value
        return filtered.value.slice().sort((a, b) => comparePratiche(a, b, key) * dir)
    })

    const pageSize = 10
    const currentPage = ref(1)
    const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)))
    const paginated = computed<Item[]>(() => {
        const start = (currentPage.value - 1) * pageSize
        return sorted.value.slice(start, start + pageSize)
    })
    function setPage(p: number) {
        currentPage.value = Math.min(Math.max(1, p), totalPages.value)
    }

    /* Badge conteggi */
    const shownCount = computed(() => filtered.value.length)
    const totalCount = computed(() => pratiche.value.length)

    /* Navigazione / azioni */
    function creaNuovoProgetto() {
        router.push({ name: 'newProject' })
    }
    function goToSingleProjectDocument() {
        router.push({ name: 'singleProjectDocumentsView' })
    }
    function goToHome() {
        router.push({ name: 'home' })
    }

    /* Delete */
    function onDeleted(id: string | number) {
        const targetId = typeof id === 'string' ? Number(id) : id
        const index = pratiche.value.findIndex(i => i.id === targetId)
        if (index !== -1) {
            pratiche.value.splice(index, 1)
            showSnack('Pratica eliminata', 'success')
            if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
        } else {
            showSnack('Elemento non trovato', 'error')
        }
    }

    /* Toast / Snackbar */
    const snackbar = ref<{ show: boolean; message: string; color: string }>({
        show: false,
        message: '',
        color: 'error'
    })
    const toastRef = ref<HTMLElement | null>(null)

    function showSnack(message: string, color: string = 'error') {
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

    watch(() => snackbar.value.show, async (show) => {
        if (!toastRef.value) return
        if (!window.bootstrap) {
            await import('bootstrap-italia/dist/js/bootstrap-italia.bundle.min.js')
            await nextTick()
        }
        const toast = window.bootstrap.Toast.getOrCreateInstance(toastRef.value, { delay: 3000 })
        show ? toast.show() : toast.hide()
    })

    /* UX: coerenza filtri e pagine */
    watch([dataDal, dataAl], ([dal, al]) => {
        const dDal = parseISODate(dal)
        const dAl = parseISODate(al)
        if (dDal && dAl && dDal > dAl) {
            dataAl.value = dal || null
        }
    })
    watch([searchNome, dataDal, dataAl, statoPratica], () => {
        currentPage.value = 1
    })
    function resetFiltri() {
        searchNome.value = ''
        dataDal.value = null
        dataAl.value = null
        statoPratica.value = null
    }
</script>

<style scoped>
    /* Righe alternate */
    .table tbody tr.bg-light {
        background-color: #f9f9f9 !important;
    }

    .table tbody tr.bg-light2 {
        background-color: #f0f0f0 !important;
    }

    /* Header cliccabili */
    th[role="button"] {
        cursor: pointer;
        user-select: none;
    }

    /* Adegua dimensioni icone nei bottoni actions se necessario */
    .btn .icon {
        vertical-align: middle;
    }

    /* ===== Filtri ===== */
    .filters-wrapper {
        background: #ffffff;
        border: 1px solid #d9dce1;
        border-radius: 8px;
        padding: 1.2rem 1.5rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }

    .reset-btn {
        height: 48px;
        padding: 0 22px;
        border-radius: 6px !important;
        font-weight: 500;
    }

    /* ===== Semaforo ===== */
    .semaphore-dot {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
    }
</style>
