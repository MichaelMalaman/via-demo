<!-- src/components/DocumentiView.vue (conversione da Vuetify a Bootstrap Italia) -->
<template>
    <div class="container-fluid px-5">
        <!-- Barra azioni -->
        <div class="row align-items-center justify-content-between mt-4 mb-4">
            <div class="col-6 d-flex justify-content-start">
                <button type="button"
                        class="btn btn-light text-primary d-inline-flex align-items-center"
                        style="height: 50px;"
                        @click="goToDashboard">
                    <svg class="icon me-2" style="width:20px;height:20px;">
                        <use xlink:href="">spritesUrl </use>
                    </svg>
                    Indietro
                </button>
            </div>

            <div class="col-6 d-flex justify-content-end">
                <button type="button"
                        class="btn btn-light text-primary"
                        style="height: 50px; width: 260px;"
                        @click="openUploadModal">
                    Carica un nuovo documento
                </button>
            </div>
        </div>

        <!-- Modale upload -->
        <div class="modal fade" tabindex="-1" ref="uploadModalRef" aria-labelledby="uploadModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content position-relative">
                    <div class="modal-header">
                        <h5 id="uploadModalTitle" class="modal-title">Carica un nuovo documento</h5>
                        <button type="button" class="btn-close" aria-label="Chiudi" @click="closeUploadModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="upload-zone d-flex flex-column align-items-center justify-content-center text-center p-5 border rounded-3"
                             @dragover.prevent
                             @drop.prevent="onFileDrop">
                            <div class="fs-6">
                                DROP FILE HERE TO UPLOAD OR
                                <span class="text-primary text-decoration-underline cursor-pointer" @click="onSelectFromPC">
                                    CLICK HERE TO BROWSE
                                </span>
                            </div>

                            <!-- input file nascosto -->
                            <input ref="fileInputRef" type="file" class="d-none" @change="onFileChosen" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modale timeline -->
        <div class="modal fade" tabindex="-1" ref="historyModalRef" aria-labelledby="historyModalTitle" aria-hidden="true">
            <div class="modal-dialog" style="max-width: 640px;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 id="historyModalTitle" class="modal-title">Cronologia documento</h5>
                        <button type="button" class="btn-close" aria-label="Chiudi" @click="closeHistoryModal"></button>
                    </div>
                    <div class="modal-body">
                        <WorkflowTimeline :events="history"
                                          :current-status="currentStatus"
                                          :current-status-date="currentStatusDate"
                                          height="420px" />
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-link" @click="closeHistoryModal">Chiudi</button>
                        <button type="button" class="btn btn-primary" @click="closeHistoryModal">
                            <svg class="icon me-1" style="width:16px;height:16px;">
                                <use xlink:href="">spritesUrl </use>
                            </svg>
                            Ok
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Toolbar filtri -->
        <div class="filters-toolbar px-3 py-2 mb-3">
            <!-- Nome file -->
            <div class="filter-item" style="min-width: 260px; max-width: 320px;">
                <label for="f-nome" class="form-label mb-1">Nome file</label>
                <div class="input-group">
                    <span class="input-group-text">
                        <svg class="icon">
                            <use xlink:href="">spritesUrl </use>
                        </svg>
                    </span>
                    <input id="f-nome"
                           v-model="filters.nomeFile"
                           type="text"
                           class="form-control"
                           placeholder="Digita per cercare (es. impianto)" />
                    <button v-if="filters.nomeFile"
                            type="button"
                            class="btn btn-outline-secondary"
                            @click="filters.nomeFile = null"
                            aria-label="Pulisci"
                            title="Pulisci">
                        &times;
                    </button>
                </div>
            </div>

            <!-- Data Dal -->
            <div class="filter-item" style="min-width: 220px; max-width: 260px;">
                <label for="f-dal" class="form-label mb-1">Ultima modifica (dal)</label>
                <input id="f-dal"
                       v-model="filters.dataDal"   <!-- ISO YYYY-MM-DD -->
                :max="maxDal || undefined"
                type="date"
                class="form-control"
                />
            </div>

            <!-- Data Al -->
            <div class="filter-item" style="min-width: 220px; max-width: 260px;">
                <label for="f-al" class="form-label mb-1">Ultima modifica (al)</label>
                <input id="f-al"
                       v-model="filters.dataAl"   <!-- ISO YYYY-MM-DD -->
                :min="minAl || undefined"
                type="date"
                class="form-control"
                />
            </div>

            <!-- Stato pratica -->
            <div class="filter-item" style="min-width: 220px; max-width: 260px;">
                <label for="f-stato" class="form-label mb-1">Stato pratica</label>
                <select id="f-stato" v-model="filters.statoPratica" class="form-select">
                    <option :value="null">— Tutti —</option>
                    <option v-for="opt in statusOptions" :key="opt" :value="opt">
                        {{ opt }}
                    </option>
                </select>
            </div>

            <div class="ms-auto d-flex align-items-center gap-3">
                <!-- Badge conteggio risultati -->
                <span class="filter-item">
                    <span class="badge bg-primary">
                        Mostrati {{ filteredItems.length }} di {{ currentItems.length }}
                    </span>
                </span>

                <!-- Reset -->
                <span class="filter-item">
                    <button type="button" class="btn btn-link text-secondary text-decoration-none" @click="resetFilters">
                        Reset filtri
                    </button>
                </span>
            </div>
        </div>

        <!-- Tabella -->
        <div class="row justify-content-center align-items-center mt-4 mb-4">
            <div class="col-12">
                <div class="table-responsive">
                    <table class="table table-hover align-middle striped-table">
                        <thead class="table-dark">
                            <tr>
                                <th>NOME FILE</th>
                                <th>DATA ULTIMA MODIFICA</th>
                                <th>STATO PRATICA</th>
                                <th>SIZE</th>
                                <th class="text-end">FUNZIONI</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in filteredItems" :key="item.nomeFile + '-' + index">
                                <td>
                                    <!-- Download simulato con nome file -->
                                    <DownloadSimulator :filename="item.nomeFile" :content="testo" :mime-type="item.tipoFile" />
                                </td>

                                <td>
                                    {{ item.dataUltimaModifica }}
                                    <button type="button"
                                            class="btn btn-sm btn-outline-primary ms-2"
                                            data-bs-toggle="tooltip"
                                            title="Cronologia / Note temporali"
                                            @click="openHistoryModal"
                                            aria-label="Apri cronologia">
                                        Cronologia
                                    </button>
                                </td>

                                <td>
                                    <template v-if="item.statoPratica === 'chiusa'">
                                        <span class="badge text-bg-success">{{ item.statoPratica }}</span>
                                    </template>
                                    <template v-else-if="item.statoPratica === 'respinta'">
                                        <span class="badge text-bg-danger">{{ item.statoPratica }}</span>
                                    </template>
                                    <template v-else-if="item.statoPratica === 'in attesa di approvazione'">
                                        <span class="badge text-bg-warning text-dark">{{ item.statoPratica }}</span>
                                    </template>
                                    <template v-else>
                                        <span>-</span>
                                    </template>
                                </td>

                                <td>{{ item.size }}</td>

                                <td class="text-end">
                                    <button type="button"
                                            class="btn btn-outline-danger btn-sm me-2"
                                            @click="openDeleteDialog(item)"
                                            aria-label="Elimina"
                                            title="Elimina">
                                        <svg class="icon" style="width:16px;height:16px;">
                                            <use xlink:href="">spritesUrl </use>
                                        </svg>
                                    </button>
                                </td>
                            </tr>

                            <tr v-if="filteredItems.length === 0">
                                <td colspan="5" class="text-center text-muted py-4">Nessun documento trovato con i filtri impostati</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Modale elimina -->
        <div class="modal fade" tabindex="-1" ref="deleteModalRef" aria-labelledby="deleteModalTitle" aria-hidden="true">
            <div class="modal-dialog" style="max-width: 480px;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 id="deleteModalTitle" class="modal-title">Conferma eliminazione</h5>
                        <button type="button" class="btn-close" aria-label="Chiudi" @click="closeDeleteDialog"></button>
                    </div>
                    <div class="modal-body">
                        Sei sicuro di voler cancellare il file
                        <strong>{{ selectedItem?.nomeFile || 'selezionato' }}</strong>?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-link text-secondary" @click="closeDeleteDialog">Annulla</button>
                        <button type="button" class="btn btn-danger" @click="confirmDelete">
                            <svg class="icon me-1" style="width:16px;height:16px;">
                                <use xlink:href="">spritesUrl </use>
                            </svg>
                            Conferma
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
    import { useRouter } from 'vue-router'
    import DownloadSimulator from '../components/DownloadSimulator.vue'
    import WorkflowTimeline from '../components/WorkflowTimeline.vue'
    import spritesUrl from 'bootstrap-italia/dist/svg/sprites.svg?url'

    declare global { interface Window { bootstrap: any } }

    const router = useRouter()

    /* ---------- Tipi ---------- */
    type Item = {
        nomeFile: string
        dataUltimaModifica: string   // 'DD/MM/YYYY'
        statoPratica?: string
        tipoFile: string
        size: string
        funzioni?: string
    }

    /* ---------- Headers (solo per riferimento, la tabella è HTML) ---------- */
    const headers = [
        { title: 'NOME FILE', key: 'nomeFile' },
        { title: 'DATA ULTIMA MODIFICA', key: 'dataUltimaModifica' },
        { title: 'STATO PRATICA', key: 'statoPratica' },
        { title: 'SIZE', key: 'size' },
        { title: 'FUNZIONI', key: 'funzioni', sortable: false }
    ]

    /* ---------- Dati ---------- */
    const items: Item[] = [
        { nomeFile: 'VALUTAZIONE TERRENO', dataUltimaModifica: '15/02/2022', statoPratica: 'chiusa', tipoFile: 'PDF', size: '110 KB', funzioni: '' },
        { nomeFile: 'MATERIALI COSTRUZIONE', dataUltimaModifica: '28/07/2023', statoPratica: 'in attesa di approvazione', tipoFile: 'PDF', size: '342 KB', funzioni: '' },
        { nomeFile: 'IMPIANTO ELETTRICO', dataUltimaModifica: '09/11/2024', statoPratica: 'respinta', tipoFile: 'CAD', size: '342 KB', funzioni: '' },
        { nomeFile: 'MODELLO 3D PROGETTO', dataUltimaModifica: '21/03/2025', statoPratica: 'chiusa', tipoFile: 'PDF', size: '110 KB', funzioni: '' },
        { nomeFile: 'MAPPE ZONA SCAVI', dataUltimaModifica: '04/08/2022', statoPratica: 'chiusa', tipoFile: 'PDF', size: '342 KB', funzioni: '' },
        { nomeFile: 'VALUTAZIONE TERRENO', dataUltimaModifica: '17/01/2024', statoPratica: 'chiusa', tipoFile: 'PDF', size: '342 KB', funzioni: '' },
        { nomeFile: 'MATERIALI COSTRUZIONE', dataUltimaModifica: '30/09/2023', statoPratica: 'chiusa', tipoFile: 'PDF', size: '110 KB', funzioni: '' },
        { nomeFile: 'IMPIANTO ELETTRICO', dataUltimaModifica: '12/06/2022', statoPratica: 'chiusa', tipoFile: 'CAD', size: '342 KB', funzioni: '' },
        { nomeFile: 'MODELLO 3D PROGETTO', dataUltimaModifica: '08/05/2025', statoPratica: 'chiusa', tipoFile: 'CAD', size: '342 KB', funzioni: '' },
        { nomeFile: 'PARCO MONTALE', dataUltimaModifica: '19/10/2024', statoPratica: 'chiusa', tipoFile: 'PDF', size: '110 KB', funzioni: '' },
        { nomeFile: 'MATERIALI COSTRUZIONE', dataUltimaModifica: '03/03/2023', statoPratica: 'chiusa', tipoFile: 'PDF', size: '342 KB', funzioni: '' },
        { nomeFile: 'IMPIANTO ELETTRICO', dataUltimaModifica: '27/07/2022', statoPratica: 'chiusa', tipoFile: 'PDF', size: '342 KB', funzioni: '' },
        { nomeFile: 'IMPIANTO EOLICO', dataUltimaModifica: '14/02/2025', statoPratica: 'chiusa', tipoFile: 'PDF', size: '110 KB', funzioni: '' },
        { nomeFile: 'IMPIANTO ELETTRICO', dataUltimaModifica: '06/11/2023', statoPratica: 'chiusa', tipoFile: 'JPEG', size: '342 KB', funzioni: '' }
    ]
    const currentItems = ref<Item[]>([...items])

    /* ---------- FILTRI ---------- */
    const filters = ref<{
        nomeFile: string | null
        dataDal: string | null   // ISO 'YYYY-MM-DD'
        dataAl: string | null
        statoPratica: string | null
    }>({
        nomeFile: null,
        dataDal: null,
        dataAl: null,
        statoPratica: null
    })

    function resetFilters() {
        filters.value = { nomeFile: null, dataDal: null, dataAl: null, statoPratica: null }
    }

    /* Stati disponibili (dinamici dalla tabella corrente) */
    const statusOptions = computed(() => {
        const set = new Set<string>()
        for (const i of currentItems.value) {
            const s = (i.statoPratica || '').trim()
            if (s) set.add(s)
        }
        return Array.from(set).sort()
    })

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
        const d = new Date(s + 'T00:00:00')
        return isNaN(d.getTime()) ? null : d
    }

    /* Constraints per i date input */
    const maxDal = computed(() => filters.value.dataAl || null)
    const minAl = computed(() => filters.value.dataDal || null)

    /* ---------- Computed: filtraggio ---------- */
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
        deleteModal?.show()
    }
    function closeDeleteDialog() {
        deleteModal?.hide()
        selectedItem.value = null
    }
    function confirmDelete() {
        if (!selectedItem.value) return
        const idx = currentItems.value.findIndex(i => i === selectedItem.value)
        if (idx !== -1) currentItems.value.splice(idx, 1)
        closeDeleteDialog()
    }

    /* ---------- Upload ---------- */
    const uploadModalRef = ref<HTMLElement | null>(null)
    let uploadModal: any = null

    const fileInputRef = ref<HTMLInputElement | null>(null)
    function onSelectFromPC() { fileInputRef.value?.click() }

    function formatBytes(bytes: number) {
        if (bytes === 0) return '0 B'
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
        const i = Math.floor(Math.log(bytes) / Math.log(1024))
        const value = bytes / Math.pow(1024, i)
        return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${sizes[i]}`
    }
    function getExtension(name: string) {
        const ext = name.split('.').pop() || ''
        return ext.toUpperCase()
    }
    function todayDDMMYYYY() {
        const d = new Date()
        const dd = String(d.getDate()).padStart(2, '0')
        const mm = String(d.getMonth() + 1).padStart(2, '0')
        const yyyy = d.getFullYear()
        return `${dd}/${mm}/${yyyy}`
    }
    function addFileAsFirstItem(file: File) {
        const nuovo: Item = {
            nomeFile: file.name,
            dataUltimaModifica: todayDDMMYYYY(),
            tipoFile: getExtension(file.name) || 'FILE',
            size: formatBytes(file.size) || '',
        }
        currentItems.value.unshift(nuovo)
    }
    function onFileChosen(e: Event) {
        const input = e.target as HTMLInputElement
        const file = input.files?.[0]
        if (file) {
            addFileAsFirstItem(file)
            closeUploadModal()
        }
        if (input) input.value = ''
    }
    function onFileDrop(e: DragEvent) {
        const file = e.dataTransfer?.files?.[0]
        if (file) {
            addFileAsFirstItem(file)
            closeUploadModal()
        }
    }

    function openUploadModal() { uploadModal?.show() }
    function closeUploadModal() { uploadModal?.hide() }

    /* ---------- Timeline ---------- */
    const historyModalRef = ref<HTMLElement | null>(null)
    let historyModal: any = null

    function openHistoryModal() { historyModal?.show() }
    function closeHistoryModal() { historyModal?.hide() }

    /* Timeline demo data */
    const history = ref([
        { id: 1, author: 'Andrea Cozzolino', date: '2022-02-15', comment: 'Documento iniziale creato.', type: 'created' },
        { id: 2, author: 'Michael Malaman', date: '2023-03-03', comment: 'Aggiornati materiali e note tecniche.', type: 'edited' },
        { id: 3, author: 'Giuseppe Perrone', date: '2024-10-19', comment: 'Inviata per approvazione.', type: 'submitted' },
        { id: 4, author: 'Reviewer Team', date: '2025-03-21', comment: 'Richieste correzioni minori.', type: 'edited' }
    ])
    const currentStatus = ref('pending')
    const currentStatusDate = ref('2025-12-11')

    /* Contenuto per DownloadSimulator */
    const testo = `Relazione finale progetto
- Sezione A
- Sezione B
© 2025`

    /* ---------- Router ---------- */
    function goToDashboard() { router.push({ name: 'dashboard' }) }

    /* ---------- Bootstrap init (Modal / Tooltip) ---------- */
    onMounted(() => {
        if (window.bootstrap) {
            if (deleteModalRef.value) deleteModal = window.bootstrap.Modal.getOrCreateInstance(deleteModalRef.value, { backdrop: 'static' })
            if (uploadModalRef.value) uploadModal = window.bootstrap.Modal.getOrCreateInstance(uploadModalRef.value, { backdrop: 'static' })
            if (historyModalRef.value) historyModal = window.bootstrap.Modal.getOrCreateInstance(historyModalRef.value, { backdrop: 'static' })

            // Attiva i tooltip presenti nella tabella (per "Cronologia / Note temporali")
            document.querySelectorAll<HTMLElement>('[data-bs-toggle="tooltip"]').forEach(el => {
                new window.bootstrap.Tooltip(el)
            })
        }
    })

    onBeforeUnmount(() => {
        deleteModal?.dispose?.()
        uploadModal?.dispose?.()
        historyModal?.dispose?.()
        deleteModal = null
        uploadModal = null
        historyModal = null
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

    /* Tabella a righe alterne (oltre a .table-hover) */
    .striped-table tbody tr:nth-child(odd) {
        background-color: #f9f9f9;
    }

    .striped-table tbody tr:nth-child(even) {
        background-color: #ffffff;
    }

    /* Cursore pointer per i link testuali */
    .cursor-pointer {
        cursor: pointer;
    }
</style>
