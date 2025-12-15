<!-- src/components/PraticheView.vue -->
<template>
    <v-container class="fill-height d-flex flex-column align-center px-10">
        <!-- Barra azioni (griglia senza gap) -->
        <v-row class="w-100 align-center justify-space-between ga-0 mt-4 mb-4">
            <!-- Pulsante sinistro -->
            <v-col cols="auto" class="pa-0">
                <v-btn prepend-icon="mdi-arrow-left"
                       @click="goToHome"
                       variant="elevated"
                       color="white"
                       class="bg-white text-primary">
                    Indietro
                </v-btn>
            </v-col>

            <!-- Pulsante destro -->
            <v-col cols="auto" class="pa-0">
                <v-btn v-if="store.state.username === 'pippo'"
                       class="bg-white text-primary"
                       @click="creaNuovaPratica">
                    <v-icon start>mdi-plus</v-icon>
                    Crea nuova pratica
                </v-btn>
            </v-col>
        </v-row>

        <!-- Tabs sempre sopra la tabella -->
        <v-tabs v-model="tab" class="mb-4">
            <v-tab value="one">Pratiche in corso</v-tab>
            <v-tab value="two">Pratiche chiuse</v-tab>
        </v-tabs>

        <!-- Contenitore tabella -->
        <v-card class="w-100 pa-4" style="min-height: 600px;">
            <v-window v-model="tab">
                <!-- Tab: Pratiche in corso -->
                <v-window-item value="one">
                    <v-data-table :headers="headers"
                                  :items="currentItems"
                                  :items-per-page="10"
                                  hover>
                        <!-- Colonna: NOME PROGETTO -->
                        <template #item.nomeProgetto="{ item }">
                            <span v-if="getRaw(item).nomeProgetto !== 'IMPIANTO FOTOVOLTAICO'">
                                {{ getRaw(item).nomeProgetto }}
                            </span>
                            <v-btn v-else
                                   variant="text"
                                   color="primary"
                                   class="pa-0"
                                   @click="goToSingleProjectDocument(getRaw(item))">
                                {{ getRaw(item).nomeProgetto }}
                            </v-btn>
                        </template>

                        <!-- Colonna: AZIONI -->
                        <template #item.azioni="{ item }">
                            <v-btn icon color="error" @click="openDeleteDialog(getRaw(item))">
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                            <v-btn icon color="primary" @click="openEditDialog(getRaw(item))">
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                        </template>
                    </v-data-table>
                </v-window-item>

                <!-- Tab: Pratiche chiuse -->
                <v-window-item value="two">
                    <v-data-table :headers="headers"
                                  :items="items2"
                                  :items-per-page="10"
                                  hover>
                        <template #item.azioni="{ item }">
                            <v-btn icon color="error" @click="openDeleteDialog(item)">
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                            <v-btn icon color="primary" @click="openEditDialog(item)">
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                        </template>
                    </v-data-table>
                </v-window-item>
            </v-window>
        </v-card>

        <!-- Dialog elimina -->
        <v-dialog v-model="deleteDialog" max-width="480">
            <v-card>
                <v-card-title>Confermi l'eliminazione?</v-card-title>
                <v-card-text>
                    Stai per eliminare: <strong>{{ selectedItem?.nomeProgetto }}</strong>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="text" @click="closeDeleteDialog">Annulla</v-btn>
                    <v-btn color="error" @click="confirmDelete">Elimina</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Dialog modifica -->
        <v-dialog v-model="editDialog" max-width="640">
            <v-card>
                <v-card-title>Modifica pratica</v-card-title>
                <v-card-text>
                    <v-form>
                        <v-text-field v-model="editItemData.nomeProgetto" label="Nome progetto" />
                        <v-text-field v-model="editItemData.dataInizio" label="Data inizio" />
                        <v-text-field v-model="editItemData.ente" label="Ente" />
                        <v-text-field v-model="editItemData.scadenza" label="Scadenza" />
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="text" @click="closeEditDialog">Annulla</v-btn>
                    <v-btn color="primary" @click="confirmEdit">Salva</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Snackbar -->
        <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="2500">
            {{ snackbar.message }}
            <template #actions>
                <v-btn variant="text" @click="snackbar.show = false">Chiudi</v-btn>
            </template>
        </v-snackbar>
    </v-container>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue'
    import { useStore } from 'vuex'
    import { useRouter } from 'vue-router'

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

    const headers = [
        { title: 'NOME PROGETTO', key: 'nomeProgetto' },
        { title: 'DATA INIZIO', key: 'dataInizio' },
        { title: 'ENTE', key: 'ente' },
        { title: 'SCADENZA', key: 'scadenza' },
        { title: 'AZIONI', key: 'azioni', sortable: false },
    ]

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

    // Dialog & selezioni
    const deleteDialog = ref(false)
    const editDialog = ref(false)
    const selectedItem = ref<Item | null>(null)
    const editItemData = ref<Item>({
        id: 0,
        nomeProgetto: '',
        dataInizio: '',
        ente: '',
        scadenza: '',
    })

    // Snackbar
    const snackbar = ref<{ show: boolean; message: string; color: string }>({
        show: false,
        message: '',
        color: 'success',
    })

    function showSnack(message: string, color: string = 'success') {
        snackbar.value = { show: true, message, color }
    }

    // Helper per compatibilità slot v-data-table (spesso item.raw in Vuetify 3)
    function getRaw(row: any) {
        return row?.raw ?? row
    }

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
    }
    function closeDeleteDialog() {
        deleteDialog.value = false
        selectedItem.value = null
    }
    function confirmDelete() {
        if (!selectedItem.value) return
        const list = tab.value === 'one' ? items.value : items2.value
        const index = list.findIndex(i => i.id === selectedItem.value!.id)
        if (index !== -1) {
            list.splice(index, 1)
            showSnack('Pratica eliminata')
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
    }
    function closeEditDialog() {
        editDialog.value = false
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

    // Log username se presente
    if (store.state.username && store.state.username.trim() !== '') {
        console.log('Username presente nello store:', store.state.username)
    } else {
        console.warn('Nessun username salvato nello store')
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

    .v-tab {
        background: none !important;
    }

    /* Esempio: card/table min-height per tab */
    v-table {
        min-height: 800px;
    }
    </style>