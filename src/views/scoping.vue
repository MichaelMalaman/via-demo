
<template>
    <div class="container-fluid p-4" style="background-color:#e3f2fd;">

        <!-- Barra azioni -->
        <div class="row align-items-center mt-4 mb-4">
            <div class="col-6 d-flex justify-content-start">
                <button class="btn btn-outline-primary bg-white d-inline-flex align-items-center"
                        @click="goTo('/dashboard')"
                        style="height:50px;">
                    <svg class="icon">`${spritesHref}#it-arrow-left`</svg>
                    <span class="ms-2">Indietro</span>
                </button>
            </div>
            <div class="col-6 d-flex justify-content-end"></div>
        </div>

        <div class="row">
            <!-- LEFT COLUMN -->
            <div class="col-12 col-lg-8 p-4">

                <div class="card border p-4">
                    <!-- Contenuto su fondo grigio -->
                    <div class="p-4" style="background-color:#f5f5f5;">

                        <!-- HEADER -->
                        <div class="row">
                            <div class="col-12">
                                <div class="card p-4 text-white" style="background-color:#1565c0;">
                                    <div class="d-flex align-items-center justify-content-between">
                                        <h2 class="mb-2">Scoping – Aggregazione Pareri Enti</h2>

                                        <span class="explain-pack">
                                            spritesHref
                                            spritesHref
                                        </span>
                                    </div>

                                    <p class="mb-1"><strong>Progetto:</strong> Impianto fotovoltaico – Fase Scoping</p>
                                    <p class="mb-0"><strong>Data:</strong> {{ today }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- WIZARD -->
                        <div class="card p-4 mt-4">

                            <!-- Stepper -->
                            <ul class="nav nav-pills flex-wrap gap-2 mb-3" role="tablist">
                                <li v-for="(s, idx) in steps" :key="idx" class="nav-item">
                                    <button class="nav-link d-inline-flex align-items-center gap-2"
                                            :class="{ active: currentStep === idx }"
                                            @click="goToStep(idx)">
                                        <span class="badge rounded-pill" :class="badgeClass(idx)">
                                            <template v-if="completed[idx]">
                                                <svg class="icon">`${spritesHref}#it-check-circle`</svg>
                                            </template>
                                            <template v-else>
                                                {{ idx + 1 }}
                                            </template>
                                        </span>
                                        {{ s.label }}
                                    </button>
                                </li>
                            </ul>

                            <!-- STEP CONTENT -->
                            <!-- STEP 1: Raccolta Pareri -->
                            <div v-if="currentStep === 0">

                                <h3 class="mb-2">1. Raccolta Pareri dagli Enti</h3>
                                <p class="text-muted">Compila il form e aggiungi i pareri ricevuti.</p>

                                <div class="card p-3 mb-3">
                                    <div class="row g-3">
                                        <div class="col-12 col-md-6">
                                            <label class="form-label fw-semibold">Ente</label>
                                            <input class="form-control" v-model="formEnte" placeholder="ARPA, Comune, Soprintendenza…" />
                                        </div>

                                        <div class="col-12 col-md-6">
                                            <label class="form-label fw-semibold">Tema principale</label>
                                            <select class="form-select" v-model="formTema">
                                                <option disabled value="">— Seleziona —</option>
                                                <option>Aria</option>
                                                <option>Acqua</option>
                                                <option>Suolo</option>
                                                <option>Rumore</option>
                                                <option>Paesaggio</option>
                                                <option>Fauna</option>
                                                <option>Traffico</option>
                                            </select>
                                        </div>

                                        <div class="col-12">
                                            <label class="form-label fw-semibold">Testo del parere</label>
                                            <textarea class="form-control" rows="3" v-model="formTesto"
                                                      placeholder="Inserisci il parere sintetico dell’ente…"></textarea>
                                        </div>

                                        <div class="col-12 d-flex justify-content-end">
                                            <button class="btn btn-primary" @click="addParere" :disabled="!formEnte || !formTema || !formTesto">
                                                Aggiungi parere
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <h5 class="mb-2">Pareri raccolti</h5>

                                <div v-if="pareri.length === 0" class="text-muted small">
                                    Nessun parere inserito.
                                </div>

                                <div v-for="p in pareri" :key="p.id" class="card p-3 mb-2 shadow-sm">
                                    <div class="d-flex justify-content-between">
                                        <strong>{{ p.ente }}</strong>
                                        <span class="badge bg-primary">{{ p.tema }}</span>
                                    </div>
                                    <p class="small mt-2 mb-0">{{ p.testo }}</p>
                                </div>

                            </div>

                            <!-- STEP 2: Topic Extraction -->
                            <div v-else-if="currentStep === 1">

                                <h3 class="mb-2">2. Analisi AI – Topic Extraction</h3>
                                <p class="text-muted">
                                    L’AI identifica automaticamente i temi ricorrenti nei pareri raccolti.
                                </p>

                                <div class="alert alert-info d-flex gap-2 align-items-center">
                                    <svg class="icon">`${spritesHref}#it-info-circle`</svg>
                                    <strong>{{ topics.length }} temi rilevati</strong>
                                </div>

                                <div class="row">
                                    <div class="col-6" v-for="t in topics" :key="t.nome">
                                        <div class="card p-3 mb-3 border">
                                            <h6 class="mb-1">{{ t.nome }}</h6>
                                            <p class="small mb-1 text-muted">Ricorrenza: {{ t.percentuale }}%</p>

                                            <div class="progress">
                                                <div class="progress-bar"
                                                     :style="{ width: t.percentuale + '%' }"
                                                     :class="topicClass(t.percentuale)">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <!-- STEP 3: Divergenze / Convergenze -->
                            <div v-else-if="currentStep === 2">

                                <h3 class="mb-2">3. Divergenze e Convergenze tra Enti</h3>
                                <p class="text-muted">L’AI evidenzia accordi e disallineamenti tematici.</p>

                                <div class="alert alert-warning d-flex gap-2 align-items-center">
                                    <svg class="icon">`${spritesHref}#it-warning`</svg>
                                    <strong>{{ divergenze.length }} divergenze rilevate</strong>
                                </div>

                                <h5>Convergenze</h5>
                                <ul>
                                    <li v-for="c in convergenze" :key="c" class="small">
                                        {{ c }}
                                    </li>
                                </ul>

                                <h5 class="mt-3">Divergenze</h5>
                                <div v-for="d in divergenze" :key="d.id" class="card p-3 mb-2">
                                    <strong>{{ d.tema }}</strong>
                                    <p class="small text-muted mb-1">Enti coinvolti: {{ d.enti }}</p>
                                    <p class="small mb-0"><em>{{ d.note }}</em></p>
                                </div>

                            </div>

                            <!-- STEP 4: Dashboard -->
                            <div v-else-if="currentStep === 3">
                                <h3 class="mb-3">4. Dashboard Tematizzata dei Pareri</h3>

                                <div class="row g-3">
                                    <div class="col-6 col-md-4" v-for="p in dashboard" :key="p.tema">
                                        <div class="card p-3 text-center shadow-sm">
                                            <h6>{{ p.tema }}</h6>
                                            <p class="display-6 fw-bold mb-0">{{ p.count }}</p>
                                            <p class="small text-muted">pareri</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- STEP 5: Bozza SIA -->
                            <div v-else-if="currentStep === 4">
                                <h3 class="mb-2">5. Generazione Bozza SIA (Studio Impatto Ambientale)</h3>
                                <p class="text-muted">
                                    Genera uno scheletro di SIA a partire dai pareri e dai temi rilevati. Puoi modificarlo prima della validazione finale.
                                </p>

                                <!-- Avvisi di validazione -->
                                <div v-if="siaValidationWarnings.length" class="alert alert-warning d-flex align-items-start gap-2">
                                    <svg class="icon">`${spritesHref}#it-warning-circle`</svg>
                                    <div>
                                        <strong>Attenzione:</strong>
                                        <ul class="mb-0">
                                            <li v-for="w in siaValidationWarnings" :key="w">{{ w }}</li>
                                        </ul>
                                    </div>
                                </div>

                                <div class="d-flex gap-2 mb-3">
                                    <button class="btn btn-primary" @click="generateSIA" :disabled="pareri.length === 0">
                                        <svg class="icon">`${spritesHref}#it-magic`</svg>
                                        <span class="ms-2">Genera bozza SIA</span>
                                    </button>
                                    <button class="btn btn-outline-secondary" @click="clearSIA" :disabled="!sia.boilerplateReady">
                                        Pulisci bozza
                                    </button>
                                </div>

                                <div class="card p-3 mb-3">
                                    <div class="row g-3">
                                        <div class="col-12 col-md-6">
                                            <label class="form-label fw-semibold">Titolo SIA</label>
                                            <input class="form-control" v-model="sia.titolo" placeholder="Esempio: SIA — Impianto fotovoltaico — Scoping" />
                                        </div>
                                        <div class="col-12 col-md-6">
                                            <label class="form-label fw-semibold">Proponente / Progetto</label>
                                            <input class="form-control" v-model="sia.progetto" placeholder="Esempio: Progetto preliminare impianto FV — Località XYZ" />
                                        </div>

                                        <div class="col-12">
                                            <label class="form-label fw-semibold">Descrizione dell’intervento</label>
                                            <textarea class="form-control" rows="3" v-model="sia.descrizione"
                                                      placeholder="Descrizione sintetica dell’intervento, fasi e area di localizzazione…"></textarea>
                                        </div>

                                        <div class="col-12">
                                            <label class="form-label fw-semibold">Quadro normativo di riferimento</label>
                                            <textarea class="form-control" rows="3" v-model="sia.quadroNormativo"
                                                      placeholder="Riferimenti normativi (es. D.Lgs. 152/2006 e s.m.i., norme regionali, linee guida ISPRA…)"></textarea>
                                        </div>

                                        <div class="col-12">
                                            <label class="form-label fw-semibold">Metodologia generale di analisi (suggerita)</label>
                                            <textarea class="form-control" rows="3" v-model="sia.metodologiaGenerale"
                                                      placeholder="Approccio metodologico generale suggerito in base ai temi…"></textarea>
                                        </div>
                                    </div>
                                </div>

                                <h5 class="mb-2">Analisi per tema (auto-compilata e modificabile)</h5>
                                <div v-if="sia.analisiTemi.length === 0" class="text-muted small mb-2">
                                    Nessun tema da analizzare. Genera la bozza oppure torna ai passi precedenti.
                                </div>

                                <div v-for="(a, i) in sia.analisiTemi" :key="a.tema" class="card p-3 mb-2 border">
                                    <div class="d-flex align-items-center justify-content-between">
                                        <strong class="me-2">{{ a.tema }}</strong>
                                        <span class="badge" :class="i % 2 === 0 ? 'bg-primary' : 'bg-secondary'">Tema</span>
                                    </div>
                                    <label class="form-label mt-2 small fw-semibold">Metodologie suggerite</label>
                                    <textarea class="form-control" rows="2" v-model="a.metodologie"></textarea>

                                    <label class="form-label mt-2 small fw-semibold">Sintesi analitica</label>
                                    <textarea class="form-control" rows="3" v-model="a.sintesi"></textarea>

                                    <label class="form-label mt-2 small fw-semibold">Misure di mitigazione</label>
                                    <textarea class="form-control" rows="2" v-model="a.mitigazioni"></textarea>
                                </div>

                                <div class="card p-3 mt-3">
                                    <div class="row g-3">
                                        <div class="col-12">
                                            <label class="form-label fw-semibold">Monitoraggio e reporting</label>
                                            <textarea class="form-control" rows="3" v-model="sia.monitoraggio"
                                                      placeholder="Piani di monitoraggio pre/durante/post operam, indicatori e frequenze…"></textarea>
                                        </div>
                                        <div class="col-12">
                                            <label class="form-label fw-semibold">Conclusioni e risultati attesi</label>
                                            <textarea class="form-control" rows="3" v-model="sia.conclusioni"
                                                      placeholder="Sintesi delle evidenze emerse, compatibilità attesa, condizioni e prescrizioni…"></textarea>
                                        </div>
                                    </div>

                                    <div class="form-check mt-3">
                                        <input class="form-check-input" type="checkbox" id="chkValidazione" v-model="sia.validato">
                                        <label class="form-check-label" for="chkValidazione">
                                            Ho completato la revisione della bozza SIA (validazione interna)
                                        </label>
                                    </div>

                                    <div class="mt-3 d-flex gap-2">
                                        <button class="btn btn-success" :disabled="!isSIAValid" @click="markSIAReady">
                                            <svg class="icon">`${spritesHref}#it-check-circle`</svg>
                                            <span class="ms-2">Contrassegna come pronto</span>
                                        </button>
                                        <span v-if="sia.boilerplateReady" class="badge bg-success align-self-center">Bozza SIA pronta</span>
                                    </div>
                                </div>
                            </div>

                            <!-- STEP 6: SNT -->
                            <div v-else-if="currentStep === 5">
                                <h3 class="mb-2">6. Generazione automatica SNT (Sintesi Non Tecnica)</h3>
                                <p class="text-muted">
                                    Riassunto divulgativo del SIA generato automaticamente. Puoi regolare lingua, tono e lunghezza.
                                </p>

                                <div class="alert" :class="sia.boilerplateReady ? 'alert-success' : 'alert-info'">
                                    <svg class="icon">`${spritesHref}#it-info-circle`</svg>
                                    <strong class="ms-2">
                                        {{ sia.boilerplateReady ? 'Bozza SIA pronta: puoi generare l’SNT.' : 'Suggerimento: genera e valida la bozza SIA per un SNT più accurato.' }}
                                    </strong>
                                </div>

                                <div class="card p-3 mb-3">
                                    <div class="row g-3">
                                        <div class="col-12 col-md-4">
                                            <label class="form-label fw-semibold">Destinatari</label>
                                            <select class="form-select" v-model="snt.destinatari">
                                                <option value="Cittadini">Cittadini</option>
                                                <option value="Stakeholder locali">Stakeholder locali</option>
                                                <option value="Amministratori">Amministratori</option>
                                            </select>
                                        </div>
                                        <div class="col-12 col-md-4">
                                            <label class="form-label fw-semibold">Lunghezza</label>
                                            <select class="form-select" v-model="snt.lunghezza">
                                                <option value="breve">Breve</option>
                                                <option value="media">Media</option>
                                                <option value="estesa">Estesa</option>
                                            </select>
                                        </div>
                                        <div class="col-12 col-md-4">
                                            <label class="form-label fw-semibold">Tono</label>
                                            <select class="form-select" v-model="snt.tono">
                                                <option value="neutro">Neutro</option>
                                                <option value="positivo">Positivo</option>
                                                <option value="istituzionale">Istituzionale</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="d-flex gap-2 mt-3">
                                        <button class="btn btn-primary" @click="generateSNT" :disabled="!hasSIAContent">
                                            <svg class="icon">`${spritesHref}#it-magic`</svg>
                                            <span class="ms-2">Genera SNT</span>
                                        </button>
                                        <button class="btn btn-outline-secondary" @click="clearSNT" :disabled="!snt.testo">
                                            Pulisci SNT
                                        </button>
                                    </div>
                                </div>

                                <div class="card p-3">
                                    <label class="form-label fw-semibold">Testo SNT (modificabile)</label>
                                    <textarea class="form-control" rows="10" v-model="snt.testo"
                                              placeholder="La Sintesi Non Tecnica apparirà qui una volta generata."></textarea>
                                </div>
                            </div>

                            <!-- STEP 7: Esportazione -->
                            <div v-else-if="currentStep === 6">
                                <h3 class="mb-2">7. Esporta Analisi Aggregata</h3>
                                <p class="text-muted">Scarica una sintesi completa: pareri, analisi, bozza SIA e SNT.</p>

                                <div class="d-flex flex-wrap gap-2">
                                    <button class="btn btn-primary" @click="exportReport">
                                        Scarica report completo (.txt)
                                    </button>
                                    <button class="btn btn-outline-primary" @click="exportSIA" :disabled="!hasSIAContent">
                                        Esporta solo SIA (.txt)
                                    </button>
                                    <button class="btn btn-outline-primary" @click="exportSNT" :disabled="!snt.testo">
                                        Esporta solo SNT (.txt)
                                    </button>
                                </div>
                            </div>

                            <!-- NAVIGATION -->
                            <div class="d-flex justify-content-between mt-4">
                                <button class="btn btn-outline-secondary" @click="prevStep" :disabled="currentStep === 0">
                                    <svg class="icon">`${spritesHref}#it-arrow-left`</svg> Indietro
                                </button>

                                <button class="btn btn-primary" @click="nextStep" :disabled="currentStep === steps.length - 1">
                                    Avanti <svg class="icon">`${spritesHref}#it-arrow-right`</svg>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <!-- RIGHT COLUMN -->
            <div class="col-12 col-lg-4 p-4">
                <div class="card border p-4">
                    <h4>AI Helper</h4>

                    <button class="btn btn-primary w-100 mb-2" @click="autoFill">
                        Compila pareri demo
                    </button>

                    <button class="btn btn-secondary w-100" @click="regenAnalysis">
                        Rigenera analisi AI
                    </button>

                    <div v-if="isProcessing" class="text-center mt-3">
                        <div class="spinner-border text-primary"></div>
                        <p class="text-muted small mt-2">Analisi in corso…</p>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
    /**
     * Componenti e setup
     * Nota: tutti i commenti aggiunti sono in italiano come richiesto.
     */
    import PopoverExplain from '@/components/PopoverExplain.vue'
    import { ref, computed } from 'vue'
    import { useRouter } from 'vue-router'
    import spritesUrl from 'bootstrap-italia/dist/svg/sprites.svg?url'

    const spritesHref = spritesUrl
    const router = useRouter()
    function goTo(path: string) { router.push(path) }

    const today = new Date().toLocaleDateString('it-IT')

    /* ------------------------------------
     * WIZARD STATE
     * ------------------------------------ */
    const steps = [
        { label: 'Raccolta Pareri' },
        { label: 'Topic Extraction' },
        { label: 'Divergenze / Convergenze' },
        { label: 'Dashboard Tematica' },
        { label: 'Bozza SIA' },            // 5.2
        { label: 'Sintesi Non Tecnica (SNT)' }, // 5.3
        { label: 'Esporta Report' },
    ]

    const currentStep = ref(0)
    const completed = ref<boolean[]>(steps.map(() => false))

    const nextStep = () => {
        if (currentStep.value < steps.length - 1) {
            completed.value[currentStep.value] = true
            currentStep.value++
        }
    }
    const prevStep = () => currentStep.value = Math.max(0, currentStep.value - 1)
    const goToStep = (i: number) => currentStep.value = i

    const badgeClass = (i: number) => {
        if (currentStep.value === i) return 'bg-primary'
        if (completed.value[i]) return 'bg-success'
        return 'bg-secondary'
    }

    /* ------------------------------------
     * RACCOLTA PARERI
     * ------------------------------------ */
    const pareri = ref<any[]>([])
    const formEnte = ref('')
    const formTema = ref('')
    const formTesto = ref('')

    function addParere() {
        pareri.value.push({
            id: crypto.randomUUID(),
            ente: formEnte.value,
            tema: formTema.value,
            testo: formTesto.value
        })
        formEnte.value = ''
        formTema.value = ''
        formTesto.value = ''
    }

    /** Compilatore rapido per demo */
    function autoFill() {
        pareri.value = [
            { id: '1', ente: 'ARPA', tema: 'Aria', testo: 'Emissioni prevedibili moderate in fase di cantiere.' },
            { id: '2', ente: 'Comune', tema: 'Rumore', testo: 'Valutare orari di cantiere e mitigazioni acustiche.' },
            { id: '3', ente: 'Soprintendenza', tema: 'Paesaggio', testo: 'Verificare visibilità da contesti tutelati.' },
            { id: '4', ente: 'ASL', tema: 'Suolo', testo: 'Analisi ulteriori su contaminazione pregressa.' },
            { id: '5', ente: 'Consorzio Idrico', tema: 'Acqua', testo: 'Gestione acque meteoriche e prevenzione dilavamento.' },
        ]
    }

    /* ------------------------------------
     * TOPIC EXTRACTION (Mock AI)
     * ------------------------------------ */
    const topics = ref([
        { nome: 'Aria', percentuale: 65 },
        { nome: 'Rumore', percentuale: 48 },
        { nome: 'Suolo', percentuale: 32 },
        { nome: 'Paesaggio', percentuale: 22 },
        { nome: 'Fauna', percentuale: 18 },
        { nome: 'Acqua', percentuale: 28 },
    ])

    function topicClass(p: number) {
        if (p >= 60) return 'bg-success'
        if (p >= 30) return 'bg-warning'
        return 'bg-danger'
    }

    /* ------------------------------------
     * DIVERGENZE & CONVERGENZE
     * ------------------------------------ */
    const convergenze = ref([
        'Tutti gli enti concordano sulla necessità di mitigazioni acustiche.',
        'Convergenza generale sulla gestione corretta delle acque meteoriche.',
    ])

    const divergenze = ref([
        { id: 'd1', tema: 'Aria', enti: 'ARPA vs Comune', note: 'ARPA richiede limiti più severi sulle polveri.' },
        { id: 'd2', tema: 'Paesaggio', enti: 'Comune vs Soprintendenza', note: 'Divergenza sulla visibilità del campo FV.' },
    ])

    /* ------------------------------------
     * DASHBOARD TEMATICA
     * ------------------------------------ */
    const dashboard = computed(() => {
        const map: any = {}
        pareri.value.forEach(p => {
            map[p.tema] = (map[p.tema] || 0) + 1
        })
        return Object.keys(map).map(k => ({ tema: k, count: map[k] }))
    })

    /* ------------------------------------
     * FINTA ANALISI
     * ------------------------------------ */
    const isProcessing = ref(false)
    function regenAnalysis() {
        isProcessing.value = true
        setTimeout(() => {
            topics.value = topics.value.map(t => ({
                ...t,
                percentuale: Math.floor(Math.random() * 70) + 10
            }))
            isProcessing.value = false
        }, 900)
    }

    /* ------------------------------------
     * 5.2 — GENERAZIONE BOZZA SIA
     * - Obiettivo: creare uno scheletro SIA automatico basato sui pareri/temi
     * - Include: metodologie suggerite, aree editabili, validazione & marcatura "pronto"
     * ------------------------------------ */

    /** Struttura di lavoro per la bozza SIA */
    type AnalisiTema = {
        tema: string
        metodologie: string
        sintesi: string
        mitigazioni: string
    }

    const sia = ref({
        titolo: '',
        progetto: '',
        descrizione: '',
        quadroNormativo: '',
        metodologiaGenerale: '',
        analisiTemi: [] as AnalisiTema[],
        monitoraggio: '',
        conclusioni: '',
        validato: false,         // flag che l’utente ha completato la revisione
        boilerplateReady: false, // flag "pronto" post-validazione
    })

    /** True se almeno una sezione SIA contiene contenuto utile */
    const hasSIAContent = computed(() => {
        const s = sia.value
        return !!(
            s.titolo || s.progetto || s.descrizione ||
            s.quadroNormativo || s.metodologiaGenerale ||
            s.analisiTemi.length || s.monitoraggio || s.conclusioni
        )
    })

    /** Validazione minima SIA (campi essenziali per marcare come pronto) */
    const siaValidationWarnings = computed(() => {
        const warnings: string[] = []
        const s = sia.value
        if (!s.titolo.trim()) warnings.push('Manca il titolo del SIA.')
        if (!s.progetto.trim()) warnings.push('Manca il campo Proponente/Progetto.')
        if (!s.descrizione.trim()) warnings.push('Manca la descrizione dell’intervento.')
        if (!s.metodologiaGenerale.trim()) warnings.push('Manca la metodologia generale.')
        if (s.analisiTemi.length === 0) warnings.push('Non è presente alcuna analisi per tema.')
        if (!s.validato) warnings.push('Spunta la casella di validazione interna per procedere.')
        return warnings
    })

    /** Abilitazione del bottone "pronto" */
    const isSIAValid = computed(() => siaValidationWarnings.value.length === 0)

    /** Dizionario metodi suggeriti per tema (mock sensato) */
    const metodoPerTema: Record<string, string> = {
        'Aria': 'Modelli di dispersione (AERMOD/ADMS), campagne PM10/PM2.5 e NOx, fattori di emissione (EMEP/EEA).',
        'Rumore': 'Mappatura acustica con ISO 9613-2 / CNOSSOS-EU, misure fonometria in continuo, barriere e layout.',
        'Suolo': 'Indagini geognostiche, carotaggi e analisi chimiche (UNI 10802), verifica siti potenzialmente contaminati.',
        'Paesaggio': 'Analisi percettiva e visiva (VIA), fotoinserimenti, simulazioni da punti di vista sensibili.',
        'Fauna': 'Monitoraggi pre- e post-operam, periodi di cantiere compatibili con fenologia, corridoi ecologici.',
        'Acqua': 'Bilanci idrici, gestione acque meteoriche, campionamenti in conformità a D.Lgs. 152/2006.',
        'Traffico': 'Valutazioni di cantiere ed esercizio, microsimulazioni, piani di accesso e scaglionamento mezzi.',
    }

    /** Genera testo "misure di mitigazione" per tema in base alle convergenze/dati */
    function mitigazioniPerTema(tema: string): string {
        const cvg = convergenze.value.join(' ').toLowerCase()
        const common: Record<string, string> = {
            'Rumore': 'Pianificazione orari di cantiere, barriere acustiche, distanza dai ricettori sensibili.',
            'Acqua': 'Regimazione acque meteoriche, vasche di prima pioggia, prevenzione del dilavamento.',
            'Aria': 'Bagnatura piste e cumuli, velocità limitata mezzi, manutenzione macchinari.',
            'Suolo': 'Gestione terre e rocce, piani scavo selettivo, ripristino morfologico.',
            'Paesaggio': 'Schermature vegetali, colorazioni a bassa riflettanza, ottimizzazione altezze.',
            'Fauna': 'Calendari lavori a bassa interferenza, fasce tampone, dissuasori temporanei.',
            'Traffico': 'Piano di viabilità di cantiere, segnaliazione, scaglionamento consegne.',
        }
        // Aggiunge enfasi alle mitigazioni acustiche/acqua se presenti nelle convergenze
        if (tema === 'Rumore' && cvg.includes('acustic')) {
            return common['Rumore'] + ' Monitoraggi in continuo nelle fasi più impattanti.'
        }
        if (tema === 'Acqua' && cvg.includes('acque') || cvg.includes('meteoriche')) {
            return common['Acqua'] + ' Dispositivi di filtrazione e controllo qualità in uscita.'
        }
        return common[tema] || ''
    }

    /** Utility: normalizza nome tema (gestisce possibili refusi) */
    function normTema(t: string): string {
        if (t.toLowerCase() === 'paisaggio') return 'Paesaggio'
        return t
    }

    /** Costruisce l’elenco temi da pareri + topics (unione) */
    const temiRilevati = computed<string[]>(() => {
        const set = new Set<string>()
        pareri.value.forEach(p => set.add(normTema(p.tema)))
        topics.value.forEach(t => set.add(normTema(t.nome)))
        return Array.from(set)
    })

    /** Genera la bozza SIA a partire dai temi/pareri */
    function generateSIA() {
        // Titoli e campi generali proposti automaticamente
        sia.value.titolo = sia.value.titolo || 'SIA — Impianto fotovoltaico — Scoping'
        sia.value.progetto = sia.value.progetto || 'Progetto preliminare impianto fotovoltaico — Località da definire'
        sia.value.descrizione = sia.value.descrizione || [
            'Il progetto prevede la realizzazione di un impianto fotovoltaico con opere connesse.',
            'Il cantiere contempla attività di movimentazione terra, posa strutture e connessioni elettriche.',
            'L’area d’intervento è caratterizzata da contesto rurale con ricettori sensibili entro il raggio di influenza.'
        ].join(' ')

        sia.value.quadroNormativo = sia.value.quadroNormativo || [
            'Quadro normativo di riferimento: D.Lgs. 152/2006 e s.m.i., normative regionali in materia ambientale,',
            'linee guida ISPRA e documenti tecnici pertinenti ai singoli comparti ambientali.'
        ].join(' ')

        // Metodologia generale suggerita in base ai temi aggregati
        const temi = temiRilevati.value
        const metodi = temi.map(t => `- ${t}: ${metodoPerTema[t] || 'Raccolta dati di base, modellazione e valutazioni di compatibilità.'}`).join('\n')
        sia.value.metodologiaGenerale = sia.value.metodologiaGenerale || [
            'L’analisi segue un approccio per componenti ambientali con raccolta dati di base, modellazione e confronto con valori/vincoli.',
            'Per i temi rilevati si adottano le seguenti metodologie:',
            metodi
        ].join('\n')

        // Analisi per tema: auto-popolamento (sintesi + miti)
        const nuoviTemi: AnalisiTema[] = temi.map(t => ({
            tema: t,
            metodologie: metodoPerTema[t] || 'Metodologia da definire in funzione delle evidenze.',
            sintesi: `Sulla componente ${t.toLowerCase()}, i pareri pervenuti indicano criticità e misure da valutare in fase di progettazione esecutiva.`,
            mitigazioni: mitigazioniPerTema(t),
        }))

        // Se già presenti alcuni temi, mantieni le modifiche e unisci i mancanti
        const esistenti = new Map(sia.value.analisiTemi.map(a => [a.tema, a]))
        nuoviTemi.forEach(a => {
            if (!esistenti.has(a.tema)) esistenti.set(a.tema, a)
        })
        sia.value.analisiTemi = Array.from(esistenti.values())

        // Monitoraggio e conclusioni suggerite
        sia.value.monitoraggio = sia.value.monitoraggio || 'Si prevedono piani di monitoraggio pre/durante/post operam con indicatori specifici per ciascun tema.'
        const sintCvg = convergenze.value.length ? `Convergenze: ${convergenze.value.join(' ')}` : ''
        const sintDiv = divergenze.value.length ? `Divergenze: ${divergenze.value.map(d => `${d.tema} (${d.enti})`).join('; ')}.` : ''
        sia.value.conclusioni = sia.value.conclusioni || [
            'Le misure di mitigazione proposte e la pianificazione di cantiere risultano idonee a contenere gli impatti.',
            sintCvg, sintDiv
        ].filter(Boolean).join(' ')

        // La bozza non è automaticamente "pronta": richiede validazione manuale
        sia.value.boilerplateReady = false
        sia.value.validato = false
    }

    /** Pulisce la bozza SIA */
    function clearSIA() {
        sia.value = {
            titolo: '',
            progetto: '',
            descrizione: '',
            quadroNormativo: '',
            metodologiaGenerale: '',
            analisiTemi: [],
            monitoraggio: '',
            conclusioni: '',
            validato: false,
            boilerplateReady: false,
        }
    }

    /** Marca la bozza come "pronta" se validazione ok */
    function markSIAReady() {
        if (!isSIAValid.value) return
        sia.value.boilerplateReady = true
    }

    /* ------------------------------------
     * 5.3 — GENERAZIONE AUTOMATICA SNT
     * - Obiettivo: sintetizzare in linguaggio divulgativo il contenuto del SIA
     * - Controlli: destinatari, lunghezza, tono
     * ------------------------------------ */
    const snt = ref({
        destinatari: 'Cittadini',
        lunghezza: 'media',   // breve | media | estesa
        tono: 'neutro',       // neutro | positivo | istituzionale
        testo: '',
    })

    /** Genera testo SNT a partire dal SIA (sezioni principali) */
    function generateSNT() {
        if (!hasSIAContent.value) return

        const intro = (() => {
            const titolo = sia.value.titolo || 'Studio di Impatto Ambientale'
            const progetto = sia.value.progetto || 'Progetto in valutazione'
            const apertura = {
                neutro: `Questo documento presenta la sintesi non tecnica del ${titolo} relativo a ${progetto}.`,
                positivo: `Questa sintesi non tecnica illustra in modo chiaro e accessibile il ${titolo} relativo a ${progetto}.`,
                istituzionale: `Si riporta di seguito la Sintesi Non Tecnica del ${titolo} riguardante ${progetto}.`,
            }[snt.value.tono]
            return apertura
        })()

        const descr = sia.value.descrizione
            ? sia.value.descrizione
            : 'L’intervento prevede opere di cantiere, installazione e connessione, con valutazione degli impatti nelle fasi di realizzazione ed esercizio.'

        // Sintesi per temi: pick breve/media/estesa
        const blocchiTemi = sia.value.analisiTemi.map(a => {
            const base = `Tema ${a.tema}: ${a.sintesi}`
            const metodo = ` Metodologie: ${a.metodologie}`
            const miti = a.mitigazioni ? ` Mitigazioni previste: ${a.mitigazioni}` : ''
            if (snt.value.lunghezza === 'breve') return `- ${base}.`
            if (snt.value.lunghezza === 'media') return `- ${base}. ${miti}`
            return `- ${base}. ${metodo}.${miti ? ' ' + miti : ''}`
        }).join('\n')

        const conclusioni = sia.value.conclusioni
            ? sia.value.conclusioni
            : 'Alla luce delle misure e dei controlli proposti, l’intervento risulta compatibile con il contesto, nel rispetto delle prescrizioni.'

        const destinatari = {
            'Cittadini': 'L’obiettivo è offrire una lettura trasparente e comprensibile.',
            'Stakeholder locali': 'L’obiettivo è supportare un confronto informato con il territorio.',
            'Amministratori': 'L’obiettivo è facilitare le valutazioni decisionali con elementi chiari e sintetici.',
        }[snt.value.destinatari]

        snt.value.testo = [
            intro,
            '',
            `In sintesi, ${descr}`,
            '',
            'Valutazioni per tema:',
            blocchiTemi || '- I temi specifici saranno approfonditi nella versione definitiva del SIA.',
            '',
            'Monitoraggio:',
            sia.value.monitoraggio || 'Sono previsti piani di monitoraggio con indicatori ambientali mirati.',
            '',
            'Conclusioni:',
            conclusioni,
            '',
            destinatari
        ].join('\n')
    }

    /** Pulisce l’SNT */
    function clearSNT() {
        snt.value.testo = ''
    }

    /* ------------------------------------
     * EXPORT REPORT (esteso con SIA + SNT)
     * ------------------------------------ */
    function downloadText(filename: string, content: string) {
        const blob = new Blob([content], { type: 'text/plain' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = filename
        a.click()
    }

    /** Export “report completo” che include pareri, analisi, SIA e SNT */
    function exportReport() {
        const content = [
            '=== REPORT COMPLETO (Mock) ===',
            '',
            'PARERI RACCOLTI:',
            ...pareri.value.map(p => `- ${p.ente}: [${p.tema}] ${p.testo}`),
            '',
            'TOPIC EXTRACTION:',
            ...topics.value.map(t => `- ${t.nome}: ${t.percentuale}%`),
            '',
            'CONVERGENZE:',
            ...(convergenze.value.length ? convergenze.value.map(c => `- ${c}`) : ['- Nessuna convergenza rilevata']),
            '',
            'DIVERGENZE:',
            ...(divergenze.value.length ? divergenze.value.map(d => `- ${d.tema} (${d.enti}): ${d.note}`) : ['- Nessuna divergenza rilevata']),
            '',
            '--- BOZZA SIA ---',
            `Titolo: ${sia.value.titolo}`,
            `Progetto: ${sia.value.progetto}`,
            '',
            'Descrizione:',
            sia.value.descrizione || '(vuoto)',
            '',
            'Quadro normativo:',
            sia.value.quadroNormativo || '(vuoto)',
            '',
            'Metodologia generale:',
            sia.value.metodologiaGenerale || '(vuoto)',
            '',
            'Analisi per tema:',
            ...(sia.value.analisiTemi.length
                ? sia.value.analisiTemi.flatMap(a => [
                    `* ${a.tema}`,
                    `  - Metodologie: ${a.metodologie}`,
                    `  - Sintesi: ${a.sintesi}`,
                    `  - Mitigazioni: ${a.mitigazioni}`,
                ])
                : ['(nessun tema)']),
            '',
            'Monitoraggio:',
            sia.value.monitoraggio || '(vuoto)',
            '',
            'Conclusioni:',
            sia.value.conclusioni || '(vuoto)',
            '',
            `Validato: ${sia.value.validato ? 'Sì' : 'No'} — Pronto: ${sia.value.boilerplateReady ? 'Sì' : 'No'}`,
            '',
            '--- SINTESI NON TECNICA (SNT) ---',
            snt.value.testo || '(non generata)',
        ].join('\n')

        downloadText('Report-Scoping-Completo.txt', content)
    }

    /** Export solo SIA */
    function exportSIA() {
        const content = [
            '=== BOZZA SIA (Mock) ===',
            `Titolo: ${sia.value.titolo}`,
            `Progetto: ${sia.value.progetto}`,
            '',
            'Descrizione:',
            sia.value.descrizione || '(vuoto)',
            '',
            'Quadro normativo:',
            sia.value.quadroNormativo || '(vuoto)',
            '',
            'Metodologia generale:',
            sia.value.metodologiaGenerale || '(vuoto)',
            '',
            'Analisi per tema:',
            ...(sia.value.analisiTemi.length
                ? sia.value.analisiTemi.flatMap(a => [
                    `* ${a.tema}`,
                    `  - Metodologie: ${a.metodologie}`,
                    `  - Sintesi: ${a.sintesi}`,
                    `  - Mitigazioni: ${a.mitigazioni}`,
                ])
                : ['(nessun tema)']),
            '',
            'Monitoraggio:',
            sia.value.monitoraggio || '(vuoto)',
            '',
            'Conclusioni:',
            sia.value.conclusioni || '(vuoto)',
            '',
            `Validato: ${sia.value.validato ? 'Sì' : 'No'} — Pronto: ${sia.value.boilerplateReady ? 'Sì' : 'No'}`,
        ].join('\n')

        downloadText('Bozza-SIA.txt', content)
    }

    /** Export solo SNT */
    function exportSNT() {
        const content = [
            '=== SINTESI NON TECNICA (Mock) ===',
            snt.value.testo || '(non generata)',
        ].join('\n')

        downloadText('Sintesi-Non-Tecnica.txt', content)
    }
</script>

<style scoped>
    h2, h3, h4 {
        font-weight: bold;
    }

    .explain-pack {
        float: right;
        display: flex;
        gap: .5rem;
    }

    p::after, h3::after, h4::after, ul::after {
        content: "";
        display: block;
        clear: both;
    }

    .icon {
        width: 16px;
        height: 16px;
    }

    .nav-pills .nav-link {
        display: flex;
        align-items: center;
        gap: .5rem;
    }

    .badge .icon {
        width: 14px;
        height: 14px;
    }

    .card:after {
        margin-top: 0px;
        
    }
</style>
