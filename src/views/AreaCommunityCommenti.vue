
<template>
    <div class="container-fluid px-4">
        <!-- Barra azioni -->
        <div class="row align-items-center mt-4 mb-4">
            <!-- Pulsante sinistro -->
            <div class="col-6 d-flex justify-content-start">

            </div>

            <!-- Pulsante destro -->
            <div class="col-6 d-flex justify-content-end">
                <button v-if="store.state.username === 'pippo'"
                        class="btn btn-outline-primary bg-white d-inline-flex align-items-center"
                        @click="creaNuovaPratica"
                        style="height: 50px;">
                    <svg class="icon"><use :href="`${spritesHref}#it-arrow-left`"></use></svg>
                    <span class="ms-2">Crea nuova pratica</span>
                </button>
            </div>
        </div>

        <!-- Tabs -->
        <ul class="nav nav-tabs mb-4" role="tablist">
            <li class="nav-item">
                <button type="button"
                        class="nav-link"
                        :class="{ active: tab === 'one' }"
                        role="tab"
                        @click="tab = 'one'">
                    Pratiche in corso
                </button>
            </li>
            <li class="nav-item">
                <button type="button"
                        class="nav-link"
                        :class="{ active: tab === 'two' }"
                        role="tab"
                        @click="tab = 'two'">
                    Pratiche chiuse
                </button>
            </li>
        </ul>


        <div class="accordion accordion-background-active" id="accordionFiltri2">
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingFiltri2">
                    <button class="accordion-button"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseFiltri2"
                            aria-expanded="true"
                            aria-controls="collapseFiltri2">
                        Filtri
                    </button>
                </h2>

                <div id="collapseFiltri2"
                     class="accordion-collapse collapse show"
                     role="region"
                     aria-labelledby="headingFiltri2"
                     data-bs-parent="#accordionFiltri2">

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



        <!-- Tab: Pratiche in corso -->
        <div v-show="tab === 'one'">
            <div class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead class="table-dark">
                        <tr>
                            <th scope="col"
                                role="button"
                                tabindex="0"
                                :aria-sort="sortKeyOne === 'nomeProgetto' ? (sortDirOne === 'up' ? 'ascending' : 'descending') : 'none'"
                                @click="sortKeyOne('nomeProgetto')"
                                @keyup.enter="setSortOne('nomeProgetto')"
                                @keyup.space.prevent="sortKeyOne('nomeProgetto')">
                                NOME PROGETTO
                                <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-arrow-${sortDirTwo}`"></use></svg>
                            </th>

                            <th scope="col"
                                role="button"
                                tabindex="0"
                                :aria-sort="sortKeyOne === 'dataInizio' ? (sortDirOne === 'up' ? 'ascending' : 'descending') : 'none'"
                                @click="setSortOne('dataInizio')"
                                @keyup.enter="setSortOne('dataInizio')"
                                @keyup.space.prevent="setSortOne('dataInizio')">
                                DATA INIZIO
                                <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-arrow-${sortDirTwo}`"></use></svg>
                            </th>

                            <th scope="col"
                                role="button"
                                tabindex="0"
                                :aria-sort="sortKeyOne === 'ente' ? (sortDirOne === 'up' ? 'ascending' : 'descending') : 'none'"
                                @click="setSortOne('ente')"
                                @keyup.enter="setSortOne('ente')"
                                @keyup.space.prevent="setSortOne('ente')">
                                ENTE
                                <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-arrow-${sortDirTwo}`"></use></svg>
                            </th>

                            <th >ULTIMO COMMENTO</th>

                            <th >AZIONI</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="(item, index) in paginatedOne"
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

                            <td>{{ item.AutoreCommento }}:{{ item.ultimoCommento }}</td>
                            <td>
                                <a href="#" data-bs-toggle="tooltip" title="Vedi documento"><svg class="icon" style="color:white"><use :href="`${spritesHref}#it-password-visible`"></use></svg></a>
                                <a href="#" data-bs-toggle="tooltip" title="scrivi commento"><svg class="icon" style="color:white"><use :href="`${spritesHref}#it-pencil`"></use></svg></a>
                            </td>

                        </tr>

                        <tr v-if="paginatedOne.length === 0">
                            <td colspan="5" class="text-center text-secondary py-4">Nessuna pratica disponibile</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Paginazione -->
            <nav aria-label="Pagine pratiche in corso" class="mt-3">
                <ul class="pagination justify-content-end">
                    <li class="page-item" :class="{ disabled: currentPageOne === 1 }">
                        <button class="page-link" @click="setPage('one', currentPageOne - 1)" aria-label="Precedente">
                            &laquo;
                        </button>
                    </li>
                    <li v-for="p in totalPagesOne"
                        :key="'p1-' + p"
                        class="page-item"
                        :class="{ active: currentPageOne === p }">
                        <button class="page-link" @click="setPage('one', p)">{{ p }}</button>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPageOne === totalPagesOne }">
                        <button class="page-link" @click="setPage('one', currentPageOne + 1)" aria-label="Successivo">
                            &raquo;
                        </button>
                    </li>
                </ul>
            </nav>
        </div>

        <!-- Tab: Pratiche chiuse -->
        <div v-show="tab === 'two'">
            <div class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead class="table-dark">
                        <tr>
                            <th scope="col"
                                role="button"
                                tabindex="0"
                                :aria-sort="sortKeyTwo === 'nomeProgetto' ? (sortDirTwo === 'up' ? 'ascending' : 'descending') : 'none'"
                                @click="setSortTwo('nomeProgetto')"
                                @keyup.enter="setSortTwo('nomeProgetto')"
                                @keyup.space.prevent="setSortTwo('nomeProgetto')">
                                NOME PROGETTO
                                <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-arrow-${sortDirTwo}`"></use></svg>
                            </th>

                            <th scope="col"
                                role="button"
                                tabindex="0"
                                :aria-sort="sortKeyTwo === 'dataInizio' ? (sortDirTwo === 'up' ? 'ascending' : 'descending') : 'none'"
                                @click="setSortTwo('dataInizio')"
                                @keyup.enter="setSortTwo('dataInizio')"
                                @keyup.space.prevent="setSortTwo('dataInizio')">
                                DATA INIZIO
                                <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-arrow-${sortDirTwo}`"></use></svg>
                            </th>

                            <th scope="col"
                                role="button"
                                tabindex="0"
                                :aria-sort="sortKeyTwo === 'ente' ? (sortDirTwo === 'up' ? 'ascending' : 'descending') : 'none'"
                                @click="setSortTwo('ente')"
                                @keyup.enter="setSortTwo('ente')"
                                @keyup.space.prevent="setSortTwo('ente')">
                                ENTE
                                <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-arrow-${sortDirTwo}`"></use></svg>
                            </th>

                            <th>ULTIMO COMMENTO</th>

                            <th>AZIONI</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="(item, index) in paginatedTwo"
                            :key="String(item.id)"
                            :class="index % 2 === 0 ? 'bg-light' : 'bg-light2'">
                            <td>{{ item.nomeProgetto }}</td>
                            <td>{{ item.dataInizio }}</td>
                            <td>{{ item.ente }}</td>
                            <td>{{ item.AutoreCommento }}:{{ item.ultimoCommento }}</td>
                            <td>
                                <a href="#" data-bs-toggle="tooltip" title="Vedi documento"><svg class="icon" style="color:white"><use :href="`${spritesHref}#it-password-visible`"></use></svg></a>
                                <a href="#" data-bs-toggle="tooltip" title="scrivi commento"><svg class="icon" style="color:white"><use :href="`${spritesHref}#it-pencil`"></use></svg></a>
                            </td>
                        </tr>

                        <tr v-if="paginatedTwo.length === 0">
                            <td colspan="5" class="text-center text-secondary py-4">Nessuna pratica disponibile</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Paginazione -->
            <nav aria-label="Pagine pratiche chiuse" class="mt-3">
                <ul class="pagination justify-content-end">
                    <li class="page-item" :class="{ disabled: currentPageTwo === 1 }">
                        <button class="page-link" @click="setPage('two', currentPageTwo - 1)" aria-label="Precedente">
                            &laquo;
                        </button>
                    </li>
                    <li v-for="p in totalPagesTwo"
                        :key="'p2-' + p"
                        class="page-item"
                        :class="{ active: currentPageTwo === p }">
                        <button class="page-link" @click="setPage('two', p)">{{ p }}</button>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPageTwo === totalPagesTwo }">
                        <button class="page-link" @click="setPage('two', currentPageTwo + 1)" aria-label="Successivo">
                            &raquo;
                        </button>
                    </li>
                </ul>
            </nav>
        </div>

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
    import { ref, computed, watch, nextTick, onMounted } from 'vue'
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

    type Item = {
        id: number
        nomeProgetto: string
        dataInizio: string   // 'DD/MM/YYYY'
        ente: string
        scadenza: string     // 'DD/MM/YYYY'
        statoChiuso: boolean,
        ultimoCommento: string,
        AutoreCommento:string

    }

    const tab = ref<'one' | 'two'>('one')

    const items = ref<Item[]>([
        { id: 1, nomeProgetto: 'IMPIANTO FOTOVOLTAICO', dataInizio: '12/03/2022', ente: 'REGIONE LOMBARDIA', scadenza: '12/04/2022', statoChiuso: false, ultimoCommento: 'Vogliamo la rivalutazione del parco nord vicino', AutoreCommento: 'Giovanni Rana'},
        { id: 2, nomeProgetto: 'IMPIANTO EOLICO', dataInizio: '12/03/2022', ente: 'REGIONE LOMBARDIA', scadenza: '12/04/2022', statoChiuso: false, ultimoCommento: 'REGIONE LOMBARDIA', AutoreCommento: 'Giovanni Rana' },
        { id: 3, nomeProgetto: 'IMPIANTO BIOESEL', dataInizio: '12/03/2022', ente: 'REGIONE LOMBARDIA', scadenza: '12/04/2022', statoChiuso: false, ultimoCommento: 'REGIONE LOMBARDIA', AutoreCommento: 'Giovanni Rana' },
        { id: 4, nomeProgetto: 'NUOVO STADIO', dataInizio: '12/03/2022', ente: 'REGIONE LOMBARDIA', scadenza: '12/04/2022', statoChiuso: false, ultimoCommento: 'REGIONE LOMBARDIA', AutoreCommento: 'Giovanni Rana' },
        { id: 5, nomeProgetto: 'PARCO GARIBALDI', dataInizio: '12/03/2022', ente: 'REGIONE LOMBARDIA', scadenza: '12/04/2022', statoChiuso: false, ultimoCommento: 'REGIONE LOMBARDIA', AutoreCommento: 'Giovanni Rana' },
        { id: 6, nomeProgetto: 'NUOVO PARCHEGGIO', dataInizio: '12/03/2022', ente: 'REGIONE LOMBARDIA', scadenza: '12/04/2022', statoChiuso: false, ultimoCommento: 'REGIONE LOMBARDIA', AutoreCommento: 'Giovanni Rana' },
        { id: 7, nomeProgetto: 'PARCO MONTALE', dataInizio: '12/03/2022', ente: 'REGIONE LOMBARDIA', scadenza: '12/04/2022', statoChiuso: false, ultimoCommento: 'REGIONE LOMBARDIA', AutoreCommento: 'Giovanni Rana' },
        { id: 8, nomeProgetto: 'NUOVA ARENA', dataInizio: '12/03/2022', ente: 'REGIONE LOMBARDIA', scadenza: '12/04/2022', statoChiuso: false, ultimoCommento: 'REGIONE LOMBARDIA', AutoreCommento: 'Giovanni Rana' },
    ])

    const items2 = ref<Item[]>([
        { id: 101, nomeProgetto: 'IMPIANTO GEOTERMICO', dataInizio: '05/02/2023', ente: 'REGIONE PIEMONTE', scadenza: '15/05/2023', statoChiuso: true, ultimoCommento: 'REGIONE LOMBARDIA', AutoreCommento: 'Giovanni Rana' },
        { id: 102, nomeProgetto: 'BONIFICA AREA INDUSTRIALE', dataInizio: '18/07/2022', ente: 'REGIONE VENETO', scadenza: '30/09/2022', statoChiuso: true, ultimoCommento: 'REGIONE LOMBARDIA', AutoreCommento: 'Giovanni Rana' },
        { id: 103, nomeProgetto: 'NUOVO PARCO URBANO', dataInizio: '10/01/2024', ente: 'COMUNE DI MILANO', scadenza: '20/03/2024', statoChiuso: true, ultimoCommento: 'REGIONE LOMBARDIA', AutoreCommento: 'Giovanni Rana' },
        { id: 104, nomeProgetto: 'IMPIANTO IDROELETTRICO', dataInizio: '22/11/2023', ente: 'REGIONE TRENTINO-ALTO ADIGE', scadenza: '15/02/2024', statoChiuso: true, ultimoCommento: 'REGIONE LOMBARDIA', AutoreCommento: 'Giovanni Rana' },
        { id: 105, nomeProgetto: 'RECUPERO DISCARICA', dataInizio: '03/06/2023', ente: 'REGIONE EMILIA-ROMAGNA', scadenza: '10/08/2023', statoChiuso: true, ultimoCommento: 'REGIONE LOMBARDIA', AutoreCommento: 'Giovanni Rana' },
        { id: 106, nomeProgetto: 'NUOVA CICLABILE', dataInizio: '12/09/2022', ente: 'COMUNE DI TORINO', scadenza: '25/11/2022', statoChiuso: true, ultimoCommento: 'REGIONE LOMBARDIA', AutoreCommento: 'Giovanni Rana' },
        { id: 107, nomeProgetto: 'IMPIANTO BIOMASSA', dataInizio: '08/04/2023', ente: 'REGIONE LOMBARDIA', scadenza: '18/06/2023', statoChiuso: true, ultimoCommento: 'REGIONE LOMBARDIA', AutoreCommento: 'Giovanni Rana' },
        { id: 108, nomeProgetto: 'RIQUALIFICAZIONE LAGUNA', dataInizio: '20/08/2023', ente: 'REGIONE VENETO', scadenza: '05/10/2023', statoChiuso: true, ultimoCommento: 'REGIONE LOMBARDIA', AutoreCommento: 'Giovanni Rana' },
        { id: 109, nomeProgetto: 'NUOVO CENTRO SPORTIVO', dataInizio: '15/03/2024', ente: 'COMUNE DI FIRENZE', scadenza: '30/05/2024', statoChiuso: true, ultimoCommento: 'REGIONE LOMBARDIA', AutoreCommento: 'Giovanni Rana' },
        { id: 110, nomeProgetto: 'IMPIANTO SOLARE TERMICO', dataInizio: '01/07/2023', ente: 'REGIONE SICILIA', scadenza: '15/09/2023', statoChiuso: true, ultimoCommento: 'REGIONE LOMBARDIA', AutoreCommento: 'Giovanni Rana' },
    ])

    /* ======================
     * Filtri
     * ====================== */
    const searchNome = ref<string>('')                                // testo libero (nomeProgetto / ente)
    const dataDal = ref<string | null>(null)                          // 'YYYY-MM-DD'
    const dataAl = ref<string | null>(null)                           // 'YYYY-MM-DD'
    const statoPratica = ref<'aperta' | 'chiusa' | null>(null)
    const statusOptions = ['aperta', 'chiusa'] as const

    /* ======================
     * Ordinamento (per tab)
     * ====================== */
    type SortKeyPratiche = 'nomeProgetto' | 'dataInizio' | 'ente' | 'scadenza'
    type SortDir = 'up' | 'down'

    const sortKeyOne = ref<SortKeyPratiche>('dataInizio')
    const sortDirOne = ref<SortDir>('down')
    function setSortOne(key: SortKeyPratiche) {
        if (sortKeyOne.value === key) sortDirOne.value = sortDirOne.value === 'up' ? 'down' : 'up'
        else { sortKeyOne.value = key; sortDirOne.value = 'up' }
    }

    const sortKeyTwo = ref<SortKeyPratiche>('dataInizio')
    const sortDirTwo = ref<SortDir>('down')
    function setSortTwo(key: SortKeyPratiche) {
        if (sortKeyTwo.value === key) sortDirTwo.value = sortDirTwo.value === 'up' ? 'down' : 'up'
        else { sortKeyTwo.value = key; sortDirTwo.value = 'up' }
    }

    /* ======================
     * Utilità
     * ====================== */
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

    /* ======================
     * Filtrati per tab
     * ====================== */
    // Tab 1: aperte
    const filteredOne = computed<Item[]>(() => {
        const tokens = searchNome.value.trim().toLowerCase().split(/\s+/).filter(Boolean)
        const dal = parseISODate(dataDal.value)
        const al = parseISODate(dataAl.value)

        return items.value
            .filter(i => !i.statoChiuso)
            .filter(i => {
                const nomeOk = tokens.length
                    ? tokens.every(t => i.nomeProgetto.toLowerCase().includes(t) || i.ente.toLowerCase().includes(t))
                    : true

                const dItem = parseDDMMYYYY(i.dataInizio)
                const dalOk = dal ? (dItem ? dItem >= dal : false) : true
                const alOk = al ? (dItem ? dItem <= al : false) : true

                const statoOk = !statoPratica.value ? true : (statoPratica.value === 'aperta')

                return nomeOk && dalOk && alOk && statoOk
            })
    })

    // Tab 2: chiuse
    const filteredTwo = computed<Item[]>(() => {
        const tokens = searchNome.value.trim().toLowerCase().split(/\s+/).filter(Boolean)
        const dal = parseISODate(dataDal.value)
        const al = parseISODate(dataAl.value)

        return items2.value
            .filter(i => i.statoChiuso)
            .filter(i => {
                const nomeOk = tokens.length
                    ? tokens.every(t => i.nomeProgetto.toLowerCase().includes(t) || i.ente.toLowerCase().includes(t))
                    : true

                const dItem = parseDDMMYYYY(i.dataInizio)
                const dalOk = dal ? (dItem ? dItem >= dal : false) : true
                const alOk = al ? (dItem ? dItem <= al : false) : true

                const statoOk = !statoPratica.value ? true : (statoPratica.value === 'chiusa')

                return nomeOk && dalOk && alOk && statoOk
            })
    })

    /* ======================
     * Ordinati + paginazione (post-filtri)
     * ====================== */
    const pageSize = 10
    const currentPageOne = ref(1)
    const currentPageTwo = ref(1)

    const sortedOne = computed<Item[]>(() => {
        const dir = sortDirOne.value === 'up' ? 1 : -1
        const key = sortKeyOne.value
        return filteredOne.value.slice().sort((a, b) => comparePratiche(a, b, key) * dir)
    })
    const sortedTwo = computed<Item[]>(() => {
        const dir = sortDirTwo.value === 'up' ? 1 : -1
        const key = sortKeyTwo.value
        return filteredTwo.value.slice().sort((a, b) => comparePratiche(a, b, key) * dir)
    })

    const totalPagesOne = computed(() => Math.max(1, Math.ceil(filteredOne.value.length / pageSize)))
    const totalPagesTwo = computed(() => Math.max(1, Math.ceil(filteredTwo.value.length / pageSize)))

    const paginatedOne = computed<Item[]>(() => {
        const start = (currentPageOne.value - 1) * pageSize
        return sortedOne.value.slice(start, start + pageSize)
    })
    const paginatedTwo = computed<Item[]>(() => {
        const start = (currentPageTwo.value - 1) * pageSize
        return sortedTwo.value.slice(start, start + pageSize)
    })

    function setPage(which: 'one' | 'two', p: number) {
        if (which === 'one') {
            currentPageOne.value = Math.min(Math.max(1, p), totalPagesOne.value)
        } else {
            currentPageTwo.value = Math.min(Math.max(1, p), totalPagesTwo.value)
        }
    }

    /* ======================
     * Badge conteggi
     * ====================== */
    const shownCount = computed(() => (tab.value === 'one' ? filteredOne.value.length : filteredTwo.value.length))
    const totalCount = computed(() =>
        tab.value === 'one'
            ? items.value.filter(i => !i.statoChiuso).length
            : items2.value.filter(i => i.statoChiuso).length
    )

    /* ======================
     * Navigazione
     * ====================== */
    function creaNuovaPratica() {
        router.push({ name: 'formPratica' })
    }

    function goToSingleProjectDocument() {
        router.push({ name: 'singleProjectDocumentsView' })
    }

    /*function============
 * Delete
        * ====================== */

    function onDeleted(id: string | number) {
        const targetId = typeof id === 'string' ? Number(id) : id
        const list = tab.value === 'one' ? items.value : items2.value
        const index = list.findIndex(i => i.id === targetId)
        if (index !== -1) {
            list.splice(index, 1)
            showSnack('Pratica eliminata', 'success')
            if (currentPageOne.value > totalPagesOne.value) currentPageOne.value = totalPagesOne.value
            if (currentPageTwo.value > totalPagesTwo.value) currentPageTwo.value = totalPagesTwo.value
        } else {
            showSnack('Elemento non trovato', 'error')
        }
    }

    /* ======================
     * Toast / Snackbar
     * ====================== */
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
            // Carica dinamicamente se non presente
            await import('bootstrap-italia/dist/js/bootstrap-italia.bundle.min.js')
            await nextTick()
        }
        const toast = window.bootstrap.Toast.getOrCreateInstance(toastRef.value, { delay: 3000 })
        show ? toast.show() : toast.hide()
    })

    /* ======================
     * UX: coerenza filtri e pagine
     * ====================== */
    // Mantieni dal <= al
    watch([dataDal, dataAl], ([dal, al]) => {
        const dDal = parseISODate(dal)
        const dAl = parseISODate(al)
        if (dDal && dAl && dDal > dAl) {
            dataAl.value = dal || null
        }
    })

    // Quando cambiano filtri/tab, vai a pagina 1 del tab corrente
    watch([searchNome, dataDal, dataAl, statoPratica, tab], () => {
        if (tab.value === 'one') currentPageOne.value = 1
        else currentPageTwo.value = 1
    })
</script>

<style scoped>
    /* Righe alternate come nell'altra pagina */
    .table tbody tr.bg-light {
        background-color: #f9f9f9 !important;
    }

    .table tbody tr.bg-light2 {
        background-color: #a5a5a5 !important; /* Se troppo scura, usa #f0f0f0 */
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

    .filters-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr); /* 2 filtri + colonna reset */
        grid-template-rows: auto auto; /* 2 righe */
        gap: 1rem;
        align-items: center;
    }

    .reset-col {
        grid-column: 3;
        grid-row: 1 / span 2;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    .reset-btn {
        height: 48px;
        padding: 0 22px;
        border-radius: 6px !important;
        font-weight: 500;
    }

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


    .btn-back {
        color: #000; /* colore normale del testo */
        background-color: #f2f2f2; /* sfondo normale */
        border: 1px solid #6c757d;
        transition: background 0.2s, color 0.2s;
    }

        .btn-back:hover,
        .btn-back:focus {
            background-color: #004080 !important; /* blu accessibile ad alto contrasto */
            color: #ffffff; /* testo bianco leggibile */
            outline: 2px solid #002a5e; /* focus ring visibile */
        }
</style>
