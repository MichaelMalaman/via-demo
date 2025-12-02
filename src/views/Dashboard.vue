
<template>
    <v-container class="fill-height d-flex flex-column align-center w-75 pa-6">
        <!-- Sezione pulsanti sopra -->
        <v-row class="mb-4" justify="space-between">
            <v-col cols="6">
                <v-btn @click="goToHome">
                    <v-icon start>mdi-arrow-left</v-icon>
                    Indietro
                </v-btn>
            </v-col>

            <v-col cols="6">

                <v-btn v-if="store.state.username === 'pippo'"
                       class="bg-white text-primary"
                       style="width: 260px;"
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

        <!-- Contenitore tabella con altezza fissa -->
        <v-card class="w-100 pa-4" style="min-height: 600px;">
            <v-window v-model="tab">
                <v-window-item value="one">

                    <v-data-table :headers="headers"
                                  :items="currentItems"
                                  :items-per-page="10"
                                  hover>
                        <!-- Colonna: NOME PROGETTO -->
                        <template #item.nomeProgetto="{ item }">
                            <!-- Se usi Vuetify 3, spesso i dati reali sono in item.raw -->
                            <span v-if="getRaw(item).nomeProgetto !== 'IMPIANTO FOTOVOLTAICO'">
                                {{ getRaw(item).nomeProgetto }}
                            </span>

                            <!-- Cliccabile SOLO se è 'IMPIANTO FOTOVOLTAICO' -->
                            <v-btn v-else
                                   variant="text"
                                   color="primary"
                                   class="pa-0"
                                   @click="goToSingleProjectDocument(getRaw(item))">
                                {{ getRaw(item).nomeProgetto }}
                            </v-btn>
                        </template>

                        <!-- Colonna: AZIONI (esempio) -->
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

    //  RENDI REATTIVI GLI ARRAY
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

    // Lista corrente
    const currentItems = computed<Item[]>(() => (tab.value === 'one' ? items.value : items2.value))

    // Dialog & selezione
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

    // Crea nuova
    function creaNuovaPratica() {
        router.push({ name: 'formPratica' })

    }
    function goToSingleProjectDocument() {
        router.push({ name: 'singleProjectDocumentsView' })

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
            list[index] = { ...editItemData.value } // aggiorna la riga
            showSnack('Pratica aggiornata')
        } else {
            showSnack('Elemento non trovato', 'error')
        }
        closeEditDialog()
    }


    // Controllo se la variabile è presente
    if (store.state.username && store.state.username.trim() !== '') {
        console.log('Username presente nello store:', store.state.username)
    } else {
        console.warn('Nessun username salvato nello store')
    }

// Se Vuetify ti passa row come item.raw, questo helper normalizza
function getRaw(row: any) {
  return row?.raw ?? row
}

    function goToHome() {
        router.push({ name: 'Home' })

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

    .blur-overlay {
        backdrop-filter: blur(2px);
    }


    v-table {
        min-height: 800px; /* o la misura che corrisponde alla tab "Pratiche chiuse" */
    }
</style>
