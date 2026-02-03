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
                    <!-- Contenuto su fondo grigio -->
                    <div class="p-4" style="background-color:#f5f5f5;">

                        <!-- HEADER -->
                        <div class="row">
                            <div class="col-12">
                                <div class="card p-4 text-white" style="background-color:#1565c0;">
                                    <div class="d-flex align-items-center justify-content-between">
                                        <h2 class="mb-2">SCOPING – Gestione fasi (AC)</h2>

                                        <span class="explain-pack">
                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-info-circle"
                                                            color="light"
                                                            text="Questa pagina copre le fasi di SCOPING: invio richiesta, coinvolgimento strutture, parere e pubblicazione."
                                                            placement="bottom"
                                                            outline
                                                            :iconOnly="true"
                                                            size="xs" />
                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-help-circle"
                                                            color="light"
                                                            text="Validazione real-time della completezza/coerenza, gestione osservazioni, bozza AI del parere e pubblicazione."
                                                            placement="bottom"
                                                            outline
                                                            :iconOnly="true"
                                                            size="xs">Aiuto</PopoverExplain>
                                        </span>
                                    </div>

                                    <p class="mb-1">
                                        <strong>Stato:</strong>
                                        <span class="badge ms-1"
                                              :class="{
                            'bg-secondary': stato === 'bozza',
                            'bg-info': stato === 'inviata',
                            'bg-primary': stato === 'autorizzata',
                            'bg-success': stato === 'pubblicataProposta',
                            'bg-dark': stato === 'parerePubblicato'
                          }">
                                            {{ statoLabel }}
                                        </span>
                                    </p>
                                    <p class="mb-0"><strong>Data:</strong> {{ today }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- WIZARD -->
                        <div class="card p-4 mt-4">

                            <!-- Stepper -->
                            <ul class="nav nav-pills flex-wrap gap-2 mb-3" role="tablist">
                                <li v-for="(s, idx) in steps" :key="s.key" class="nav-item">
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

                            <!-- STEP CONTENT -->
                            <!-- STEP 1: Invio richiesta di confronto -->
                            <div v-if="currentStep === 0">
                                <h3 class="mb-2">1. Invio richiesta di confronto</h3>
                                <p class="text-muted">
                                    Inserisci i contenuti richiesti. Il sistema esegue una verifica di completezza e coerenza in tempo reale.
                                    L’AC autorizza la pubblicazione della proposta sul portale.
                                </p>

                                <div class="card p-3 mb-3">
                                    <div class="row g-3">
                                        <!-- Descrizione progetto -->
                                        <div class="col-12">
                                            <label class="form-label fw-semibold">Descrizione progetto</label>
                                            <textarea class="form-control"
                                                      rows="4"
                                                      v-model="descrizioneProgetto"
                                                      placeholder="Descrizione sintetica dell’intervento, localizzazione, fasi operative, opere connesse…"></textarea>
                                            <div class="form-text">
                                                Lunghezza: <strong>{{ descrizioneProgetto.trim().length }}</strong> caratteri
                                            </div>
                                        </div>

                                        <!-- SPA -->
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
                                                <span class="badge" :class="hasSpa ? 'bg-success' : 'bg-secondary'">
                                                    {{ hasSpa ? 'Caricato' : 'Manca' }}
                                                </span>
                                            </div>
                                        </div>

                                        <!-- Proposta SIA -->
                                        <div class="col-12 col-lg-6">
                                            <label class="form-label fw-semibold">Proposta Studio Impatto Ambientale (SIA)</label>
                                            <input class="form-control"
                                                   type="file"
                                                   accept=".pdf,.doc,.docx"
                                                   @change="onFileChange($event, 'propostaSia')" />
                                            <div class="form-text">
                                                File: <strong>{{ propostaSiaFileName || '—' }}</strong>
                                                <span v-if="propostaSiaSize">({{ propostaSiaSize }})</span>
                                            </div>
                                            <div class="mt-1">
                                                <span class="badge" :class="hasPropostaSia ? 'bg-success' : 'bg-secondary'">
                                                    {{ hasPropostaSia ? 'Caricato' : 'Manca' }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Esiti real-time -->
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
                                        <div class="col-12 col-md-6">
                                            <label class="form-label small fw-semibold">Coerenza documentale</label>
                                            <div class="alert py-2 px-3 mb-0"
                                                 :class="coerenzaOk ? 'alert-success' : 'alert-warning'">
                                                <strong>{{ coerenzaOk ? 'OK' : 'Da verificare' }}</strong> —
                                                {{ coerenzaOk ? 'formati attesi e campi minimi presenti' : 'mancano contenuti o formati non validi' }}
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Azioni -->
                                    <div class="d-flex flex-wrap gap-2 mt-3">
                                        <button class="btn btn-outline-secondary" @click="resetRichiesta" :disabled="isProcessing">
                                            Annulla / Svuota
                                        </button>
                                        <button class="btn btn-primary"
                                                @click="inviaRichiesta"
                                                :disabled="!isInvioAbilitato || isProcessing">
                                            <svg class="icon"><use :href="`${spritesHref}#it-mail`" /></svg>
                                            <span class="ms-2">Invia richiesta di confronto</span>
                                        </button>
                                        <button class="btn btn-success"
                                                @click="autorizzaPubblicazione"
                                                :disabled="!puoiAutorizzare || isProcessing">
                                            <svg class="icon"><use :href="`${spritesHref}#it-check-circle`" /></svg>
                                            <span class="ms-2">Autorizza pubblicazione proposta</span>
                                        </button>
                                    </div>

                                    <div class="row g-3 mt-3">
                                        <div class="col-12 col-md-4">
                                            <div class="small text-muted">Richiesta inviata:</div>
                                            <div><strong>{{ inviataAt ? formatDateTime(inviataAt) : '—' }}</strong></div>
                                        </div>
                                        <div class="col-12 col-md-4">
                                            <div class="small text-muted">Autorizzazione AC:</div>
                                            <div><strong>{{ autorizzataAt ? formatDateTime(autorizzataAt) : '—' }}</strong></div>
                                        </div>
                                        <div class="col-12 col-md-4">
                                            <div class="small text-muted">Pubblicazione proposta:</div>
                                            <div><strong>{{ pubblicataPropostaAt ? formatDateTime(pubblicataPropostaAt) : '—' }}</strong></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- STEP 2: Coinvolgimento strutture regionali -->
                            <div v-else-if="currentStep === 1">
                                <h3 class="mb-2">2. Coinvolgimento strutture regionali</h3>
                                <p class="text-muted">
                                    La documentazione è a disposizione di amministrazioni/enti che possono presentare osservazioni.
                                    L’AC recepisce le osservazioni e le integra nella pratica.
                                </p>

                                <div class="row g-3">
                                    <div class="col-12 col-lg-6">
                                        <div class="card p-3 h-100">
                                            <strong>Invia osservazione</strong>
                                            <div class="mt-2">
                                                <label class="form-label small">Struttura / Ente</label>
                                                <input class="form-control"
                                                       type="text"
                                                       v-model="obsAutore"
                                                       placeholder="ARPA, Comune, Soprintendenza…" />
                                            </div>
                                            <div class="mt-2">
                                                <label class="form-label small">Testo osservazione</label>
                                                <textarea class="form-control"
                                                          rows="3"
                                                          v-model="obsTesto"
                                                          placeholder="Inserisci osservazione…"></textarea>
                                            </div>
                                            <div class="mt-2 d-flex gap-2">
                                                <button class="btn btn-primary"
                                                        @click="aggiungiOsservazione"
                                                        :disabled="!obsTesto.trim()">
                                                    Aggiungi osservazione
                                                </button>
                                                <span class="align-self-center small text-muted">
                                                    Totale: <strong>{{ osservazioni.length }}</strong>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-12 col-lg-6">
                                        <div class="card p-3 h-100">
                                            <strong>Note di integrazione AC</strong>
                                            <textarea class="form-control mt-2"
                                                      rows="6"
                                                      v-model="noteIntegrazione"
                                                      placeholder="Bozza di integrazione interna alle osservazioni per la pratica…"></textarea>

                                            <div class="mt-3">
                                                <label class="form-label small fw-semibold">Avanzamento integrazione osservazioni</label>
                                                <div class="progress">
                                                    <div class="progress-bar"
                                                         role="progressbar"
                                                         :style="{ width: integrazioneProgress + '%' }"
                                                         :class="scoreBarClass(integrazioneProgress)">
                                                        {{ integrazioneProgress }}%
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="osservazioni.length" class="card p-3 mt-3">
                                    <h6 class="mb-2">Osservazioni ricevute</h6>
                                    <ul class="list-group">
                                        <li v-for="o in osservazioni" :key="o.id" class="list-group-item">
                                            <div class="d-flex justify-content-between flex-wrap">
                                                <div>
                                                    <strong>{{ o.autore || 'Ente/Struttura' }}</strong>
                                                    <span class="text-muted small ms-2">{{ formatDateTime(o.data) }}</span>
                                                </div>
                                                <div class="d-flex align-items-center gap-2">
                                                    <span class="badge" :class="o.integrata ? 'bg-success' : 'bg-secondary'">
                                                        {{ o.integrata ? 'Integrata' : 'Da integrare' }}
                                                    </span>
                                                    <button class="btn btn-sm btn-outline-success" @click="toggleIntegrata(o)">
                                                        {{ o.integrata ? 'Segna come non integrata' : 'Segna come integrata' }}
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="mt-1">{{ o.testo }}</div>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <!-- STEP 3: Valutazione e Parere -->
                            <div v-else-if="currentStep === 2">
                                <h3 class="mb-2">3. Valutazione e Parere</h3>
                                <p class="text-muted">
                                    Un tool AI genera una bozza di parere (contenuti, criticità, spunti) con linee guida.
                                    Entro <strong>45 giorni</strong> l’AC esprime il parere sulle informazioni necessarie nella SIA.
                                </p>

                                <div class="row g-3">
                                    <div class="col-12 col-xl-6">
                                        <div class="card p-3 h-100">
                                            <div class="mb-2">
                                                <strong>Inizio scoping:</strong>
                                                <span class="ms-1">{{ scopingStart ? formatDateTime(scopingStart) : '—' }}</span>
                                            </div>
                                            <div class="mb-2">
                                                <strong>Scadenza parere (45 gg):</strong>
                                                <span class="ms-1">{{ parereDeadline ? formatDateTime(parereDeadline) : '—' }}</span>
                                            </div>
                                            <div class="mb-2">
                                                <strong>Giorni residui:</strong>
                                                <span class="badge ms-1"
                                                      :class="{
                                                      'bg-success' : giorniResiduiParere>
                                                    10,
                                                    'bg-warning': giorniResiduiParere <= 10 && giorniResiduiParere > 0,
                                                    'bg-danger': giorniResiduiParere <= 0
                                                    }">
                                                    {{ parereDeadline ? giorniResiduiParere : '—' }}
                                                </span>
                                            </div>
                                            <div class="mt-3">
                                                <label class="form-label small fw-semibold">Avanzamento verso scadenza</label>
                                                <div class="progress">
                                                    <div class="progress-bar"
                                                         role="progressbar"
                                                         :style="{ width: parereProgress + '%' }"
                                                         :class="scoreBarClass(parereProgress)">
                                                        {{ parereProgress }}%
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-12 col-xl-6">
                                        <div class="card p-3 h-100">
                                            <div class="d-flex flex-wrap gap-2">
                                                <button class="btn btn-outline-primary" @click="generaBozzaParere" :disabled="isProcessing">
                                                    <svg class="icon"><use :href="`${spritesHref}#it-magic`" /></svg>
                                                    <span class="ms-2">Genera bozza AI</span>
                                                </button>
                                                <button class="btn btn-outline-secondary" @click="rigeneraBozzaParere" :disabled="isProcessing">
                                                    Rigenera
                                                </button>
                                                <button class="btn btn-success"
                                                        @click="finalizzaParere"
                                                        :disabled="!parereBozza.trim() || !!parereFinalizzatoAt || isProcessing">
                                                    <svg class="icon"><use :href="`${spritesHref}#it-check-circle`" /></svg>
                                                    <span class="ms-2">Segna come finalizzato</span>
                                                </button>
                                            </div>

                                            <div v-if="parereFinalizzatoAt" class="alert alert-success mt-3">
                                                <svg class="icon"><use :href="`${spritesHref}#it-check-circle`" /></svg>
                                                <strong class="ms-1">Parere finalizzato:</strong>
                                                {{ formatDateTime(parereFinalizzatoAt) }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="card p-3 mt-3">
                                    <h6 class="mb-2">Linee guida suggerite</h6>
                                    <ul class="small">
                                        <li v-for="g in lineeGuida" :key="g">{{ g }}</li>
                                    </ul>
                                </div>

                                <div class="card p-3 mt-3">
                                    <label class="form-label fw-semibold">Bozza di parere (modificabile)</label>
                                    <textarea class="form-control" rows="10" v-model="parereBozza"
                                              placeholder="La bozza AI del parere apparirà qui. Puoi modificarla prima della pubblicazione."></textarea>
                                </div>
                            </div>

                            <!-- STEP 4: Pubblicazione Parere -->
                            <div v-else-if="currentStep === 3">
                                <h3 class="mb-2">4. Pubblicazione parere</h3>
                                <p class="text-muted">
                                    L’AC pubblica il parere sul sito web istituzionale.
                                </p>

                                <div class="card p-3">
                                    <div class="d-flex flex-wrap gap-2">
                                        <button class="btn btn-success"
                                                @click="pubblicaParere"
                                                :disabled="!parereFinalizzatoAt || !!parerePublishedAt || isProcessing">
                                            <svg class="icon"><use :href="`${spritesHref}#it-upload`" /></svg>
                                            <span class="ms-2">Pubblica parere</span>
                                        </button>
                                        <button class="btn btn-outline-primary"
                                                @click="exportParereTxt"
                                                :disabled="!parereBozza.trim()">
                                            Esporta parere (.txt)
                                        </button>
                                    </div>

                                    <div class="row g-3 mt-3">
                                        <div class="col-12 col-md-6">
                                            <div class="small text-muted">Parere finalizzato:</div>
                                            <div><strong>{{ parereFinalizzatoAt ? formatDateTime(parereFinalizzatoAt) : '—' }}</strong></div>
                                        </div>
                                        <div class="col-12 col-md-6">
                                            <div class="small text-muted">Parere pubblicato:</div>
                                            <div><strong>{{ parerePublishedAt ? formatDateTime(parerePublishedAt) : '—' }}</strong></div>
                                        </div>
                                    </div>

                                    <div v-if="parerePublishedAt" class="alert alert-success mt-3">
                                        <svg class="icon"><use :href="`${spritesHref}#it-check-circle`" /></svg>
                                        <strong class="ms-1">Parere pubblicato</strong> sul portale istituzionale in data
                                        <strong>{{ formatDateTime(parerePublishedAt) }}</strong>.
                                    </div>
                                </div>
                            </div>

                            <!-- NAVIGATION -->
                            <div class="d-flex justify-content-between mt-4">
                                <button class="btn btn-outline-secondary" @click="prevStep" :disabled="currentStep === 0">
                                    <svg class="icon"><use :href="`${spritesHref}#it-arrow-left`" /></svg> Indietro
                                </button>

                                <button v-if="currentStep === steps.length - 1 || isProcessing"
                                        class="btn btn-primary"
                                        @click="goTo('/provvedimentoDiConsultazione')">
                                    <span class="me-1">Prossima fase</span>
                                    <svg class="icon"><use :href="`${spritesHref}#it-arrow-right`" /></svg>
                                </button>
                                <button v-else class="btn btn-primary" @click="nextStep" :disabled="isNextDisabled">
                                    <span class="me-1">Avanti</span>
                                    <svg class="icon"><use :href="`${spritesHref}#it-arrow-right`" /></svg>
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

                    <button class="btn btn-primary w-100 mb-2"
                            @click="generaBozzaParere"
                            :disabled="isProcessing">
                        Genera bozza di parere
                    </button>
                    <button class="btn btn-secondary w-100 mb-2"
                            @click="popolaDemo"
                            :disabled="isProcessing">
                        Compila dati demo
                    </button>

                    <div class="mt-3">
                        <div class="d-flex align-items-center justify-content-between mb-2">
                            <h6 class="mb-0">Indicatori</h6>
                            <button class="btn btn-outline-secondary btn-sm" @click="refreshIndicators" :disabled="isProcessing">
                                Aggiorna
                            </button>
                        </div>

                        <!-- Completezza -->
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

                        <!-- Coerenza -->
                        <div class="mb-3">
                            <div class="d-flex justify-content-between">
                                <span class="small fw-semibold">Coerenza</span>
                                <span class="small">{{ coerenzaOk ? 'OK' : 'Da verificare' }}</span>
                            </div>
                            <div class="progress">
                                <div class="progress-bar"
                                     role="progressbar"
                                     :style="{ width: (coerenzaOk ? 100 : 40) + '%' }"
                                     :class="coerenzaOk ? 'bg-success' : 'bg-warning'"></div>
                            </div>
                        </div>

                        <!-- Scadenza 45 gg -->
                        <div class="mb-3">
                            <div class="d-flex justify-content-between">
                                <span class="small fw-semibold">Avanzamento verso scadenza (45 gg)</span>
                                <span class="small">{{ parereProgress }}%</span>
                            </div>
                            <div class="progress">
                                <div class="progress-bar"
                                     role="progressbar"
                                     :style="{ width: parereProgress + '%' }"
                                     :class="scoreBarClass(parereProgress)"></div>
                            </div>
                        </div>

                        <!-- Integrazione osservazioni -->
                        <div>
                            <div class="d-flex justify-content-between">
                                <span class="small fw-semibold">% osservazioni integrate</span>
                                <span class="small">{{ integrazioneProgress }}%</span>
                            </div>
                            <div class="progress">
                                <div class="progress-bar"
                                     role="progressbar"
                                     :style="{ width: integrazioneProgress + '%' }"
                                     :class="scoreBarClass(integrazioneProgress)"></div>
                            </div>
                        </div>

                    </div>

                    <div v-if="isProcessing" class="text-center mt-3">
                        <div class="spinner-border text-primary"></div>
                        <p class="text-muted small mt-2">Elaborazione…</p>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
    /**
     * SCOPING – Vue3 + bootstrap-italia
     * Funzioni chiave: verifica real-time, autorizzazione AC, osservazioni, bozza AI parere, scadenza 45gg, pubblicazione.
     */
    import PopoverExplain from '@/components/PopoverExplain.vue'
    import { ref, computed } from 'vue'
    import { useRouter } from 'vue-router'
    import spritesUrl from 'bootstrap-italia/dist/svg/sprites.svg?url'

    const spritesHref = spritesUrl
    const router = useRouter()
    function goTo(path: string) { router.push(path) }

    const today = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })

    /* ---------------------------
     * WIZARD STATE
     * --------------------------- */
    const steps = [
        { key: 'invio', label: 'Invio richiesta' },
        { key: 'coinvolgimento', label: 'Coinvolgimento strutture' },
        { key: 'parere', label: 'Valutazione & Parere' },
        { key: 'pubblicazione', label: 'Pubblicazione parere' },
    ]
    const currentStep = ref(0)
    const completed = ref<boolean[]>(steps.map(() => false))

    function goToStep(i: number) { currentStep.value = i }
    function nextStep() {
        if (currentStep.value < steps.length - 1) {
            completed.value[currentStep.value] = true
            currentStep.value++
        }
    }
    function prevStep() { currentStep.value = Math.max(0, currentStep.value - 1) }
    function badgeClass(i: number) {
        if (currentStep.value === i) return 'bg-primary'
        if (completed.value[i]) return 'bg-success'
        return 'bg-secondary'
    }

    /* ---------------------------
     * STATO PRATICA
     * --------------------------- */
    type Stato = 'bozza' | 'inviata' | 'autorizzata' | 'pubblicataProposta' | 'parerePubblicato'
    const stato = ref<Stato>('bozza')
    const statoLabel = computed(() => {
        switch (stato.value) {
            case 'inviata': return 'Richiesta inviata'
            case 'autorizzata': return 'Autorizzata da AC'
            case 'pubblicataProposta': return 'Proposta pubblicata'
            case 'parerePubblicato': return 'Parere pubblicato'
            default: return 'Bozza'
        }
    })

    /* ---------------------------
     * INPUT RICHIESTA (Descrizione, SPA, Proposta SIA)
     * --------------------------- */
    const descrizioneProgetto = ref<string>('')

    // SPA
    const spaFile = ref<File | null>(null)
    const spaFileName = ref<string>(''); const spaSize = ref<string>('')

    // Proposta SIA
    const propostaSiaFile = ref<File | null>(null)
    const propostaSiaFileName = ref<string>(''); const propostaSiaSize = ref<string>('')

    function onFileChange(e: Event, type: 'spa' | 'propostaSia') {
        const input = e.target as HTMLInputElement
        const f = input.files?.[0] || null
        if (type === 'spa') {
            spaFile.value = f
            spaFileName.value = f?.name || ''
            spaSize.value = f ? humanSize(f.size) : ''
        } else {
            propostaSiaFile.value = f
            propostaSiaFileName.value = f?.name || ''
            propostaSiaSize.value = f ? humanSize(f.size) : ''
        }
    }

    function humanSize(n: number) {
        if (!n) return ''
        const units = ['B', 'KB', 'MB', 'GB']
        let i = 0; let s = n
        while (s >= 1024 && i < units.length - 1) { s = s / 1024; i++ }
        return `${s.toFixed(1)} ${units[i]}`
    }

    const hasDescrizione = computed(() => descrizioneProgetto.value.trim().length >= 50) // soglia minima sensata
    const hasSpa = computed(() => !!spaFile.value)
    const hasPropostaSia = computed(() => !!propostaSiaFile.value)

    /* ---------------------------
     * COMPLETEZZA & COERENZA (real-time)
     * --------------------------- */
    // Formati attesi e check minimi
    const spaFormatoOk = computed(() => !!spaFileName.value.match(/\.(pdf|docx?|PDF)$/))
    const propostaSiaFormatoOk = computed(() => !!propostaSiaFileName.value.match(/\.(pdf|docx?|PDF)$/))
    const coerenzaOk = computed(() => hasDescrizione.value && hasSpa.value && hasPropostaSia.value && spaFormatoOk.value && propostaSiaFormatoOk.value)

    // Completezza: pesi 40% descrizione, 30% SPA, 30% Proposta SIA, +10% bonus coerenza (cap 100)
    const completenessScore = computed(() => {
        let s = 0
        if (hasDescrizione.value) s += 40
        if (hasSpa.value) s += 30
        if (hasPropostaSia.value) s += 30
        if (coerenzaOk.value) s = Math.min(100, s + 10)
        return Math.min(100, s)
    })
    function scoreBarClass(v: number) {
        if (v >= 80) return 'bg-success'
        if (v >= 60) return 'bg-warning'
        return 'bg-danger'
    }

    /* ---------------------------
     * INVIO & AUTORIZZAZIONE & PUBBLICAZIONE PROPOSTA
     * --------------------------- */
    const isProcessing = ref(false)
    const inviataAt = ref<Date | null>(null)
    const autorizzataAt = ref<Date | null>(null)
    const pubblicataPropostaAt = ref<Date | null>(null)

    const isInvioAbilitato = computed(() => completenessScore.value >= 70 && coerenzaOk.value)
    const puoiAutorizzare = computed(() => !!inviataAt.value && coerenzaOk.value && !autorizzataAt.value)

    function resetRichiesta() {
        descrizioneProgetto.value = ''
        spaFile.value = null; spaFileName.value = ''; spaSize.value = ''
        propostaSiaFile.value = null; propostaSiaFileName.value = ''; propostaSiaSize.value = ''
        inviataAt.value = null; autorizzataAt.value = null; pubblicataPropostaAt.value = null
        stato.value = 'bozza'
    }

    function inviaRichiesta() {
        if (!isInvioAbilitato.value) return
        isProcessing.value = true
        setTimeout(() => {
            inviataAt.value = new Date()
            stato.value = 'inviata'
            isProcessing.value = false
        }, 600)
    }

    function autorizzaPubblicazione() {
        if (!puoiAutorizzare.value) return
        isProcessing.value = true
        setTimeout(() => {
            autorizzataAt.value = new Date()
            pubblicataPropostaAt.value = new Date()
            stato.value = 'pubblicataProposta'
            // Avvio scoping per il conteggio 45 gg
            scopingStart.value = pubblicataPropostaAt.value
            parereDeadline.value = addDays(scopingStart.value!, 45)
            isProcessing.value = false
        }, 600)
    }

    /* ---------------------------
     * COINVOLGIMENTO STRUTTURE: osservazioni & integrazione
     * --------------------------- */
    type Osservazione = { id: number; autore: string; testo: string; data: Date; integrata: boolean }
    const osservazioni = ref<Osservazione[]>([])
    const obsAutore = ref<string>(''); const obsTesto = ref<string>('')
    const noteIntegrazione = ref<string>('')

    function aggiungiOsservazione() {
        if (!obsTesto.value.trim()) return
        const id = osservazioni.value.length + 1
        osservazioni.value.push({
            id,
            autore: (obsAutore.value || '').trim(),
            testo: obsTesto.value.trim(),
            data: new Date(),
            integrata: false,
        })
        obsAutore.value = ''; obsTesto.value = ''
    }

    function toggleIntegrata(o: Osservazione) {
        o.integrata = !o.integrata
    }
    const integrazioneProgress = computed(() => {
        if (!osservazioni.value.length) return 0
        const done = osservazioni.value.filter(o => o.integrata).length
        return Math.round((done / osservazioni.value.length) * 100)
    })

    /* ---------------------------
     * VALUTAZIONE & PARERE: scadenza 45 gg + bozza AI
     * --------------------------- */
    const scopingStart = ref<Date | null>(null)
    const parereDeadline = ref<Date | null>(null)

    const parereProgress = computed(() => {
        if (!scopingStart.value || !parereDeadline.value) return 0
        const total = parereDeadline.value.getTime() - scopingStart.value.getTime()
        const done = Math.min(Math.max(new Date().getTime() - scopingStart.value.getTime(), 0), total)
        const p = Math.round((done / total) * 100)
        return isNaN(p) ? 0 : p
    })
    const giorniResiduiParere = computed(() => {
        if (!parereDeadline.value) return 0
        const ms = parereDeadline.value.getTime() - new Date().getTime()
        return Math.ceil(ms / (1000 * 60 * 60 * 24))
    })

    const lineeGuida = ref<string[]>([
        'Indicare gli elementi minimi che devono essere sviluppati nella SIA definitiva.',
        'Esplicitare le criticità potenziali e i relativi indicatori di monitoraggio.',
        'Suggerire metodologie di analisi per ciascuna componente ambientale pertinente.',
        'Richiamare la normativa e le linee guida di riferimento (es. D.Lgs. 152/2006).',
        'Definire misure di mitigazione e condizioni per fasi di cantiere ed esercizio.'
    ])

    const parereBozza = ref<string>('')
    const parereFinalizzatoAt = ref<Date | null>(null)
    const parerePublishedAt = ref<Date | null>(null)

    function generaBozzaParere() {
        isProcessing.value = true
        setTimeout(() => {
            const obsSint = osservazioni.value.length
                ? `Sono pervenute ${osservazioni.value.length} osservazioni; integrazione AC al ${integrazioneProgress.value}%.`
                : 'Non risultano osservazioni pervenute alla data odierna.'
            const descr = descrizioneProgetto.value.trim() || 'Progetto descritto in termini generali (dettagli in proposta SIA/SPA).'
            parereBozza.value = [
                '=== Bozza di Parere (SCOPING) ===',
                '',
                '1) Contenuti considerati',
                `- Descrizione progetto: ${cut(descr, 500)}`,
                `- SPA: ${spaFileName.value || '—'}; Proposta SIA: ${propostaSiaFileName.value || '—'}`,
                '',
                '2) Osservazioni e integrazioni',
                `- ${obsSint}`,
                noteIntegrazione.value ? `- Note AC: ${noteIntegrazione.value}` : null,
                '',
                '3) Criticità e spunti',
                '- Valutare impatti in fase di cantiere su suolo, aria e rumore; definire misure di mitigazione proporzionate.',
                '- Verificare eventuali corridoi ecologici e ricettori sensibili (paesaggio/abitati).',
                '- Gestione acque meteoriche e terre/rocce da scavo secondo normativa.',
                '',
                '4) Linee guida per la SIA',
                ...lineeGuida.value.map(g => `- ${g}`),
                '',
                '5) Conclusioni (proposta)',
                'Alla luce dei materiali preliminari e delle osservazioni pervenute, si delineano i contenuti minimi necessari per la SIA definitiva, con particolare attenzione alle componenti ambientali maggiormente esposte e ai relativi piani di monitoraggio.',
                '',
                '=== Fine Bozza ==='
            ].filter(Boolean).join('\n')
            isProcessing.value = false
        }, 600)
    }
    function rigeneraBozzaParere() { generaBozzaParere() }
    function finalizzaParere() {
        if (!parereBozza.value.trim()) return
        parereFinalizzatoAt.value = new Date()
    }

    function pubblicaParere() {
        if (!parereFinalizzatoAt.value || parerePublishedAt.value) return
        parerePublishedAt.value = new Date()
        stato.value = 'parerePubblicato'
    }

    /* ---------------------------
     * NAV GUARD: disabilita Avanti quando non sensato
     * --------------------------- */
    const isNextDisabled = computed(() => {
        if (currentStep.value === 0) return !(inviataAt.value && autorizzataAt.value && pubblicataPropostaAt.value)
        if (currentStep.value === 1) return false
        if (currentStep.value === 2) return !parereFinalizzatoAt.value // prima di andare a pubblicazione, finalizza
        return false
    })

    /* ---------------------------
     * HELPERS
     * --------------------------- */
    function refreshIndicators() {
        // Computed si aggiornano automaticamente; questo è un placeholder per eventuali calcoli lato server.
    }
    function popolaDemo() {
        if (!descrizioneProgetto.value.trim()) {
            descrizioneProgetto.value = 'Realizzazione di impianto fotovoltaico con opere connesse in area produttiva; ' +
                'sono previste fasi di cantiere con movimentazione terra, installazione strutture e cablaggi.'
        }
        if (!osservazioni.value.length) {
            osservazioni.value = [
                { id: 1, autore: 'ARPA', testo: 'Considerare mitigazioni per emissioni di polveri in cantiere.', data: new Date(), integrata: true },
                { id: 2, autore: 'Comune', testo: 'Valutare la viabilità di accesso mezzi pesanti.', data: new Date(), integrata: false },
            ]
        }
        if (!noteIntegrazione.value.trim()) {
            noteIntegrazione.value = 'Si propone piano mitigazioni polveri/rumore e verifica accessi con fasature orarie.'
        }
    }
    function formatDateTime(d: Date | null): string {
        if (!d) return '—'
        return d.toLocaleString('it-IT', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    }
    function addDays(d: Date, n: number): Date { const x = new Date(d); x.setDate(x.getDate() + n); return x }
    function cut(s: string, n: number) { return s.length <= n ? s : s.slice(0, n - 3) + '...' }

    /* ---------------------------
     * EXPORT PARERE
     * --------------------------- */
    function exportParereTxt() {
        const content = parereBozza.value.trim() || 'Nessun contenuto disponibile.'
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = 'Parere-SCOPING.txt'
        a.click()
        URL.revokeObjectURL(a.href)
    }
</script>

<style scoped>
    h2, h3, h4, h6 {
        font-weight: bold;
    }

    /* Pacchetto explainability allineato a destra */
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

    /* Icone bootstrap-italia */
    .icon {
        width: 16px;
        height: 16px;
    }

    /* Nav pills stepper */
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