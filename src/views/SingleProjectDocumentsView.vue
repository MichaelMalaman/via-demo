
<template>
    <v-container class="fill-height d-flex flex-column">
        <!-- Barra azioni -->
        <v-row class="justify-center align-center">
            <v-col class="d-flex justify-start" cols="6">
                <v-btn @click="goToDashboard"
                       color="#0066CC"
                       class="bg-white text-primary"
                       style="height: 50px;">
                    <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
            </v-col>

            <v-col class="d-flex justify-end" cols="6">
                <v-dialog v-model="dialogOpen" max-width="800" height="600">
                    <template v-slot:activator="{ props: activatorProps }">
                        <v-btn v-bind="activatorProps"
                               color="#0066CC"
                               class="bg-white text-primary"
                               style="height: 50px; width: 260px;">
                            Carica un nuovo documento
                        </v-btn>
                    </template>

                    <template v-slot:default="{ isActive }">
                        <v-sheet class="upload-zone d-flex flex-column align-center justify-center text-center"
                                 rounded
                                 @dragover.prevent
                                 @drop.prevent="onFileDrop">
                            <v-btn icon
                                   color="error"
                                   @click="dialogOpen = false"
                                   aria-label="Elimina"
                                   style="position: absolute; top: 8px; right: 8px;">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                            <div class="text-body-1">
                                DROP FILE HERE TO UPLOAD OR
                                <span class="text-primary text-decoration-underline cursor-pointer"
                                      @click="onSelectFromPC">
                                    CLICK HERE TO BROWSE
                                </span>
                            </div>

                            <!-- input file nascosto -->
                            <input ref="fileInputRef" type="file" class="d-none" @change="onFileChosen" />
                        </v-sheet>
                    </template>
                </v-dialog>
            </v-col>
        </v-row>

        <!-- FILTRI IN UNICA RIGA -->
        <v-toolbar flat class="filters-toolbar px-3 py-2">
            <!-- Nome file -->
            <div class="filter-item" style="min-width: 260px; max-width: 320px;">
                <v-text-field v-model="filters.nomeFile"
                              label="Nome file"
                              placeholder="Digita per cercare (es. impianto)"
                              clearable
                              density="comfortable"
                              variant="outlined"
                              prepend-inner-icon="mdi-file-search-outline"
                              hide-details="auto" />
            </div>

            <!-- Data Dal -->
            <div class="filter-item" style="min-width: 220px; max-width: 260px;">
                <v-menu v-model="menuDal"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y>
                    <template #activator="{ props }">
                        <v-text-field v-bind="props"
                                      readonly
                                      variant="outlined"
                                      density="comfortable"
                                      label="Ultima modifica (dal)"
                                      prepend-inner-icon="mdi-calendar"
                                      :model-value="filters.dataDal || ''"
                                      clearable
                                      @click:clear="clearDal"
                                      hide-details="auto" />
                    </template>
                    <v-card>
                        <v-date-picker v-model="pickerDal"
                                       color="primary"
                                       show-adjacent-months
                                       locale="it-IT"
                                       :max="pickerAl || undefined"
                                       @update:model-value="onPickDal"></v-date-picker>
                        <v-card-actions class="justify-end">
                            <v-btn variant="text" color="grey" @click="menuDal = false">Chiudi</v-btn>
                            <v-btn color="primary" @click="menuDal = false">Applica</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-menu>
            </div>

            <!-- Data Al -->
            <div class="filter-item" style="min-width: 220px; max-width: 260px;">
                <v-menu v-model="menuAl"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y>
                    <template #activator="{ props }">
                        <v-text-field v-bind="props"
                                      readonly
                                      variant="outlined"
                                      density="comfortable"
                                      label="Ultima modifica (al)"
                                      prepend-inner-icon="mdi-calendar-end"
                                      :model-value="filters.dataAl || ''"
                                      clearable
                                      @click:clear="clearAl"
                                      hide-details="auto" />
                    </template>
                    <v-card>
                        <v-date-picker v-model="pickerAl"
                                       color="primary"
                                       show-adjacent-months
                                       locale="it-IT"
                                       :min="pickerDal || undefined"
                                       @update:model-value="onPickAl"></v-date-picker>
                        <v-card-actions class="justify-end">
                            <v-btn variant="text" color="grey" @click="menuAl = false">Chiudi</v-btn>
                            <v-btn color="primary" @click="menuAl = false">Applica</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-menu>
            </div>

            <!-- Stato pratica -->
            <div class="filter-item" style="min-width: 220px; max-width: 260px;">
                <v-select v-model="filters.statoPratica"
                          :items="statusOptions"
                          label="Stato pratica"
                          clearable
                          density="comfortable"
                          variant="outlined"
                          prepend-inner-icon="mdi-filter"
                          :item-title="i => i"
                          :item-value="i => i"
                          hide-details="auto" />
            </div>

            <v-spacer />


            <v-spacer />

            <!-- Badge conteggio risultati -->
            <div class="filter-item" style="min-width: 180px;">
                <v-chip color="primary"
                        class="mr-2"
                        variant="tonal"
                        label>
                    Mostrati {{ filteredItems.length }} di {{ currentItems.length }}
                </v-chip>
            </div>

            <!-- Reset -->
            <div class="filter-item" style="min-width: 120px;">
                <v-btn variant="text" color="grey" @click="resetFilters" class="text-none">
                    Reset filtri
                </v-btn>
            </div>

        </v-toolbar>

        <!-- Tabella -->
        <v-row class="justify-center align-center flex-grow-1">
            <v-col cols="12" md="12" lg="12">
                <v-data-table :headers="headers"
                              :items="filteredItems"
                              class="striped-table"
                              :items-per-page="10"
                              hover>
                    <template #item="{ item, index }">
                        <tr :class="index % 2 === 0 ? 'bg-grey-lighten-4' : 'bg-white'">
                            <td>{{ item.nomeFile }}</td>
                            <td>{{ item.dataUltimaModifica }}</td>

                            <td>
                                <template v-if="item.statoPratica === 'chiusa'">
                                    <v-chip color="green" size="small" label>{{ item.statoPratica }}</v-chip>
                                </template>
                                <template v-else-if="item.statoPratica === 'respinta'">
                                    <v-chip color="red" size="small" label>{{ item.statoPratica }}</v-chip>
                                </template>
                                <template v-else-if="item.statoPratica === 'in attesa di approvazione'">
                                    <v-chip color="warning" size="small" label>{{ item.statoPratica }}</v-chip>
                                </template>
                                <template v-else>
                                    <span>-</span>
                                </template>
                            </td>

                            <td>{{ item.tipoFile }}</td>
                            <td>{{ item.size }}</td>
                            <td>
                                <v-btn icon color="error" @click="openDeleteDialog(item)" aria-label="Elimina">
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>

                                <v-dialog v-model="deleteDialog" max-width="480" scrim="transparent" class="blur-overlay" persistent>
                                    <v-card>
                                        <v-card-title class="text-h6">Conferma eliminazione</v-card-title>
                                        <v-card-text>
                                            Sei sicuro di voler cancellare il file
                                            <strong>{{ selectedItem?.nomeFile || 'selezionato' }}</strong>?
                                        </v-card-text>
                                        <v-card-actions class="justify-end">
                                            <v-btn variant="text" color="grey" @click="closeDeleteDialog">Annulla</v-btn>
                                            <v-btn color="error" prepend-icon="mdi-delete" @click="confirmDelete">
                                                Conferma
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </td>
                        </tr>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue'
    import { useRouter } from 'vue-router'

    const dialogOpen = ref(false)

    /* ---------- Tipi ---------- */
    type Item = {
        nomeFile: string
        dataUltimaModifica: string   // 'DD/MM/YYYY'
        statoPratica?: string
        tipoFile: string
        size: string
        funzioni?: string
    }

    /* ---------- Headers ---------- */
    const headers = [
        { title: 'NOME FILE', key: 'nomeFile' },
        { title: 'DATA ULTIMA MODIFICA', key: 'dataUltimaModifica' },
        { title: 'STATO PRATICA', key: 'statoPratica' },
        { title: 'TIPO DI FILE', key: 'tipoFile' },
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
        dataDal: string | null   // 'DD/MM/YYYY' (visualizzata)
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

    /* ---------- Date picker state (ISO per pickers) ---------- */
    const menuDal = ref(false)
    const menuAl = ref(false)
    const pickerDal = ref<string | null>(null) // 'YYYY-MM-DD'
    const pickerAl = ref<string | null>(null) // 'YYYY-MM-DD'

    function clearDal() {
        filters.value.dataDal = null
        pickerDal.value = null
    }
    function clearAl() {
        filters.value.dataAl = null
        pickerAl.value = null
    }

    /* Eventi di update: formatto e mostro nel campo */
    function onPickDal(val: string | null) {
        pickerDal.value = val
        filters.value.dataDal = val ? formatISOtoDDMMYYYY(val) : null
    }
    function onPickAl(val: string | null) {
        pickerAl.value = val
        filters.value.dataAl = val ? formatISOtoDDMMYYYY(val) : null
    }

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
    function formatISOtoDDMMYYYY(iso: string): string {
        const d = parseISODate(iso)
        if (!d) return ''
        const dd = String(d.getDate()).padStart(2, '0')
        const mm = String(d.getMonth() + 1).padStart(2, '0')
        const yyyy = d.getFullYear()
        return `${dd}/${mm}/${yyyy}`
    }

    /* ---------- Computed: filtraggio ---------- */
    const filteredItems = computed<Item[]>(() => {
        const nome = (filters.value.nomeFile || '').trim().toLowerCase()
        const stato = (filters.value.statoPratica || '').trim().toLowerCase()

        // Ricerca naturale: AND tra parole (senza wildcard)
        const tokens = nome ? nome.split(/\s+/).filter(Boolean) : []

        const dal = filters.value.dataDal ? parseDDMMYYYY(filters.value.dataDal) : null
        const al = filters.value.dataAl ? parseDDMMYYYY(filters.value.dataAl) : null
        // Inclusivo sul limite superiore (opzionale):
        // if (al) al.setHours(23, 59, 59, 999)

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
    const deleteDialog = ref(false)
    const selectedItem = ref<Item | null>(null)

    function openDeleteDialog(item: Item) {
        selectedItem.value = item
        deleteDialog.value = true
    }
    function closeDeleteDialog() {
        deleteDialog.value = false
        selectedItem.value = null
    }
    function confirmDelete() {
        if (!selectedItem.value) return
        const idx = currentItems.value.findIndex(i => i === selectedItem.value)
        if (idx !== -1) {
            currentItems.value.splice(idx, 1)
        }
        closeDeleteDialog()
    }

    /* ---------- Upload ---------- */
    const fileInputRef = ref<HTMLInputElement | null>(null)
    function onSelectFromPC() {
        fileInputRef.value?.click()
    }
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
            dialogOpen.value = false
        }
        if (input) input.value = ''
    }
    function onFileDrop(e: DragEvent) {
        const file = e.dataTransfer?.files?.[0]
        if (file) {
            addFileAsFirstItem(file)
            dialogOpen.value = false
        }
    }

    /* ---------- Router ---------- */
    const router = useRouter()
    function goToDashboard() {
        router.push({ name: 'dashboard' })
    }
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

    /* Tabella a righe alterne */
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

    /* Header personalizzato */
    :deep(.v-data-table thead tr) {
        background-color: #5B5B5B !important;
    }

    :deep(.v-data-table thead th) {
        color: #FFFFFF !important;
        font-weight: 600;
    }
</style>
