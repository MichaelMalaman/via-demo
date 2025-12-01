
<template>
    <v-container class="fill-height d-flex justify-center align-center bg-primary">
        <v-card class="pa-0 w-70 h-70">
            <v-sheet elevation="4">
                <v-container class="py-8">
                    <!-- Titolo -->
                    <v-row>
                        <v-col cols="12" md="8">
                            <p class="text-subtitle-2 font-weight-bold">
                                RICHIESTA D'ACCESSO SPID - LIVELLO 2
                            </p>
                        </v-col>
                    </v-row>

                    <!-- Sezione principale -->
                    <v-row class="justify-center align-stretch" dense>
                        <!-- Card credenziali -->
                        <v-col cols="6" md="6">
                            <v-card class="d-flex flex-column" style="height: 100%">
                                <v-card-title class="text-h6">
                                    Entra con le tue credenziali SPID
                                </v-card-title>
                                <v-card-text>
                                    <v-form @submit.prevent="onSubmit">
                                        <v-text-field label="Email"
                                                      autocomplete="username"
                                                      v-model="emailLocal"
                                                      type="email"
                                                      :rules="[rules.required, rules.email]" />
                                        <v-text-field label="Password"
                                                      type="password"
                                                      autocomplete="current-password"
                                                      v-model="passwordLocal"
                                                      :rules="[rules.required, rules.min6]" />

                                        <p class="text-body-2 mt-2">
                                            Hai dimenticato la password?
                                            <strong>#Richiedine una nuova</strong>
                                        </p>

                                        <v-row class="mt-4" dense>
                                            <v-col cols="6">
                                                <v-btn variant="outlined" block @click="onCancel">
                                                    Annulla
                                                </v-btn>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-btn color="primary" block type="submit">
                                                    Procedi
                                                </v-btn>
                                            </v-col>
                                        </v-row>

                                        <p class="text-body-2 mt-4">
                                            Non hai ancora attivato le credenziali SPID?
                                            <strong>#Attivale ora</strong>
                                        </p>
                                    </v-form>

                                    <ul class="no-bullets">
                                        <li><a href="#">#Maggiori informazioni su SPID</a></li>
                                        <li><a href="#">#Non hai lo SPID?</a></li>
                                        <li><a href="#">#Serve aiuto?</a></li>
                                    </ul>
                                </v-card-text>
                            </v-card>
                        </v-col>

                        <!-- Card QR -->
                        <v-col cols="6" md="6">
                            <v-card class="d-flex flex-column" style="height: 100%">
                                <v-card-title class="text-h6">Entra con App posteID</v-card-title>
                                <v-card-text class="d-flex flex-column justify-center align-center">
                                    <p>Apri l'App posteID ed inquadra il QR Code.</p>
                                    <div class="text-center my-6">
                                
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
            </v-sheet>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue'
    import { useStore } from 'vuex'

    // store
    const store = useStore()

    // campi locali (per evitare di scrivere nello store ad ogni battuta)
    const emailLocal = ref<string>(store.getters.email || '')
    const passwordLocal = ref<string>('')

    // regole base di validazione
    const rules = {
        required: (v: string) => !!v || 'Campo obbligatorio',
        email: (v: string) => /.+@.+\..+/.test(v) || 'Email non valida',
        min6: (v: string) => (v?.length ?? 0) >= 6 || 'Minimo 6 caratteri'
    }

    // QR demo
    const qrUrl = ref(`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${Math.random()}`)

    // azioni
    function onCancel() {
        emailLocal.value = store.getters.email || ''
        passwordLocal.value = ''
    }

    async function onSubmit() {
        // salva nello store
        store.dispatch('updateEmail', emailLocal.value)
        store.dispatch('updatePassword', passwordLocal.value)

        // esempio: chiama login e poi pulisci password
        await store.dispatch('doLogin')
        passwordLocal.value = '' // pulizia anche lato UI
    }
</script>

<style scoped>
    .w-70 {
        width: 70%;
    }

    .h-70 {
        min-height: 70%;
    }

    .no-bullets {
        list-style-type: none;
        padding-left: 0;
    }
</style>
