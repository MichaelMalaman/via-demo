
<template>
    <v-container class="fill-height d-flex justify-center align-center w-60">


        <v-row no-gutters class=" align-center">
            <v-col>

                <!-- Tabs -->
                <v-tabs v-model="tab" color="white">
                    <v-tab value="one">Pratiche in corso</v-tab>
                    <v-tab value="two">Pratiche chiuse</v-tab>
                </v-tabs>
            </v-col>
            <v-col>
            </v-col>


            <v-col>

                <v-btn color="#0066CC"
                       class="d-flex align-center pa-0 bg-white"
                       style="height: 50px; width: 260px;">

                    Crea unuova pratica
                </v-btn>
            </v-col>
        </v-row>
        <v-row no-gutters>
            <v-col>
                <!-- Tabella con scroll interno -->
                <div class="flex-grow-1 overflow-auto">
                    <v-data-table :headers="headers"
                                  :items="currentItems"
                                  class="striped-table"
                                  :items-per-page="10"
                                  hover>
                        <template #item="{ item, index }">
                            <tr :class="index % 2 === 0 ? 'bg-grey-lighten-4' : 'bg-white'">
                                <td>{{ item.nomeProgetto }}</td>
                                <td>{{ item.dataInizio }}</td>
                                <td>{{ item.ente }}</td>
                                <td>{{ item.scadenza }}</td>
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
                </div>
</v-col>
            </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const tab = ref<'one' | 'two'>('one')

const headers = [
  { title: 'NOME PROGETTO', key: 'nomeProgetto' },
  { title: 'DATA INIZIO', key: 'dataInizio' },
  { title: 'ENTE', key: 'ente' },
  { title: 'SCADENZA', key: 'scadenza' },
  { title: 'AZIONI', key: 'azioni', sortable: false },
]

const items = [
  { nomeProgetto: 'IMPIANTO FOTOVOLTAICO', dataInizio: '12/03/2022', ente: 'REGIONE LOMBARDIA', scadenza: '12/04/2022', azioni: '' },
  { nomeProgetto: 'IMPIANTO EOLICO', dataInizio: '12/03/2022', ente: 'REGIONE LOMBARDIA', scadenza: '12/04/2022', azioni: '' },
  { nomeProgetto: 'IMPIANTO BIOESEL', dataInizio: '12/03/2022', ente: 'REGIONE LOMBARDIA', scadenza: '12/04/2022', azioni: '' },
  { nomeProgetto: 'NUOVO STADIO', dataInizio: '12/03/2022', ente: 'REGIONE LOMBARDIA', scadenza: '12/04/2022', azioni: '' },
  { nomeProgetto: 'PARCO GARIBALDI', dataInizio: '12/03/2022', ente: 'REGIONE LOMBARDIA', scadenza: '12/04/2022', azioni: '' },
  { nomeProgetto: 'NUOVO PARCHEGGIO', dataInizio: '12/03/2022', ente: 'REGIONE LOMBARDIA', scadenza: '12/04/2022', azioni: '' },
  { nomeProgetto: 'PARCO MONTALE', dataInizio: '12/03/2022', ente: 'REGIONE LOMBARDIA', scadenza: '12/04/2022', azioni: '' },
  { nomeProgetto: 'NUOVA ARENA', dataInizio: '12/03/2022', ente: 'REGIONE LOMBARDIA', scadenza: '12/04/2022', azioni: '' }
]

const items2 = [
  { nomeProgetto: 'IMPIANTO GEOTERMICO', dataInizio: '05/02/2023', ente: 'REGIONE PIEMONTE', scadenza: '15/05/2023', azioni: '' },
  { nomeProgetto: 'BONIFICA AREA INDUSTRIALE', dataInizio: '18/07/2022', ente: 'REGIONE VENETO', scadenza: '30/09/2022', azioni: '' },
  { nomeProgetto: 'NUOVO PARCO URBANO', dataInizio: '10/01/2024', ente: 'COMUNE DI MILANO', scadenza: '20/03/2024', azioni: '' },
  { nomeProgetto: 'IMPIANTO IDROELETTRICO', dataInizio: '22/11/2023', ente: 'REGIONE TRENTINO-ALTO ADIGE', scadenza: '15/02/2024', azioni: '' },
  { nomeProgetto: 'RECUPERO DISCARICA', dataInizio: '03/06/2023', ente: 'REGIONE EMILIA-ROMAGNA', scadenza: '10/08/2023', azioni: '' },
  { nomeProgetto: 'NUOVA CICLABILE', dataInizio: '12/09/2022', ente: 'COMUNE DI TORINO', scadenza: '25/11/2022', azioni: '' },
  { nomeProgetto: 'IMPIANTO BIOMASSA', dataInizio: '08/04/2023', ente: 'REGIONE LOMBARDIA', scadenza: '18/06/2023', azioni: '' },
  { nomeProgetto: 'RIQUALIFICAZIONE LAGUNA', dataInizio: '20/08/2023', ente: 'REGIONE VENETO', scadenza: '05/10/2023', azioni: '' },
  { nomeProgetto: 'NUOVO CENTRO SPORTIVO', dataInizio: '15/03/2024', ente: 'COMUNE DI FIRENZE', scadenza: '30/05/2024', azioni: '' },
  { nomeProgetto: 'IMPIANTO SOLARE TERMICO', dataInizio: '01/07/2023', ente: 'REGIONE SICILIA', scadenza: '15/09/2023', azioni: '' }
]

const currentItems = computed(() => tab.value === 'one' ? items : items2)
</script>

<style scoped>
    .striped-table tbody tr:nth-child(odd) {
        background-color: #f9f9f9; /* grigio chiaro */
    }

    .striped-table tbody tr:nth-child(even) {
        background-color: #ffffff; /* bianco */
    }

    /* Mantieni larghezza stabile */
    .striped-table table {
        table-layout: fixed;
        width: 100%;
    }


    .v-tab {
        background: none !important;
    }

</style>
