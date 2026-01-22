
<template>
    <div class="container-fluid p-4" style="background-color:#e3f2fd;">

        <!-- Barra azioni -->
        <div class="row align-items-center mt-4 mb-4">
            <div class="col-6 d-flex justify-content-start">
                <button class="btn btn-outline-primary bg-white d-inline-flex align-items-center"
                        @click="goTo('/dashboard')"
                        style="height:50px;">
                    <svg class="icon"><use :href="`${spritesHref}#it-arrow-left`" /></svg>
                    <span class="ms-2">Indietro</span>
                </button>
            </div>
            <div class="col-6 d-flex justify-content-end"></div>
        </div>

        <div class="row">
            <!-- LEFT COLUMN -->
            <div class="col-12 col-lg-8 p-4">
                <div class="card border p-4">
                    <div class="p-4" style="background-color:#f5f5f5;">

                        <!-- HEADER -->
                        <div class="row">
                            <div class="col-12">
                                <div class="card p-4 text-white" style="background-color:#1565c0;">
                                    <div class="d-flex align-items-center justify-content-between">
                                        <h2 class="mb-2">Fase 3 - Presentazione Istanza</h2>
                                        <span class="explain-pack">
                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-info-circle"
                                                            color="light"
                                                            text="Raccoglie SIA/SNT/Pareri, genera la bozza, verifica coerenza, gestisce approvazione A.C."
                                                            placement="bottom"
                                                            outline
                                                            :iconOnly="true"
                                                            size="xs" />
                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-help-circle"
                                                            color="light"
                                                            text="Mock locale: nessuna chiamata esterna. Esporti TXT/JSON in UTF-8."
                                                            placement="bottom"
                                                            outline
                                                            :iconOnly="true"
                                                            size="xs" />
                                        </span>
                                    </div>

                                    <p class="mb-1"><strong>Progetto:</strong> Impianto fotovoltaico — Presentazione Istanza</p>
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
                                                <svg class="icon"><use :href="`${spritesHref}#it-check-circle`" /></svg>
                                            </template>
                                            <template v-else>
                                                {{ idx + 1 }}
                                            </template>
                                        </span>
                                        {{ s.label }}
                                    </button>
                                </li>
                            </ul>

                            <!-- STEP 1: Raccolta Documenti Precedenti -->
                            <div v-if="currentStep === 0">
                                <h3 class="mb-2">1. Raccolta documenti dalle fasi precedenti</h3>
                                <p class="text-muted">
                                    Import automatico da localStorage (chiavi Scoping:*). In alternativa incolla i contenuti manualmente.
                                </p>

                                <div class="alert alert-info d-flex align-items-center gap-2">
                                    <svg class="icon"><use :href="`${spritesHref}#it-info-circle`" /></svg>
                                    <div>
                                        <strong>Origine dati:</strong>
                                        <span v-if="collezione.origine === 'localStorage'">localStorage</span>
                                        <span v-else-if="collezione.origine === 'manual'">inserimento manuale</span>
                                        <span v-else>non ancora importati</span>
                                    </div>
                                </div>

                                <div class="d-flex gap-2 mb-3">
                                    <button class="btn btn-primary" @click="importFromLocalStorage">
                                        <svg class="icon"><use :href="`${spritesHref}#it-download`" /></svg>
                                        <span class="ms-2">Importa da localStorage</span>
                                    </button>
                                    <button class="btn btn-outline-secondary" @click="clearCollection" :disabled="!hasCollection">
                                        Svuota raccolta
                                    </button>
                                </div>

                                <div class="row g-3">
                                    <!-- SIA -->
                                    <div class="col-12">
                                        <div class="card p-3">
                                            <div class="d-flex justify-content-between align-items-center">
                                                <h6 class="mb-0">Bozza SIA</h6>
                                                <span class="badge" :class="collezione.sia ? 'bg-success' : 'bg-secondary'">
                                                    {{ collezione.sia ? 'Trovato' : 'Manca' }}
                                                </span>
                                            </div>
                                            <textarea class="form-control mt-2" rows="4" v-model="manual.sia"
                                                      placeholder="Incolla qui il SIA se non presente in localStorage"></textarea>
                                            <div class="text-end mt-2">
                                                <button class="btn btn-sm btn-outline-primary" @click="loadManual('sia')" :disabled="!manual.sia.trim()">Usa testo incollato</button>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- SNT -->
                                    <div class="col-12">
                                        <div class="card p-3">
                                            <div class="d-flex justify-content-between align-items-center">
                                                <h6 class="mb-0">Sintesi Non Tecnica (SNT)</h6>
                                                <span class="badge" :class="collezione.snt ? 'bg-success' : 'bg-secondary'">
                                                    {{ collezione.snt ? 'Trovata' : 'Manca' }}
                                                </span>
                                            </div>
                                            <textarea class="form-control mt-2" rows="3" v-model="manual.snt"
                                                      placeholder="Incolla qui l’SNT se non presente in localStorage"></textarea>
                                            <div class="text-end mt-2">
                                                <button class="btn btn-sm btn-outline-primary" @click="loadManual('snt')" :disabled="!manual.snt.trim()">Usa testo incollato</button>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Pareri & Strutture correlate -->
                                    <div class="col-12">
                                        <div class="card p-3">
                                            <h6 class="mb-2">Pareri, Topic, Convergenze/Divergenze, Dashboard</h6>
                                            <div class="small">
                                                <span class="badge me-2" :class="collezione.pareri?.length ? 'bg-success' : 'bg-secondary'">
                                                    Pareri: {{ collezione.pareri?.length || 0 }}
                                                </span>
                                                <span class="badge me-2" :class="collezione.topics?.length ? 'bg-success' : 'bg-secondary'">
                                                    Topic: {{ collezione.topics?.length || 0 }}
                                                </span>
                                                <span class="badge me-2" :class="collezione.convergenze?.length ? 'bg-success' : 'bg-secondary'">
                                                    Convergenze
                                                </span>
                                                <span class="badge me-2" :class="collezione.divergenze?.length ? 'bg-success' : 'bg-secondary'">
                                                    Divergenze
                                                </span>
                                                <span class="badge" :class="collezione.dashboard?.length ? 'bg-success' : 'bg-secondary'">
                                                    Dashboard
                                                </span>
                                            </div>

                                            <textarea class="form-control mt-2" rows="4" v-model="manual.pareri"
                                                      placeholder='Incolla JSON pareri/topic/divergenze/dashboard (es. {"pareri":[...],"topics":[...],...})'></textarea>
                                            <div class="text-end mt-2">
                                                <button class="btn btn-sm btn-outline-primary" @click="loadManual('pareri')" :disabled="!manual.pareri.trim()">Usa JSON incollato</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- STEP 2: Generazione Bozza Provvedimento -->
                            <div v-else-if="currentStep === 1">
                                <h3 class="mb-2">2. Generazione bozza del Provvedimento di Consultazione</h3>
                                <p class="text-muted">Sezioni precompilate sulla base di SIA/SNT/Pareri. Puoi modificare liberamente prima della verifica.</p>

                                <div class="d-flex gap-2 mb-3">
                                    <button class="btn btn-primary" @click="generaBozza" :disabled="!hasCollection">
                                        <svg class="icon"><use :href="`${spritesHref}#it-magic`" /></svg>
                                        <span class="ms-2">Genera bozza</span>
                                    </button>
                                    <button class="btn btn-outline-secondary" @click="pulisciBozza" :disabled="!hasBozza">
                                        Pulisci
                                    </button>
                                </div>

                                <!-- Intestazione -->
                                <div class="card p-3 mb-3">
                                    <h6>Intestazione</h6>
                                    <div class="row g-3">
                                        <div class="col-12 col-md-4">
                                            <label class="form-label fw-semibold">Ente</label>
                                            <input class="form-control" v-model="provv.intestazione.ente" placeholder="Autorità Competente / Ente" />
                                        </div>
                                        <div class="col-12 col-md-4">
                                            <label class="form-label fw-semibold">Settore/Ufficio</label>
                                            <input class="form-control" v-model="provv.intestazione.settore" placeholder="Settore VIA/VAS, UO, ecc." />
                                        </div>
                                        <div class="col-6 col-md-2">
                                            <label class="form-label fw-semibold">Numero</label>
                                            <input class="form-control" v-model="provv.intestazione.numero" placeholder="Auto" />
                                        </div>
                                        <div class="col-6 col-md-2">
                                            <label class="form-label fw-semibold">Data</label>
                                            <input type="date" class="form-control" v-model="provv.intestazione.data" />
                                        </div>
                                    </div>
                                </div>

                                <!-- Oggetto -->
                                <div class="card p-3 mb-3">
                                    <h6>Oggetto</h6>
                                    <input class="form-control" v-model="provv.oggetto" placeholder="Oggetto del provvedimento" />
                                </div>

                                <!-- Premesse -->
                                <div class="card p-3 mb-3">
                                    <h6>Premesse (VISTO/VISTA, CONSIDERATO)</h6>
                                    <label class="form-label small fw-semibold">Richiami normativi (uno per riga)</label>
                                    <textarea class="form-control mb-2" rows="3" v-model="provv.premesse.richiamiNormativi"></textarea>

                                    <label class="form-label small fw-semibold">Considerato che</label>
                                    <textarea class="form-control" rows="3" v-model="provv.premesse.considerato"></textarea>
                                </div>

                                <!-- Valutazioni -->
                                <div class="card p-3 mb-3">
                                    <h6>Valutazioni tecniche (sintesi)</h6>
                                    <textarea class="form-control" rows="4" v-model="provv.valutazioni"></textarea>
                                </div>

                                <!-- Articolato: DISPONE -->
                                <div class="card p-3 mb-3">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <h6 class="mb-0">DISPONE (Articolato)</h6>
                                        <button class="btn btn-sm btn-outline-primary" @click="aggiungiArticolo">
                                            <svg class="icon"><use :href="`${spritesHref}#it-plus-circle`" /></svg>
                                            <span class="ms-2">Aggiungi articolo</span>
                                        </button>
                                    </div>

                                    <div v-if="provv.dispone.length === 0" class="text-muted small mt-2">
                                        Nessun articolo. Genera la bozza oppure aggiungi manualmente.
                                    </div>

                                    <div v-for="(art, idx) in provv.dispone" :key="art.id" class="card p-3 mt-2 border">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <strong>Art. {{ idx + 1 }} — {{ art.titolo || 'Titolo' }}</strong>
                                            <div class="d-flex gap-2">
                                                <button class="btn btn-xs btn-outline-secondary" @click="muoviArticolo(idx, -1)" :disabled="idx===0" title="Sposta su">▲</button>
                                                <button class="btn btn-xs btn-outline-secondary" @click="muoviArticolo(idx, 1)" :disabled="idx===provv.dispone.length-1" title="Sposta giù">▼</button>
                                                <button class="btn btn-xs btn-outline-danger" @click="rimuoviArticolo(idx)" title="Rimuovi">✕</button>
                                            </div>
                                        </div>
                                        <label class="form-label small fw-semibold mt-2">Titolo</label>
                                        <input class="form-control" v-model="art.titolo" placeholder="Es. Avvio consultazione pubblica" />
                                        <label class="form-label small fw-semibold mt-2">Testo</label>
                                        <textarea class="form-control" rows="3" v-model="art.testo"></textarea>
                                    </div>
                                </div>

                                <!-- Allegati -->
                                <div class="card p-3">
                                    <h6>Allegati</h6>
                                    <div class="row g-2">
                                        <div class="col-12 col-md-6" v-for="(al, i) in provv.allegati" :key="al.id">
                                            <div class="input-group">
                                                <span class="input-group-text">#{{ i+1 }}</span>
                                                <input class="form-control" v-model="al.nome" />
                                                <button class="btn btn-outline-danger" @click="rimuoviAllegato(i)">Rimuovi</button>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <button class="btn btn-sm btn-outline-primary mt-2" @click="aggiungiAllegato">Aggiungi allegato</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- STEP 3: Verifica coerenza (NLP mock) -->
                            <div v-else-if="currentStep === 2">
                                <h3 class="mb-2">3. Verifica coerenza formale e struttura (NLP)</h3>
                                <p class="text-muted">Controlli automatici su struttura, completezza e coerenza. Applica i fix suggeriti.</p>

                                <div class="d-flex gap-2 mb-3">
                                    <button class="btn btn-primary" @click="eseguiNLP" :disabled="!hasBozza">
                                        <svg class="icon"><use :href="`${spritesHref}#it-play-circle`" /></svg>
                                        <span class="ms-2">Esegui verifica</span>
                                    </button>
                                    <button class="btn btn-outline-secondary" @click="applicaAutoFix" :disabled="nlp.issues.length===0">
                                        Applica auto-fix
                                    </button>
                                </div>

                                <div v-if="nlp.running" class="text-center my-3">
                                    <div class="spinner-border text-primary"></div>
                                    <p class="text-muted small mt-2">Analisi in corso…</p>
                                </div>

                                <div v-else>
                                    <div class="alert" :class="badgeRisultatoNLP.class">
                                        <strong>{{ badgeRisultatoNLP.label }}</strong>
                                        <span class="ms-2 small text-muted">Errori: {{ nlpCount('error') }}, Avvisi: {{ nlpCount('warning') }}, Info: {{ nlpCount('info') }}</span>
                                    </div>

                                    <div v-if="nlp.issues.length === 0" class="text-muted">Nessuna criticità rilevata.</div>

                                    <div v-for="(iss, i) in nlp.issues" :key="i" class="card p-3 mb-2"
                                         :class="iss.severita==='error' ? 'border-danger' : iss.severita==='warning' ? 'border-warning' : 'border-info'">
                                        <div class="d-flex justify-content-between align-items-start">
                                            <div>
                                                <span class="badge me-2"
                                                      :class="iss.severita==='error' ? 'bg-danger' : iss.severita==='warning' ? 'bg-warning text-dark' : 'bg-info text-dark'">
                                                    {{ iss.severita.toUpperCase() }}
                                                </span>
                                                <strong>{{ iss.titolo }}</strong>
                                                <div class="small text-muted mt-1">{{ iss.descrizione }}</div>
                                                <div v-if="iss.suggerimento" class="small mt-2"><em>Suggerimento:</em> {{ iss.suggerimento }}</div>
                                            </div>
                                            <div>
                                                <button v-if="iss.autoFix" class="btn btn-sm btn-outline-primary" @click="iss.autoFix()">Applica fix</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- STEP 4: Revisione e approvazione AC -->
                            <div v-else-if="currentStep === 3">
                                <h3 class="mb-2">4. Revisione e approvazione finale (A.C.)</h3>
                                <p class="text-muted">Compila i metadati di approvazione. Una volta approvato, la bozza viene bloccata.</p>

                                <div class="card p-3 mb-3">
                                    <div class="row g-3">
                                        <div class="col-12 col-md-4">
                                            <label class="form-label fw-semibold">Revisore (A.C.)</label>
                                            <input class="form-control" v-model="approvazione.revisore" placeholder="Nome e Cognome" />
                                        </div>
                                        <div class="col-12 col-md-4">
                                            <label class="form-label fw-semibold">Ruolo</label>
                                            <input class="form-control" v-model="approvazione.ruolo" placeholder="Es. Dirigente Settore VIA" />
                                        </div>
                                        <div class="col-6 col-md-2">
                                            <label class="form-label fw-semibold">Esito</label>
                                            <select class="form-select" v-model="approvazione.esito">
                                                <option>Approvato</option>
                                                <option>Rinviato</option>
                                            </select>
                                        </div>
                                        <div class="col-6 col-md-2">
                                            <label class="form-label fw-semibold">Versione</label>
                                            <input class="form-control" v-model="approvazione.versione" />
                                        </div>
                                        <div class="col-12">
                                            <label class="form-label fw-semibold">Note</label>
                                            <textarea class="form-control" rows="3" v-model="approvazione.note"></textarea>
                                        </div>
                                    </div>

                                    <div class="form-check mt-3">
                                        <input class="form-check-input" type="checkbox" id="chkAC" v-model="approvazione.approvato">
                                        <label class="form-check-label" for="chkAC">
                                            Confermo approvazione finale dell'Autorità Competente
                                        </label>
                                    </div>

                                    <div class="mt-3 d-flex gap-2">
                                        <button class="btn btn-success" @click="finalizzaApprovazione" :disabled="!puoApprovare">
                                            <svg class="icon"><use :href="`${spritesHref}#it-check-circle`" /></svg>
                                            <span class="ms-2">Finalizza approvazione</span>
                                        </button>
                                        <span v-if="provv.locked" class="badge bg-success align-self-center">Provvedimento approvato e bloccato</span>
                                    </div>

                                    <div v-if="changelog.length" class="mt-3">
                                        <h6>Changelog</h6>
                                        <ul class="small">
                                            <li v-for="(c, i) in changelog" :key="i">{{ c }}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <!-- STEP 5: Esporta & Protocolla -->
                            <div v-else-if="currentStep === 4">
                                <h3 class="mb-2">5. Esporta & Protocolla</h3>
                                <p class="text-muted">Esporta il provvedimento e genera un payload pronto per la protocollazione.</p>

                                <div class="d-flex flex-wrap gap-2 mb-3">
                                    <button class="btn btn-primary" @click="exportProvvedimentoTXT" :disabled="!hasBozza">
                                        Esporta Provvedimento (.txt)
                                    </button>
                                    <button class="btn btn-outline-primary" @click="exportProvvedimentoJSON" :disabled="!hasBozza">
                                        Esporta Provvedimento (.json)
                                    </button>
                                    <button class="btn btn-outline-secondary" @click="generaPayloadProtocollo" :disabled="!hasBozza">
                                        Genera payload protocollo (JSON)
                                    </button>
                                </div>

                                <div class="card p-3">
                                    <label class="form-label fw-semibold">Anteprima payload protocollo</label>
                                    <pre class="small mb-0" style="white-space:pre-wrap">{{ payloadProtocollo }}</pre>
                                </div>
                            </div>

                            <!-- NAVIGATION -->
                            <div class="d-flex justify-content-between mt-4">
                                <button class="btn btn-outline-secondary" @click="prevStep" :disabled="currentStep === 0">
                                    <svg class="icon"><use :href="`${spritesHref}#it-arrow-left`" /></svg> Indietro
                                </button>

                                <button class="btn btn-primary" @click="nextStep" :disabled="currentStep === steps.length - 1">
                                    Avanti <svg class="icon"><use :href="`${spritesHref}#it-arrow-right`" /></svg>
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

                    <button class="btn btn-primary w-100 mb-2" @click="importFromLocalStorage">
                        Importa scoping da localStorage
                    </button>

                    <button class="btn btn-secondary w-100 mb-2" @click="generaBozza" :disabled="!hasCollection">
                        Genera bozza provvedimento
                    </button>

                    <button class="btn btn-outline-secondary w-100" @click="eseguiNLP" :disabled="!hasBozza">
                        Esegui verifica NLP
                    </button>

                    <div v-if="nlp.running" class="text-center mt-3">
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
    import { ref, computed, watch } from 'vue'
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
        { label: 'Raccolta documenti' },
        { label: 'Bozza provvedimento' },
        { label: 'Verifica coerenza (NLP)' },
        { label: 'Revisione A.C.' },
        { label: 'Esporta & Protocolla' },
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
     * 1) RACCOLTA DOCUMENTI (da fasi precedenti)
     * ------------------------------------ */
    type Parere = { id: string; ente: string; tema: string; testo: string }
    type Topic = { nome: string; percentuale: number }
    type Divergenza = { id: string; tema: string; enti: string; note: string }
    type DashboardItem = { tema: string; count: number }
    type SIA = { titolo?: string; progetto?: string; descrizione?: string; quadroNormativo?: string; metodologiaGenerale?: string; analisiTemi?: any[]; monitoraggio?: string; conclusioni?: string; validato?: boolean; boilerplateReady?: boolean }

    const collezione = ref<{
        origine?: 'localStorage' | 'manual'
        pareri?: Parere[]
        topics?: Topic[]
        convergenze?: string[]
        divergenze?: Divergenza[]
        dashboard?: DashboardItem[]
        sia?: SIA | string
        snt?: string
    }>({})

    const manual = ref({
        sia: '',
        snt: '',
        pareri: '',
    })

    const KEYS = {
        pareri: 'Scoping:Pareri',
        topics: 'Scoping:Topics',
        convergenze: 'Scoping:Convergenze',
        divergenze: 'Scoping:Divergenze',
        dashboard: 'Scoping:Dashboard',
        sia: 'Scoping:SIA:TXT',
        snt: 'Scoping:SNT:TXT',
    }

    const hasCollection = computed(() => !!(
        collezione.value.pareri?.length ||
        collezione.value.sia ||
        collezione.value.snt ||
        collezione.value.topics?.length
    ))

    function importFromLocalStorage() {
        try {
            const parseMaybe = (v: string | null) => {
                if (!v) return undefined
                try { return JSON.parse(v) } catch { return v }
            }
            collezione.value.pareri = parseMaybe(localStorage.getItem(KEYS.pareri)) || []
            collezione.value.topics = parseMaybe(localStorage.getItem(KEYS.topics)) || []
            collezione.value.convergenze = parseMaybe(localStorage.getItem(KEYS.convergenze)) || []
            collezione.value.divergenze = parseMaybe(localStorage.getItem(KEYS.divergenze)) || []
            collezione.value.dashboard = parseMaybe(localStorage.getItem(KEYS.dashboard)) || []
            collezione.value.sia = parseMaybe(localStorage.getItem(KEYS.sia)) || ''
            collezione.value.snt = parseMaybe(localStorage.getItem(KEYS.snt)) || ''
            collezione.value.origine = 'localStorage'
        } catch (e) {
            console.error('Import localStorage fallito', e)
        }
    }

    function clearCollection() {
        collezione.value = {}
        manual.value = { sia: '', snt: '', pareri: '' }
    }

    function loadManual(which: 'sia' | 'snt' | 'pareri') {
        if (which === 'sia') {
            collezione.value.sia = manual.value.sia
        } else if (which === 'snt') {
            collezione.value.snt = manual.value.snt
        } else {
            try {
                const obj = JSON.parse(manual.value.pareri)
                collezione.value.pareri = obj.pareri || []
                collezione.value.topics = obj.topics || []
                collezione.value.convergenze = obj.convergenze || []
                collezione.value.divergenze = obj.divergenze || []
                collezione.value.dashboard = obj.dashboard || []
                collezione.value.origine = 'manual'
            } catch {
                alert('JSON non valido per Pareri/Topic/Divergenze/Dashboard')
            }
        }
    }

    /* ------------------------------------
     * 2) BOZZA PROVVEDIMENTO (sezioni precompilate)
     * ------------------------------------ */
    type Articolo = { id: string; titolo: string; testo: string }
    type Allegato = { id: string; nome: string }

    const provv = ref({
        locked: false,
        intestazione: { ente: '', settore: '', numero: '', data: '' },
        oggetto: '',
        premesse: {
            richiamiNormativi: '',
            considerato: ''
        },
        valutazioni: '',
        dispone: [] as Articolo[],
        allegati: [] as Allegato[],
    })

    const hasBozza = computed(() =>
        provv.value.oggetto || provv.value.dispone.length > 0 || provv.value.premesse.richiamiNormativi
    )

    function generaNumeroProgressivo(): string {
        const yyyy = new Date().getFullYear()
        const n = Math.floor(Math.random() * 9000) + 1000
        return `${n}/${yyyy}`
    }

    function generaBozza() {
        // Intestazione base
        const d = new Date()
        provv.value.intestazione.ente = provv.value.intestazione.ente || 'Autorità Competente Regionale'
        provv.value.intestazione.settore = provv.value.intestazione.settore || 'Settore VIA/VAS'
        provv.value.intestazione.numero = provv.value.intestazione.numero || generaNumeroProgressivo()
        provv.value.intestazione.data = provv.value.intestazione.data || d.toISOString().substring(0, 10)

        // Oggetto dal SIA/SNT
        const oggettoSIA = typeof collezione.value.sia === 'string'
            ? (collezione.value.sia.split('\n')[0] || '').replace(/^Titolo:\s*/i, '').trim()
            : (collezione.value.sia?.titolo || '')
        provv.value.oggetto = provv.value.oggetto || (oggettoSIA || 'Avvio della consultazione pubblica per il progetto di impianto fotovoltaico')

        // Premesse: richiami + considerato
        const richiami: string[] = []
        const qn = typeof collezione.value.sia !== 'string' ? collezione.value.sia?.quadroNormativo : ''
        if (qn) richiami.push(qn)
        richiami.push(
            'VISTO il D.Lgs. 152/2006 e s.m.i.;',
            'VISTE le linee guida ISPRA pertinenti;',
            'VISTA la documentazione istruttoria pervenuta;'
        )
        provv.value.premesse.richiamiNormativi = provv.value.premesse.richiamiNormativi || richiami.join('\n')

        const considerato: string[] = []
        if (collezione.value.convergenze?.length) {
            considerato.push(`CONSIDERATO che sussistono convergenze: ${collezione.value.convergenze.join(' ')}`)
        }
        if (collezione.value.divergenze?.length) {
            const sintDiv = collezione.value.divergenze.map(d => `${d.tema} (${d.enti})`).join('; ')
            considerato.push(`CONSIDERATO che emergono divergenze su: ${sintDiv}.`)
        }
        provv.value.premesse.considerato = provv.value.premesse.considerato || considerato.join(' ')

        // Valutazioni: sintesi da SIA/SNT
        const sntShort = (collezione.value.snt || '').split('\n').slice(0, 3).join(' ')
        const siaConclusioni = typeof collezione.value.sia !== 'string' ? (collezione.value.sia?.conclusioni || '') : ''
        provv.value.valutazioni = provv.value.valutazioni || [
            'Dalla valutazione tecnica emergono profili di compatibilità ambientale con idonee misure di mitigazione.',
            sntShort,
            siaConclusioni
        ].filter(Boolean).join('\n')

        // Articolato DISPONE precompilato
        if (provv.value.dispone.length === 0) {
            provv.value.dispone = [
                {
                    id: crypto.randomUUID(),
                    titolo: 'Avvio della consultazione pubblica',
                    testo: 'Di avviare la consultazione pubblica ai sensi della normativa vigente, come da allegato calendario.'
                },
                {
                    id: crypto.randomUUID(),
                    titolo: 'Messa a disposizione degli atti',
                    testo: 'Di mettere a disposizione del pubblico la documentazione (SIA, SNT, pareri) tramite il portale istituzionale.'
                },
                {
                    id: crypto.randomUUID(),
                    titolo: 'Presentazione osservazioni',
                    testo: 'Di consentire la presentazione di osservazioni da parte dei soggetti interessati entro 30 giorni dalla pubblicazione.'
                },
                {
                    id: crypto.randomUUID(),
                    titolo: 'Comunicazioni e trasmissioni',
                    testo: 'Di trasmettere il presente provvedimento ai soggetti istituzionali competenti.'
                },
            ]
        }

        // Allegati auto
        if (provv.value.allegati.length === 0) {
            const base: Allegato[] = []
            if (collezione.value.sia) base.push({ id: crypto.randomUUID(), nome: 'Allegato A — Studio di Impatto Ambientale (SIA)' })
            if (collezione.value.snt) base.push({ id: crypto.randomUUID(), nome: 'Allegato B — Sintesi Non Tecnica (SNT)' })
            if (collezione.value.pareri?.length) base.push({ id: crypto.randomUUID(), nome: 'Allegato C — Elenco pareri enti' })
            base.push({ id: crypto.randomUUID(), nome: 'Allegato D — Calendario consultazione' })
            provv.value.allegati = base
        }
    }

    function pulisciBozza() {
        provv.value.oggetto = ''
        provv.value.premesse = { richiamiNormativi: '', considerato: '' }
        provv.value.valutazioni = ''
        provv.value.dispone = []
        provv.value.allegati = []
    }

    function aggiungiArticolo() {
        provv.value.dispone.push({
            id: crypto.randomUUID(),
            titolo: '',
            testo: ''
        })
    }
    function rimuoviArticolo(i: number) {
        provv.value.dispone.splice(i, 1)
    }
    function muoviArticolo(i: number, delta: number) {
        const j = i + delta
        if (j < 0 || j >= provv.value.dispone.length) return
        const tmp = provv.value.dispone[i]
        provv.value.dispone[i] = provv.value.dispone[j]
        provv.value.dispone[j] = tmp
    }

    function aggiungiAllegato() {
        provv.value.allegati.push({ id: crypto.randomUUID(), nome: 'Nuovo allegato' })
    }
    function rimuoviAllegato(i: number) {
        provv.value.allegati.splice(i, 1)
    }

    /* ------------------------------------
     * 3) VERIFICA COERENZA (NLP mock)
     * ------------------------------------ */
    const nlp = ref({
        running: false,
        issues: [] as { severita: 'error' | 'warning' | 'info'; titolo: string; descrizione: string; suggerimento?: string; autoFix?: () => void }[]
    })

    function nlpCount(level: 'error' | 'warning' | 'info') {
        return nlp.value.issues.filter(i => i.severita === level).length
    }
    const badgeRisultatoNLP = computed(() => {
        const e = nlpCount('error'), w = nlpCount('warning')
        if (e > 0) return { class: 'alert-danger', label: 'Sono presenti errori bloccanti' }
        if (w > 0) return { class: 'alert-warning', label: 'Sono presenti avvisi' }
        return { class: 'alert-success', label: 'Documento coerente' }
    })

    function eseguiNLP() {
        nlp.value.running = true
        nlp.value.issues = []
        setTimeout(() => {
            const issues: typeof nlp.value.issues = []

            // Presenza sezioni
            if (!provv.value.oggetto.trim()) issues.push({
                severita: 'error',
                titolo: 'Oggetto mancante',
                descrizione: 'L’oggetto del provvedimento è vuoto.',
                suggerimento: 'Compila un oggetto sintetico e chiaro.'
            })

            if (!provv.value.premesse.richiamiNormativi.trim()) issues.push({
                severita: 'error',
                titolo: 'Premesse normative mancanti',
                descrizione: 'Mancano i richiami VISTO/VISTA.',
                suggerimento: 'Inserisci almeno i riferimenti essenziali (D.Lgs. 152/2006, linee guida, atti istruttori).',
                autoFix: () => {
                    provv.value.premesse.richiamiNormativi = [
                        'VISTO il D.Lgs. 152/2006 e s.m.i.;',
                        'VISTE le linee guida ISPRA pertinenti;',
                        'VISTA la documentazione istruttoria pervenuta;'
                    ].join('\n')
                }
            })

            if (provv.value.dispone.length === 0) issues.push({
                severita: 'error',
                titolo: 'Articolato assente',
                descrizione: 'La sezione DISPONE non contiene articoli.',
                suggerimento: 'Aggiungi almeno un articolo (avvio consultazione, pubblicazione, osservazioni, trasmissioni).',
                autoFix: () => { generaBozza() }
            })

            // Allegati coerenti
            const nomi = provv.value.allegati.map(a => a.nome.toLowerCase())
            if (collezione.value.sia && !nomi.some(n => n.includes('sia'))) issues.push({
                severita: 'warning',
                titolo: 'Allegato SIA non elencato',
                descrizione: 'È presente un SIA importato, ma non è tra gli allegati.',
                suggerimento: 'Aggiungi SIA tra gli allegati.',
                autoFix: () => provv.value.allegati.push({ id: crypto.randomUUID(), nome: 'Allegato — Studio di Impatto Ambientale (SIA)' })
            })
            if (collezione.value.snt && !nomi.some(n => n.includes('snt'))) issues.push({
                severita: 'warning',
                titolo: 'Allegato SNT non elencato',
                descrizione: 'È presente una SNT, ma non è tra gli allegati.',
                suggerimento: 'Aggiungi SNT tra gli allegati.',
                autoFix: () => provv.value.allegati.push({ id: crypto.randomUUID(), nome: 'Allegato — Sintesi Non Tecnica (SNT)' })
            })

            // Stile formale (verbi dispositivi)
            const testoDisp = provv.value.dispone.map(d => (d.titolo + ' ' + d.testo)).join(' ').toLowerCase()
            if (!/(dispone|di avviare|di approvare|di trasmettere|di mettere a disposizione)/i.test(testoDisp)) {
                issues.push({
                    severita: 'warning',
                    titolo: 'Formule dispositive non rilevate',
                    descrizione: 'Non sono state individuate espressioni tipiche del dispositivo.',
                    suggerimento: 'Usa formule come "DISPONE", "di avviare", "di approvare", "di trasmettere".'
                })
            }

            // Titoli articoli
            if (provv.value.dispone.length > 0) {
                provv.value.dispone.forEach((a, idx) => {
                    if (!a.titolo.trim()) {
                        issues.push({
                            severita: 'warning',
                            titolo: `Titolo mancante nell’articolo ${idx + 1}`,
                            descrizione: 'Un articolo non ha titolo.',
                            suggerimento: 'Inserisci un titolo breve e descrittivo.'
                        })
                    }
                })
            }

            // Coerenza oggetto/articolato
            if (provv.value.oggetto.toLowerCase().includes('consultazione') && !testoDisp.includes('consultazione')) {
                issues.push({
                    severita: 'info',
                    titolo: 'Coerenza oggetto/articolato',
                    descrizione: 'L’oggetto parla di consultazione ma non è citata chiaramente nel dispositivo.',
                    suggerimento: 'Inserisci un articolo esplicito di "Avvio della consultazione pubblica".',
                    autoFix: () => provv.value.dispone.unshift({
                        id: crypto.randomUUID(),
                        titolo: 'Avvio della consultazione pubblica',
                        testo: 'Di avviare la consultazione pubblica ai sensi della normativa vigente.'
                    })
                })
            }

            // Data/numero intestazione
            if (!provv.value.intestazione.data) {
                issues.push({
                    severita: 'warning',
                    titolo: 'Data assente in intestazione',
                    descrizione: 'Manca la data del provvedimento.',
                    autoFix: () => provv.value.intestazione.data = new Date().toISOString().substring(0, 10)
                })
            }
            if (!provv.value.intestazione.numero) {
                issues.push({
                    severita: 'warning',
                    titolo: 'Numero assente in intestazione',
                    descrizione: 'Manca il numero progressivo del provvedimento.',
                    autoFix: () => provv.value.intestazione.numero = generaNumeroProgressivo()
                })
            }

            nlp.value.issues = issues
            nlp.value.running = false
        }, 600)
    }

    function applicaAutoFix() {
        nlp.value.issues.forEach(i => { if (i.autoFix) i.autoFix() })
        eseguiNLP()
    }

    /* ------------------------------------
     * 4) APPROVAZIONE A.C. (lock + changelog + versione)
     * ------------------------------------ */
    const approvazione = ref({
        revisore: '',
        ruolo: '',
        esito: 'Approvato',
        versione: '1.0',
        note: '',
        approvato: false
    })

    const puoApprovare = computed(() => approvazione.value.approvato && approvazione.value.esito === 'Approvato' && hasBozza.value)

    const changelog = ref<string[]>([])
    function finalizzaApprovazione() {
        if (!puoApprovare.value) return
        provv.value.locked = true
        const ts = new Date().toLocaleString('it-IT')
        changelog.value.push(`Approvato da ${approvazione.value.revisore} (${approvazione.value.ruolo}) — v${approvazione.value.versione} — ${ts}`)
    }

    // Evita modifiche quando bloccato (in una UI reale si disabiliterebbero i campi)
    watch(provv, (v) => {
        if (v.locked) {
            // placeholder per eventuali side-effect
        }
    }, { deep: true })

    /* ------------------------------------
     * 5) ESPORTA & PROTOCOLLA
     * ------------------------------------ */
    function downloadText(filename: string, content: string) {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = filename
        a.click()
    }

    function downloadJSON(filename: string, obj: any) {
        const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json;charset=utf-8' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = filename
        a.click()
    }

    function serializeTXT(): string {
        const header = [
            `${provv.value.intestazione.ente} — ${provv.value.intestazione.settore}`,
            `Provvedimento n. ${provv.value.intestazione.numero} del ${provv.value.intestazione.data}`,
            '',
            `OGGETTO: ${provv.value.oggetto}`,
            '',
            'PREMESSE:',
            provv.value.premesse.richiamiNormativi || '(richiami assenti)',
            '',
            (provv.value.premesse.considerato ? `CONSIDERATO CHE:\n${provv.value.premesse.considerato}\n` : ''),
            'VALUTAZIONI TECNICHE:',
            provv.value.valutazioni || '(valutazioni assenti)',
            '',
            'DISPONE:'
        ].join('\n')

        const articoli = provv.value.dispone
            .map((a, i) => `Art. ${i + 1} — ${a.titolo}\n${a.testo}`)
            .join('\n\n')

        const allegati = [
            '',
            'ALLEGATI:',
            ...(provv.value.allegati.length
                ? provv.value.allegati.map((a) => `- ${a.nome}`)
                : ['(nessuno)']),
            '',
            `Stato approvazione: ${provv.value.locked ? 'APPROVATO' : 'BOZZA'}`
        ].join('\n')

        return [header, articoli, allegati].join('\n')
    }

    function exportProvvedimentoTXT() {
        downloadText('Provvedimento-Consultazione.txt', serializeTXT())
    }

    function exportProvvedimentoJSON() {
        downloadJSON('Provvedimento-Consultazione.json', {
            intestazione: provv.value.intestazione,
            oggetto: provv.value.oggetto,
            premesse: provv.value.premesse,
            valutazioni: provv.value.valutazioni,
            dispone: provv.value.dispone,
            allegati: provv.value.allegati,
            approvazione: {
                revisore: approvazione.value.revisore,
                ruolo: approvazione.value.ruolo,
                esito: approvazione.value.esito,
                versione: approvazione.value.versione,
                note: approvazione.value.note,
                approvato: approvazione.value.approvato
            },
            locked: provv.value.locked
        })
    }

    const payloadProtocollo = ref('')
    function generaPayloadProtocollo() {
        const payload = {
            metadata: {
                tipo: 'Provvedimento di consultazione',
                numero: provv.value.intestazione.numero,
                data: provv.value.intestazione.data,
                ente: provv.value.intestazione.ente,
                settore: provv.value.intestazione.settore,
                oggetto: provv.value.oggetto,
                versione: approvazione.value.versione,
                approvato: provv.value.locked
            },
            allegati: provv.value.allegati.map(a => ({ nome: a.nome, tipo: 'text/plain' })),
            riferimenti: {
                haSIA: !!collezione.value.sia,
                haSNT: !!collezione.value.snt,
                pareri: collezione.value.pareri?.length || 0
            }
        }
        payloadProtocollo.value = JSON.stringify(payload, null, 2)
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
</style>
