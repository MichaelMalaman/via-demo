
<template>
    <!-- Frame a tutta viewport -->
    <div class="app-frame d-flex justify-content-center align-items-center bg-primary px-5">
        <!-- Card centrale -->
        <div class="card app-card shadow">
            <!-- Tabs -->
            <div class="card-header p-0">
                <ul class="nav nav-tabs" role="tablist">
                    <li class="nav-item">
                        <button class="nav-link"
                                :class="{ active: tab === 'one' }"
                                type="button"
                                role="tab"
                                @click="tab = 'one'">
                            SPID
                        </button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link"
                                :class="{ active: tab === 'two' }"
                                type="button"
                                role="tab"
                                @click="tab = 'two'">
                            CIE
                        </button>
                    </li>
                </ul>
            </div>

            <!-- Finestra dei tab: occupa lo spazio verticale della card -->
            <div class="card-body tabs-window">
                <!-- TAB SPID -->
                <div v-show="tab === 'one'" class="h-100">
                    <div class="tab-scroll">
                        <div class="row g-0">
                            <div class="col">
                                <div class="p-2 m-2 border-0">
                                    <p>
                                        SPID, il Sistema Pubblico di Identità Digitale, è il sistema di accesso che consente di utilizzare,
                                        con un'identità digitale unica, i servizi online della Pubblica Amministrazione e dei privati accreditati.
                                        Se sei già in possesso di un'identità digitale, accedi con le credenziali del tuo gestore.
                                        Se non hai ancora un'identità digitale, richiedila ad uno dei gestori.
                                    </p>
                                </div>
                            </div>

                            <!-- Separatore a tutta larghezza (equivalente del v-responsive width="100%") -->
                            <div class="w-100"></div>

                            <div class="col">
                                <div class="p-2 m-2 border-0">
                                    <ul class="no-bullets">
                                        <li><a href="#">#Maggiori informazioni su SPID</a></li>
                                        <li><a href="#">#Non hai lo SPID?</a></li>
                                        <li><a href="#">#Serve aiuto?</a></li>
                                    </ul>
                                </div>
                            </div>

                            <div class="col">
                                <button class="btn btn-primary d-flex align-items-center p-0"
                                        style="height: 80px; width: 260px;"
                                        type="button">
                                    <!-- Parte sinistra: icona in cerchio -->
                                    <div class="d-flex align-items-center justify-content-center bg-white"
                                         style="width: 56px; height: 56px; border-radius: 50%;">
                                        <svg class="icon" style="width: 32px; height: 32px;">
                                            {{spritesUrl}}#it-user
                                        </svg>
                                    </div>
                                    <!-- Linea di separazione -->
                                    <div style="width: 1px; background-color: white; margin: 0 12px;"></div>

                                    <!-- Testo -->
                                    <span class="text-white fw-bold">Entra con SPID</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- TAB CIE -->
                <div v-show="tab === 'two'" class="h-100">
                    <div class="tab-scroll">
                        <!-- Titolo -->
                        <div class="row">
                            <div class="col-12 col-md-8">
                                <p class="h6 fw-bold mb-2">
                                    RICHIESTA D'ACCESSO CIE - LIVELLO 2
                                </p>
                            </div>
                        </div>

                        <!-- Sezione principale -->
                        <div class="row justify-content-center align-items-stretch g-2">
                            <!-- Card credenziali -->
                            <div class="col-12 col-md-6">
                                <h2 class="h6">Entra con le tue credenziali CIE</h2>

                                <form @submit.prevent="salvaUsername">
                                    <div class="mb-3">
                                        <label for="usernameInput" class="form-label">Numero CIE o Codice fiscale o Email</label>
                                        <input id="usernameInput"
                                               v-model="usernameInput"
                                               type="text"
                                               autocomplete="username"
                                               class="form-control" />
                                    </div>

                                    <div class="mb-3">
                                        <label for="passwordInput" class="form-label">Password</label>
                                        <input id="passwordInput"
                                               type="password"
                                               autocomplete="current-password"
                                               class="form-control" />
                                    </div>

                                    <p class="small mt-2">
                                        Hai dimenticato la password?
                                        <strong>Richiedine una nuova</strong>
                                    </p>

                                    <div class="row mt-4 g-2">
                                        <div class="col-6">
                                            <button type="button" class="btn btn-outline-secondary w-100">Annulla</button>
                                        </div>
                                        <div class="col-6">
                                            <button type="submit" class="btn btn-primary w-100">Procedi</button>
                                        </div>
                                    </div>

                                    <p class="small mt-4">
                                        Non hai ancora attivato le credenziali CIE?
                                        <strong>Attivale ora</strong>
                                    </p>
                                </form>
                            </div>

                            <!-- Card QR -->
                            <div class="col-12 col-md-6">
                                <span class="h6 d-block">Entra con App CieID</span>
                                <span class="d-flex flex-column justify-content-center align-items-center"></span>

                                <div class="d-flex justify-content-center my-4">
                                    qrUrl
                                </div>

                                <p>Apri l'App CieID ed inquadra il QR Code.</p>
                            </div>
                        </div>

                        <hr class="mt-5" />

                        <!-- Card lettura carta -->
                        <div class="row mt-4">
                            <div class="col-12">
                                <span class="h6 d-block">Entra con lettura carta</span>
                                <p class="mb-2">
                                    Puoi entrare con la lettura della Carta (livello 3) da smartphone NFC o PC con lettore smart card.
                                    <br /><br />
                                    <strong>Scopri di più</strong>
                                </p>
                                <button type="button" class="btn btn-primary w-100 mt-2">Entra con lettura carta</button>
                            </div>
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
                    <button type="button"
                            class="btn-close"
                            data-bs-dismiss="toast"
                            aria-label="Chiudi"
                            @click="snackbar.show = false"></button>
                </div>
                <div class="toast-body" :class="toastBodyClass">
                    {{ snackbar.message }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, watch } from 'vue'
    import { useStore } from 'vuex'
    import { useRouter } from 'vue-router'
    import spritesUrl from 'bootstrap-italia/dist/svg/sprites.svg?url'

    // Tipi bootstrap in window (per TS)
    declare global {
        interface Window { bootstrap: any }
    }

    const tab = ref<'one' | 'two'>('one')
    const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=0.11978395002270947'

    const router = useRouter()
    const store = useStore()
    const usernameInput = ref('')

    const snackbar = ref<{ show: boolean; message: string; color: string }>({
        show: false,
        message: '',
        color: 'error'
    })

    function showSnack(message: string, color: string = 'error') {
        snackbar.value = { show: true, message, color }
    }

    // Toast ref + sync con stato snackbar
    const toastRef = ref<HTMLElement | null>(null)

    watch(() => snackbar.value.show, (show) => {
        if (!toastRef.value || !window.bootstrap) return
        const toast = window.bootstrap.Toast.getOrCreateInstance(toastRef.value, { delay: 3000 })
        if (show) toast.show()
        else toast.hide()
    })

    // Mappa colore snackbar → classi toast
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

    const salvaUsername = () => {
        store.commit('setUsername', usernameInput.value)
        console.log('Username salvato:', store.state.username)
        router.push({ name: 'dashboard' })
    }
</script>

<style scoped>
    /* --- FRAME --- */
    /* blocca l'altezza/larghezza rispetto al dispositivo */
    .app-frame {
        height: 100vh;
        width: 100vw;
    }

    /* --- CARD --- */
    /* card centrale: dimensione deterministica + layout verticale */
    .app-card {
        max-width: 960px; /* card “desktop” centrata */
        width: 100%;
        height: 80vh; /* blocca l’altezza del contenuto */
        margin: 0 auto;
        display: flex;
        flex-direction: column;
    }

    /* la finestra dei tab deve riempire la card */
    .tabs-window {
        flex: 1 1 auto;
        min-height: 0; /* crucial per abilitare lo scroll del figlio */
    }

    /* contenuto dei tab scrollabile, non cambia l'altezza del frame */
    .tab-scroll {
        height: 100%;
        overflow: auto;
        padding: 16px;
    }

    /* utilità originali */
    .no-bullets {
        list-style: none;
        padding: 0;
    }
</style>
