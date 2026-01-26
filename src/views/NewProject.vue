
<template>
    <div class="container my-4">
        <!-- Barra azioni -->
        <div class="row align-items-center mt-4 mb-4">
            <!-- Pulsante sinistro -->
            <div class="col-6 d-flex justify-content-start">
                <button class="btn btn-back btn-outline-primary bg-white d-inline-flex align-items-center"
                        @click="goTo('dashboard')"
                        style="height: 50px;">
                    <svg class="icon"><use :href="`${spritesHref}#it-arrow-left`"></use></svg>
                    <span class="ms-2">Indietro</span>
                </button>
            </div>

            <!-- Pulsante destro -->
            <div class="col-6 d-flex justify-content-end">

            </div>
        </div>
        <!-- Header -->
        <div class="d-flex align-items-center justify-content-between mb-3">
            <h1 class="h4 mb-0">Nuovo progetto - Studio di Impatto Ambientale</h1>

            <!-- Breve stato sintetico -->
            <span class="badge rounded-pill"
                  :class="allRequiredPresent ? 'text-bg-success' : 'text-bg-warning text-dark'">
                {{ presentCount }}/{{ totalRequired }} documenti obbligatori
            </span>
        </div>

        <!-- Anagrafica progetto -->
        <div class="card mb-4">
            <div class="card-header d-flex align-items-center gap-2">
                <svg class="icon"><use :href="`${spritesHref}#it-folder`"></use></svg>
                <strong>Dati progetto</strong>
            </div>
            <div class="card-body">
                <form @submit.prevent="onSave">
                    <div class="row g-3">
                        <div class="col-12 col-md-6">
                            <label for="nomeProgetto" class="form-label">Nome progetto</label>
                            <input id="nomeProgetto" v-model.trim="project.nome" type="text" class="form-control"
                                   placeholder="Es. Impianto fotovoltaico in area dismessa" required />
                        </div>
                        <div class="col-12 col-md-3">
                            <label for="ente" class="form-label">Ente proponente</label>
                            <input id="ente" v-model.trim="project.ente" type="text" class="form-control"
                                   placeholder="Es. Comune di Milano" />
                        </div>
                        <div class="col-12 col-md-3">
                            <label for="dataAvvio" class="form-label">Data avvio (AAAA-MM-GG)</label>
                            <input id="dataAvvio" v-model="project.dataAvvio" type="date" class="form-control" />
                        </div>
                        <div class="col-12">
                            <label for="note" class="form-label">Note</label>
                            <textarea id="note" v-model.trim="project.note" rows="3" class="form-control"
                                      placeholder="Annotazioni sintetiche, riferimenti interni, ecc."></textarea>
                        </div>
                    </div>

                    <!-- Azioni di form -->
                    <div class="d-flex justify-content-end gap-2 mt-3">
                        <button type="button" class="btn btn-outline-secondary" @click="resetAll">Annulla</button>
                        <button type="submit" class="btn btn-primary">
                            <svg class="icon"><use :href="`${spritesHref}#it-upload`"></use></svg>
                            <span class="ms-1">Crea progetto</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Documenti obbligatori e tecnici -->
        <div class="card mb-4">
            <div class="card-header d-flex align-items-center gap-2">
                <svg class="icon"><use :href="`${spritesHref}#it-upload`"></use></svg>
                <strong>Documenti obbligatori e tecnici</strong>
            </div>
            <div class="card-body">
                <div class="row g-4">
                    <div v-for="doc in REQUIRED_DOCS" :key="doc.key" class="col-12 col-lg-6">
                        <div class="border rounded p-3 h-100">
                            <div class="d-flex align-items-start justify-content-between">
                                <div class="d-flex align-items-center gap-2">
                                    <svg class="icon"><use :href="`${spritesHref}#it-folder`"></use></svg>
                                    <strong>{{ doc.label }}</strong>
                                </div>
                                <span class="badge rounded-pill"
                                      :class="isPresent(doc.key) ? 'text-bg-success' : 'text-bg-danger'">
                                    {{ isPresent(doc.key) ? 'Presente' : 'Mancante' }}
                                </span>
                            </div>

                            <p class="mt-2 mb-3 small text-secondary" v-if="doc.help">{{ doc.help }}</p>

                            <!-- Uploader -->
                            <div class="d-flex align-items-center gap-2">
                                <input :id="`inp-${doc.key}`"
                                       type="file"
                                       class="form-control"
                                       :multiple="doc.multiple"
                                       :accept="doc.accept"
                                       @change="onFilesSelected($event, doc.key)" />
                                <button v-if="filesMap[doc.key]?.length"
                                        type="button"
                                        class="btn btn-outline-danger"
                                        @click="clearFiles(doc.key)">
                                    <svg class="icon"><use :href="`${spritesHref}#it-delete`"></use></svg>
                                    Pulisci
                                </button>
                            </div>

                            <!-- Lista file caricati -->
                            <ul class="mt-3 mb-0 list-unstyled" v-if="filesMap[doc.key]?.length">
                                <li v-for="(f, i) in filesMap[doc.key]" :key="f._id" class="d-flex align-items-center justify-content-between py-1">
                                    <span class="small">
                                        <svg class="icon"><use :href="`${spritesHref}#it-link`"></use></svg>
                                        {{ f.name }} <span class="text-secondary">({{ formatBytes(f.size) }})</span>
                                    </span>
                                    <button type="button" class="btn btn-sm btn-outline-secondary" @click="removeFile(doc.key, i)">
                                        Rimuovi
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Allegati e elaborati grafici -->
        <div class="card mb-4">
            <div class="card-header d-flex align-items-center gap-2">
                <svg class="icon"><use :href="`${spritesHref}#it-image`"></use></svg>
                <strong>Allegati ed elaborati grafici</strong>
            </div>
            <div class="card-body">
                <div class="row g-4">
                    <div v-for="doc in ATTACHMENTS" :key="doc.key" class="col-12 col-lg-6">
                        <div class="border rounded p-3 h-100">
                            <div class="d-flex align-items-start justify-content-between">
                                <div class="d-flex align-items-center gap-2">
                                    <svg class="icon"><use :href="`${spritesHref}#it-user`"></use></svg>
                                    <strong>{{ doc.label }}</strong>
                                </div>
                                <span class="badge rounded-pill"
                                      :class="isPresent(doc.key) ? 'text-bg-success' : 'text-bg-secondary'">
                                    {{ isPresent(doc.key) ? 'Presente' : 'Facoltativo' }}
                                </span>
                            </div>

                            <p class="mt-2 mb-3 small text-secondary" v-if="doc.help">{{ doc.help }}</p>

                            <!-- Uploader -->
                            <div class="d-flex align-items-center gap-2">
                                <input :id="`inp-${doc.key}`"
                                       type="file"
                                       class="form-control"
                                       :multiple="true"
                                       :accept="doc.accept"
                                       @change="onFilesSelected($event, doc.key)" />
                                <button v-if="filesMap[doc.key]?.length"
                                        type="button"
                                        class="btn btn-outline-danger"
                                        @click="clearFiles(doc.key)">
                                    <svg class="icon"><use :href="`${spritesHref}#it-user`"></use></svg>
                                    Pulisci
                                </button>
                            </div>

                            <!-- Lista file caricati -->
                            <ul class="mt-3 mb-0 list-unstyled" v-if="filesMap[doc.key]?.length">
                                <li v-for="(f, i) in filesMap[doc.key]" :key="f._id" class="d-flex align-items-center justify-content-between py-1">
                                    <span class="small">
                                        <svg class="icon"><use :href="`${spritesHref}#it-link`"></use></svg>
                                        {{ f.name }} <span class="text-secondary">({{ formatBytes(f.size) }})</span>
                                    </span>
                                    <button type="button" class="btn btn-sm btn-outline-secondary" @click="removeFile(doc.key, i)">
                                        Rimuovi
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Azioni finali -->
        <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-link" @click="resetAll">Reset tutto</button>
            <button type="button" class="btn btn-primary" @click="onSave">
                <svg class="icon"><use :href="`${spritesHref}#it-upload`"></use></svg>
                <span class="ms-1">Salva progetto e documenti</span>
            </button>
        </div>

        <!-- Toast di conferma -->
        <div class="toast position-fixed bottom-0 end-0 m-3"
             role="alert" aria-live="assertive" aria-atomic="true" ref="toastRef">
            <div class="toast-header bg-success text-white">
                <strong class="me-auto">Salvataggio</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Chiudi"></button>
            </div>
            <div class="toast-body">
                Progetto creato e documenti salvati.
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, reactive, computed, onMounted } from 'vue'
    import { useStore } from 'vuex'
    import { useRouter } from 'vue-router'
    import spritesUrl from 'bootstrap-italia/dist/svg/sprites.svg?url'
    const spritesHref = spritesUrl
    const store = useStore()
    const router = useRouter()

    /** ---------------------------
     *  Costanti: chiavi documenti
     *  --------------------------- */
    type DocKey =
        | 'relazioneTecnica'
        | 'quadroNormativo'
        | 'analisiAmbientale'
        | 'analisiImpatti'
        | 'mitigazioniCompensazioni'
        | 'sintesiNonTecnica'
        | 'cartografieGIS'
        | 'planimetrieSezioni'
        | 'fotoinserimentiRendering'
        | 'tabelleCalcoli'
        | 'relazioniSpecialistiche'

    type DocDef = {
        key: DocKey
        label: string
        help?: string
        multiple?: boolean
        accept?: string
    }

    const REQUIRED_DOCS: DocDef[] = [
        {
            key: 'relazioneTecnica', label: 'Relazione tecnica principale',
            help: 'Descrizione del progetto: caratteristiche, fasi, tecnologie, alternative.'
        },
        {
            key: 'quadroNormativo', label: 'Quadro normativo e pianificazione',
            help: 'Conformità a D.Lgs. 152/2006, Dir. 2014/52/UE; PAI, PPTR e vincoli.'
        },
        {
            key: 'analisiAmbientale', label: 'Analisi ambientale',
            help: 'Suolo, aria, acqua, flora, fauna, paesaggio; vincoli / Natura 2000.'
        },
        {
            key: 'analisiImpatti', label: 'Analisi degli impatti',
            help: 'Impatti diretti/indiretti/cumulativi; per fase; indicatori/metodi.'
        },
        {
            key: 'mitigazioniCompensazioni', label: 'Misure di mitigazione e compensazione',
            help: 'Strategie su aria/acqua/suolo/biodiversità; piano di monitoraggio.'
        },
        {
            key: 'sintesiNonTecnica', label: 'Sintesi non tecnica',
            help: 'Documento comprensibile per il pubblico e gli stakeholder.'
        },
    ]

    const ATTACHMENTS: DocDef[] = [
        {
            key: 'cartografieGIS', label: 'Cartografie e mappe GIS',
            help: 'Localizzazione, vincoli paesaggistici, corridoi ecologici.',
            multiple: true, accept: '.pdf,image/*,.kmz,.kml'
        },
        {
            key: 'planimetrieSezioni', label: 'Planimetrie e sezioni',
            help: 'Layout impianto, opere accessorie.',
            multiple: true, accept: '.pdf,image/*'
        },
        {
            key: 'fotoinserimentiRendering', label: 'Fotoinserimenti e rendering',
            help: 'Impatto visivo sul paesaggio.',
            multiple: true, accept: 'image/*,.pdf'
        },
        {
            key: 'tabelleCalcoli', label: 'Tabelle e calcoli',
            help: 'Stime emissioni/rumore/riduzioni; rischio idrogeologico.',
            multiple: true, accept: '.pdf,.xls,.xlsx,.csv'
        },
        {
            key: 'relazioniSpecialistiche', label: 'Relazioni specialistiche',
            help: 'Fauna/flora; idrologia/geologia; VINCA se necessario.',
            multiple: true, accept: '.pdf'
        },
    ]

    /** ---------------------------
     *  Stato: progetto + file
     *  --------------------------- */
    type Project = { nome: string; ente: string; dataAvvio: string; note: string }
    const project = reactive<Project>({ nome: '', ente: '', dataAvvio: '', note: '' })

    // Mappa di liste file per ciascun DocKey
    type FileEntry = File & { _id: string }           // _id per key stabile nel v-for
    const filesMap = reactive<Record<DocKey, FileEntry[]>>({
        relazioneTecnica: [], quadroNormativo: [], analisiAmbientale: [],
        analisiImpatti: [], mitigazioniCompensazioni: [], sintesiNonTecnica: [],
        cartografieGIS: [], planimetrieSezioni: [], fotoinserimentiRendering: [],
        tabelleCalcoli: [], relazioniSpecialistiche: [],
    })

    /** ---------------------------
     *  Helpers
     *  --------------------------- */
    function uid() { return Math.random().toString(36).slice(2) }
    function formatBytes(bytes: number) {
        if (!bytes) return '0 B'
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
        const i = Math.floor(Math.log(bytes) / Math.log(1024))
        const v = bytes / Math.pow(1024, i)
        return `${v < 10 ? v.toFixed(1) : Math.round(v)} ${sizes[i]}`
    }
    function isPresent(key: DocKey) { return (filesMap[key]?.length ?? 0) > 0 }

    /** ---------------------------
     *  Statistiche documenti
     *  --------------------------- */
    const presentCount = computed(() => REQUIRED_DOCS.reduce((acc, d) => acc + (isPresent(d.key) ? 1 : 0), 0))
    const totalRequired = REQUIRED_DOCS.length
    const allRequiredPresent = computed(() => presentCount.value === totalRequired)

    /** ---------------------------
     *  Eventi uploader
     *  --------------------------- */
    function onFilesSelected(evt: Event, key: DocKey) {
        const input = evt.target as HTMLInputElement
        const list = input.files
        if (!list || list.length === 0) return
        const entries: FileEntry[] = Array.from(list).map(f => Object.assign(f, { _id: uid() }))
        // se il doc non è multiplo, conserva solo il primo
        const def = [...REQUIRED_DOCS, ...ATTACHMENTS].find(d => d.key === key)
        if (def?.multiple) {
            filesMap[key].push(...entries)
        } else {
            filesMap[key] = [entries[0]]
        }
        input.value = '' // reset per poter ricaricare lo stesso file
    }
    function removeFile(key: DocKey, index: number) {
        filesMap[key].splice(index, 1)
    }
    function clearFiles(key: DocKey) {
        filesMap[key] = []
    }

    /** ---------------------------
     *  Salvataggio (store + feedback)
     *  --------------------------- */
    const toastRef = ref<HTMLElement | null>(null)
    function showSavedToast() {
        if (!toastRef.value) return
        // se usi bootstrap bundle globale, puoi leggere window.bootstrap.Toast
        // oppure importare { Toast } da 'bootstrap' e istanziare qui
        // @ts-ignore
        const t = window.bootstrap?.Toast?.getOrCreateInstance(toastRef.value, { delay: 2500 })
        t?.show?.()
    }

    // Esempio di salvataggio: crea progetto e associa documenti
    async function onSave() {
        // semplice validazione
        if (!project.nome.trim()) { alert('Inserisci il nome progetto'); return }
        // commit/dispatch: adatta al tuo store
        try {
            store.commit('createProject', {
                id: Date.now(),
                ...project,
                // NB: serializzare i file veri richiede upload lato server.
                // Qui salviamo solo metadati (nome/size/type), come placeholder.
                documents: Object.fromEntries(
                    Object.entries(filesMap).map(([k, arr]) => [
                        k, arr.map(f => ({ name: f.name, size: f.size, type: f.type }))
                    ])
                ),
                createdAt: new Date().toISOString(),
            })
            showSavedToast()
            // router.push({ name: 'dashboard' }) // se vuoi tornare alla lista
        } catch (e) {
            console.error('Errore salvataggio', e)
            alert('Errore durante il salvataggio')
        }
    }

    function resetAll() {
        project.nome = ''; project.ente = ''; project.dataAvvio = ''; project.note = ''
        Object.keys(filesMap).forEach(k => (filesMap[k as DocKey] = []))
    }

    /** Bootstrap Italia JS opzionale per Toast (se non caricato globalmente) */
    onMounted(async () => {
        // se non hai già importato il bundle BI globalmente:
        // await import('bootstrap-italia/dist/js/bootstrap-italia.bundle.min.js')
    })
    function goTo(path: string) {
        router.push(path)
    }
</script>

<style scoped>
    /* Piccole utilità di visualizzazione */
    .card-header .icon {
        width: 1rem;
        height: 1rem;
    }

    .border.rounded {
        background-color: #fff;
    }
</style>
