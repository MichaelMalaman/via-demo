
<template>
    <div class="container-fluid px-4">
        <!-- Barra azioni -->
        <div class="row align-items-center mt-4 mb-4">
            <!-- Pulsante sinistro -->
            <div class="col-6 d-flex justify-content-start">
                <button class="btn btn-outline-primary bg-white d-inline-flex align-items-center"
                        @click="goToHome"
                        style="height: 50px;">
                    <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-arrow-left`"></use></svg>
                    <span class="ms-2">Indietro</span>
                </button>
            </div>

            <!-- Pulsante destro -->
            <div class="col-6 d-flex justify-content-end">
                <button v-if="store.state.username === 'pippo'"
                        class="btn btn-outline-primary bg-white d-inline-flex align-items-center"
                        @click="creaNuovaPratica"
                        style="height: 50px;">
                    <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-plus`"></use></svg>
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

        <!-- Tab: Pratiche in corso -->
        <div v-show="tab === 'one'">
            <div class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead class="table-dark">
                        <tr>
                            <th scope="col" role="button" tabindex="0"
                                :aria-sort="sortKeyOne === 'nomeProgetto' ? (sortDirOne === 'up' ? 'ascending' : 'descending') : 'none'"
                                @click="setSortOne('nomeProgetto')"
                                @keyup.enter="setSortOne('nomeProgetto')"
                                @keyup.space.prevent="setSortOne('nomeProgetto')">
                                NOME PROGETTO
                                <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-arrow-${sortDirOne}`"></use></svg>
                            </th>

                            <th scope="col" role="button" tabindex="0"
                                :aria-sort="sortKeyOne === 'dataInizio' ? (sortDirOne === 'up' ? 'ascending' : 'descending') : 'none'"
                                @click="setSortOne('dataInizio')"
                                @keyup.enter="setSortOne('dataInizio')"
                                @keyup.space.prevent="setSortOne('dataInizio')">
                                DATA INIZIO
                                <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-arrow-${sortDirOne}`"></use></svg>
                            </th>

                            <th scope="col" role="button" tabindex="0"
                                :aria-sort="sortKeyOne === 'ente' ? (sortDirOne === 'up' ? 'ascending' : 'descending') : 'none'"
                                @click="setSortOne('ente')"
                                @keyup.enter="setSortOne('ente')"
                                @keyup.space.prevent="setSortOne('ente')">
                                ENTE
                                <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-arrow-${sortDirOne}`"></use></svg>
                            </th>

                            <th scope="col" role="button" tabindex="0"
                                :aria-sort="sortKeyOne === 'scadenza' ? (sortDirOne === 'up' ? 'ascending' : 'descending') : 'none'"
                                @click="setSortOne('scadenza')"
                                @keyup.enter="setSortOne('scadenza')"
                                @keyup.space.prevent="setSortOne('scadenza')">
                                SCADENZA
                                <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-arrow-${sortDirOne}`"></use></svg>
                            </th>

                            <th class="text-end">AZIONI</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in paginatedCurrent" :key="String(item.id)"
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
                            <td class="text-end">
                                <!-- Delete  -->
                                <DeleteItemButton :id="String(item.id)"
                                                  variant="outline-danger"
                                                  size="sm"
                                                  :confirm="true"
                                                  @deleted="onDeleted">
                                    <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-delete`"></use></svg>
                                </DeleteItemButton>


                            </td>
                        </tr>
                        <tr v-if="paginatedCurrent.length === 0">
                            <td colspan="5" class="text-center text-secondary py-4">Nessuna pratica disponibile</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Paginazione -->
            <nav aria-label="Pagine pratiche in corso" class="mt-3">
                <ul class="pagination justify-content-end">
                    <li class="page-item" :class="{ disabled: currentPageOne === 1 }">
                        <button class="page-link" @click="setPage('one', currentPageOne - 1)" aria-label="Precedente">&laquo;</button>
                    </li>
                    <li v-for="p in totalPagesOne"
                        :key="'p1-' + p"
                        class="page-item"
                        :class="{ active: currentPageOne === p }">
                        <button class="page-link" @click="setPage('one', p)">{{ p }}</button>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPageOne === totalPagesOne }">
                        <button class="page-link" @click="setPage('one', currentPageOne + 1)" aria-label="Successivo">&raquo;</button>
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
                            <th scope="col" role="button" tabindex="0"
                                :aria-sort="sortKeyTwo === 'nomeProgetto' ? (sortDirTwo === 'up' ? 'ascending' : 'descending') : 'none'"
                                @click="setSortTwo('nomeProgetto')"
                                @keyup.enter="setSortTwo('nomeProgetto')"
                                @keyup.space.prevent="setSortTwo('nomeProgetto')">
                                NOME PROGETTO
                                <!-- usa sortDirTwo, non sortDirOne -->
                                <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-arrow-${sortDirTwo}`"></use></svg>
                            </th>

                            <th scope="col" role="button" tabindex="0"
                                :aria-sort="sortKeyTwo === 'dataInizio' ? (sortDirTwo === 'up' ? 'ascending' : 'descending') : 'none'"
                                @click="setSortTwo('dataInizio')"
                                @keyup.enter="setSortTwo('dataInizio')"
                                @keyup.space.prevent="setSortTwo('dataInizio')">
                                DATA INIZIO
                                <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-arrow-${sortDirTwo}`"></use></svg>
                            </th>

                            <th scope="col" role="button" tabindex="0"
                                :aria-sort="sortKeyTwo === 'ente' ? (sortDirTwo === 'up' ? 'ascending' : 'descending') : 'none'"
                                @click="setSortTwo('ente')"
                                @keyup.enter="setSortTwo('ente')"
                                @keyup.space.prevent="setSortTwo('ente')">
                                ENTE
                                <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-arrow-${sortDirTwo}`"></use></svg>
                            </th>

                            <th scope="col" role="button" tabindex="0"
                                :aria-sort="sortKeyTwo === 'scadenza' ? (sortDirTwo === 'up' ? 'ascending' : 'descending') : 'none'"
                                @click="setSortTwo('scadenza')"
                                @keyup.enter="setSortTwo('scadenza')"
                                @keyup.space.prevent="setSortTwo('scadenza')">
                                SCADENZA
                                <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-arrow-${sortDirTwo}`"></use></svg>
                            </th>

                            <th class="text-end">AZIONI</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in paginatedTwo" :key="String(item.id)"
                            :class="index % 2 === 0 ? 'bg-light' : 'bg-light2'">
                            <td>{{ item.nomeProgetto }}</td>
                            <td>{{ item.dataInizio }}</td>
                            <td>{{ item.ente }}</td>
                            <td>{{ item.scadenza }}</td>
                            <td class="text-end">
                                <!--  Delete  -->
                                <DeleteItemButton :id="String(item.id)"
                                                  variant="outline-danger"
                                                  size="sm"
                                                  :confirm="true"
                                                  @deleted="onDeleted">
                                    <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-delete`"></use></svg>
                                </DeleteItemButton>

                               

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
                        <button class="page-link" @click="setPage('two', currentPageTwo - 1)" aria-label="Precedente">&laquo;</button>
                    </li>
                    <li v-for="p in totalPagesTwo"
                        :key="'p2-' + p"
                        class="page-item"
                        :class="{ active: currentPageTwo === p }">
                        <button class="page-link" @click="setPage('two', p)">{{ p }}</button>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPageTwo === totalPagesTwo }">
                        <button class="page-link" @click="setPage('two', currentPageTwo + 1)" aria-label="Successivo">&raquo;</button>
                    </li>
                </ul>
            </nav>
        </div>
    </div>

</template>

<script setup lang="ts">
    import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
    import { useStore } from 'vuex'
    import { useRouter } from 'vue-router'
    import DeleteItemButton from '../components/DeleteItemButton.vue'


    import spritesUrl from 'bootstrap-italia/dist/svg/sprites.svg?url'
    const spritesHref = spritesUrl

    const router = useRouter()
    const store = useStore()

    type Item = {
        id: number
        nomeProgetto: string
        dataInizio: string
        ente: string
        scadenza: string
    }

    const tab = ref<'one' | 'two'>('one')

    const items = ref<Item[]>([
        { id: 1, nomeProgetto: 'IMPIANTO FOTOVOLTAICO', dataInizio: '12/03/2022', ente: 'REGIONE LOMBARDIA', scadenza: '12/04/2022' },
        { id: 2, nomeProgetto: 'IMPIANTO EOLICO', dataInizio: '12/03/2022', ente: 'REGIONE LOMBARDIA', scadenza: '12/04/2022' },
        { id: 3, nomeProgetto: 'IMPIANTO BIOESEL', dataInizio: '12/03/2022', ente: 'REGIONE LOMBARDIA', scadenza: '12/04/2022' },
        { id: 4, nomeProgetto: 'NUOVO STADIO', dataInizio: '12/03/2022', ente: 'REGIONE LOMBARDIA', scadenza: '12/04/2022' },
        { id: 5, nomeProgetto: 'PARCO GARIBALDI', dataInizio: '12/03/2022', ente: 'REGIONE LOMBARDIA', scadenza: '12/04/2022' },
        { id: 6, nomeProgetto: 'NUOVO PARCHEGGIO', dataInizio: '12/03/2022', ente: 'REGIONE LOMBARDIA', scadenza: '12/04/2022' },
        { id: 7, nomeProgetto: 'PARCO MONTALE', dataInizio: '12/03/2022', ente: 'REGIONE LOMBARDIA', scadenza: '12/04/2022' },
        { id: 8, nomeProgetto: 'NUOVA ARENA', dataInizio: '12/03/2022', ente: 'REGIONE LOMBARDIA', scadenza: '12/04/2022' },
    ])

    const items2 = ref<Item[]>([
        { id: 101, nomeProgetto: 'IMPIANTO GEOTERMICO', dataInizio: '05/02/2023', ente: 'REGIONE PIEMONTE', scadenza: '15/05/2023' },
        { id: 102, nomeProgetto: 'BONIFICA AREA INDUSTRIALE', dataInizio: '18/07/2022', ente: 'REGIONE VENETO', scadenza: '30/09/2022' },
        { id: 103, nomeProgetto: 'NUOVO PARCO URBANO', dataInizio: '10/01/2024', ente: 'COMUNE DI MILANO', scadenza: '20/03/2024' },
        { id: 104, nomeProgetto: 'IMPIANTO IDROELETTRICO', dataInizio: '22/11/2023', ente: 'REGIONE TRENTINO-ALTO ADIGE', scadenza: '15/02/2024' },
        { id: 105, nomeProgetto: 'RECUPERO DISCARICA', dataInizio: '03/06/2023', ente: 'REGIONE EMILIA-ROMAGNA', scadenza: '10/08/2023' },
        { id: 106, nomeProgetto: 'NUOVA CICLABILE', dataInizio: '12/09/2022', ente: 'COMUNE DI TORINO', scadenza: '25/11/2022' },
        { id: 107, nomeProgetto: 'IMPIANTO BIOMASSA', dataInizio: '08/04/2023', ente: 'REGIONE LOMBARDIA', scadenza: '18/06/2023' },
        { id: 108, nomeProgetto: 'RIQUALIFICAZIONE LAGUNA', dataInizio: '20/08/2023', ente: 'REGIONE VENETO', scadenza: '05/10/2023' },
        { id: 109, nomeProgetto: 'NUOVO CENTRO SPORTIVO', dataInizio: '15/03/2024', ente: 'COMUNE DI FIRENZE', scadenza: '30/05/2024' },
        { id: 110, nomeProgetto: 'IMPIANTO SOLARE TERMICO', dataInizio: '01/07/2023', ente: 'REGIONE SICILIA', scadenza: '15/09/2023' },
    ])

    const currentItems = computed<Item[]>(() => (tab.value === 'one' ? items.value : items2.value))

    // ---- SORT: helper e stato per ciascun tab ----
    type SortKeyPratiche = 'nomeProgetto' | 'dataInizio' | 'ente' | 'scadenza'
    type SortDir = 'up' | 'down'  //

    function parseDDMMYYYY(s: string): Date | null {
        const parts = s.split('/')
        if (parts.length !== 3) return null
        const [dd, mm, yyyy] = parts.map(Number)
        const d = new Date(yyyy, mm - 1, dd)
        return isNaN(d.getTime()) ? null : d
    }
    function safeLower(s: string | null | undefined): string {
        return (s ?? '').toString().trim().toLowerCase()
    }
    function comparePratiche(a: Item, b: Item, key: SortKeyPratiche): number {
        switch (key) {
            case 'nomeProgetto': return safeLower(a.nomeProgetto).localeCompare(safeLower(b.nomeProgetto))
            case 'ente': return safeLower(a.ente).localeCompare(safeLower(b.ente))
            case 'dataInizio': {
                const dA = parseDDMMYYYY(a.dataInizio) ?? new Date(0)
                const dB = parseDDMMYYYY(b.dataInizio) ?? new Date(0)
                return dA.getTime() - dB.getTime()
            }
            case 'scadenza': {
                const dA = parseDDMMYYYY(a.scadenza) ?? new Date(0)
                const dB = parseDDMMYYYY(b.scadenza) ?? new Date(0)
                return dA.getTime() - dB.getTime()
            }
        }
    }

    const sortKeyOne = ref<SortKeyPratiche>('dataInizio')
    const sortDirOne = ref<SortDir>('down')
    function setSortOne(key: SortKeyPratiche) {
        if (sortKeyOne.value === key) {
            sortDirOne.value = sortDirOne.value === 'up' ? 'down' : 'up'
        } else {
            sortKeyOne.value = key
            sortDirOne.value = 'up'
        }
    }

    const sortKeyTwo = ref<SortKeyPratiche>('dataInizio')
    const sortDirTwo = ref<SortDir>('down')
    function setSortTwo(key: SortKeyPratiche) {
        if (sortKeyTwo.value === key) {
            sortDirTwo.value = sortDirTwo.value === 'up' ? 'down' : 'up'
        } else {
            sortKeyTwo.value = key
            sortDirTwo.value = 'up'
        }
    }

    // ---- Ordinati per tab (prima della paginazione) ----
    const sortedOne = computed<Item[]>(() => {
        const dir = sortDirOne.value === 'up' ? 1 : -1
        const key = sortKeyOne.value
        return items.value.slice().sort((a, b) => comparePratiche(a, b, key) * dir)
    })
    const sortedTwo = computed<Item[]>(() => {
        const dir = sortDirTwo.value === 'up' ? 1 : -1
        const key = sortKeyTwo.value
        return items2.value.slice().sort((a, b) => comparePratiche(a, b, key) * dir)
    })

    // ---- Paginazione ----
    const pageSize = 10
    const currentPageOne = ref(1)
    const currentPageTwo = ref(1)

    const totalPagesOne = computed(() => Math.max(1, Math.ceil(items.value.length / pageSize)))
    const totalPagesTwo = computed(() => Math.max(1, Math.ceil(items2.value.length / pageSize)))

    // Paginazione su array ordinati
    const paginatedCurrent = computed(() => {
        const page = currentPageOne.value
        const start = (page - 1) * pageSize
        return sortedOne.value.slice(start, start + pageSize)
    })
    const paginatedTwo = computed(() => {
        const page = currentPageTwo.value
        const start = (page - 1) * pageSize
        return sortedTwo.value.slice(start, start + pageSize)
    })

    function setPage(which: 'one' | 'two', p: number) {
        if (which === 'one') {
            currentPageOne.value = Math.min(Math.max(1, p), totalPagesOne.value)
        } else {
            currentPageTwo.value = Math.min(Math.max(1, p), totalPagesTwo.value)
        }
    }



    // Navigazione
    function creaNuovaPratica() {
        router.push({ name: 'formPratica' })
    }
    function goToSingleProjectDocument(item?: Item) {
        router.push({ name: 'singleProjectDocumentsView' })
    }
    function goToHome() {
        router.push({ name: 'home' })
    }

    // DELETE
    function onDeleted(id: string | number) {
        const targetId = typeof id === 'string' ? Number(id) : id
        const list = tab.value === 'one' ? items.value : items2.value
        const index = list.findIndex(i => i.id === targetId)
        if (index !== -1) {
            list.splice(index, 1)
            showSnack('Pratica eliminata')
            // aggiorna paginazione se necessario
            if (tab.value === 'one' && currentPageOne.value > totalPagesOne.value) {
                currentPageOne.value = totalPagesOne.value
            }
            if (tab.value === 'two' && currentPageTwo.value > totalPagesTwo.value) {
                currentPageTwo.value = totalPagesTwo.value
            }
        } else {
            showSnack('Elemento non trovato', 'error')
        }
    }



    function showSnack(message: string, color: string = 'error') {
        snackbar.value = { show: true, message, color }
    }

    // Toast ref + sync con stato snackbar
    const snackbar = ref<{ show: boolean; message: string; color: string }>({
        show: false,
        message: '',
        color: 'error'
    })
    const toastRef = ref<HTMLElement | null>(null)

    watch(() => snackbar.value.show, (show) => {
        if (!toastRef.value || !window.bootstrap) return
        const toast = window.bootstrap.Toast.getOrCreateInstance(toastRef.value, { delay: 3000 })
        if (show) toast.show()
        else toast.hide()
    })

    // Mappa colore snackbar → classi toast
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
</style>
