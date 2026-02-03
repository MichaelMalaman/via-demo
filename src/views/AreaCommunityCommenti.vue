<template>
    <div class="container-fluid px-4">
        <!-- Barra azioni -->
        <div class="row align-items-center mt-4 mb-4">
            <!-- Pulsante sinistro -->
            <div class="col-6 d-flex justify-content-start"></div>

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
                                @click="setSortOne('nomeProgetto')"
                                @keyup.enter="setSortOne('nomeProgetto')"
                                @keyup.space.prevent="setSortOne('nomeProgetto')">
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

                            <th>ULTIMO COMMENTO</th>
                            <th>AZIONI</th>
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

                            <!-- Azioni (tab aperte) -->
                            <td>
                                <!-- Vedi documento -->
                                <button type="button"
                                        class="btn btn-link p-0"
                                        data-bs-toggle="tooltip"
                                        title="Vedi commenti del documento"
                                        @click="openViewComments(item)"
                                        aria-label="Vedi commenti del documento">
                                    <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-password-visible`"></use></svg>
                                </button>

                                <!-- Scrivi/Modifica commento -->
                                <button type="button"
                                        class="btn btn-link p-0 ms-3"
                                        data-bs-toggle="tooltip"
                                        title="Scrivi o modifica commento"
                                        @click="openEditComments(item)"
                                        aria-label="Scrivi o modifica commento">
                                    <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-pencil`"></use></svg>
                                </button>
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
                    <li v-for="p in totalPagesOne" :key="'p1-' + p" class="page-item" :class="{ active: currentPageOne === p }">
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
                                <!-- Vedi documento -->
                                <button type="button"
                                        class="btn btn-link p-0"
                                        data-bs-toggle="tooltip"
                                        title="Vedi commenti del documento"
                                        @click="openViewComments(item)"
                                        aria-label="Vedi commenti del documento">
                                    <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-password-visible`"></use></svg>
                                </button>

                                <!-- Scrivi/Modifica commento -->
                                <button type="button"
                                        class="btn btn-link p-0 ms-3"
                                        data-bs-toggle="tooltip"
                                        title="Scrivi o modifica commento"
                                        @click="openEditComments(item)"
                                        aria-label="Scrivi o modifica commento">
                                    <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-pencil`"></use></svg>
                                </button>
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
                    <li v-for="p in totalPagesTwo" :key="'p2-' + p" class="page-item" :class="{ active: currentPageTwo === p }">
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

        <!-- ========================= -->
        <!-- MODALE: Vedi commenti     -->
        <!-- ========================= -->
        <div class="modal fade"
             id="viewCommentsModal"
             tabindex="-1"
             aria-hidden="true"
             aria-labelledby="viewCommentsTitle"
             ref="modalViewRef">
            <div class="modal-dialog modal-lg modal-dialog-scrollable">
                <div class="modal-content">
                    <!-- Header con tasto Esci a sinistra -->
                    <div class="modal-header d-flex align-items-center">
                        <button type="button" class="btn btn-back d-inline-flex align-items-center me-3" @click="closeView" aria-label="Esci">
                            <svg class="icon"><use :href="`${spritesHref}#it-arrow-left`"></use></svg>
                            <span class="ms-1">Esci</span>
                        </button>
                        <h5 class="modal-title" id="viewCommentsTitle">
                            Commenti — {{ activeItem?.nomeProgetto || 'Nessun progetto' }}
                        </h5>
                        <button type="button" class="btn-close ms-auto" @click="closeView" aria-label="Chiudi"></button>
                    </div>

                    <div class="modal-body">
                        <div v-if="currentComments.length === 0" class="alert alert-info">
                            Nessun commento presente per questo documento.
                        </div>

                        <ul v-else class="list-group">
                            <li v-for="c in currentComments" :key="c.id" class="list-group-item">
                                <div class="d-flex justify-content-between">
                                    <strong>{{ c.author }}</strong>
                                    <small class="text-secondary">{{ formatDate(c.createdAt) }}</small>
                                </div>
                                <p class="mb-0">{{ c.text }}</p>
                            </li>
                        </ul>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-primary" @click="closeView">Chiudi</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- ========================= -->
        <!-- MODALE: Edit commenti     -->
        <!-- ========================= -->
        <div class="modal fade"
             id="editCommentsModal"
             tabindex="-1"
             aria-hidden="true"
             aria-labelledby="editCommentsTitle"
             ref="modalEditRef">
            <div class="modal-dialog modal-lg modal-dialog-scrollable">
                <div class="modal-content">
                    <!-- Header con tasto Esci a sinistra -->
                    <div class="modal-header d-flex align-items-center">
                        <button type="button" class="btn btn-back d-inline-flex align-items-center me-3" @click="closeEdit" aria-label="Esci">
                            <svg class="icon"><use :href="`${spritesHref}#it-arrow-left`"></use></svg>
                            <span class="ms-1">Esci</span>
                        </button>
                        <h5 class="modal-title" id="editCommentsTitle">
                            Modifica/aggiungi commenti — {{ activeItem?.nomeProgetto || 'Nessun progetto' }}
                        </h5>
                        <button type="button" class="btn-close ms-auto" @click="closeEdit" aria-label="Chiudi"></button>
                    </div>

                    <div class="modal-body">
                        <!-- Lista completa dei commenti -->
                        <h6 class="fw-semibold mb-2">Tutti i commenti</h6>
                        <div v-if="currentComments.length === 0" class="alert alert-info">
                            Ancora nessun commento. Scrivi il primo qui sotto.
                        </div>
                        <ul v-else class="list-group mb-3">
                            <li v-for="c in currentComments" :key="c.id" class="list-group-item">
                                <div class="d-flex justify-content-between">
                                    <strong>{{ c.author }}</strong>
                                    <small class="text-secondary">{{ formatDate(c.createdAt) }}</small>
                                </div>
                                <p class="mb-0">{{ c.text }}</p>
                            </li>
                        </ul>

                        <!-- Editor nuovo commento -->
                        <label class="form-label fw-semibold" for="newComment">Nuovo commento</label>
                        <textarea id="newComment"
                                  class="form-control"
                                  rows="3"
                                  v-model="newCommentText"
                                  placeholder="Scrivi qui il tuo commento..."></textarea>
                        <small class="text-secondary d-block mt-1">
                            L’ultimo commento inserito verrà mostrato nella tabella come “ULTIMO COMMENTO”.
                        </small>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" @click="closeEdit">Annulla</button>
                        <button type="button"
                                class="btn btn-primary d-inline-flex align-items-center"
                                :disabled="!newCommentText.trim() || !activeItem"
                                @click="addComment()">
                            <svg class="icon"><use :href="`${spritesHref}#it-pencil`"></use></svg>
                            <span class="ms-1">Salva commento</span>
                        </button>
                    </div>
                </div>
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
        statoChiuso: boolean
        ultimoCommento: string
        AutoreCommento: string
    }

    const tab = ref<'one' | 'two'>('one')

    /** DATI TABELLA (ultimoCommento/AutoreCommento sincronizzati da commentsByItem) */
    const items = ref<Item[]>([
        { id: 1, nomeProgetto: 'IMPIANTO FOTOVOLTAICO', dataInizio: '12/03/2022', ente: 'REGIONE LOMBARDIA', scadenza: '12/04/2022', statoChiuso: false, ultimoCommento: '', AutoreCommento: '' },
        { id: 2, nomeProgetto: 'IMPIANTO EOLICO', dataInizio: '12/03/2022', ente: 'REGIONE LOMBARDIA', scadenza: '12/04/2022', statoChiuso: false, ultimoCommento: '', AutoreCommento: '' },
        { id: 3, nomeProgetto: 'IMPIANTO BIOESEL', dataInizio: '12/03/2022', ente: 'REGIONE LOMBARDIA', scadenza: '12/04/2022', statoChiuso: false, ultimoCommento: '', AutoreCommento: '' },
        { id: 4, nomeProgetto: 'NUOVO STADIO', dataInizio: '12/03/2022', ente: 'REGIONE LOMBARDIA', scadenza: '12/04/2022', statoChiuso: false, ultimoCommento: '', AutoreCommento: '' },
        { id: 5, nomeProgetto: 'PARCO GARIBALDI', dataInizio: '12/03/2022', ente: 'REGIONE LOMBARDIA', scadenza: '12/04/2022', statoChiuso: false, ultimoCommento: '', AutoreCommento: '' },
        { id: 6, nomeProgetto: 'NUOVO PARCHEGGIO', dataInizio: '12/03/2022', ente: 'REGIONE LOMBARDIA', scadenza: '12/04/2022', statoChiuso: false, ultimoCommento: '', AutoreCommento: '' },
        { id: 7, nomeProgetto: 'PARCO MONTALE', dataInizio: '12/03/2022', ente: 'REGIONE LOMBARDIA', scadenza: '12/04/2022', statoChiuso: false, ultimoCommento: '', AutoreCommento: '' },
        { id: 8, nomeProgetto: 'NUOVA ARENA', dataInizio: '12/03/2022', ente: 'REGIONE LOMBARDIA', scadenza: '12/04/2022', statoChiuso: false, ultimoCommento: '', AutoreCommento: '' },
    ])

    const items2 = ref<Item[]>([
        { id: 101, nomeProgetto: 'IMPIANTO GEOTERMICO', dataInizio: '05/02/2023', ente: 'REGIONE PIEMONTE', scadenza: '15/05/2023', statoChiuso: true, ultimoCommento: '', AutoreCommento: '' },
        { id: 102, nomeProgetto: 'BONIFICA AREA INDUSTRIALE', dataInizio: '18/07/2022', ente: 'REGIONE VENETO', scadenza: '30/09/2022', statoChiuso: true, ultimoCommento: '', AutoreCommento: '' },
        { id: 103, nomeProgetto: 'NUOVO PARCO URBANO', dataInizio: '10/01/2024', ente: 'COMUNE DI MILANO', scadenza: '20/03/2024', statoChiuso: true, ultimoCommento: '', AutoreCommento: '' },
        { id: 104, nomeProgetto: 'IMPIANTO IDROELETTRICO', dataInizio: '22/11/2023', ente: 'REGIONE TRENTINO-ALTO ADIGE', scadenza: '15/02/2024', statoChiuso: true, ultimoCommento: '', AutoreCommento: '' },
        { id: 105, nomeProgetto: 'RECUPERO DISCARICA', dataInizio: '03/06/2023', ente: 'REGIONE EMILIA-ROMAGNA', scadenza: '10/08/2023', statoChiuso: true, ultimoCommento: '', AutoreCommento: '' },
        { id: 106, nomeProgetto: 'NUOVA CICLABILE', dataInizio: '12/09/2022', ente: 'COMUNE DI TORINO', scadenza: '25/11/2022', statoChiuso: true, ultimoCommento: '', AutoreCommento: '' },
        { id: 107, nomeProgetto: 'IMPIANTO BIOMASSA', dataInizio: '08/04/2023', ente: 'REGIONE LOMBARDIA', scadenza: '18/06/2023', statoChiuso: true, ultimoCommento: '', AutoreCommento: '' },
        { id: 108, nomeProgetto: 'RIQUALIFICAZIONE LAGUNA', dataInizio: '20/08/2023', ente: 'REGIONE VENETO', scadenza: '05/10/2023', statoChiuso: true, ultimoCommento: '', AutoreCommento: '' },
        { id: 109, nomeProgetto: 'NUOVO CENTRO SPORTIVO', dataInizio: '15/03/2024', ente: 'COMUNE DI FIRENZE', scadenza: '30/05/2024', statoChiuso: true, ultimoCommento: '', AutoreCommento: '' },
        { id: 110, nomeProgetto: 'IMPIANTO SOLARE TERMICO', dataInizio: '01/07/2023', ente: 'REGIONE SICILIA', scadenza: '15/09/2023', statoChiuso: true, ultimoCommento: '', AutoreCommento: '' },
    ])

    /* ======================
     * Filtri
     * ====================== */
    const searchNome = ref<string>('')           // testo libero (nomeProgetto / ente)
    const dataDal = ref<string | null>(null)     // 'YYYY-MM-DD'
    const dataAl = ref<string | null>(null)      // 'YYYY-MM-DD'
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

    /* ======================
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
    watch([dataDal, dataAl], ([dal, al]) => {
        const dDal = parseISODate(dal)
        const dAl = parseISODate(al)
        if (dDal && dAl && dDal > dAl) {
            dataAl.value = dal || null
        }
    })
    watch([searchNome, dataDal, dataAl, statoPratica, tab], () => {
        if (tab.value === 'one') currentPageOne.value = 1
        else currentPageTwo.value = 1
    })

    /* ======================
     * Commenti (workflow VIA: visione -> upload -> integrazioni -> pareri -> approvazione)
     * ====================== */
    type Comment = {
        id: number
        author: string
        text: string
        createdAt: string // YYYY-MM-DD
    }

    const activeItem = ref<Item | null>(null)
    const modalViewRef = ref<HTMLElement | null>(null)
    const modalEditRef = ref<HTMLElement | null>(null)
    let bsViewModal: any = null
    let bsEditModal: any = null

    // Mappa dei commenti per pratica (id -> Comment[])
    const commentsByItem = ref<Record<number, Comment[]>>({
        // --- APERTE ---
        1: [
            { id: 1001, author: 'Eleonora Passeri', text: 'Visionato SIA e tavole FV: rilievi su ombreggiamenti perimetrali.', createdAt: '2025-10-20' },
            { id: 1002, author: 'Fabrizio Simeoni', text: 'Caricata Relazione Tecnica v1.2 e schemi unifilari su repository. Protocollo RL-2025-1123.', createdAt: '2025-11-02' },
            { id: 1003, author: 'Andrea Cozzolino', text: 'ARPA chiede integrazioni: analisi acustica inverter e studio ombre trimestrale.', createdAt: '2025-11-18' },
            { id: 1004, author: 'Lucrezia Russo', text: 'Integrazioni caricate (acustica/ombre). In attesa seduta Commissione VIA.', createdAt: '2026-01-15' },
        ],
        2: [
            { id: 2001, author: 'Luca Stefano Raccis', text: 'Visionato studio anemometrico 12 mesi; note su turbolenza sito.', createdAt: '2025-09-11' },
            { id: 2002, author: 'Bernardo Rispoli Valenti', text: 'Upload layout pale e viabilità di cantiere. Protocollo RL-2025-1477.', createdAt: '2025-10-01' },
            { id: 2003, author: 'Eleonora Passeri', text: 'Richieste integrazioni VIA: rotte avifauna, collision risk e mappa isofonica.', createdAt: '2025-11-06' },
        ],
        3: [
            { id: 3001, author: 'Andrea Cozzolino', text: 'Visionato SIA biomassa; rilievi su bilancio emissivo e gestione additivi.', createdAt: '2025-08-25' },
            { id: 3002, author: 'Lucrezia Russo', text: 'Caricata AUA integrazione: bilancio di massa e registro rifiuti.', createdAt: '2025-10-10' },
        ],
        4: [
            { id: 4001, author: 'Fabrizio Simeoni', text: 'Visionato progetto stadio: traffico evento e flussi esodo da completare.', createdAt: '2025-09-05' },
            { id: 4002, author: 'Andrea Cozzolino', text: 'Caricate tavole illuminotecniche e relazione sicurezza. Protocollo RL-2025-1662.', createdAt: '2025-11-02' },
        ],
        5: [
            { id: 5001, author: 'Lucrezia Russo', text: 'Visionata relazione paesaggistica; note su specie autoctone e irrigazione.', createdAt: '2025-06-16' },
            { id: 5002, author: 'Luca Stefano Raccis', text: 'Upload piano manutenzione verde e tav. vegetazionale.', createdAt: '2025-06-30' },
        ],
        6: [
            { id: 6001, author: 'Bernardo Rispoli Valenti', text: 'Visionato studio sosta; verifiche pendenze rampe mancanti.', createdAt: '2025-05-20' },
            { id: 6002, author: 'Andrea Cozzolino', text: 'Caricati esecutivi parcheggio; in attesa convenzione urbanistica.', createdAt: '2025-09-12' },
        ],
        7: [
            { id: 7001, author: 'Eleonora Passeri', text: 'Visionato screening incidenza su ZSC; prescrizioni stagionali cantiere.', createdAt: '2025-04-08' },
            { id: 7002, author: 'Fabrizio Simeoni', text: 'Upload tavole sentieristica e arredi con verifica accessibilità.', createdAt: '2025-10-24' },
        ],
        8: [
            { id: 8001, author: 'Lucrezia Russo', text: 'Visionato progetto acustico arena; classe obiettivo III.', createdAt: '2025-03-28' },
            { id: 8002, author: 'Andrea Cozzolino', text: 'Parere ATS favorevole con prescrizioni su flussi di esodo caricati.', createdAt: '2025-11-14' },
        ],

        // --- CHIUSE ---
        101: [
            { id: 10101, author: 'Luca Stefano Raccis', text: 'Visionati profili termici e curva reiniezione.', createdAt: '2024-10-12' },
            { id: 10102, author: 'Eleonora Passeri', text: 'Upload prove tenuta pozzi e report conformità.', createdAt: '2024-11-05' },
            { id: 10103, author: 'Andrea Cozzolino', text: 'Provvedimento VIA favorevole; procedimento chiuso.', createdAt: '2024-12-01' },
        ],
        102: [
            { id: 10201, author: 'Lucrezia Russo', text: 'Visionati esiti soil-gas e MIP; hotspot BTEX individuati.', createdAt: '2024-07-18' },
            { id: 10202, author: 'Paolo Ferri', text: 'Upload piano scavo e prescrizioni CER 17.05.', createdAt: '2024-08-25' },
            { id: 10203, author: 'Andrea Cozzolino', text: 'VIA conclusa con pareri favorevoli; chiusura post-operam.', createdAt: '2024-09-10' },
        ],
        103: [
            { id: 10301, author: 'Stefano Gatti', text: 'Ombreggiamento conforme; specie autoctone validate.', createdAt: '2024-02-10' },
            { id: 10302, author: 'Elena Russo', text: 'Collaudo verde chiuso; manutenzione 24 mesi.', createdAt: '2024-03-27' },
            { id: 10303, author: 'Andrea Cozzolino', text: 'Provvedimento VIA favorevole; chiusura procedimento.', createdAt: '2024-03-30' },
        ],
        104: [
            { id: 10401, author: 'Elena Russo', text: 'Aggiornato DMV secondo linee 2023.', createdAt: '2024-01-09' },
            { id: 10402, author: 'Davide Conti', text: 'Pareri enti favorevoli caricati.', createdAt: '2024-02-12' },
            { id: 10403, author: 'Andrea Cozzolino', text: 'VIA approvata; fine lavori.', createdAt: '2024-02-14' },
        ],
        105: [
            { id: 10501, author: 'Davide Conti', text: 'Allineato piano monitoraggi ad ARPA.', createdAt: '2023-08-05' },
            { id: 10502, author: 'Andrea Cozzolino', text: 'Chiusura procedimento VIA con esito favorevole.', createdAt: '2023-08-08' },
        ],
        106: [
            { id: 10601, author: 'Marta Leone', text: 'Analisi incidentalità completate.', createdAt: '2022-10-11' },
            { id: 10602, author: 'Francesca De Luca', text: 'Collaudo segnaletica e illuminazione OK.', createdAt: '2022-11-21' },
            { id: 10603, author: 'Andrea Cozzolino', text: 'Provvedimento VIA favorevole; chiuso.', createdAt: '2022-11-22' },
        ],
        107: [
            { id: 10701, author: 'Paolo Ferri', text: 'Bilancio emissivo aggiornato BAT 2023.', createdAt: '2023-06-08' },
            { id: 10702, author: 'Riccardo Neri', text: 'AUA rinnovata; matrice controlli caricata.', createdAt: '2023-06-17' },
            { id: 10703, author: 'Andrea Cozzolino', text: 'Esito VIA favorevole; conclusione.', createdAt: '2023-06-18' },
        ],
        108: [
            { id: 10801, author: 'Francesca De Luca', text: 'Interferenze con ZPS verificate; prescrizioni recepite.', createdAt: '2023-09-11' },
            { id: 10802, author: 'Luca Stefano Raccis', text: 'Monitoraggio salinità conforme.', createdAt: '2023-10-02' },
            { id: 10803, author: 'Andrea Cozzolino', text: 'VIA favorevole; chiusura.', createdAt: '2023-10-03' },
        ],
        109: [
            { id: 10901, author: 'Riccardo Neri', text: 'Valutazione acustica serale integrata; limiti rispettati.', createdAt: '2024-04-20' },
            { id: 10902, author: 'Sara Colombo', text: 'Agibilità rilasciata; fine lavori.', createdAt: '2024-05-26' },
            { id: 10903, author: 'Andrea Cozzolino', text: 'Provvedimento VIA favorevole.', createdAt: '2024-05-27' },
        ],
        110: [
            { id: 11001, author: 'Sara Colombo', text: 'Allineamento PR FESR Az.2.2 verificato.', createdAt: '2023-08-28' },
            { id: 11002, author: 'Eleonora Passeri', text: 'Collaudo impianto OK; curve rendimento conformi.', createdAt: '2023-09-12' },
            { id: 11003, author: 'Andrea Cozzolino', text: 'VIA favorevole; concluso.', createdAt: '2023-09-13' },
        ],
    })

    /** Sincronizza la tabella con l’ultimo commento reale per ciascun id */
    function syncTableFromComments() {
        const syncArr = (arr: Item[]) => {
            arr.forEach((row) => {
                const list = commentsByItem.value[row.id] ?? []
                if (list.length > 0) {
                    const sorted = list.slice().sort((a, b) => a.createdAt.localeCompare(b.createdAt))
                    const last = sorted[sorted.length - 1]
                    row.ultimoCommento = last.text
                    row.AutoreCommento = last.author
                } else {
                    row.ultimoCommento = ''
                    row.AutoreCommento = ''
                }
            })
        }
        syncArr(items.value)
        syncArr(items2.value)
    }

    // Chiamate di sync
    onMounted(() => {
        syncTableFromComments()
    })
    syncTableFromComments() // anche subito dopo la definizione

    // Form nuovo commento
    const newCommentText = ref<string>('')

    // Utility: formatta data
    function formatDate(iso: string): string {
        const d = new Date(iso)
        if (isNaN(d.getTime())) return iso
        const dd = String(d.getDate()).padStart(2, '0')
        const mm = String(d.getMonth() + 1).padStart(2, '0')
        const yyyy = d.getFullYear()
        return `${dd}/${mm}/${yyyy}`
    }

    // Commenti dell’item attivo
    const currentComments = computed<Comment[]>(() => {
        const id = activeItem.value?.id
        if (!id) return []
        return commentsByItem.value[id] ?? []
    })

    // Apertura/chiusura modali
    async function ensureBootstrap() {
        if (!window.bootstrap) {
            await import('bootstrap-italia/dist/js/bootstrap-italia.bundle.min.js')
            await nextTick()
        }
    }
    async function openViewComments(item: Item) {
        activeItem.value = item
        await ensureBootstrap()
        bsViewModal = window.bootstrap.Modal.getOrCreateInstance(modalViewRef.value!)
        bsViewModal.show()
    }
    async function openEditComments(item: Item) {
        activeItem.value = item
        newCommentText.value = ''
        await ensureBootstrap()
        bsEditModal = window.bootstrap.Modal.getOrCreateInstance(modalEditRef.value!)
        bsEditModal.show()
    }
    function closeView() {
        if (bsViewModal) bsViewModal.hide()
    }
    function closeEdit() {
        if (bsEditModal) bsEditModal.hide()
    }

    // Aggiungi commento e aggiorna tabella con sync
    function addComment() {
        const item = activeItem.value
        const text = newCommentText.value.trim()
        if (!item || !text) return

        const newC: Comment = {
            id: Date.now(),
            author: store.state.username || 'Utente',
            text,
            createdAt: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
        }

        const list = commentsByItem.value[item.id] ?? []
        commentsByItem.value[item.id] = [...list, newC]

        // Allinea tabella al vero "ultimo commento"
        syncTableFromComments()

        showSnack('Commento aggiunto', 'success')
        closeEdit()
    }

    /* Piccolo extra: reset filtri */
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
        background-color: #a5a5a5 !important;
    }

    /* Header cliccabili */
    th[role="button"] {
        cursor: pointer;
        user-select: none;
    }

    /* Icone */
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
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: auto auto;
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

    /* Pulsante "Esci" modale */
    .btn-back {
        color: #000;
        background-color: #f2f2f2;
        border: 1px solid #6c757d;
        transition: background 0.2s, color 0.2s;
    }

        .btn-back:hover,
        .btn-back:focus {
            background-color: #004080 !important;
            color: #ffffff;
            outline: 2px solid #002a5e;
        }

        .btn-back .icon {
            margin-top: -1px;
        }
</style>