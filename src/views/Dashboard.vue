<!-- src/components/PraticheView.vue -->
<template>
    <div class="container d-flex flex-column align-items-center px-5 min-vh-100">
        <!-- Barra azioni -->
        <div class="row g-0 w-100 align-items-center justify-content-between mt-4 mb-4">
            <!-- Pulsante sinistro -->
            <div class="col-auto p-0">
                <button class="btn btn-light text-primary d-inline-flex align-items-center" @click="goToHome">
                    <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-arrow-left`"></use></svg>

                    Indietro
                </button>
            </div>

            <!-- Pulsante destro -->
            <div class="col-auto p-0">
                <button v-if="store.state.username === 'pippo'"
                        class="btn btn-light text-primary d-inline-flex align-items-center"
                        @click="creaNuovaPratica">
                    <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-plus`"></use></svg>

                    Crea nuova pratica
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

        <!-- Contenitore tabella -->
        <div class="card w-100 p-4" style="min-height: 600px;">
            <!-- Tab: Pratiche in corso -->
            <div v-show="tab === 'one'">
                <div class="table-responsive">
                    <table class="table table-hover table-striped align-middle">
                        <thead>
                            <tr>
                                <th>NOME PROGETTO</th>
                                <th>DATA INIZIO</th>
                                <th>ENTE</th>
                                <th>SCADENZA</th>
                                <th class="text-end">AZIONI</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in paginatedCurrent" :key="item.id">
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
                                    <button type="button"
                                            class="btn btn-outline-danger btn-sm me-2"
                                            @click="openDeleteDialog(item)"
                                            aria-label="Elimina"
                                            title="Elimina">
                                        <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-delete`"></use></svg>

                                    </button>
                                    <button type="button"
                                            class="btn btn-outline-primary btn-sm"
                                            @click="openEditDialog(item)"
                                            aria-label="Modifica"
                                            title="Modifica">
                                        <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-pencil`"></use></svg>

                                    </button>
                                </td>
                            </tr>
                            <tr v-if="paginatedCurrent.length === 0">
                                <td colspan="5" class="text-center text-muted py-4">Nessuna pratica disponibile</td>
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
                    <table class="table table-hover table-striped align-middle">
                        <thead>
                            <tr>
                                <th>NOME PROGETTO</th>
                                <th>DATA INIZIO</th>
                                <th>ENTE</th>
                                <th>SCADENZA</th>
                                <th class="text-end">AZIONI</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in paginatedTwo" :key="item.id">
                                <td>{{ item.nomeProgetto }}</td>
                                <td>{{ item.dataInizio }}</td>
                                <td>{{ item.ente }}</td>
                                <td>{{ item.scadenza }}</td>
                                <td class="text-end">
                                    <button type="button"
                                            class="btn btn-outline-danger btn-sm me-2"
                                            @click="openDeleteDialog(item)"
                                            aria-label="Elimina"
                                            title="Elimina">
                                        <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-delete`"></use></svg>

                                    </button>
                                    <button type="button"
                                            class="btn btn-outline-primary btn-sm"
                                            @click="openEditDialog(item)"
                                            aria-label="Modifica"
                                            title="Modifica">
                                        <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-edit`"></use></svg>

                                    </button>
                                </td>
                            </tr>
                            <tr v-if="paginatedTwo.length === 0">
                                <td colspan="5" class="text-center text-muted py-4">Nessuna pratica disponibile</td>
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

        <!-- Modal elimina -->
        <div class="modal fade" tabindex="-1" ref="deleteModalRef" aria-labelledby="deleteModalTitle" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 id="deleteModalTitle" class="modal-title">Confermi l'eliminazione?</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Chiudi"></button>
                    </div>
                    <div class="modal-body">
                        Stai per eliminare: <strong>{{ selectedItem?.nomeProgetto }}</strong>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-link" @click="closeDeleteDialog">Annulla</button>
                        <button type="button" class="btn btn-danger" @click="confirmDelete">Elimina</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal modifica -->
        <div class="modal fade" tabindex="-1" ref="editModalRef" aria-labelledby="editModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 id="editModalTitle" class="modal-title">Modifica pratica</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Chiudi"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="confirmEdit">
                            <div class="row g-3">
                                <div class="col-12 col-md-6">
                                    <label for="nomeProgetto" class="form-label">Nome progetto</label>
                                    <input id="nomeProgetto" v-model="editItemData.nomeProgetto" type="text" class="form-control" />
                                </div>
                                <div class="col-12 col-md-6">
                                    <label for="dataInizio" class="form-label">Data inizio</label>
                                    <input id="dataInizio" v-model="editItemData.dataInizio" type="text" class="form-control" />
                                </div>
                                <div class="col-12 col-md-6">
                                    <label for="ente" class="form-label">Ente</label>
                                    <input id="ente" v-model="editItemData.ente" type="text" class="form-control" />
                                </div>
                                <div class="col-12 col-md-6">
                                    <label for="scadenza" class="form-label">Scadenza</label>
                                    <input id="scadenza" v-model="editItemData.scadenza" type="text" class="form-control" />
                                </div>
                            </div>
                            <div class="d-flex justify-content-end mt-4">
                                <button type="button" class="btn btn-link me-2" @click="closeEditDialog">Annulla</button>
                                <button type="submit" class="btn btn-primary">Salva</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Toast (replacement del v-snackbar) -->
        <div class="toast position-fixed top-0 end-0 m-3"
             role="alert"
             aria-live="assertive"
             aria-atomic="true"
             ref="toastRef">
            <div class="toast-header" :class="toastHeaderClass">
                <strong class="me-auto">Notifica</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Chiudi" @click="snackbar.show = false"></button>
            </div>
            <div class="toast-body" :class="toastBodyClass">
                {{ snackbar.message }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
    import { useStore } from 'vuex'
    import { useRouter } from 'vue-router'
    import spritesUrl from 'bootstrap-italia/dist/svg/sprites.svg?url'
    const spritesHref = spritesUrl
    // Bootstrap (JS bundle disponibile grazie all'import nel main.ts)
    declare global { interface Window { bootstrap: any } }

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

    // Paginazione
    const pageSize = 10
    const currentPageOne = ref(1)
    const currentPageTwo = ref(1)

    const totalPagesOne = computed(() => Math.max(1, Math.ceil(items.value.length / pageSize)))
    const totalPagesTwo = computed(() => Math.max(1, Math.ceil(items2.value.length / pageSize)))

    const paginatedCurrent = computed(() => {
        const page = currentPageOne.value
        const start = (page - 1) * pageSize
        return items.value.slice(start, start + pageSize)
    })

    const paginatedTwo = computed(() => {
        const page = currentPageTwo.value
        const start = (page - 1) * pageSize
        return items2.value.slice(start, start + pageSize)
    })

    function setPage(which: 'one' | 'two', p: number) {
        if (which === 'one') {
            currentPageOne.value = Math.min(Math.max(1, p), totalPagesOne.value)
        } else {
            currentPageTwo.value = Math.min(Math.max(1, p), totalPagesTwo.value)
        }
    }

    // Dialog & selezioni
    const deleteModalRef = ref<HTMLElement | null>(null)
    const editModalRef = ref<HTMLElement | null>(null)
    let deleteModal: any = null
    let editModal: any = null

    const deleteDialog = ref(false) // per compat logica
    const editDialog = ref(false)

    const selectedItem = ref<Item | null>(null)
    const editItemData = ref<Item>({
        id: 0, nomeProgetto: '', dataInizio: '', ente: '', scadenza: '',
    })

    // Toast (snackbar)
    const toastRef = ref<HTMLElement | null>(null)
    const snackbar = ref<{ show: boolean; message: string; color: string }>({
        show: false,
        message: '',
        color: 'success',
    })

    function showSnack(message: string, color: string = 'success') {
        snackbar.value = { show: true, message, color }
    }

    // Map colori → classi toast
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

    // Gestione Toast (apri/chiudi quando cambia stato)
    watch(() => snackbar.value.show, (show) => {
        if (!toastRef.value || !window.bootstrap) return
        const toast = window.bootstrap.Toast.getOrCreateInstance(toastRef.value, { delay: 2500 })
        show ? toast.show() : toast.hide()
    })

    // Navigazione
    function creaNuovaPratica() {
        router.push({ name: 'formPratica' })
    }
    function goToSingleProjectDocument(item?: Item) {
        router.push({ name: 'singleProjectDocumentsView' })
    }
    function goToHome() {
        router.push({ name: 'Home' })
    }

    // Delete
    function openDeleteDialog(item: Item) {
        selectedItem.value = { ...item }
        deleteDialog.value = true
        if (deleteModal) deleteModal.show()
    }
    function closeDeleteDialog() {
        deleteDialog.value = false
        if (deleteModal) deleteModal.hide()
        selectedItem.value = null
    }
    function confirmDelete() {
        if (!selectedItem.value) return
        const list = tab.value === 'one' ? items.value : items2.value
        const index = list.findIndex(i => i.id === selectedItem.value!.id)
        if (index !== -1) {
            list.splice(index, 1)
            showSnack('Pratica eliminata')
            // aggiorna pagine se necessario
            if (tab.value === 'one' && currentPageOne.value > totalPagesOne.value) currentPageOne.value = totalPagesOne.value
            if (tab.value === 'two' && currentPageTwo.value > totalPagesTwo.value) currentPageTwo.value = totalPagesTwo.value
        } else {
            showSnack('Elemento non trovato', 'error')
        }
        closeDeleteDialog()
    }

    // Edit
    function openEditDialog(item: Item) {
        selectedItem.value = { ...item }
        editItemData.value = { ...item }
        editDialog.value = true
        if (editModal) editModal.show()
    }
    function closeEditDialog() {
        editDialog.value = false
        if (editModal) editModal.hide()
        selectedItem.value = null
    }
    function confirmEdit() {
        const list = tab.value === 'one' ? items.value : items2.value
        const index = list.findIndex(i => i.id === editItemData.value.id)
        if (index !== -1) {
            list[index] = { ...editItemData.value }
            showSnack('Pratica aggiornata')
        } else {
            showSnack('Elemento non trovato', 'error')
        }
        closeEditDialog()
    }

    onMounted(() => {
        // Inizializza modali
        if (deleteModalRef.value && window.bootstrap) {
            deleteModal = window.bootstrap.Modal.getOrCreateInstance(deleteModalRef.value, { backdrop: 'static' })
        }
        if (editModalRef.value && window.bootstrap) {
            editModal = window.bootstrap.Modal.getOrCreateInstance(editModalRef.value, { backdrop: 'static' })
        }
    })

    onBeforeUnmount(() => {
        deleteModal?.dispose?.()
        editModal?.dispose?.()
        deleteModal = null
        editModal = null
        selectedItem.value = null
    })

    // Log username (come nel tuo originale)
    if (store.state.username && store.state.username.trim() !== '') {
        console.log('Username presente nello store:', store.state.username)
    } else {
        console.warn('Nessun username salvato nello store')
    }
</script>

<style scoped>
    /* Strisce tabella (usiamo .table-striped ma lasciamo la tua utility se vuoi personalizzare) */
    .striped-table tbody tr:nth-child(odd) {
        background-color: #f9f9f9;
    }

    .striped-table tbody tr:nth-child(even) {
        background-color: #ffffff;
    }

    .striped-table table {
        table-layout: fixed;
        width: 100%;
    }

    /* Min-height extra per l'area tabella, se desideri */
    v-table {
        min-height: 800px;
    }

    /* Adegua dimensioni icone nei bottoni actions se necessario */
    .btn .icon {
        vertical-align: middle;
    }
</style>
``
