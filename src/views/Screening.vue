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
                                        <h2 class="mb-2">1 - SCREENING – Gestione fasi (AC)</h2>
                                        <!-- Explainability pack allineato a destra del titolo -->
                                        <span class="explain-pack">
                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-info-circle"
                                                            color="light"
                                                            text="Questa pagina implementa le fasi dello SCREENING: verifica completezza, (auto)rigetto in caso di incoerenze, pubblicazione/consultazione, integrazioni e provvedimento."
                                                            placement="bottom"
                                                            outline
                                                            :iconOnly="true"
                                                            size="xs" />
                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-help-circle"
                                                            color="light"
                                                            text="Input richiesti: SPA e Copia pagamento. Consultazione: 30 giorni. Integrazioni: richiesta entro 15 giorni dal termine consultazione; proponente: 45 giorni. Bozza e pubblicazione provvedimento assistite da AI."
                                                            placement="bottom"
                                                            outline
                                                            :iconOnly="true"
                                                            size="xs">Come</PopoverExplain>
                                        </span>
                                    </div>

                                    <p class="mb-1">
                                        <strong>Stato pratica:</strong>
                                        <span class="badge ms-1"
                                              :class="{
                        'bg-success': status === 'ok',
                        'bg-danger': status === 'rejected',
                        'bg-secondary': status === 'draft'
                      }">{{ statusLabel }}</span>
                                    </p>
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
                                                <svg class="icon">
                                                    <use :href="`${spritesHref}#it-check-circle`" />
                                                </svg>
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
                                <!-- STEP 1: Verifica completezza -->
                                <div v-if="currentStep === 0">
                                    <h3 class="mb-2">1. Verifica completezza documentale</h3>
                                    <p class="text-muted">
                                        Carica i documenti richiesti. La verifica di completezza è in tempo reale.
                                    </p>

                                    <div class="row g-3">
                                        <div class="col-12 col-lg-6">
                                            <label class="form-label fw-semibold">Studio Preliminare Ambientale (SPA)</label>
                                            <input class="form-control"
                                                   type="file"
                                                   accept=".pdf,.doc,.docx"
                                                   @change="onFileChange($event, 'spa')" />
                                            <div class="form-text">
                                                File: <strong>{{ spaFileName || '—' }}</strong>
                                                <span v-if="spaSize">({{ spaSize }})</span>
                                            </div>
                                            <div class="mt-1">
                                                <span class="badge"
                                                      :class="hasSpa ? 'bg-success' : 'bg-secondary'">{{ hasSpa ? 'Caricato' : 'Manca' }}</span>
                                            </div>
                                        </div>

                                        <div class="col-12 col-lg-6">
                                            <label class="form-label fw-semibold">Copia pagamento Contributo</label>
                                            <input class="form-control"
                                                   type="file"
                                                   accept=".pdf,.jpg,.jpeg,.png"
                                                   @change="onFileChange($event, 'fee')" />
                                            <div class="form-text">
                                                File: <strong>{{ feeFileName || '—' }}</strong>
                                                <span v-if="feeSize">({{ feeSize }})</span>
                                            </div>
                                            <div class="mt-1">
                                                <span class="badge"
                                                      :class="hasFee ? 'bg-success' : 'bg-secondary'">{{ hasFee ? 'Caricato' : 'Manca' }}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Check coerenza (simulato) -->
                                    <div class="alert mt-3" :class="coerenzaOk ? 'alert-success' : 'alert-warning'">
                                        <strong>Coerenza documentale:</strong>
                                        <span v-if="coerenzaOk">documenti coerenti.</span>
                                        <span v-else>verifica in corso o esito incerto (caricare/riprovare).</span>
                                    </div>

                                    <!-- Completezza progress -->
                                    <div class="row g-3 mt-2">
                                        <div class="col-12 col-md-6">
                                            <label class="form-label small fw-semibold">Completezza documentale</label>
                                            <div class="progress">
                                                <div class="progress-bar"
                                                     role="progressbar"
                                                     :style="{ width: completenessScore + '%' }"
                                                     :class="scoreBarClass(completenessScore)">
                                                    {{ completenessScore }}%
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12 col-md-6 d-flex align-items-end gap-2">
                                            <button class="btn btn-outline-secondary flex-fill"
                                                    @click="resetUpload"
                                                    :disabled="isProcessing">
                                                Annulla / Svuota
                                            </button>
                                            <button class="btn btn-primary flex-fill"
                                                    @click="elaboraPreReport"
                                                    :disabled="!hasSpa || isProcessing">
                                                Elabora pre-report
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Pre-report (impatti ambientali) -->
                                    <div v-if="preReport" class="alert alert-info mt-3">
                                        <strong>Pre-report impatti ambientali:</strong>
                                        <div class="mt-1">{{ preReport }}</div>
                                    </div>

                                    <!-- Esiti automatici -->
                                    <div class="mt-3 d-flex flex-wrap gap-2">
                                        <button class="btn btn-danger"
                                                @click="autoRigetta"
                                                :disabled="hasRequiredDocs && coerenzaOk || isProcessing">
                                            Rigetta pratica (incompletezza/incoerenza)
                                        </button>
                                        <button class="btn btn-success"
                                                @click="confermaCompletezza"
                                                :disabled="!hasRequiredDocs || !coerenzaOk || isProcessing">
                                            Conferma completezza
                                        </button>
                                    </div>

                                    <div v-if="status === 'rejected'" class="alert alert-danger mt-3">
                                        <strong>Pratica rigettata automaticamente:</strong>
                                        documentazione non completa o incoerente.
                                        <div class="mt-2">
                                            <button class="btn btn-outline-light btn-sm" @click="goToStep(1)">
                                                Vedi fase “Richiesta integrazioni”
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- STEP 2: Richiesta integrazioni (N/A – auto) -->
                                <div v-else-if="currentStep === 1">
                                    <h3 class="mb-2">2. Richiesta integrazioni</h3>
                                    <p class="text-muted">
                                        N/A – Il sistema riconosce i documenti e <strong>rigetta la pratica</strong> se
                                        non sono completi o coerenti.
                                    </p>

                                    <div v-if="status === 'rejected'" class="alert alert-danger">
                                        <svg class="icon me-1"><use :href="`${spritesHref}#it-close-circle`" /></svg>
                                        <strong>Esito:</strong> Pratica rigettata per incompletezza o incoerenza.
                                    </div>

                                    <div v-else class="alert alert-success">
                                        <svg class="icon me-1"><use :href="`${spritesHref}#it-check-circle`" /></svg>
                                        <strong>Esito:</strong> Documentazione completa e coerente. Non sono richieste integrazioni in questa fase.
                                    </div>

                                    <div class="d-flex gap-2 mt-3">
                                        <button class="btn btn-outline-secondary" @click="goToStep(0)">
                                            Torna alla verifica documentale
                                        </button>
                                        <button class="btn btn-primary"
                                                @click="nextStep"
                                                :disabled="status === 'rejected'">
                                            Procedi a Pubblicazione & Consultazione
                                        </button>
                                    </div>
                                </div>

                                <!-- STEP 3: Pubblicazione & Consultazione (30 gg) -->
                                <div v-else-if="currentStep === 2">
                                    <h3 class="mb-2">3. Pubblicazione & Consultazione pubblica</h3>
                                    <p class="text-muted">
                                        AC pubblica lo SPA, notifica amm.ni/enti. Chiunque può presentare osservazioni entro 30 giorni.
                                    </p>

                                    <div class="d-flex flex-wrap gap-2 mb-3">
                                        <button class="btn btn-outline-primary"
                                                @click="pubblicaSPA"
                                                :disabled="!!publishedAt || isProcessing || status !== 'ok'">
                                            Pubblica SPA sul portale & invia notifiche
                                        </button>
                                        <button class="btn btn-outline-secondary"
                                                @click="generaReportOsservazioni"
                                                :disabled="osservazioni.length === 0 || isProcessing">
                                            Genera Report AI osservazioni
                                        </button>
                                    </div>

                                    <div class="row g-3">
                                        <div class="col-12 col-lg-6">
                                            <div class="card p-3 h-100">
                                                <div class="mb-2">
                                                    <strong>Pubblicazione:</strong>
                                                    <span class="ms-1">{{ publishedAt ? formatDate(publishedAt) : '—' }}</span>
                                                </div>
                                                <div class="mb-2">
                                                    <strong>Fine consultazione (30 gg):</strong>
                                                    <span class="ms-1">{{ consultationEnd ? formatDate(consultationEnd) : '—' }}</span>
                                                </div>
                                                <div>
                                                    <strong>Giorni residui:</strong>
                                                    <span class="badge ms-1"
                                                          :class="{
                                                          'bg-success' : giorniResiduiConsultazione>
                                                        10,
                                                        'bg-warning': giorniResiduiConsultazione <= 10 && giorniResiduiConsultazione > 0,
                                                        'bg-danger': giorniResiduiConsultazione <= 0
                                                        }"
                                                        >{{ publishedAt ? giorniResiduiConsultazione : '—' }}
                                                    </span>
                                                </div>

                                                <div class="mt-3">
                                                    <label class="form-label small fw-semibold">Avanzamento consultazione</label>
                                                    <div class="progress">
                                                        <div class="progress-bar"
                                                             role="progressbar"
                                                             :style="{ width: consultazioneProgress + '%' }"
                                                             :class="scoreBarClass(consultazioneProgress)">
                                                            {{ consultazioneProgress }}%
                                                        </div>
                                                    </div>
                                                </div>

                                                <div v-if="publishedAt" class="alert alert-info mt-3">
                                                    <svg class="icon me-1"><use :href="`${spritesHref}#it-mail`" /></svg>
                                                    Notifiche inviate a amministrazioni/enti. Consultazione
                                                    <strong>{{ consultazioneAttiva ? 'attiva' : 'chiusa' }}</strong>.
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-12 col-lg-6">
                                            <div class="card p-3 h-100">
                                                <strong>Invia osservazione (anche community)</strong>
                                                <div class="mt-2">
                                                    <label class="form-label small">Autore (opzionale)</label>
                                                    <input class="form-control"
                                                           type="text"
                                                           v-model="osservazioneAutore"
                                                           placeholder="Nome o ente"
                                                           :disabled="!consultazioneAttiva" />
                                                </div>
                                                <div class="mt-2">
                                                    <label class="form-label small">Testo osservazione</label>
                                                    <textarea class="form-control"
                                                              rows="3"
                                                              v-model="osservazioneTesto"
                                                              placeholder="Inserisci osservazione..."
                                                              :disabled="!consultazioneAttiva"></textarea>
                                                </div>
                                                <div class="mt-2 d-flex gap-2">
                                                    <button class="btn btn-primary"
                                                            @click="aggiungiOsservazione"
                                                            :disabled="!consultazioneAttiva || !osservazioneTesto.trim()">
                                                        Invia osservazione
                                                    </button>
                                                    <span class="align-self-center small text-muted">Totale: <strong>{{ osservazioni.length }}</strong></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div v-if="osservazioni.length" class="card p-3 mt-3">
                                        <h6 class="mb-2">Osservazioni ricevute</h6>
                                        <ul class="list-group">
                                            <li v-for="o in osservazioni"
                                                :key="o.id"
                                                class="list-group-item">
                                                <div class="d-flex justify-content-between">
                                                    <div>
                                                        <strong>{{ o.autore || 'Anonimo/Community' }}</strong>
                                                        <span class="text-muted small ms-2">{{ formatDate(o.data) }}</span>
                                                    </div>
                                                    <span class="badge bg-secondary">#{{ o.id }}</span>
                                                </div>
                                                <div class="mt-1">{{ o.testo }}</div>
                                            </li>
                                        </ul>

                                        <div v-if="aiObservationsReport" class="alert alert-secondary mt-3">
                                            <strong>Report AI (osservazioni):</strong>
                                            <div class="mt-1">{{ aiObservationsReport }}</div>
                                        </div>
                                    </div>
                                </div>

                                <!-- STEP 4: Integrazioni & Provvedimento -->
                                <div v-else-if="currentStep === 3">
                                    <h3 class="mb-2">4. Integrazioni & Provvedimento</h3>
                                    <p class="text-muted">
                                        Integrazioni richiedibili entro 15 giorni dal termine consultazione. Il proponente ha 45 giorni per rispondere. Generazione bozza AI e pubblicazione provvedimento VIA.
                                    </p>

                                    <div class="row g-3">
                                        <div class="col-12 col-xl-6">
                                            <div class="card p-3 h-100">
                                                <div class="mb-2">
                                                    <strong>Fine consultazione:</strong>
                                                    <span class="ms-1">{{ consultationEnd ? formatDate(consultationEnd) : '—' }}</span>
                                                </div>
                                                <div class="mb-2">
                                                    <strong>Scadenza richiesta integrazioni (15 gg):</strong>
                                                    <span class="ms-1">
                                                        {{
                            integrazioneWindowEnd ? formatDate(integrazioneWindowEnd) : '—'
                                                        }}
                                                    </span>
                                                </div>
                                                <div class="mb-2">
                                                    <strong>È possibile richiedere integrazioni?</strong>
                                                    <span class="badge ms-1"
                                                          :class="canRichiedereIntegrazioni ? 'bg-success' : 'bg-secondary'">{{ canRichiedereIntegrazioni ? 'Sì' : 'No' }}</span>
                                                </div>

                                                <div class="d-flex flex-wrap gap-2 mt-2">
                                                    <button class="btn btn-outline-primary"
                                                            @click="richiediIntegrazioni"
                                                            :disabled="!canRichiedereIntegrazioni || !!integrazioniRequestedAt || isProcessing">
                                                        Richiedi integrazioni
                                                    </button>
                                                    <div v-if="integrazioniRequestedAt" class="small text-muted">
                                                        Richiesta inviata: <strong>{{ formatDate(integrazioniRequestedAt) }}</strong>
                                                    </div>
                                                </div>

                                                <div v-if="integrazioniRequestedAt" class="mt-3">
                                                    <div class="mb-2">
                                                        <strong>Scadenza proponente (45 gg):</strong>
                                                        <span class="ms-1">
                                                            {{
                              proponenteDeadline ? formatDate(proponenteDeadline) : '—'
                                                            }}
                                                        </span>
                                                    </div>
                                                    <label class="form-label small fw-semibold">Carica integrazioni del proponente</label>
                                                    <input class="form-control"
                                                           type="file"
                                                           accept=".pdf,.doc,.docx"
                                                           @change="onFileChange($event, 'integrazioni')" />
                                                    <div class="form-text">
                                                        File: <strong>{{ integrazioniFileName || '—' }}</strong>
                                                        <span v-if="integrazioniSize">({{ integrazioniSize }})</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-12 col-xl-6">
                                            <div class="card p-3 h-100">
                                                <div class="d-flex flex-wrap gap-2">
                                                    <button class="btn btn-outline-secondary"
                                                            @click="generaBozzaProvvedimento"
                                                            :disabled="isProcessing">
                                                        Genera bozza AI provvedimento
                                                    </button>
                                                    <button class="btn btn-success"
                                                            @click="pubblicaProvvedimento"
                                                            :disabled="!bozzaProvvedimento || !!provvedimentoPublishedAt || isProcessing">
                                                        Pubblica provvedimento VIA
                                                    </button>
                                                </div>

                                                <div v-if="bozzaProvvedimento" class="alert alert-info mt-3">
                                                    <strong>Bozza AI (provvedimento):</strong>
                                                    <div class="mt-1">{{ bozzaProvvedimento }}</div>
                                                </div>

                                                <div v-if="provvedimentoPublishedAt" class="alert alert-success mt-3">
                                                    <svg class="icon me-1"><use :href="`${spritesHref}#it-check-circle`" /></svg>
                                                    Provvedimento pubblicato su portale in data
                                                    <strong>{{ formatDate(provvedimentoPublishedAt) }}</strong>.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Navigazione step -->
                            <div class="d-flex justify-content-between mt-4">
                                <button class="btn btn-outline-secondary"
                                        @click="prevStep"
                                        :disabled="currentStep === 0 || isProcessing">
                                    <svg class="icon"><use :href="`${spritesHref}#it-arrow-left`" /></svg>
                                    <span class="ms-1">Indietro</span>
                                </button>

                                <button v-if="currentStep === steps.length - 1 || isProcessing"
                                        class="btn btn-primary"
                                        @click="goTo('/scoping')">
                                    <span class="me-1">Prossima fase</span>
                                    <svg class="icon"><use :href="`${spritesHref}#it-arrow-right`" /></svg>
                                </button>
                                <button v-else
                                        class="btn btn-primary"
                                        @click="nextStep"
                                        :disabled="isNextDisabled">
                                    <span class="me-1">Avanti</span>
                                    <svg class="icon"><use :href="`${spritesHref}#it-arrow-right`" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <!-- /bg section -->
                </div>
            </div>

            <!-- RIGHT COLUMN -->
            <div class="col-12 col-lg-4 p-4">
                <!-- AI Helper -->
                <div class="card border p-4 mb-4">
                    <h4>AI Helper</h4>

                    <button class="btn btn-primary w-100 mb-2"
                            type="button"
                            @click="elaboraPreReport"
                            :disabled="!hasSpa || isProcessing">
                        Verifica & Pre-report
                    </button>
                    <button class="btn btn-secondary w-100 mb-2"
                            type="button"
                            @click="generaReportOsservazioni"
                            :disabled="osservazioni.length === 0 || isProcessing">
                        Report AI osservazioni
                    </button>
                    <button class="btn btn-success w-100"
                            type="button"
                            @click="generaBozzaProvvedimento"
                            :disabled="isProcessing">
                        Bozza AI provvedimento
                    </button>

                    <div v-if="isProcessing" class="text-center mt-3">
                        <div class="spinner-border text-primary"></div>
                        <p class="small text-muted mt-2">Elaborazione…</p>
                    </div>
                </div>

                <!-- Scoreboard -->
                <div class="card border p-4">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <h4 class="mb-0">Indicatori</h4>
                        <button class="btn btn-outline-secondary btn-sm" @click="refreshScores" :disabled="isProcessing">
                            Aggiorna
                        </button>
                    </div>

                    <!-- Completezza documentale -->
                    <div class="mb-3">
                        <div class="d-flex justify-content-between">
                            <span class="small fw-semibold">Completezza documentale</span>
                            <span class="small">{{ completenessScore }}%</span>
                        </div>
                        <div class="progress">
                            <div class="progress-bar"
                                 role="progressbar"
                                 :style="{ width: completenessScore + '%' }"
                                 :class="scoreBarClass(completenessScore)"></div>
                        </div>
                    </div>

                    <!-- Avanzamento consultazione -->
                    <div class="mb-3">
                        <div class="d-flex justify-content-between">
                            <span class="small fw-semibold">Avanzamento consultazione</span>
                            <span class="small">{{ consultazioneProgress }}%</span>
                        </div>
                        <div class="progress">
                            <div class="progress-bar"
                                 role="progressbar"
                                 :style="{ width: consultazioneProgress + '%' }"
                                 :class="scoreBarClass(consultazioneProgress)"></div>
                        </div>
                    </div>

                    <!-- Osservazioni analizzate (AI) -->
                    <div>
                        <div class="d-flex justify-content-between">
                            <span class="small fw-semibold">Osservazioni con report AI</span>
                            <span class="small">{{ osservazioniAnalizzatePerc }}%</span>
                        </div>
                        <div class="progress">
                            <div class="progress-bar"
                                 role="progressbar"
                                 :style="{ width: osservazioniAnalizzatePerc + '%' }"
                                 :class="scoreBarClass(osservazioniAnalizzatePerc)"></div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /RIGHT -->
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
        { key: 'verifica', label: 'Verifica completezza' },
        { key: 'integrazioni', label: 'Richiesta integrazioni' },
        { key: 'pubblicazione', label: 'Pubbl. & Consultazione' },
        { key: 'provvedimento', label: 'Integrazioni & Provvedimento' },
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

    /* ========== STATUS PRATICA ========== */
    type Stato = 'draft' | 'ok' | 'rejected'
    const status = ref<Stato>('draft')
    const statusLabel = computed(() => {
        if (status.value === 'ok') return 'Documentazione conforme'
        if (status.value === 'rejected') return 'Rigettata'
        return 'In compilazione'
    })

    /* ========== FILE INPUTS ========== */
    // SPA
    const spaFile = ref<File | null>(null)
    const spaFileName = ref<string>('')
    const spaSize = ref<string>('')

    // Fee (copia pagamento)
    const feeFile = ref<File | null>(null)
    const feeFileName = ref<string>('')
    const feeSize = ref<string>('')

    // Integrazioni (eventuale caricamento del proponente)
    const integrazioniFile = ref<File | null>(null)
    const integrazioniFileName = ref<string>('')
    const integrazioniSize = ref<string>('')

    function onFileChange(e: Event, type: 'spa' | 'fee' | 'integrazioni') {
        const input = e.target as HTMLInputElement
        const f = input.files?.[0] || null
        if (type === 'spa') {
            spaFile.value = f
            spaFileName.value = f?.name || ''
            spaSize.value = f ? humanSize(f.size) : ''
        } else if (type === 'fee') {
            feeFile.value = f
            feeFileName.value = f?.name || ''
            feeSize.value = f ? humanSize(f.size) : ''
        } else {
            integrazioniFile.value = f
            integrazioniFileName.value = f?.name || ''
            integrazioniSize.value = f ? humanSize(f.size) : ''
        }
        // ogni cambio ricalcola la coerenza/completezza
        refreshScores()
    }

    function resetUpload() {
        spaFile.value = null; spaFileName.value = ''; spaSize.value = ''
        feeFile.value = null; feeFileName.value = ''; feeSize.value = ''
        integrazioniFile.value = null; integrazioniFileName.value = ''; integrazioniSize.value = ''
        preReport.value = ''
        status.value = 'draft'
        refreshScores()
    }

    function humanSize(n: number) {
        if (!n) return ''
        const units = ['B', 'KB', 'MB', 'GB']
        let i = 0
        let s = n
        while (s >= 1024 && i < units.length - 1) { s = s / 1024; i++ }
        return `${s.toFixed(1)} ${units[i]}`
    }

    const hasSpa = computed(() => !!spaFile.value)
    const hasFee = computed(() => !!feeFile.value)
    const hasRequiredDocs = computed(() => hasSpa.value && hasFee.value)

    /* ========== COMPLETEZZA & COERENZA (real-time) ========== */
    const isProcessing = ref(false)

    // Real-time "coerenza" (simulata): true se entrambi presenti e formati attesi
    const coerenzaOk = computed(() => {
        if (!hasRequiredDocs.value) return false
        const spaOk = !!spaFileName.value.match(/\.(pdf|docx?|PDF)$/)
        const feeOk = !!feeFileName.value.match(/\.(pdf|jpg|jpeg|png|PDF|JPG|JPEG|PNG)$/)
        return spaOk && feeOk
    })

    // Score completezza: 50% per ciascun documento richiesto; +10% se coerenza ok (capped 100)
    const completenessScore = computed(() => {
        let s = 0
        if (hasSpa.value) s += 50
        if (hasFee.value) s += 50
        if (coerenzaOk.value) s = Math.min(100, s + 10)
        return s > 100 ? 100 : s
    })

    function scoreBarClass(v: number) {
        if (v >= 80) return 'bg-success'
        if (v >= 60) return 'bg-warning'
        return 'bg-danger'
    }

    /* ========== PRE-REPORT (impatti) ========== */
    const preReport = ref<string>('')
    function elaboraPreReport() {
        if (!hasSpa.value) return
        isProcessing.value = true
        setTimeout(() => {
            preReport.value =
                'Interferenze potenziali su suolo e qualità dell’aria in fase di cantiere; si raccomanda piano mitigazioni per polveri/rumore, monitoraggi fauna nei corridoi prossimi e verifica accessi viabilistici.'
            isProcessing.value = false
        }, 600)
    }

    function autoRigetta() {
        // rigetta se incompletezza o incoerenza
        if (!hasRequiredDocs.value || !coerenzaOk.value) {
            status.value = 'rejected'
            stepCompleted.value[0] = true
            currentStep.value = 1
        }
    }
    function confermaCompletezza() {
        if (hasRequiredDocs.value && coerenzaOk.value) {
            status.value = 'ok'
            stepCompleted.value[0] = true
            currentStep.value = 1
        }
    }

    /* ========== PUBBLICAZIONE & CONSULTAZIONE (30 gg) ========== */
    const publishedAt = ref<Date | null>(null)
    const consultationEnd = ref<Date | null>(null)
    const consultazioneAttiva = computed(() => {
        const now = new Date()
        return !!(publishedAt.value && consultationEnd.value && now <= consultationEnd.value)
    })
    const giorniResiduiConsultazione = computed(() => {
        if (!consultationEnd.value) return 0
        const ms = consultationEnd.value.getTime() - new Date().getTime()
        return Math.ceil(ms / (1000 * 60 * 60 * 24))
    })
    const consultazioneProgress = computed(() => {
        if (!publishedAt.value || !consultationEnd.value) return 0
        const total = consultationEnd.value.getTime() - publishedAt.value.getTime()
        const done = Math.min(Math.max(new Date().getTime() - publishedAt.value.getTime(), 0), total)
        const p = Math.round((done / total) * 100)
        return isNaN(p) ? 0 : p
    })

    type Osservazione = { id: number; autore: string; testo: string; data: Date }
    const osservazioni = ref<Osservazione[]>([])
    const osservazioneAutore = ref<string>('')
    const osservazioneTesto = ref<string>('')

    function pubblicaSPA() {
        if (status.value !== 'ok') return
        const now = new Date()
        publishedAt.value = now
        consultationEnd.value = addDays(now, 30)
    }

    function aggiungiOsservazione() {
        if (!consultazioneAttiva.value || !osservazioneTesto.value.trim()) return
        const id = osservazioni.value.length + 1
        osservazioni.value.push({
            id,
            autore: (osservazioneAutore.value || '').trim(),
            testo: osservazioneTesto.value.trim(),
            data: new Date(),
        })
        osservazioneAutore.value = ''
        osservazioneTesto.value = ''
    }

    const aiObservationsReport = ref<string>('')
    const osservazioniAnalizzatePerc = computed(() => {
        if (osservazioni.value.length === 0) return 0
        // semplice: se esiste il report, consideriamo 100%, altrimenti 0
        return aiObservationsReport.value ? 100 : 0
    })
    function generaReportOsservazioni() {
        if (!osservazioni.value.length) return
        isProcessing.value = true
        setTimeout(() => {
            const n = osservazioni.value.length
            const keywords = estraiKeywords(osservazioni.value.map(o => o.testo))
            aiObservationsReport.value =
                `Ricevute ${n} osservazioni. Temi ricorrenti: ${keywords.slice(0, 5).join(', ')}. ` +
                `Si propone di rispondere con misure di mitigazione proporzionate e di motivare il provvedimento in relazione ai punti sollevati.`
            isProcessing.value = false
        }, 600)
    }
    function estraiKeywords(texts: string[]): string[] {
        const stop = new Set(['di', 'a', 'da', 'in', 'con', 'su', 'per', 'tra', 'fra', 'il', 'la', 'lo', 'i', 'gli', 'le', 'e', 'ed', 'che', 'del', 'della', 'dei', 'delle'])
        const freq: Record<string, number> = {}
        texts.join(' ').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '')
            .split(/\s+/).forEach(w => {
                if (w && !stop.has(w) && w.length > 2) freq[w] = (freq[w] || 0) + 1
            })
        return Object.entries(freq).sort((a, b) => b[1] - a[1]).map(([k]) => k)
    }

    /* ========== INTEGRAZIONI & PROVVEDIMENTO ========== */
    // Richiesta integrazioni entro 15 gg dal termine consultazione
    const integrazioneWindowEnd = computed(() => consultationEnd.value ? addDays(consultationEnd.value, 15) : null)
    const canRichiedereIntegrazioni = computed(() => {
        if (!consultationEnd.value) return false
        const now = new Date()
        return now > consultationEnd.value && (!integrazioneWindowEnd.value || now <= integrazioneWindowEnd.value)
    })
    const integrazioniRequestedAt = ref<Date | null>(null)
    const proponenteDeadline = ref<Date | null>(null)

    function richiediIntegrazioni() {
        if (!canRichiedereIntegrazioni.value || integrazioniRequestedAt.value) return
        const now = new Date()
        integrazioniRequestedAt.value = now
        proponenteDeadline.value = addDays(now, 45)
    }

    const bozzaProvvedimento = ref<string>('')
    const provvedimentoPublishedAt = ref<Date | null>(null)

    function generaBozzaProvvedimento() {
        isProcessing.value = true
        setTimeout(() => {
            const osserva = osservazioni.value.length
            const integTxt = integrazioniFileName.value ? 'con integrazioni pervenute' : 'in assenza di ulteriori integrazioni'
            bozzaProvvedimento.value =
                `Alla luce degli esiti della consultazione (${osserva} osservazioni) e ${integTxt}, ` +
                `si propone il provvedimento di assoggettabilità a VIA in via prudenziale, ` +
                `con prescrizioni su mitigazioni in fase di cantiere (polveri/rumore), monitoraggi fauna e gestione terre/rocce.`
            isProcessing.value = false
        }, 600)
    }

    function pubblicaProvvedimento() {
        if (!bozzaProvvedimento.value || provvedimentoPublishedAt.value) return
        provvedimentoPublishedAt.value = new Date()
    }

    /* ========== NAV GUARD: disabilita Avanti quando non sensato ========== */
    const isNextDisabled = computed(() => {
        if (currentStep.value === 0) {
            // non si procede se non confermata completezza
            return status.value !== 'ok' && status.value !== 'rejected'
        }
        if (currentStep.value === 1) {
            // se rigettata si impedisce avanzamento
            return status.value === 'rejected'
        }
        if (currentStep.value === 2) {
            // si consente avanzare comunque (può essere anche consultazione chiusa)
            return false
        }
        return false
    })

    /* ========== HELPERS ========== */
    function refreshScores() {
        // trigger computeds; qui potresti integrare controlli aggiuntivi (hash, firme, ecc.)
        // Niente da fare esplicitamente: i computed si aggiornano da soli.
    }

    function addDays(d: Date, n: number): Date {
        const x = new Date(d)
        x.setDate(x.getDate() + n)
        return x
    }

    function formatDate(d: Date | null): string {
        if (!d) return '—'
        return d.toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })
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