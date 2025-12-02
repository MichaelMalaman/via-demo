
<template>
    <v-container class="fill-height d-flex justify-center align-center w-60">
        <v-row no-gutters class="align-center">
            <v-col>
                <!-- Tabs -->
                <v-tabs v-model="tab" color="white">
                    <v-tab value="one">Pratiche in corso</v-tab>
                    <v-tab value="two">Pratiche chiuse</v-tab>
                </v-tabs>
            </v-col>
            <v-col></v-col>
            <v-col>
                <v-btn color="#0066CC"
                       class="d-flex align-center pa-0 bg-white"
                       style="height: 50px; width: 260px;"
                       @click="creaNuovaPratica">
                    Crea nuova pratica
                </v-btn>
            </v-col>
        </v-row>

        <v-row no-gutters>
            <v-col>
                <!-- Tabella -->
                <div class="flex-grow-1 overflow-auto">
                    <v-data-table :headers="headers"
                                  :items="currentItems"
                                  class="striped-table"
                                  :items-per-page="10"
                                  hover>
                        <!-- Riga personalizzata -->
                        <template #item="{ item, index }">
                            <!-- Se con Vuetify 3 l’item reale è item.raw, usa item.raw.nomeProgetto ecc. -->
                            <tr :class="index % 2 === 0 ? 'bg-grey-lighten-4' : 'bg-white'">
                                <td>{{ item.nomeProgetto }}</td>
                                <td>{{ item.dataInizio }}</td>
                                <td>{{ item.ente }}</td>
                                <td>{{ item.scadenza }}</td>
                                <td>
                                    <v-btn icon color="error" @click="openDeleteDialog(item)" aria-label="Elimina">
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                    <v-btn icon color="primary" @click="openEditDialog(item)" aria-label="Modifica">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                </td>
                            </tr>
                        </template>
                    </v-data-table>
                </div>
            </v-col>
        </v-row>

        <!-- Dialog DELETE -->
        <v-dialog v-model="deleteDialog" max-width="480" scrim="transparent" class="blur-overlay" persistent>
            <v-card>
                <v-card-title class="text-h6">Conferma eliminazione</v-card-title>
                <v-card-text>
                    Sei sicuro di voler cancellare
                    <strong>{{ selectedItem?.nomeProgetto || 'l’elemento' }}</strong>?
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn variant="text" color="grey" @click="closeDeleteDialog">Annulla</v-btn>
                    <v-btn color="error" prepend-icon="mdi-delete" @click="confirmDelete">Conferma</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Dialog EDIT -->
        <v-dialog v-model="editDialog" max-width="560" scrim="transparent" class="blur-overlay" persistent>
            <v-card>
                <v-card-title class="text-h6">Modifica pratica</v-card-title>
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="editItemData.nomeProgetto" label="Nome Progetto" />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="editItemData.ente" label="Ente" />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="editItemData.dataInizio" label="Data Inizio" />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="editItemData.scadenza" label="Scadenza" />
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn variant="text" color="grey" @click="closeEditDialog">Annulla</v-btn>
                    <v-btn color="primary" prepend-icon="mdi-content-save" @click="confirmEdit">Salva</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Snackbar feedback -->
        <v-snackbar v-model="snackbar.show" :timeout="3000" :color="snackbar.color">
            {{ snackbar.message }}
            <template #actions>
                <v-btn variant="text" @click="snackbar.show = false">Chiudi</v-btn>
            </template>
        </v-snackbar>
    </v-container>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue'
    import { useStore } from 'vuex'  // ✅ aggiunto
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

    // ⚠️ RENDI REATTIVI GLI ARRAY
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
        const nuova: Item = {
            id: Date.now(),
            nomeProgetto: 'NUOVA PRATICA',
            dataInizio: new Date().toLocaleDateString('it-IT'),
            ente: 'ENTE',
            scadenza: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toLocaleDateString('it-IT'),
        }
            (tab.value === 'one' ? items.value : items2.value).unshift(nuova)
        showSnack('Pratica creata')
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
</style>
