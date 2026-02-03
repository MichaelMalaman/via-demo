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
                                        <h2 class="mb-2">Fase 3 — Presentazione Istanza</h2>
                                        <span class="explain-pack">
                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-info-circle"
                                                            color="light"
                                                            text="La pagina gestisce invio istanza, fascicolo digitale, PEC agli enti, risposta proponente e avvio consultazione."
                                                            placement="bottom"
                                                            outline
                                                            :iconOnly="true"
                                                            size="xs" />
                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-help-circle"
                                                            color="light"
                                                            text="Mock locale: controlli real-time e generazioni testuali; nessuna chiamata esterna."
                                                            placement="bottom"
                                                            outline
                                                            :iconOnly="true"
                                                            size="xs" />
                                        </span>
                                    </div>

                                    <p class="mb-1">
                                        <strong>Stato pratica:</strong>
                                        <span class="badge ms-1"
                                              :class="{
                            'bg-secondary': stato === 'bozza',
                            'bg-info': stato === 'inviata',
                            'bg-warning': stato === 'rigettata',
                            'bg-primary': stato === 'pecInviata',
                            'bg-success': stato === 'avvioPubblicato'
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
                            <!-- STEP 1: Invio dell’istanza -->
                            <div v-if="currentStep === 0">
                                <h3 class="mb-2">1. Invio dell’istanza</h3>
                                <p class="text-muted">
                                    Carica i documenti richiesti. Il sistema esegue la verifica in tempo reale e redige il fascicolo digitale.
                                </p>

                                <div class="row g-3">
                                    <!-- SIA -->
                                    <div class="col-12 col-lg-6">
                                        <label class="form-label fw-semibold">Studio di Impatto Ambientale (SIA)</label>
                                        <input class="form-control" type="file" accept=".pdf,.doc,.docx"
                                               @change="onFileChange($event, 'sia')" />
                                        <div class="form-text">
                                            File: <strong>{{ siaFileName || '—' }}</strong>
                                            <span v-if="siaSize">({{ siaSize }})</span>
                                        </div>
                                        <div class="mt-1">
                                            <span class="badge" :class="hasSia ? 'bg-success' : 'bg-secondary'">{{ hasSia ? 'Caricato' : 'Manca' }}</span>
                                        </div>
                                    </div>

                                    <!-- Progetto di fattibilità -->
                                    <div class="col-12 col-lg-6">
                                        <label class="form-label fw-semibold">Progetto di fattibilità</label>
                                        <input class="form-control" type="file" accept=".pdf,.doc,.docx,.zip"
                                               @change="onFileChange($event, 'fattibilita')" />
                                        <div class="form-text">
                                            File: <strong>{{ fattFileName || '—' }}</strong>
                                            <span v-if="fattSize">({{ fattSize }})</span>
                                        </div>
                                        <div class="mt-1">
                                            <span class="badge" :class="hasFatt ? 'bg-success' : 'bg-secondary'">{{ hasFatt ? 'Caricato' : 'Manca' }}</span>
                                        </div>
                                    </div>

                                    <!-- SNT -->
                                    <div class="col-12 col-lg-6">
                                        <label class="form-label fw-semibold">Sintesi non tecnica</label>
                                        <input class="form-control" type="file" accept=".pdf,.doc,.docx,.txt"
                                               @change="onFileChange($event, 'snt')" />
                                        <div class="form-text">
                                            File: <strong>{{ sntFileName || '—' }}</strong>
                                            <span v-if="sntSize">({{ sntSize }})</span>
                                        </div>
                                        <div class="mt-1">
                                            <span class="badge" :class="hasSnt ? 'bg-success' : 'bg-secondary'">{{ hasSnt ? 'Caricato' : 'Manca' }}</span>
                                        </div>
                                    </div>

                                    <!-- Documenti eventuali (multi) -->
                                    <div class="col-12 col-lg-6">
                                        <label class="form-label fw-semibold">Documenti eventuali (multi)</label>
                                        <input class="form-control" type="file" multiple
                                               accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
                                               @change="onExtraFilesChange" />
                                        <div class="form-text">
                                            Caricati: <strong>{{ extraDocs.length }}</strong>
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
                                        <div class="alert py-2 px-3 mb-0" :class="coerenzaOk ? 'alert-success' : 'alert-warning'">
                                            <strong>{{ coerenzaOk ? 'OK' : 'Da verificare' }}</strong>
                                            — {{ coerenzaOk ? 'formati attesi presenti' : 'mancano formati attesi (SIA, Fattibilità, SNT)' }}
                                        </div>
                                    </div>
                                </div>

                                <!-- Fascicolo digitale (real-time) -->
                                <div class="card p-3 mt-3">
                                    <div class="d-flex align-items-center justify-content-between">
                                        <h6 class="mb-0">Fascicolo digitale pratica (anteprima in tempo reale)</h6>
                                        <button class="btn btn-sm btn-outline-primary" @click="exportFascicolo" :disabled="!hasDocMinimi">
                                            Scarica fascicolo (.json)
                                        </button>
                                    </div>
                                    <pre class="small mt-2" style="white-space:pre-wrap">{{ fascicoloDigitale }}</pre>
                                </div>

                                <!-- Azioni -->
                                <div class="d-flex flex-wrap gap-2 mt-3">
                                    <button class="btn btn-outline-secondary" @click="resetIstanza" :disabled="isProcessing">
                                        Annulla / Svuota
                                    </button>
                                    <button class="btn btn-danger" @click="autoRigetta" :disabled="(hasDocMinimi && coerenzaOk) || isProcessing">
                                        Rigetta pratica (incompletezza/incoerenza)
                                    </button>
                                    <button class="btn btn-primary" @click="inviaIstanza" :disabled="!isInvioAbilitato || isProcessing">
                                        <svg class="icon"><use :href="`${spritesHref}#it-mail`" /></svg>
                                        <span class="ms-2">Invia istanza</span>
                                    </button>
                                </div>

                                <div class="row g-3 mt-3">
                                    <div class="col-12 col-md-6">
                                        <div class="small text-muted">Istanza inviata:</div>
                                        <div><strong>{{ istanzaInviataAt ? formatDateTime(istanzaInviataAt) : '—' }}</strong></div>
                                    </div>
                                </div>
                            </div>

                            <!-- STEP 2: Richiesta integrazioni (N/A – auto) -->
                            <div v-else-if="currentStep === 1">
                                <h3 class="mb-2">2. Richiesta integrazioni</h3>
                                <p class="text-muted">
                                    N/A – Il sistema riconosce i documenti e <strong>rigetta la pratica</strong> se non sono completi o coerenti.
                                </p>

                                <div v-if="stato === 'rigettata'" class="alert alert-danger">
                                    <svg class="icon"><use :href="`${spritesHref}#it-close-circle`" /></svg>
                                    <strong class="ms-1">Esito:</strong> Pratica rigettata per incompletezza o incoerenza.
                                </div>
                                <div v-else class="alert alert-success">
                                    <svg class="icon"><use :href="`${spritesHref}#it-check-circle`" /></svg>
                                    <strong class="ms-1">Esito:</strong> Documentazione completa e coerente. Non sono richieste integrazioni in questa fase.
                                </div>

                                <div class="d-flex gap-2 mt-3">
                                    <button class="btn btn-outline-secondary" @click="goToStep(0)">
                                        Torna all’invio istanza
                                    </button>
                                    <button class="btn btn-primary" @click="nextStep" :disabled="stato === 'rigettata'">
                                        Procedi a Richiesta procedibilità
                                    </button>
                                </div>
                            </div>

                            <!-- STEP 3: Richiesta procedibilità (PEC + 20 gg) -->
                            <div v-else-if="currentStep === 2">
                                <h3 class="mb-2">3. Richiesta procedibilità</h3>
                                <p class="text-muted">
                                    AC verifica il fascicolo e invia PEC a amministrazioni, Commissione Tecnica ed enti. Entro <strong>20 giorni</strong> gli enti si esprimono sulla completezza documentale.
                                </p>

                                <div class="d-flex flex-wrap gap-2 mb-3">
                                    <button class="btn btn-outline-primary" @click="inviaPEC" :disabled="!istanzaInviataAt || !!pecInviataAt || isProcessing">
                                        <svg class="icon"><use :href="`${spritesHref}#it-mail`" /></svg>
                                        <span class="ms-2">Invia PEC a amm.ni / Commissione Tecnica / enti</span>
                                    </button>
                                    <button class="btn btn-outline-secondary" @click="aggiungiRispostaDemo" :disabled="!pecInviataAt || isProcessing">
                                        Aggiungi risposte demo enti
                                    </button>
                                </div>

                                <div class="row g-3">
                                    <div class="col-12 col-xl-6">
                                        <div class="card p-3 h-100">
                                            <div class="mb-2">
                                                <strong>PEC inviata:</strong>
                                                <span class="ms-1">{{ pecInviataAt ? formatDateTime(pecInviataAt) : '—' }}</span>
                                            </div>
                                            <div class="mb-2">
                                                <strong>Scadenza enti (20 gg):</strong>
                                                <span class="ms-1">{{ entiDeadline ? formatDateTime(entiDeadline) : '—' }}</span>
                                            </div>
                                            <div class="mb-2">
                                                <strong>Giorni residui:</strong>
                                                <span class="badge ms-1"
                                                      :class="{
                                                      'bg-success' : giorniResiduiEnti>
                                                    10,
                                                    'bg-warning': giorniResiduiEnti <= 10 && giorniResiduiEnti > 0,
                                                    'bg-danger': giorniResiduiEnti <= 0
                                                    }">
                                                    {{ entiDeadline ? giorniResiduiEnti : '—' }}
                                                </span>
                                            </div>
                                            <div class="mt-3">
                                                <label class="form-label small fw-semibold">Avanzamento risposte enti</label>
                                                <div class="progress">
                                                    <div class="progress-bar"
                                                         role="progressbar"
                                                         :style="{ width: risposteProgress + '%' }"
                                                         :class="scoreBarClass(risposteProgress)">
                                                        {{ risposteProgress }}%
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="mt-3">
                                                <strong>Destinatari PEC</strong>
                                                <ul class="small mb-0">
                                                    <li v-for="d in destinatariPEC" :key="d">{{ d }}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-12 col-xl-6">
                                        <div class="card p-3 h-100">
                                            <strong>Risposte enti sulla completezza documentale</strong>
                                            <div class="mt-2">
                                                <div class="row g-2">
                                                    <div class="col-12 col-md-6">
                                                        <input class="form-control" v-model="nuovaRisposta.ente" placeholder="Ente/Struttura" />
                                                    </div>
                                                    <div class="col-12 col-md-6">
                                                        <select class="form-select" v-model="nuovaRisposta.esito">
                                                            <option value="conforme">Conforme</option>
                                                            <option value="non conforme">Non conforme</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-12">
                                                        <textarea class="form-control" rows="2" v-model="nuovaRisposta.note" placeholder="Note"></textarea>
                                                    </div>
                                                    <div class="col-12 d-flex justify-content-end">
                                                        <button class="btn btn-primary" @click="aggiungiRisposta" :disabled="!nuovaRisposta.ente.trim() || !pecInviataAt">
                                                            Aggiungi risposta
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <ul class="list-group mt-3">
                                                <li v-for="r in risposteEnti" :key="r.id" class="list-group-item d-flex justify-content-between align-items-start">
                                                    <div>
                                                        <div class="fw-semibold">{{ r.ente }}</div>
                                                        <div class="small text-muted">{{ formatDateTime(r.data) }}</div>
                                                        <div class="small mt-1">{{ r.note }}</div>
                                                    </div>
                                                    <span class="badge" :class="r.esito === 'conforme' ? 'bg-success' : 'bg-danger'">{{ r.esito }}</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- STEP 4: Avvio procedimento -->
                            <div v-else-if="currentStep === 3">
                                <h3 class="mb-2">4. Avvio procedimento</h3>
                                <p class="text-muted">
                                    Il proponente risponde entro <strong>20 giorni</strong> a eventuali richieste di integrazione. Il tool AI genera suggerimenti per il provvedimento di consultazione. L’AC pubblica SIA e il provvedimento di avvio consultazione.
                                </p>

                                <div class="row g-3">
                                    <div class="col-12 col-xl-6">
                                        <div class="card p-3 h-100">
                                            <div class="d-flex flex-wrap gap-2">
                                                <button class="btn btn-outline-primary" @click="richiediIntegrazioni" :disabled="!!richiestaIntegrazioniAt || isProcessing">
                                                    Richiedi integrazioni al proponente
                                                </button>
                                            </div>

                                            <div class="mt-3">
                                                <div class="mb-2"><strong>Richiesta integrazioni:</strong> <span class="ms-1">{{ richiestaIntegrazioniAt ? formatDateTime(richiestaIntegrazioniAt) : '—' }}</span></div>
                                                <div class="mb-2"><strong>Scadenza proponente (20 gg):</strong> <span class="ms-1">{{ proponenteDeadline ? formatDateTime(proponenteDeadline) : '—' }}</span></div>
                                                <div class="mb-2">
                                                    <strong>Giorni residui:</strong>
                                                    <span class="badge ms-1"
                                                          :class="{
                                                          'bg-success' : giorniResiduiProponente>
                                                        10,
                                                        'bg-warning': giorniResiduiProponente <= 10 && giorniResiduiProponente > 0,
                                                        'bg-danger': giorniResiduiProponente <= 0
                                                        }">
                                                        {{ proponenteDeadline ? giorniResiduiProponente : '—' }}
                                                    </span>
                                                </div>
                                            </div>

                                            <div v-if="richiestaIntegrazioniAt" class="mt-2">
                                                <label class="form-label small fw-semibold">Carica risposta del proponente (integrazioni)</label>
                                                <input class="form-control" type="file" accept=".pdf,.doc,.docx,.zip" @change="onFileChange($event, 'rispostaProponente')" />
                                                <div class="form-text">
                                                    File: <strong>{{ rispostaPropFileName || '—' }}</strong>
                                                    <span v-if="rispostaPropSize">({{ rispostaPropSize }})</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-12 col-xl-6">
                                        <div class="card p-3 h-100">
                                            <div class="d-flex flex-wrap gap-2">
                                                <button class="btn btn-outline-secondary" @click="generaSuggerimentiAI" :disabled="isProcessing">
                                                    <svg class="icon"><use :href="`${spritesHref}#it-magic`" /></svg>
                                                    <span class="ms-2">Genera suggerimenti AI</span>
                                                </button>
                                                <button class="btn btn-success" @click="pubblicaAvvio" :disabled="!suggerimentiAI.trim() || !!pubblicatoAvvioAt || isProcessing">
                                                    <svg class="icon"><use :href="`${spritesHref}#it-upload`" /></svg>
                                                    <span class="ms-2">Pubblica SIA & provvedimento avvio consultazione</span>
                                                </button>
                                                <button class="btn btn-outline-primary" @click="exportProvvedimentoAvvio" :disabled="!suggerimentiAI.trim()">
                                                    Esporta provvedimento avvio (.txt)
                                                </button>
                                            </div>

                                            <div class="mt-3">
                                                <div class="small text-muted">Pubblicazione avvio consultazione:</div>
                                                <div><strong>{{ pubblicatoAvvioAt ? formatDateTime(pubblicatoAvvioAt) : '—' }}</strong></div>
                                            </div>

                                            <div class="alert alert-info mt-3" v-if="suggerimentiAI">
                                                <strong>Suggerimenti AI (provvedimento di consultazione):</strong>
                                                <div class="mt-1">{{ suggerimentiAI }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- NAVIGATION -->
                            <div class="d-flex justify-content-between mt-4">
                                <button class="btn btn-outline-secondary" @click="prevStep" :disabled="currentStep === 0 || isProcessing">
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
                    <h4>AI Helper & Indicatori</h4>

                    <button class="btn btn-primary w-100 mb-2" @click="generaSuggerimentiAI" :disabled="isProcessing">
                        Genera suggerimenti AI
                    </button>
                    <button class="btn btn-secondary w-100 mb-2" @click="compilaDemo" :disabled="isProcessing">
                        Compila demo documenti & risposte
                    </button>
                    <button class="btn btn-outline-secondary w-100" @click="exportFascicolo" :disabled="!hasDocMinimi || isProcessing">
                        Esporta fascicolo (.json)
                    </button>

                    <div class="mt-3">
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

                        <!-- Scadenze -->
                        <div class="mb-3">
                            <div class="d-flex justify-content-between">
                                <span class="small fw-semibold">Avanzamento risposte enti (20 gg)</span>
                                <span class="small">{{ risposteProgress }}%</span>
                            </div>
                            <div class="progress">
                                <div class="progress-bar"
                                     role="progressbar"
                                     :style="{ width: risposteProgress + '%' }"
                                     :class="scoreBarClass(risposteProgress)"></div>
                            </div>
                        </div>

                        <div>
                            <div class="d-flex justify-content-between">
                                <span class="small fw-semibold">Risposta proponente (20 gg)</span>
                                <span class="small">{{ rispostaProponenteProgress }}%</span>
                            </div>
                            <div class="progress">
                                <div class="progress-bar"
                                     role="progressbar"
                                     :style="{ width: rispostaProponenteProgress + '%' }"
                                     :class="scoreBarClass(rispostaProponenteProgress)"></div>
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
     * PRESENTAZIONE ISTANZA — Vue3 + bootstrap-italia
     * Fasi: Invio (real-time checks + fascicolo), N/A integrazioni (auto-rigetto), Procedibilità (PEC + 20gg), Avvio procedimento (20gg + AI + pubblicazione).
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
     * WIZARD
     * --------------------------- */
    const steps = [
        { key: 'invio', label: 'Invio istanza' },
        { key: 'integrazioni', label: 'Richiesta integrazioni' },
        { key: 'procedibilita', label: 'Richiesta procedibilità' },
        { key: 'avvio', label: 'Avvio procedimento' },
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
    type Stato = 'bozza' | 'inviata' | 'rigettata' | 'pecInviata' | 'avvioPubblicato'
    const stato = ref<Stato>('bozza')
    const statoLabel = computed(() => {
        switch (stato.value) {
            case 'inviata': return 'Istanza inviata'
            case 'rigettata': return 'Rigettata'
            case 'pecInviata': return 'PEC inviata'
            case 'avvioPubblicato': return 'Avvio consultazione pubblicato'
            default: return 'Bozza'
        }
    })

    /* ---------------------------
     * INPUT DOCUMENTI
     * --------------------------- */
    const siaFile = ref<File | null>(null)
    const siaFileName = ref(''); const siaSize = ref('')

    const fattFile = ref<File | null>(null)
    const fattFileName = ref(''); const fattSize = ref('')

    const sntFile = ref<File | null>(null)
    const sntFileName = ref(''); const sntSize = ref('')

    type ExtraDoc = { id: string; name: string; size: number }
    const extraDocs = ref<ExtraDoc[]>([])

    function humanSize(n: number) {
        if (!n) return ''
        const units = ['B', 'KB', 'MB', 'GB']
        let i = 0; let s = n
        while (s >= 1024 && i < units.length - 1) { s = s / 1024; i++ }
        return `${s.toFixed(1)} ${units[i]}`
    }

    function onFileChange(e: Event, type: 'sia' | 'fattibilita' | 'snt' | 'rispostaProponente') {
        const input = e.target as HTMLInputElement
        const f = input.files?.[0] || null
        if (type === 'sia') {
            siaFile.value = f; siaFileName.value = f?.name || ''; siaSize.value = f ? humanSize(f.size) : ''
        } else if (type === 'fattibilita') {
            fattFile.value = f; fattFileName.value = f?.name || ''; fattSize.value = f ? humanSize(f.size) : ''
        } else if (type === 'snt') {
            sntFile.value = f; sntFileName.value = f?.name || ''; sntSize.value = f ? humanSize(f.size) : ''
        } else {
            rispostaPropFile.value = f; rispostaPropFileName.value = f?.name || ''; rispostaPropSize.value = f ? humanSize(f.size) : ''
        }
    }

    function onExtraFilesChange(e: Event) {
        const input = e.target as HTMLInputElement
        const list = Array.from(input.files || [])
        extraDocs.value = list.map(f => ({ id: crypto.randomUUID(), name: f.name, size: f.size }))
    }

    /* ---------------------------
     * CHECK COMPLETEZZA & COERENZA
     * --------------------------- */
    const hasSia = computed(() => !!siaFile.value)
    const hasFatt = computed(() => !!fattFile.value)
    const hasSnt = computed(() => !!sntFile.value)
    const hasDocMinimi = computed(() => hasSia.value && hasFatt.value && hasSnt.value)

    const siaFmt = computed(() => !!siaFileName.value.match(/\.(pdf|docx?|PDF)$/))
    const fattFmt = computed(() => !!fattFileName.value.match(/\.(pdf|docx?|zip|PDF|ZIP)$/))
    const sntFmt = computed(() => !!sntFileName.value.match(/\.(pdf|docx?|txt|PDF|TXT)$/))
    const coerenzaOk = computed(() => hasDocMinimi.value && siaFmt.value && fattFmt.value && sntFmt.value)

    // Pesi: 35% SIA, 30% Fattibilità, 25% SNT, 10% Documenti eventuali (+10% bonus coerenza, cap 100)
    const completenessScore = computed(() => {
        let s = 0
        if (hasSia.value) s += 35
        if (hasFatt.value) s += 30
        if (hasSnt.value) s += 25
        if (extraDocs.value.length) s += 10
        if (coerenzaOk.value) s = Math.min(100, s + 10)
        return Math.min(100, s)
    })
    function scoreBarClass(v: number) {
        if (v >= 80) return 'bg-success'
        if (v >= 60) return 'bg-warning'
        return 'bg-danger'
    }

    /* ---------------------------
     * FASCICOLO DIGITALE (real-time)
     * --------------------------- */
    function simpleHash(s: string) {
        let h = 0
        for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
        return h.toString(16).padStart(8, '0')
    }
    const fascicolo = computed(() => {
        const docs = [
            siaFileName.value && { tipo: 'SIA', nome: siaFileName.value, size: siaSize.value, hash: simpleHash(siaFileName.value + siaSize.value) },
            fattFileName.value && { tipo: 'Progetto fattibilità', nome: fattFileName.value, size: fattSize.value, hash: simpleHash(fattFileName.value + fattSize.value) },
            sntFileName.value && { tipo: 'SNT', nome: sntFileName.value, size: sntSize.value, hash: simpleHash(sntFileName.value + sntSize.value) },
            ...extraDocs.value.map(x => ({ tipo: 'Documento eventuale', nome: x.name, size: humanSize(x.size), hash: simpleHash(x.name + x.size) }))
        ].filter(Boolean) as any[]
        return {
            generatedAt: new Date().toISOString(),
            stato: stato.value,
            completezza: completenessScore.value,
            coerenza: coerenzaOk.value,
            documenti: docs
        }
    })
    const fascicoloDigitale = computed(() => JSON.stringify(fascicolo.value, null, 2))
    function exportFascicolo() {
        const blob = new Blob([fascicoloDigitale.value], { type: 'application/json;charset=utf-8' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = 'FascicoloDigitale.json'
        a.click()
        URL.revokeObjectURL(a.href)
    }

    /* ---------------------------
     * STEP 1: Invio / Rigetto
     * --------------------------- */
    const isProcessing = ref(false)
    const istanzaInviataAt = ref<Date | null>(null)
    const isInvioAbilitato = computed(() => completenessScore.value >= 70 && coerenzaOk.value)

    function resetIstanza() {
        siaFile.value = null; siaFileName.value = ''; siaSize.value = ''
        fattFile.value = null; fattFileName.value = ''; fattSize.value = ''
        sntFile.value = null; sntFileName.value = ''; sntSize.value = ''
        extraDocs.value = []
        istanzaInviataAt.value = null
        stato.value = 'bozza'
    }

    function autoRigetta() {
        if (!hasDocMinimi.value || !coerenzaOk.value) {
            stato.value = 'rigettata'
            completed.value[0] = true
            currentStep.value = 1
        }
    }

    function inviaIstanza() {
        if (!isInvioAbilitato.value) return
        isProcessing.value = true
        setTimeout(() => {
            istanzaInviataAt.value = new Date()
            stato.value = 'inviata'
            isProcessing.value = false
        }, 500)
    }

    /* ---------------------------
     * STEP 3: Procedibilità (PEC + 20 gg)
     * --------------------------- */
    const destinatariPEC = [
        'PEC Commissione Tecnica',
        'PEC ARPA Regionale',
        'PEC Comune competente',
        'PEC ASL',
        'PEC Soprintendenza'
    ]
    const pecInviataAt = ref<Date | null>(null)
    const entiDeadline = ref<Date | null>(null)
    type RispostaEnte = { id: number; ente: string; esito: 'conforme' | 'non conforme'; note: string; data: Date }
    const risposteEnti = ref<RispostaEnte[]>([])
    const nuovaRisposta = ref({ ente: '', esito: 'conforme' as 'conforme' | 'non conforme', note: '' })

    function addDays(d: Date, n: number) { const x = new Date(d); x.setDate(x.getDate() + n); return x }
    function formatDateTime(d: Date | null) {
        if (!d) return '—'
        return d.toLocaleString('it-IT', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    }

    function inviaPEC() {
        isProcessing.value = true
        setTimeout(() => {
            pecInviataAt.value = new Date()
            entiDeadline.value = addDays(pecInviataAt.value, 20)
            stato.value = 'pecInviata'
            isProcessing.value = false
        }, 500)
    }
    function aggiungiRisposta() {
        if (!nuovaRisposta.value.ente.trim()) return
        risposteEnti.value.push({
            id: risposteEnti.value.length + 1,
            ente: nuovaRisposta.value.ente.trim(),
            esito: nuovaRisposta.value.esito,
            note: nuovaRisposta.value.note.trim(),
            data: new Date()
        })
        nuovaRisposta.value = { ente: '', esito: 'conforme', note: '' }
    }
    function aggiungiRispostaDemo() {
        const demo = [
            { ente: 'ARPA', esito: 'conforme', note: 'Documentazione completa.' },
            { ente: 'Comune', esito: 'non conforme', note: 'Manca tavola viabilità cantieri (allegato tecnico).' },
        ] as const
        demo.forEach(d => {
            risposteEnti.value.push({
                id: risposteEnti.value.length + 1,
                ente: d.ente,
                esito: d.esito as any,
                note: d.note,
                data: new Date()
            })
        })
    }
    const risposteProgress = computed(() => {
        // Avanzamento rispetto al numero di destinatari
        const total = destinatariPEC.length
        const done = Math.min(risposteEnti.value.length, total)
        return Math.round((done / total) * 100)
    })
    const giorniResiduiEnti = computed(() => {
        if (!entiDeadline.value) return 0
        const ms = entiDeadline.value.getTime() - new Date().getTime()
        return Math.ceil(ms / (1000 * 60 * 60 * 24))
    })

    /* ---------------------------
     * STEP 4: Avvio procedimento (20 gg proponente + AI + Pubblicazione)
     * --------------------------- */
    const richiestaIntegrazioniAt = ref<Date | null>(null)
    const proponenteDeadline = ref<Date | null>(null)
    const rispostaPropFile = ref<File | null>(null)
    const rispostaPropFileName = ref(''); const rispostaPropSize = ref('')

    function richiediIntegrazioni() {
        if (richiestaIntegrazioniAt.value) return
        richiestaIntegrazioniAt.value = new Date()
        proponenteDeadline.value = addDays(richiestaIntegrazioniAt.value, 20)
    }

    const rispostaProponenteProgress = computed(() => {
        if (!richiestaIntegrazioniAt.value || !proponenteDeadline.value) return 0
        if (rispostaPropFile.value) return 100
        // percentuale temporale trascorsa (informativa)
        const total = proponenteDeadline.value.getTime() - richiestaIntegrazioniAt.value.getTime()
        const done = Math.min(Math.max(new Date().getTime() - richiestaIntegrazioniAt.value.getTime(), 0), total)
        return Math.round((done / total) * 100)
    })
    const giorniResiduiProponente = computed(() => {
        if (!proponenteDeadline.value) return 0
        const ms = proponenteDeadline.value.getTime() - new Date().getTime()
        return Math.ceil(ms / (1000 * 60 * 60 * 24))
    })

    const suggerimentiAI = ref<string>('')

    function generaSuggerimentiAI() {
        isProcessing.value = true
        setTimeout(() => {
            const criticita: string[] = []
            if (!siaFmt.value) criticita.push('Verifica formato e integrità del SIA.')
            if (!fattFmt.value) criticita.push('Verifica formato e contenuto del Progetto di fattibilità.')
            if (!sntFmt.value) criticita.push('Verifica formato SNT e coerenza con SIA.')
            const nonConformi = risposteEnti.value.filter(r => r.esito === 'non conforme').map(r => `${r.ente}: ${r.note}`)
            if (nonConformi.length) criticita.push(`Esiti non conformi per: ${nonConformi.join(' | ')}`)

            const linee = [
                'Mettere a disposizione del pubblico SIA e SNT tramite portale istituzionale con calendario consultazione.',
                'Consentire presentazione osservazioni entro 30 giorni dalla pubblicazione.',
                'Trasmettere il provvedimento a Commissione Tecnica e enti competenti.',
                'Prevedere, se necessario, ulteriori integrazioni documentali prima dell’avvio.'
            ]
            suggerimentiAI.value = [
                'Bozza di suggerimenti per il provvedimento di avvio consultazione:',
                criticita.length ? `- Criticità da evidenziare: ${criticita.join(' | ')}` : '- Nessuna criticità bloccante rilevata dai controlli di coerenza.',
                `- Linee dispositive: ${linee.join(' | ')}`,
                rispostaPropFileName.value ? `- Presa d’atto delle integrazioni del proponente: ${rispostaPropFileName.value}.` : '- In attesa di eventuali integrazioni del proponente.'
            ].join('\n')
            isProcessing.value = false
        }, 500)
    }

    const pubblicatoAvvioAt = ref<Date | null>(null)
    function pubblicaAvvio() {
        if (!suggerimentiAI.value.trim() || pubblicatoAvvioAt.value) return
        pubblicatoAvvioAt.value = new Date()
        stato.value = 'avvioPubblicato'
    }

    function exportProvvedimentoAvvio() {
        const content = [
            '=== Provvedimento di Avvio Consultazione (Bozza) ===',
            '',
            'Dispositivo (estratto):',
            '- Mettere a disposizione SIA e SNT sul portale.',
            '- Avviare consultazione pubblica (30 giorni).',
            '- Ricezione osservazioni e trasmissioni agli enti competenti.',
            '',
            'Suggerimenti AI:',
            suggerimentiAI.value || '(non generati)',
            '',
            `Data: ${today}`
        ].join('\n')
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = 'Provvedimento-Avvio-Consultazione.txt'
        a.click()
        URL.revokeObjectURL(a.href)
    }

    /* ---------------------------
     * NAV GUARD
     * --------------------------- */
    const isNextDisabled = computed(() => {
        if (currentStep.value === 0) return !(stato.value === 'inviata' || stato.value === 'rigettata')
        if (currentStep.value === 1) return stato.value === 'rigettata' // se rigettata, non si prosegue
        if (currentStep.value === 2) return !pecInviataAt.value
        return false
    })

    /* ---------------------------
     * DEMO & UTILITY
     * --------------------------- */
    function compilaDemo() {
        if (!siaFileName.value) { siaFileName.value = 'SIA-ImpiantoFV.pdf'; siaSize.value = '5.4 MB' }
        if (!fattFileName.value) { fattFileName.value = 'ProgettoFattibilita.docx'; fattSize.value = '2.1 MB' }
        if (!sntFileName.value) { sntFileName.value = 'SNT.txt'; sntSize.value = '48 KB' }
        if (!extraDocs.value.length) {
            extraDocs.value = [
                { id: crypto.randomUUID(), name: 'Elaborato_Paesaggio.pdf', size: 800000 },
                { id: crypto.randomUUID(), name: 'Tavola_Viabilita.png', size: 3000000 },
            ]
        }
    }

</script>

<style scoped>
    h2, h3, h4, h6 {
        font-weight: bold;
    }

    /* Explainability pack a destra del titolo */
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