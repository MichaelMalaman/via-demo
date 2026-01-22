
<template>
    <!-- container principale con sfondo -->
    <div class="container-fluid p-4" style="background-color:#e3f2fd;">
        <!-- Barra azioni -->
        <div class="row align-items-center mt-4 mb-4">
            <!-- Pulsante sinistro -->
            <div class="col-6 d-flex justify-content-start">
                <button class="btn btn-outline-primary bg-white d-inline-flex align-items-center"
                        @click="goTo('/dashboard')"
                        style="height: 50px;">
                    <svg class="icon"><use :href="`${spritesHref}#it-arrow-left`" /></svg>
                    <span class="ms-2">Indietro</span>
                </button>
            </div>

            <!-- Pulsante destro -->
            <div class="col-6 d-flex justify-content-end">
                <!-- spazio azioni -->
            </div>
        </div>

        <div class="row">
            <!-- LEFT COLUMN -->
            <div class="col-12 col-lg-8 p-4">
                <div class="card border p-4">
                    <!-- sezione contenuti con sfondo grigio chiaro -->
                    <div class="p-4" style="background-color:#f5f5f5;">
                        <!-- HEADER -->
                        <div class="row">
                            <div class="col-12">
                                <div class="card p-4 text-white" style="background-color:#1565c0;">
                                    <div class="d-flex align-items-center justify-content-between">
                                        <h2 class="mb-2">Assistente Analisi Preliminare degli Impatti Ambientali (AC)</h2>
                                        <!-- Explainability pack allineato a destra del titolo -->
                                        <span class="explain-pack">
                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-info-circle"
                                                            color="light"
                                                            text="Questa pagina simula il flusso di analisi dello SPA e la generazione di una bozza decisionale."
                                                            placement="bottom"
                                                            outline
                                                            :iconOnly="true"
                                                            size="xs" />
                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-help-circle"
                                                            color="light"
                                                            text="Gli step includono: upload, analisi automatica, confronto storico, rischi, bozza di assoggettabilità e relazione finale."
                                                            placement="bottom"
                                                            outline
                                                            :iconOnly="true"
                                                            size="xs">Come</PopoverExplain>
                                        </span>
                                    </div>

                                    <p class="mb-1"><strong>File Analizzato:</strong> {{ uploadedFileName || '— nessun file' }}</p>
                                    <p class="mb-0"><strong>Data:</strong> {{ today }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- WIZARD: Stepper + contenuto -->
                        <div class="card p-4 mt-4">
                            <!-- Stepper (pill orizzontale) -->
                            <ul class="nav nav-pills flex-wrap gap-2 mb-3" role="tablist">
                                <li v-for="(s, idx) in steps"
                                    :key="s.key"
                                    class="nav-item"
                                    role="presentation">
                                    <button type="button"
                                            class="nav-link d-inline-flex align-items-center gap-2"
                                            :class="{ active: currentStep === idx }"
                                            @click="goToStep(idx)">
                                        <span class="badge rounded-pill" :class="badgeClass(idx)">
                                            <template v-if="stepCompleted[idx]">
                                                <svg class="icon"><use :href="`${spritesHref}#it-check-circle`" /></svg>
                                            </template>
                                            <template v-else>
                                                {{ idx + 1 }}
                                            </template>
                                        </span>
                                        <span class="text-start">{{ s.label }}</span>
                                    </button>
                                </li>
                            </ul>

                            <!-- Contenuti step -->
                            <div class="mt-3">
                                <!-- STEP 1: Upload SPA -->
                                <div v-if="currentStep === 0">
                                    <h3 class="mb-2">1. Carica documento SPA</h3>
                                    <p class="text-muted">Seleziona lo Studio Preliminare Ambientale da analizzare.</p>

                                    <div class="row g-3 align-items-end">
                                        <div class="col-12 col-md-8">
                                            <label class="form-label fw-semibold">Documento (PDF/DOCX)</label>
                                            <input class="form-control"
                                                   type="file"
                                                   accept=".pdf,.doc,.docx"
                                                   @change="onFileChange" />
                                            <div class="form-text">
                                                File corrente: <strong>{{ uploadedFileName || '—' }}</strong>
                                                <span v-if="uploadedSize">({{ uploadedSize }})</span>
                                            </div>
                                        </div>
                                        <div class="col-12 col-md-4 d-flex gap-2">
                                            <button class="btn btn-outline-secondary flex-fill"
                                                    :disabled="!selectedFile || isProcessing"
                                                    @click="clearUpload">
                                                Annulla
                                            </button>
                                            <button class="btn btn-primary flex-fill"
                                                    :disabled="!selectedFile || isProcessing"
                                                    @click="startAnalysis">
                                                Avvia analisi
                                            </button>
                                        </div>
                                    </div>

                                    <div v-if="isProcessing" class="text-center mt-3">
                                        <div class="spinner-border text-primary"></div>
                                        <p class="small text-muted mt-2">Elaborazione documento…</p>
                                    </div>

                                    <div v-if="uploadedFileName && !isProcessing" class="alert alert-success d-flex align-items-center gap-2 mt-3">
                                        <svg class="icon"><use :href="`${spritesHref}#it-check-circle`" /></svg>
                                        Documento pronto per l’analisi.
                                    </div>
                                </div>

                                <!-- STEP 2: Analisi automatica -->
                                <div v-else-if="currentStep === 1">
                                    <h3 class="mb-2">2. Analisi automatica contenuti SPA</h3>
                                    <p class="text-muted">Sintesi dei contenuti e individuazione aree di attenzione.</p>

                                    <div v-if="isProcessing" class="text-center">
                                        <div class="spinner-border text-primary"></div>
                                        <p class="small text-muted mt-2">Analisi in corso…</p>
                                    </div>

                                    <div v-else>
                                        <div class="alert alert-info">
                                            <strong>Risultato sintetico:</strong>
                                            {{ analysisSummary }}
                                        </div>

                                        <ul>
                                            <li>Tipologia intervento: <strong>{{ tipologiaIntervento }}</strong></li>
                                            <li>Contesto territoriale: {{ contestoTerritoriale }}</li>
                                            <li>Interazioni ambientali: {{ interazioniSintesi }}</li>
                                        </ul>

                                        <div class="row g-3 mt-2">
                                            <div class="col-12 col-md-4">
                                                <label class="form-label small fw-semibold">Affidabilità analisi</label>
                                                <div class="progress">
                                                    <div class="progress-bar"
                                                         role="progressbar"
                                                         :style="{ width: reliabilityScore + '%' }"
                                                         :class="scoreBarClass(reliabilityScore)">
                                                        {{ reliabilityScore }}%
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 col-md-4">
                                                <label class="form-label small fw-semibold">Completezza SPA</label>
                                                <div class="progress">
                                                    <div class="progress-bar"
                                                         role="progressbar"
                                                         :style="{ width: completenessScore + '%' }"
                                                         :class="scoreBarClass(completenessScore)">
                                                        {{ completenessScore }}%
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 col-md-4">
                                                <label class="form-label small fw-semibold">Somiglianza storico</label>
                                                <div class="progress">
                                                    <div class="progress-bar"
                                                         role="progressbar"
                                                         :style="{ width: similarityScore + '%' }"
                                                         :class="scoreBarClass(similarityScore)">
                                                        {{ similarityScore }}%
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="d-flex gap-2 mt-3">
                                            <button class="btn btn-outline-secondary" @click="regenAnalysis" :disabled="isProcessing">
                                                Rigenera analisi
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- STEP 3: Confronto storico -->
                                <div v-else-if="currentStep === 2">
                                    <h3 class="mb-2">3. Confronto con database storico</h3>
                                    <p class="text-muted">Esito del confronto automatico con casi analoghi.</p>

                                    <div class="list-group mb-3">
                                        <div class="list-group-item d-flex justify-content-between">
                                            Somiglianza con casi campione: <strong>{{ similarityScore }}%</strong>
                                            <span class="badge" :class="similarityBadgeClass">{{ similarityBadgeText }}</span>
                                        </div>
                                        <div class="list-group-item">• {{ matchCounts.industrie }} impianti su area industriale dismessa</div>
                                        <div class="list-group-item">• {{ matchCounts.fauna }} casi con rischio su fauna/corridoi</div>
                                        <div class="list-group-item">• {{ matchCounts.integrazioni }} casi con integrazioni richieste</div>
                                    </div>

                                    <button class="btn btn-outline-primary" @click="regenSimilarity" :disabled="isProcessing">
                                        Aggiorna confronto
                                    </button>
                                </div>

                                <!-- STEP 4: Rischi probabili -->
                                <div v-else-if="currentStep === 3">
                                    <h3 class="mb-2">4. Evidenziazione rischi probabili</h3>
                                    <p class="text-muted">Selezione sintetica dei rischi con livello stimato.</p>

                                    <div class="alert alert-warning d-flex align-items-center gap-2">
                                        <svg class="icon"><use :href="`${spritesHref}#it-warning`" /></svg>
                                        <strong>{{ risks.length }} rischi potenzialmente significativi identificati</strong>
                                    </div>

                                    <ul class="list-group">
                                        <li v-for="r in risks"
                                            :key="r.id"
                                            class="list-group-item d-flex justify-content-between align-items-start">
                                            <div>
                                                <div class="fw-semibold">{{ r.titolo }}</div>
                                                <div class="small text-muted">{{ r.note }}</div>
                                            </div>
                                            <span class="badge" :class="riskBadgeClass(r.severita)">{{ r.severita }}</span>
                                        </li>
                                    </ul>

                                    <div class="mt-3 d-flex gap-2">
                                        <button class="btn btn-outline-secondary" @click="shuffleRisks" :disabled="isProcessing">
                                            Rigenera rischi
                                        </button>
                                    </div>
                                </div>

                                <!-- STEP 5: Bozza assoggettabilità -->
                                <div v-else-if="currentStep === 4">
                                    <h3 class="mb-2">5. Bozza di valutazione di assoggettabilità</h3>
                                    <p class="text-muted">Sintesi degli esiti e proposta iniziale.</p>

                                    <div class="card p-3">
                                        <p class="mb-2">
                                            In base agli elementi raccolti, il progetto
                                            <strong>{{ propostaVia === 'SI' ? 'potrebbe richiedere VIA completa' : 'potrebbe non richiedere VIA completa' }}</strong>.
                                        </p>
                                        <p class="mb-2"><strong>Motivazioni principali:</strong></p>
                                        <ul class="mb-0">
                                            <li v-for="m in motivazioni" :key="m">{{ m }}</li>
                                        </ul>
                                    </div>

                                    <div class="mt-3">
                                        <label class="form-label fw-semibold">Proposta</label>
                                        <div class="d-flex gap-3">
                                            <div class="form-check">
                                                <input class="form-check-input"
                                                       type="radio"
                                                       id="via-si"
                                                       value="SI"
                                                       v-model="propostaVia" />
                                                <label class="form-check-label" for="via-si">Sì — VIA completa</label>
                                            </div>
                                            <div class="form-check">
                                                <input class="form-check-input"
                                                       type="radio"
                                                       id="via-no"
                                                       value="NO"
                                                       v-model="propostaVia" />
                                                <label class="form-check-label" for="via-no">No — non necessaria</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- STEP 6: Relazione & template -->
                                <div v-else-if="currentStep === 5">
                                    <h3 class="mb-2">6. Relazione (template standard)</h3>
                                    <p class="text-muted">Struttura standardizzata conforme ai format AC.</p>

                                    <ul class="small">
                                        <li>Introduzione</li>
                                        <li>Contesto territoriale</li>
                                        <li>Analisi impatti</li>
                                        <li>Risultati confronto storico</li>
                                        <li>Valutazione assoggettabilità</li>
                                        <li>Decisione motivata</li>
                                    </ul>

                                    <div class="alert alert-secondary">
                                        <strong>Anteprima:</strong> verrà generato un file di testo con i valori mostrati negli step precedenti.
                                    </div>

                                    <button class="btn btn-outline-primary" @click="exportRelazione" :disabled="isProcessing">
                                        Genera & scarica relazione
                                    </button>
                                </div>
                            </div>

                            <!-- Navigazione step -->
                            <div class="d-flex justify-content-between mt-4">
                                <button class="btn btn-outline-secondary" @click="prevStep" :disabled="currentStep === 0 || isProcessing">
                                    <svg class="icon"><use :href="`${spritesHref}#it-arrow-left`" /></svg>
                                    <span class="ms-1">Indietro</span>
                                </button>
                                <button class="btn btn-primary" @click="nextStep" :disabled="currentStep === steps.length - 1 || isProcessing">
                                    <span class="me-1">Avanti</span>
                                    <svg class="icon"><use :href="`${spritesHref}#it-arrow-right`" /></svg>
                                </button>
                            </div>
                        </div>
                    </div> <!-- /bg section -->
                </div>
            </div>

            <!-- RIGHT COLUMN -->
            <div class="col-12 col-lg-4 p-4">
                <!-- AI Helper -->
                <div class="card border p-4 mb-4">
                    <h4>AI Helper</h4>

                    <button class="btn btn-primary w-100 mb-2" type="button" @click="quickRun" :disabled="isProcessing">
                        Esegui tutti gli step
                    </button>
                    <button class="btn btn-secondary w-100 mb-2" type="button" @click="regenAll" :disabled="isProcessing">
                        Rigenera indicatori
                    </button>
                    <button class="btn btn-success w-100" type="button" @click="goToStep(5)" :disabled="isProcessing">
                        Vai a Relazione
                    </button>

                    <div v-if="isProcessing" class="text-center mt-3">
                        <div class="spinner-border text-primary"></div>
                        <p class="small text-muted mt-2">Elaborazione…</p>
                    </div>
                </div>

                <!-- Scoreboard -->
                <div class="card border p-4">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <h4 class="mb-0">Indicatori di affidabilità</h4>
                        <button class="btn btn-outline-secondary btn-sm" @click="regenAll" :disabled="isProcessing">
                            Aggiorna
                        </button>
                    </div>

                    <div class="mb-3">
                        <div class="d-flex justify-content-between">
                            <span class="small fw-semibold">Affidabilità analisi</span>
                            <span class="small">{{ reliabilityScore }}%</span>
                        </div>
                        <div class="progress">
                            <div class="progress-bar"
                                 role="progressbar"
                                 :style="{ width: reliabilityScore + '%' }"
                                 :class="scoreBarClass(reliabilityScore)"></div>
                        </div>
                    </div>

                    <div class="mb-3">
                        <div class="d-flex justify-content-between">
                            <span class="small fw-semibold">Somiglianza storico</span>
                            <span class="small">{{ similarityScore }}%</span>
                        </div>
                        <div class="progress">
                            <div class="progress-bar"
                                 role="progressbar"
                                 :style="{ width: similarityScore + '%' }"
                                 :class="scoreBarClass(similarityScore)"></div>
                        </div>
                    </div>

                    <div>
                        <div class="d-flex justify-content-between">
                            <span class="small fw-semibold">Completezza SPA</span>
                            <span class="small">{{ completenessScore }}%</span>
                        </div>
                        <div class="progress">
                            <div class="progress-bar"
                                 role="progressbar"
                                 :style="{ width: completenessScore + '%' }"
                                 :class="scoreBarClass(completenessScore)"></div>
                        </div>
                    </div>
                </div>
            </div> <!-- /RIGHT -->
        </div>
    </div>
</template>

<script setup lang="ts">
    import PopoverExplain from '@/components/PopoverExplain.vue'
    import { ref, computed } from 'vue'
    import { useRouter } from 'vue-router'

    import spritesUrl from 'bootstrap-italia/dist/svg/sprites.svg?url'
    const spritesHref = spritesUrl

    const router = useRouter()
    function goTo(path: string) { router.push(path) }

    const today = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })

    /* ========== WIZARD STATE ========== */
    const steps = [
        { key: 'upload', label: 'Upload SPA' },
        { key: 'analisi', label: 'Analisi automatica' },
        { key: 'storico', label: 'Confronto storico' },
        { key: 'rischi', label: 'Rischi probabili' },
        { key: 'assog', label: 'Bozza assoggettabilità' },
        { key: 'relazione', label: 'Relazione finale' },
    ]
    const currentStep = ref(0)
    const stepCompleted = ref<boolean[]>(steps.map(() => false))
    function goToStep(idx: number) { currentStep.value = idx }
    function nextStep() {
        if (currentStep.value < steps.length - 1) {
            stepCompleted.value[currentStep.value] = true
            currentStep.value++
        }
    }
    function prevStep() {
        if (currentStep.value > 0) currentStep.value--
    }
    function badgeClass(idx: number) {
        return currentStep.value === idx ? 'bg-primary' : (stepCompleted.value[idx] ? 'bg-success' : 'bg-secondary')
    }

    /* ========== UPLOAD (simulato) ========== */
    const selectedFile = ref<File | null>(null)
    const uploadedFileName = ref<string>('')
    const uploadedSize = ref<string>('')

    function onFileChange(e: Event) {
        const input = e.target as HTMLInputElement
        const f = input.files?.[0]
        if (f) {
            selectedFile.value = f
            uploadedFileName.value = f.name
            uploadedSize.value = humanSize(f.size)
        } else {
            clearUpload()
        }
    }
    function clearUpload() {
        selectedFile.value = null
        uploadedFileName.value = ''
        uploadedSize.value = ''
    }

    function humanSize(n: number) {
        if (!n) return ''
        const units = ['B', 'KB', 'MB', 'GB']
        let i = 0
        let s = n
        while (s >= 1024 && i < units.length - 1) { s = s / 1024; i++ }
        return `${s.toFixed(1)} ${units[i]}`
    }

    /* ========== ANALISI & SCORE (simulati) ========== */
    const isProcessing = ref(false)

    // indicatori
    const reliabilityScore = ref(78)
    const similarityScore = ref(82)
    const completenessScore = ref(73)

    // testi sintesi
    const analysisSummary = ref('Il documento indica possibili interferenze moderate su suolo, atmosfera e fauna; necessarie integrazioni su gestione cantiere e monitoraggi.')
    const tipologiaIntervento = ref('Impianto energetico')
    const contestoTerritoriale = ref('Area industriale dismessa con vincoli limitati')
    const interazioniSintesi = ref('Suolo, atmosfera (polveri), fauna locale (corridoi)')

    // storico - conteggi sintetici
    const matchCounts = ref({ industrie: 42, fauna: 58, integrazioni: 19 })

    function startAnalysis() {
        isProcessing.value = true
        // Step 1 -> avvio analisi: al termine marca completato e va allo step 2
        setTimeout(() => {
            // valori pseudo-random coerenti
            seedScores()
            stepCompleted.value[0] = true
            isProcessing.value = false
            currentStep.value = 1
        }, 1200)
    }

    function seedScores() {
        reliabilityScore.value = randRange(68, 90)
        similarityScore.value = randRange(60, 92)
        completenessScore.value = randRange(60, 88)

        // aggiorna sintesi
        const syn = [
            'Il documento descrive in modo adeguato il progetto, con alcuni punti da integrare su gestione cantiere.',
            'Le interazioni con fauna e qualità dell’aria risultano rilevanti in fase di cantiere.',
            'Il confronto con casi analoghi suggerisce possibile assoggettamento a VIA.',
        ]
        analysisSummary.value = syn[randRange(0, syn.length - 1)]

        // aggiorna storico counts
        matchCounts.value = {
            industrie: randRange(35, 55),
            fauna: randRange(40, 70),
            integrazioni: randRange(10, 30)
        }

        // aggiorna testi contesto
        const contesti = [
            'Area industriale dismessa con vincoli limitati',
            'Area periurbana con corridoi ecologici prossimi',
            'Zona produttiva con viabilità dedicata'
        ]
        contestoTerritoriale.value = contesti[randRange(0, contesti.length - 1)]
    }

    function randRange(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    function regenAnalysis() {
        isProcessing.value = true
        setTimeout(() => {
            seedScores()
            isProcessing.value = false
        }, 700)
    }

    function regenSimilarity() {
        isProcessing.value = true
        setTimeout(() => {
            similarityScore.value = randRange(55, 95)
            matchCounts.value = {
                industrie: randRange(30, 60),
                fauna: randRange(35, 75),
                integrazioni: randRange(8, 35)
            }
            isProcessing.value = false
        }, 600)
    }

    const similarityBadgeClass = computed(() => {
        if (similarityScore.value >= 80) return 'bg-primary'
        if (similarityScore.value >= 60) return 'bg-info'
        return 'bg-secondary'
    })
    const similarityBadgeText = computed(() => {
        if (similarityScore.value >= 80) return 'Affidabile'
        if (similarityScore.value >= 60) return 'Buona'
        return 'Bassa'
    })

    function scoreBarClass(v: number) {
        if (v >= 80) return 'bg-success'
        if (v >= 60) return 'bg-warning'
        return 'bg-danger'
    }

    /* ========== RISCHI (simulati) ========== */
    type Severita = 'basso' | 'medio' | 'alto'
    type Risk = { id: string; titolo: string; note: string; severita: Severita }

    const risks = ref<Risk[]>([
        { id: 'r1', titolo: 'Polveri in fase di cantiere', note: 'Necessarie barriere/umidificazione', severita: 'medio' },
        { id: 'r2', titolo: 'Interferenza con corridoi ecologici', note: 'Monitoraggio periodico fauna', severita: 'basso' },
        { id: 'r3', titolo: 'Gestione terre e rocce da scavo', note: 'Piano conforme D.Lgs. 152/2006', severita: 'medio' },
    ])

    function shuffleRisks() {
        const severities: Severita[] = ['basso', 'medio', 'alto']
        risks.value = risks.value.map(r => ({ ...r, severita: severities[randRange(0, 2)] }))
    }

    function riskBadgeClass(s: Severita) {
        return {
            'bg-success': s === 'basso',
            'bg-warning': s === 'medio',
            'bg-danger': s === 'alto',
            'badge': true
        }
    }

    /* ========== PROPOSTA & MOTIVAZIONI (simulate) ========== */
    const propostaVia = ref<'SI' | 'NO'>('SI')
    const motivazioni = computed(() => {
        const m: string[] = []
        if (similarityScore.value >= 75) m.push('Confronto storico: elevata somiglianza con casi assoggettati')
        if (reliabilityScore.value < 70) m.push('Affidabilità analisi non massima: opportuno approfondimento')
        if (completenessScore.value < 80) m.push('Completezza documento migliorabile in alcune sezioni')
        if (!m.length) m.push('Valutazione prudenziale in base al quadro informativo')
        return m
    })

    /* ========== RELAZIONE: export .txt ========== */
    function exportRelazione() {
        const lines = [
            '=== Relazione di Analisi Preliminare (Simulazione) ===',
            `Data: ${today}`,
            `Documento: ${uploadedFileName.value || '—'}`,
            '',
            '1) Analisi automatica',
            `- Affidabilità analisi: ${reliabilityScore.value}%`,
            `- Completezza SPA: ${completenessScore.value}%`,
            `- Somiglianza storico: ${similarityScore.value}%`,
            `- Sintesi: ${analysisSummary.value}`,
            '',
            '2) Rischi probabili',
            ...risks.value.map(r => `- ${r.titolo} [${r.severita}] — ${r.note}`),
            '',
            '3) Bozza di assoggettabilità',
            `- Proposta: ${propostaVia.value === 'SI' ? 'Sì — VIA completa' : 'No — non necessaria'}`,
            '  Motivazioni:',
            ...motivazioni.value.map(m => `  • ${m}`),
            '',
            '4) Struttura relazione (template)',
            '   Introduzione; Contesto; Analisi; Confronto storico; Assoggettabilità; Decisione motivata.',
            '',
            '=== Fine Relazione ==='
        ]
        const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = 'Relazione-Analisi-Preliminare.txt'
        a.click()
        URL.revokeObjectURL(a.href)
    }

    /* ========== Helper rapidi ========== */
    function quickRun() {
        // esegue upload finto + analisi + passa allo step finale
        if (!uploadedFileName.value) {
            uploadedFileName.value = 'SPA-001.pdf'
            uploadedSize.value = '1.2 MB'
        }
        isProcessing.value = true
        setTimeout(() => {
            seedScores()
            stepCompleted.value[0] = true // upload
            stepCompleted.value[1] = true // analisi
            stepCompleted.value[2] = true // storico
            stepCompleted.value[3] = true // rischi
            stepCompleted.value[4] = true // bozza
            isProcessing.value = false
            currentStep.value = 5
        }, 1200)
    }

    function regenAll() {
        isProcessing.value = true
        setTimeout(() => {
            seedScores()
            shuffleRisks()
            // proposta predefinita in base a punteggi
            propostaVia.value = (similarityScore.value >= 75 || reliabilityScore.value < 70) ? 'SI' : 'NO'
            isProcessing.value = false
        }, 800)
    }
</script>

<style scoped>
    h2, h3, h4 {
        font-weight: bold;
    }

    /* Pacchetto di due pulsanti Explainability sempre allineato a destra */
    .explain-pack {
        float: right;
        display: inline-flex;
        gap: .5rem;
        margin-left: .5rem;
    }

    /* Clear del float per evitare sovrapposizioni */
    p::after, h3::after, h4::after, ul::after {
        content: "";
        display: block;
        clear: both;
    }

    /* Dimensioni icona standard BI nei bottoni */
    .icon {
        width: 16px;
        height: 16px;
    }

    /* Nav pills stepper: pill più comode al click */
    .nav-pills .nav-link {
        display: inline-flex;
        align-items: center;
        gap: .5rem;
    }

    /* Badge step */
    .badge .icon {
        width: 14px;
        height: 14px;
    }
</style>
