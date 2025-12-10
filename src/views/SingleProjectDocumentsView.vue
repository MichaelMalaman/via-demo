

<template>
    <v-container class="fill-height d-flex flex-column">


        <!-- Riga con tabella centrata -->
        <v-row class="justify-center align-center flex-grow-1">
            <v-col class="d-flex justify-start" cols="6">
                <v-btn @click="goToDashboard"
                       color="#0066CC"
                       class="bg-white text-primary"
                       style="height: 50px;">
                    <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
            </v-col>
            <v-col class="d-flex justify-end" cols="6">

                <v-dialog max-width="800" height="600">
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
                            <v-btn icon color="error" @click="isActive.value = false" aria-label="Elimina" style="position: absolute; top: 8px; right: 8px;">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                            <div class="text-body-1">
                                DROP FILE HERE TO UPLOAD OR
                                <span class="text-primary text-decoration-underline cursor-pointer" @click="onSelectFromPC">
                                    CLICK HERE TO BROWSE
                                </span>
                            </div>

                            <!-- input file nascosto -->
                            <input ref="fileInputRef" type="file" class="d-none" @change="onFileChosen" />
                        </v-sheet>


                    </template>
                </v-dialog>
            </v-col>

            <v-col cols="12" md="12" lg="12">

                <v-data-table :headers="headers"
                              :items="currentItems"
                              class="striped-table"
                              :items-per-page="10"
                              hover>
                    <template #item="{ item, index }">
                        <tr :class="index % 2 === 0 ? 'bg-grey-lighten-4' : 'bg-white'">
                            <td>{{ item.nomeFile }}</td>
                            <td>{{ item.dataUltimaModifica }}</td>
                            <td>{{ item.tipoFile }}</td>
                            <td>{{ item.size }}</td>
                            <td>

                                <!-- Azioni nella colonna ALTRO -->
                                <v-btn icon color="error" @click="openDeleteDialog(item)" aria-label="Elimina">
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                                <v-btn icon color="primary" @click="openEditDialog(item)" aria-label="Modifica">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>

                                <!-- Dialog di conferma eliminazione -->
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

                                <!-- Dialog di modifica -->
                                <v-dialog v-model="editDialog" max-width="480" scrim="transparent" class="blur-overlay" persistent>
                                    <v-card>
                                        <v-card-title class="text-h6">Modifica file</v-card-title>
                                        <v-card-text>
                                            <v-text-field v-model="editItemData.nomeFile" label="Nome File"></v-text-field>
                                            <v-text-field v-model="editItemData.dataUltimaModifica" label="Data Ultima Modifica"></v-text-field>
                                            <v-text-field v-model="editItemData.tipoFile" label="Tipo di File"></v-text-field>
                                            <v-text-field v-model="editItemData.size" label="Size"></v-text-field>
                                        </v-card-text>
                                        <v-card-actions class="justify-end">
                                            <v-btn variant="text" color="grey" @click="closeEditDialog">Annulla</v-btn>
                                            <v-btn color="primary" prepend-icon="mdi-content-save" @click="confirmEdit">
                                                Salva
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
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'

    type Item = {
        nomeFile: string
        dataUltimaModifica: string
        tipoFile: string
        size: string
        altro?: string
    }

    const headers = [
        { title: 'NOME FILE', key: 'nomeFile' },
        { title: 'DATA ULTIMA MODIFICA', key: 'dataUltimaModifica' },
        { title: 'TIPO DI FILE', key: 'tipoFile' },
        { title: 'SIZE', key: 'size' },
        { title: 'ALTRO', key: 'altro', sortable: false }
    ]

    const items: Item[] = [
        { nomeFile: 'VALUTAZIONE TERRENO', dataUltimaModifica: '12/03/2022', tipoFile: 'PDF', size: '110 KB', altro: '' },
        { nomeFile: 'MATERIALI COSTRUZIONE', dataUltimaModifica: '12/03/2022', tipoFile: 'PDF', size: '342 KB', altro: '' },
        { nomeFile: 'IMPIANTO ELETTRICO', dataUltimaModifica: '12/03/2022', tipoFile: 'CAD', size: '342 KB', altro: '' },
        { nomeFile: 'MODELLO 3D PROGETTO', dataUltimaModifica: '12/03/2022', tipoFile: 'PDF', size: '110 KB', altro: '' },
        { nomeFile: 'MAPPE ZONA SCAVI', dataUltimaModifica: '12/03/2022', tipoFile: 'PDF', size: '342 KB', altro: '' },
        { nomeFile: 'VALUTAZIONE TERRENO', dataUltimaModifica: '12/03/2022', tipoFile: 'PDF', size: '342 KB', altro: '' },
        { nomeFile: 'MATERIALI COSTRUZIONE', dataUltimaModifica: '12/03/2022', tipoFile: 'PDF', size: '110 KB', altro: '' },
        { nomeFile: 'IMPIANTO ELETTRICO', dataUltimaModifica: '12/03/2022', tipoFile: 'CAD', size: '342 KB', altro: '' },
        { nomeFile: 'MODELLO 3D PROGETTO', dataUltimaModifica: '12/03/2022', tipoFile: 'CAD', size: '342 KB', altro: '' },
        { nomeFile: 'PARCO MONTALE', dataUltimaModifica: '12/03/2022', tipoFile: 'PDF', size: '110 KB', altro: '' },
        { nomeFile: 'MATERIALI COSTRUZIONE', dataUltimaModifica: '12/03/2022', tipoFile: 'PDF', size: '342 KB', altro: '' },
        { nomeFile: 'IMPIANTO ELETTRICO', dataUltimaModifica: '12/03/2022', tipoFile: 'PDF', size: '342 KB', altro: '' },
        { nomeFile: 'IMPIANTO EOLICO', dataUltimaModifica: '12/03/2022', tipoFile: 'PDF', size: '110 KB', altro: '' },
        { nomeFile: 'IMPIANTO ELETTRICO', dataUltimaModifica: '12/03/2022', tipoFile: 'JPEG', size: '342 KB', altro: '' }
    ]

    const currentItems = ref<Item[]>([...items])

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

    /* ---------- Dialog modifica ---------- */
    const editDialog = ref(false)
    const editItemData = ref<Item>({
        nomeFile: '',
        dataUltimaModifica: '',
        tipoFile: '',
        size: ''
    })

    function openEditDialog(item: Item) {
        editItemData.value = { ...item }
        editDialog.value = true
    }
    function closeEditDialog() {
        editDialog.value = false
    }
    function confirmEdit() {
        const idx = currentItems.value.findIndex(i => i.nomeFile === editItemData.value.nomeFile)
        if (idx !== -1) currentItems.value[idx] = { ...editItemData.value }
        closeEditDialog()
    }

    /* ---------- Upload: input + D&D ---------- */
    const fileInputRef = ref<HTMLInputElement | null>(null)

    function onSelectFromPC() {
        fileInputRef.value?.click()
    }

    // Utility
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
            size: formatBytes(file.size) || ''
        }
        currentItems.value.unshift(nuovo) // 👈 PRIMO ITEM
        console.log('currentItems (head):', currentItems.value.slice(0, 3))
    }

    function onFileChosen(e: Event) {
        const input = e.target as HTMLInputElement
        const file = input.files?.[0]
        if (file) {
            console.log('File scelto:', file.name)
            addFileAsFirstItem(file) // 👈 MANCAVA QUESTA CHIAMATA
        }
        // resetta l'input per permettere di riselezionare lo stesso file
        if (input) input.value = ''
    }

    function onFileDrop(e: DragEvent) {
        const file = e.dataTransfer?.files?.[0]
        if (file) {
            console.log('File droppato:', file.name)
            addFileAsFirstItem(file)
        }
    }

    /* ---------- Router ---------- */
    const router = useRouter()
    function goToDashboard() {
        router.push({ name: 'dashboard' })
    }
</script>

<style scoped>
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
