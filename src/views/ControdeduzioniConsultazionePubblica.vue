
<template>
    <div class="container-fluid p-4" style="background-color:#e3f2fd;">
        <!-- Barra azioni -->
        <div class="row align-items-center mt-4 mb-4">
            <div class="col-6 d-flex justify-content-start">
                <button class="btn btn-outline-primary bg-white d-inline-flex align-items-center"
                        @click="goTo('/dashboard')" style="height:50px;">
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
                                        <h2 class="mb-2">Fase 4 — Controdeduzioni & Consultazione Pubblica</h2>
                                        <span class="explain-pack">
                                            <PopoverExplain :spritesHref="spritesHref"
                                                            icon="it-info-circle"
                                                            color="light"
                                                            text="Aggrega osservazioni, analizza temi e sentiment, genera sintesi e suggerimenti AI."
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
                                    <p class="mb-1"><strong>Progetto:</strong> Impianto fotovoltaico — Controdeduzioni & Parere Finale</p>
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

                            <!-- STEP 1: Raccolta Osservazioni (5.2) -->
                            <div v-if="currentStep === 0">
                                <h3 class="mb-2">5.2 — Aggregazione & Sintesi Osservazioni (Pubblico/Enti)</h3>
                                <p class="text-muted">
                                    Import automatico da <code>localStorage</code> (chiavi:
                                    <code>Consultazione:Osservazioni:Pubblico</code>,
                                    <code>Consultazione:Osservazioni:Enti</code>).
                                    In alternativa incolla manualmente JSON (array).
                                </p>

                                <div class="alert alert-info d-flex align-items-center gap-2">
                                    <svg class="icon"><use :href="`${spritesHref}#it-info-circle`" /></svg>
                                    <div>
                                        <strong>Origine dati:</strong>
                                        <span v-if="raccolta.origine === 'localStorage'">localStorage</span>
                                        <span v-else-if="raccolta.origine === 'manual'">inserimento manuale</span>
                                        <span v-else>non ancora importati</span>
                                    </div>
                                </div>

                                <div class="d-flex flex-wrap gap-2 mb-3">
                                    <button class="btn btn-primary" @click="importOsservazioni">
                                        <svg class="icon"><use :href="`${spritesHref}#it-download`" /></svg>
                                        <span class="ms-2">Importa osservazioni</span>
                                    </button>
                                    <button class="btn btn-outline-secondary" @click="clearRaccolta" :disabled="!hasOsservazioni">
                                        Svuota raccolta
                                    </button>
                                </div>

                                <div class="row g-3">
                                    <!-- JSON pubblico -->
                                    <div class="col-12">
                                        <div class="card p-3">
                                            <div class="d-flex justify-content-between align-items-center">
                                                <h6 class="mb-0">Osservazioni pubblico</h6>
                                                <span class="badge" :class="raccolta.pubblico.length ? 'bg-success' : 'bg-secondary'">
                                                    {{ raccolta.pubblico.length }} elementi
                                                </span>
                                            </div>
                                            <textarea class="form-control mt-2" rows="4" v-model="manual.pubblico"
                                                      placeholder='Incolla JSON array (es. [{"id":"O-1","autore":"...","testo":"..."}])'></textarea>
                                            <div class="text-end mt-2">
                                                <button class="btn btn-sm btn-outline-primary" @click="loadManual('pubblico')" :disabled="!manual.pubblico.trim()">Usa JSON incollato</button>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- JSON enti -->
                                    <div class="col-12">
                                        <div class="card p-3">
                                            <div class="d-flex justify-content-between align-items-center">
                                                <h6 class="mb-0">Osservazioni enti</h6>
                                                <span class="badge" :class="raccolta.enti.length ? 'bg-success' : 'bg-secondary'">
                                                    {{ raccolta.enti.length }} elementi
                                                </span>
                                            </div>
                                            <textarea class="form-control mt-2" rows="4" v-model="manual.enti"
                                                      placeholder='Incolla JSON array (es. [{"id":"E-1","ente":"ARPA","testo":"..."}])'></textarea>
                                            <div class="text-end mt-2">
                                                <button class="btn btn-sm btn-outline-primary" @click="loadManual('enti')" :disabled="!manual.enti.trim()">Usa JSON incollato</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <hr class="my-4">

                                <div class="row g-3">
                                    <div class="col-12 col-md-6">
                                        <div class="card p-3">
                                            <h6 class="mb-1">Anteprima (primi 3)</h6>
                                            <ul class="small mb-0">
                                                <li v-for="o in anteprima" :key="o.id">
                                                    <strong>[{{ o.id }}]</strong>
                                                    <span class="badge" :class="o.provenienza==='ente' ? 'bg-success' : 'bg-info text-dark'">{{ o.provenienza }}</span>
                                                    <span v-if="o.ente" class="ms-1">— {{ o.ente }}</span><br>
                                                    <span class="text-muted">{{ trimText(o.testo, 120) }}</span>
                                                </li>
                                                <li v-if="anteprima.length===0" class="text-muted">Nessuna osservazione disponibile.</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="col-12 col-md-6">
                                        <div class="card p-3">
                                            <h6 class="mb-1">Statistiche rapide</h6>
                                            <div class="small">
                                                <div>Totale: <strong>{{ totali.tutte }}</strong></div>
                                                <div>Da pubblico: <strong>{{ totali.pubblico }}</strong></div>
                                                <div>Da enti: <strong>{{ totali.enti }}</strong></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- STEP 2: Analisi (Topic, Clustering, Sentiment) -->
                            <div v-else-if="currentStep === 1">
                                <h3 class="mb-2">Analisi — Topic modeling, clustering & sentiment</h3>
                                <p class="text-muted">Analisi locale (mock): nessuna chiamata esterna. Regola i parametri e avvia.</p>

                                <div class="card p-3 mb-3">
                                    <div class="row g-3">
                                        <div class="col-12 col-md-4">
                                            <label class="form-label fw-semibold">Numero temi (K)</label>
                                            <input type="range" class="form-range" min="2" max="8" v-model.number="parametri.kTemi">
                                            <div class="small">K = <strong>{{ parametri.kTemi }}</strong></div>
                                        </div>
                                        <div class="col-12 col-md-4">
                                            <label class="form-label fw-semibold">Parole per tema</label>
                                            <input type="number" class="form-control" min="3" max="10" v-model.number="parametri.topParoleTema">
                                        </div>
                                        <div class="col-12 col-md-4">
                                            <label class="form-label fw-semibold">Frasi per sintesi</label>
                                            <input type="number" class="form-control" min="3" max="10" v-model.number="parametri.frasiSintesi">
                                        </div>
                                    </div>

                                    <div class="d-flex flex-wrap gap-2 mt-3">
                                        <button class="btn btn-primary" @click="eseguiAnalisi" :disabled="!(hasOsservazioni)">
                                            <svg class="icon"><use :href="`${spritesHref}#it-play-circle`" /></svg>
                                            <span class="ms-2">Esegui analisi</span>
                                        </button>
                                        <button class="btn btn-outline-secondary" @click="resetAnalisi" :disabled="temi.length===0 && cluster.length===0">
                                            Pulisci risultati
                                        </button>
                                    </div>
                                </div>

                                <div v-if="analisiRunning" class="text-center my-3">
                                    <div class="spinner-border text-primary"></div>
                                    <p class="text-muted small mt-2">Analisi in corso…</p>
                                </div>

                                <div v-else>
                                    <!-- Temi -->
                                    <div class="card p-3 mb-3">
                                        <h6 class="mb-2">Temi individuati</h6>
                                        <div v-if="temi.length===0" class="text-muted small">Nessun tema disponibile. Avvia l'analisi.</div>
                                        <div class="row g-3">
                                            <div class="col-12 col-md-6" v-for="(t,i) in temi" :key="i">
                                                <div class="border rounded p-2 h-100">
                                                    <div class="d-flex justify-content-between align-items-center">
                                                        <strong>Tema #{{ i+1 }}</strong>
                                                        <span class="badge bg-primary">{{ t.size }} osserv.</span>
                                                    </div>
                                                    <div class="small text-muted mt-1">Parole chiave: <em>{{ t.keywords.join(', ') }}</em></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Clustering -->
                                    <div class="card p-3 mb-3">
                                        <h6 class="mb-2">Clustering per tema</h6>
                                        <div v-if="cluster.length===0" class="text-muted small">Nessun cluster disponibile.</div>
                                        <div class="accordion" id="accCluster">
                                            <div class="accordion-item" v-for="(c, i) in cluster" :key="i">
                                                <h2 class="accordion-header" :id="`head-${i}`">
                                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                                            :data-bs-target="`#coll-${i}`" aria-expanded="false" :aria-controls="`coll-${i}`">
                                                        Cluster #{{ i+1 }} — <span class="ms-1 small text-muted">Parole: {{ c.label.join(', ') }}</span>
                                                        <span class="badge bg-secondary ms-2">{{ c.items.length }}</span>
                                                    </button>
                                                </h2>
                                                <div :id="`coll-${i}`" class="accordion-collapse collapse" :aria-labelledby="`head-${i}`" data-bs-parent="#accCluster">
                                                    <div class="accordion-body">
                                                        <ul class="small">
                                                            <li v-for="o in c.items" :key="o.id">
                                                                <strong>[{{ o.id }}]</strong>
                                                                <span class="badge" :class="o.provenienza==='ente' ? 'bg-success' : 'bg-info text-dark'">{{ o.provenienza }}</span>
                                                                <span v-if="o.ente" class="ms-1">— {{ o.ente }}</span>
                                                                <div class="text-muted">{{ trimText(o.testo, 200) }}</div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Sentiment -->
                                    <div class="card p-3">
                                        <h6 class="mb-2">Sentiment analysis</h6>
                                        <div class="d-flex flex-wrap gap-2 mb-2">
                                            <span class="badge bg-success">Positivi: {{ sentimentAgg.positivo }}</span>
                                            <span class="badge bg-warning text-dark">Critici: {{ sentimentAgg.critico }}</span>
                                            <span class="badge bg-danger">Negativi: {{ sentimentAgg.negativo }}</span>
                                            <span class="badge bg-secondary">Neutri: {{ sentimentAgg.neutro }}</span>
                                        </div>
                                        <div class="small text-muted">Metodo lessicale (mock) con gestione basilare negazioni/intensificatori.</div>
                                    </div>
                                </div>
                            </div>

                            <!-- STEP 3: Sintesi & Suggerimenti AI -->
                            <div v-else-if="currentStep === 2">
                                <h3 class="mb-2">Sintesi automatica & Suggerimenti AI</h3>
                                <p class="text-muted">Sintesi estrattiva multi-documento + raccomandazioni basate su temi critici e sentiment.</p>

                                <div class="d-flex flex-wrap gap-2 mb-3">
                                    <button class="btn btn-primary" @click="generaSintesi" :disabled="temi.length===0 && cluster.length===0">
                                        <svg class="icon"><use :href="`${spritesHref}#it-magic`" /></svg>
                                        <span class="ms-2">Genera sintesi</span>
                                    </button>
                                    <button class="btn btn-outline-secondary" @click="pulisciSintesi" :disabled="!sintesi.testo">
                                        Pulisci
                                    </button>
                                </div>

                                <div class="card p-3 mb-3">
                                    <h6 class="mb-2">Sintesi automatica</h6>
                                    <textarea class="form-control" rows="6" v-model="sintesi.testo"
                                              placeholder="La sintesi apparirà qui ed è liberamente modificabile."></textarea>
                                    <div class="small text-muted mt-2">
                                        Citazioni inserite automaticamente come [O-id]. Es.: [O-12]
                                    </div>
                                </div>

                                <div class="card p-3">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <h6 class="mb-0">Suggerimenti AI di modifiche ai documenti</h6>
                                        <button class="btn btn-sm btn-outline-primary" @click="rigeneraSuggerimenti" :disabled="temi.length===0 && cluster.length===0">
                                            Rigenera
                                        </button>
                                    </div>

                                    <div v-if="suggerimenti.length === 0" class="small text-muted mt-2">Nessun suggerimento (esegui analisi prima).</div>

                                    <div v-for="(s, i) in suggerimenti" :key="i" class="card p-2 mt-2 border">
                                        <div class="d-flex justify-content-between align-items-start">
                                            <div>
                                                <strong>{{ s.titolo }}</strong>
                                                <div class="small text-muted mt-1">{{ s.descrizione }}</div>
                                                <div v-if="s.fonti && s.fonti.length" class="small mt-1">
                                                    <em>Fonti:</em> <span class="text-muted">[{{ s.fonti.join(', ') }}]</span>
                                                </div>
                                            </div>
                                            <div>
                                                <button class="btn btn-xs btn-outline-primary" @click="accettaSuggerimento(s)">
                                                    Accetta
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div v-if="modificheProposte.length" class="alert alert-info mt-3">
                                        <strong>Modifiche accettate:</strong>
                                        <ul class="mb-0">
                                            <li v-for="(m, j) in modificheProposte" :key="j">{{ m }}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <!-- STEP 4: Bozza Parere Finale (5.3) -->
                            <div v-else-if="currentStep === 3">
                                <h3 class="mb-2">5.3 — Produzione Parere Motivato Finale (A.C.)</h3>
                                <p class="text-muted">Generazione AI (mock) della bozza di parere con citazioni automatiche.</p>

                                <div class="d-flex flex-wrap gap-2 mb-3">
                                    <button class="btn btn-primary" @click="generaBozzaParere" :disabled="!sintesi.testo">
                                        Genera bozza di Parere Motivato Finale
                                    </button>
                                    <button class="btn btn-outline-secondary" @click="pulisciBozzaParere" :disabled="!hasBozzaParere">
                                        Pulisci
                                    </button>
                                </div>

                                <!-- Intestazione -->
                                <div class="card p-3 mb-3">
                                    <h6>Intestazione</h6>
                                    <div class="row g-3">
                                        <div class="col-12 col-md-4">
                                            <label class="form-label fw-semibold">Ente</label>
                                            <input class="form-control" v-model="parere.intestazione.ente" placeholder="Autorità Competente / Ente" />
                                        </div>
                                        <div class="col-12 col-md-4">
                                            <label class="form-label fw-semibold">Settore/Ufficio</label>
                                            <input class="form-control" v-model="parere.intestazione.settore" placeholder="Settore VIA/VAS" />
                                        </div>
                                        <div class="col-6 col-md-2">
                                            <label class="form-label fw-semibold">Numero</label>
                                            <input class="form-control" v-model="parere.intestazione.numero" placeholder="Auto" />
                                        </div>
                                        <div class="col-6 col-md-2">
                                            <label class="form-label fw-semibold">Data</label>
                                            <input type="date" class="form-control" v-model="parere.intestazione.data" />
                                        </div>
                                    </div>
                                </div>

                                <!-- Oggetto & Esito -->
                                <div class="card p-3 mb-3">
                                    <h6>Oggetto & Esito Parere</h6>
                                    <input class="form-control mb-2" v-model="parere.oggetto" placeholder="Oggetto del Parere Motivato Finale" />
                                    <div class="row g-3">
                                        <div class="col-12 col-md-4">
                                            <label class="form-label fw-semibold">Esito</label>
                                            <select class="form-select" v-model="parere.esito">
                                                <option>Favorevole</option>
                                                <option>Favorevole con prescrizioni</option>
                                                <option>Non favorevole</option>
                                            </select>
                                        </div>
                                        <div class="col-12 col-md-8">
                                            <label class="form-label fw-semibold">Sintesi esito (motivazione breve)</label>
                                            <input class="form-control" v-model="parere.sintesiEsito" placeholder="Motivazione sintetica" />
                                        </div>
                                    </div>
                                </div>

                                <!-- Premesse -->
                                <div class="card p-3 mb-3">
                                    <h6>Premesse (VISTO/VISTA, CONSIDERATO)</h6>
                                    <label class="form-label small fw-semibold">Richiami normativi (uno per riga)</label>
                                    <textarea class="form-control mb-2" rows="3" v-model="parere.premesse.richiamiNormativi"></textarea>

                                    <label class="form-label small fw-semibold">Considerato che</label>
                                    <textarea class="form-control" rows="3" v-model="parere.premesse.considerato"></textarea>
                                </div>

                                <!-- Valutazioni -->
                                <div class="card p-3 mb-3">
                                    <h6>Valutazioni tecniche (sintesi + citazioni)</h6>
                                    <textarea class="form-control" rows="5" v-model="parere.valutazioni"></textarea>
                                    <div class="small text-muted mt-2">
                                        Citazioni fonti applicate: <span v-if="parere.citazioni.length">[{{ parere.citazioni.join(', ') }}]</span><span v-else>nessuna</span>
                                    </div>
                                </div>

                                <!-- Prescrizioni -->
                                <div class="card p-3 mb-3">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <h6 class="mb-0">Prescrizioni (se applicabile)</h6>
                                        <button class="btn btn-sm btn-outline-primary" @click="aggiungiPrescrizione">
                                            <svg class="icon"><use :href="`${spritesHref}#it-plus-circle`" /></svg>
                                            <span class="ms-2">Aggiungi</span>
                                        </button>
                                    </div>
                                    <div v-if="parere.prescrizioni.length === 0" class="text-muted small mt-2">
                                        Nessuna prescrizione.
                                    </div>
                                    <div v-for="(p,i) in parere.prescrizioni" :key="p.id" class="input-group mt-2">
                                        <span class="input-group-text">#{{ i+1 }}</span>
                                        <input class="form-control" v-model="p.testo" placeholder="Testo prescrizione" />
                                        <button class="btn btn-outline-danger" @click="rimuoviPrescrizione(i)">Rimuovi</button>
                                    </div>
                                </div>

                                <!-- Dispositivo finale -->
                                <div class="card p-3 mb-3">
                                    <h6>Dispositivo</h6>
                                    <textarea class="form-control" rows="4" v-model="parere.dispositivo"
                                              placeholder="Es. Si esprime parere favorevole (con prescrizioni) per i motivi esposti..."></textarea>
                                </div>
                            </div>

                            <!-- STEP 5: Verifica (completezza/coerenza/struttura normativa) -->
                            <div v-else-if="currentStep === 4">
                                <h3 class="mb-2">Verifica — completezza, coerenza, struttura normativa</h3>
                                <p class="text-muted">Controlli automatici e auto-fix sui principali requisiti formali e sostanziali.</p>

                                <div class="d-flex flex-wrap gap-2 mb-3">
                                    <button class="btn btn-primary" @click="eseguiVerifica" :disabled="!hasBozzaParere">
                                        <svg class="icon"><use :href="`${spritesHref}#it-play-circle`" /></svg>
                                        <span class="ms-2">Esegui verifica</span>
                                    </button>
                                    <button class="btn btn-outline-secondary" @click="applicaAutoFix" :disabled="verifica.issues.length===0">
                                        Applica auto-fix
                                    </button>
                                </div>

                                <div v-if="verifica.running" class="text-center my-3">
                                    <div class="spinner-border text-primary"></div>
                                    <p class="text-muted small mt-2">Analisi in corso…</p>
                                </div>

                                <div v-else>
                                    <div class="alert" :class="badgeRisultatoVerifica.class">
                                        <strong>{{ badgeRisultatoVerifica.label }}</strong>
                                        <span class="ms-2 small text-muted">
                                            Errori: {{ countIssues('error') }}, Avvisi: {{ countIssues('warning') }}, Info: {{ countIssues('info') }}
                                        </span>
                                    </div>

                                    <div v-if="verifica.issues.length === 0" class="text-muted">Nessuna criticità rilevata.</div>

                                    <div v-for="(iss, i) in verifica.issues" :key="i" class="card p-3 mb-2"
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

                            <!-- STEP 6: Revisione e approvazione AC -->
                            <div v-else-if="currentStep === 5">
                                <h3 class="mb-2">Revisione e approvazione finale (A.C.)</h3>
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
                                        <span v-if="parere.locked" class="badge bg-success align-self-center">Parere approvato e bloccato</span>
                                    </div>

                                    <div v-if="changelog.length" class="mt-3">
                                        <h6>Changelog</h6>
                                        <ul class="small">
                                            <li v-for="(c, i) in changelog" :key="i">{{ c }}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <!-- STEP 7: Esporta & Protocolla -->
                            <div v-else-if="currentStep === 6">
                                <h3 class="mb-2">Esporta & Protocolla</h3>
                                <p class="text-muted">Esporta il parere e genera un payload pronto per la protocollazione.</p>

                                <div class="d-flex flex-wrap gap-2 mb-3">
                                    <button class="btn btn-primary" @click="exportParereTXT" :disabled="!hasBozzaParere">
                                        Esporta Parere (.txt)
                                    </button>
                                    <button class="btn btn-outline-primary" @click="exportParereJSON" :disabled="!hasBozzaParere">
                                        Esporta Parere (.json)
                                    </button>
                                    <button class="btn btn-outline-secondary" @click="generaPayloadProtocollo" :disabled="!hasBozzaParere">
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

                    <button class="btn btn-primary w-100 mb-2" @click="importOsservazioni">
                        Importa osservazioni da localStorage
                    </button>
                    <button class="btn btn-secondary w-100 mb-2" @click="eseguiAnalisi" :disabled="!hasOsservazioni">
                        Esegui analisi (topic/sentiment)
                    </button>
                    <button class="btn btn-outline-secondary w-100 mb-2" @click="generaSintesi" :disabled="temi.length===0 && cluster.length===0">
                        Genera sintesi
                    </button>
                    <button class="btn btn-outline-secondary w-100" @click="generaBozzaParere" :disabled="!sintesi.testo">
                        Genera bozza parere
                    </button>

                    <div v-if="analisiRunning || verifica.running" class="text-center mt-3">
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
     * Pagina: Fase 4 — Controdeduzioni & Consultazione Pubblica
     * - Implementa 5.2 (aggregazione/sintesi osservazioni, topic/clustering, sentiment, suggerimenti)
     * - Implementa 5.3 (bozza parere finale con citazioni, verifica, approvazione, export)
     * - Mock locale, nessuna chiamata esterna. Commenti in italiano.
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
        { label: 'Raccolta Osservazioni' },                         // 5.2
        { label: 'Analisi (topic/sentiment/clustering)' },          // 5.2
        { label: 'Sintesi & Suggerimenti AI' },                     // 5.2
        { label: 'Bozza Parere Finale (A.C.)' },                    // 5.3
        { label: 'Verifica (completezza/coerenza/struttura)' },     // 5.3
        { label: 'Revisione A.C.' },                                // 5.3
        { label: 'Esporta & Protocolla' }                           // 5.3
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
     * 5.2) RACCOLTA OSSERVAZIONI
     * ------------------------------------ */
    type Osservazione = {
        id: string
        provenienza: 'pubblico' | 'ente'
        autore?: string
        ente?: string
        canale?: 'portale' | 'email' | 'pec' | 'sportello'
        data?: string
        testo: string
        allegati?: string[]
    }

    const STORAGE_KEYS = {
        pubblico: 'Consultazione:Osservazioni:Pubblico',
        enti: 'Consultazione:Osservazioni:Enti'
    }

    const raccolta = ref<{ origine?: 'localStorage' | 'manual'; pubblico: Osservazione[]; enti: Osservazione[] }>({
        pubblico: [],
        enti: []
    })

    const manual = ref({ pubblico: '', enti: '' })

    const hasOsservazioni = computed(() => (raccolta.value.pubblico.length + raccolta.value.enti.length) > 0)
    const anteprima = computed(() => {
        const all: Osservazione[] = [...raccolta.value.pubblico, ...raccolta.value.enti]
        return all.slice(0, 3)
    })
    const totali = computed(() => ({
        pubblico: raccolta.value.pubblico.length,
        enti: raccolta.value.enti.length,
        tutte: raccolta.value.pubblico.length + raccolta.value.enti.length
    }))

    function importOsservazioni() {
        try {
            const readArray = (k: string) => {
                const v = localStorage.getItem(k)
                if (!v) return []
                const arr = JSON.parse(v)
                return Array.isArray(arr) ? arr : []
            }
            const pubb = readArray(STORAGE_KEYS.pubblico).map((o: any) => ({
                id: o.id || crypto.randomUUID(),
                provenienza: 'pubblico',
                autore: o.autore,
                testo: o.testo || '',
                data: o.data,
                canale: o.canale,
                allegati: o.allegati || []
            }))
            const enti = readArray(STORAGE_KEYS.enti).map((o: any) => ({
                id: o.id || crypto.randomUUID(),
                provenienza: 'ente',
                ente: o.ente,
                testo: o.testo || '',
                data: o.data,
                canale: o.canale,
                allegati: o.allegati || []
            }))
            raccolta.value.pubblico = pubb
            raccolta.value.enti = enti
            raccolta.value.origine = 'localStorage'
        } catch (e) {
            console.error('Import osservazioni fallito', e)
            alert('Import fallito: JSON non valido in localStorage')
        }
    }

    function clearRaccolta() {
        raccolta.value = { pubblico: [], enti: [] }
        manual.value = { pubblico: '', enti: '' }
    }

    function loadManual(which: 'pubblico' | 'enti') {
        try {
            const arr = JSON.parse(manual.value[which])
            if (!Array.isArray(arr)) throw new Error('Il JSON deve essere un array')
            const mapped: Osservazione[] = arr.map((o: any) => ({
                id: o.id || crypto.randomUUID(),
                provenienza: which === 'pubblico' ? 'pubblico' : 'ente',
                autore: o.autore,
                ente: o.ente,
                canale: o.canale,
                data: o.data,
                testo: o.testo || '',
                allegati: o.allegati || []
            }))
            raccolta.value[which] = mapped
            raccolta.value.origine = 'manual'
        } catch {
            alert('JSON non valido: atteso un array di osservazioni')
        }
    }

    function trimText(t: string, n = 140) {
        const s = t || ''
        return s.length > n ? s.slice(0, n) + '…' : s
    }

    /* ------------------------------------
     * 5.2) ANALISI (topic/clustering/sentiment) — MOCK LOCALE
     * ------------------------------------ */
    const parametri = ref({
        kTemi: 4,
        topParoleTema: 5,
        frasiSintesi: 5
    })

    const analisiRunning = ref(false)
    const temi = ref<{ keywords: string[], size: number }[]>([])
    const cluster = ref<{ label: string[], items: Osservazione[] }[]>([])
    const sentimentAgg = ref({ positivo: 0, negativo: 0, critico: 0, neutro: 0 })

    // Stopword italiane (ridotte per esempio)
    const STOP_IT = new Set([
        'di', 'a', 'da', 'in', 'con', 'su', 'per', 'tra', 'fra', 'il', 'lo', 'la', 'i', 'gli', 'le', 'un', 'uno', 'una',
        'che', 'e', 'ed', 'ma', 'o', 'come', 'anche', 'non', 'più', 'meno', 'al', 'del', 'della', 'dei', 'delle', 'degli',
        'ai', 'agli', 'alle', 'allo', 'all', 'dall', 'nell', 'sul', 'nei', 'nelle', 'sui', 'sulle', 'questo', 'questa', 'quello',
        'sono', 'essere', 'può', 'puo', 'può', 'deve', 'devi', 'devo', 'si', 'no', 'nei', 'siano', 'stato', 'stata', 'stati'
    ])

    // Lessico sentiment minimale
    const POS = new Set(['migliora', 'positivo', 'vantaggio', 'beneficio', 'adeguato', 'conforme', 'ottimale', 'sostenibile', 'favorevole'])
    const NEG = new Set(['negativo', 'impatto', 'impatta', 'inquinamento', 'rumore', 'odore', 'criticità', 'critico', 'rischio', 'nonconforme', 'insufficiente', 'carente', 'violazione'])
    const INTENS = new Set(['molto', 'forte', 'elevato', 'significativo', 'grave'])
    const NEGAZ = new Set(['non', 'mai', 'senza'])

    function tokenize(text: string): string[] {
        return (text || '')
            .toLowerCase()
            .normalize('NFD').replace(/\p{Diacritic}/gu, '')
            .replace(/[^\p{L}\p{N}\s]/gu, ' ')
            .split(/\s+/)
            .filter(t => t && !STOP_IT.has(t) && t.length > 2)
    }

    function termFreq(tokens: string[]): Record<string, number> {
        const m: Record<string, number> = {}
        tokens.forEach(t => { m[t] = (m[t] || 0) + 1 })
        return m
    }

    function sentimentScore(text: string) {
        const words = (text || '').toLowerCase().split(/\s+/)
        let score = 0, negate = 0, boost = 1
        for (let i = 0; i < words.length; i++) {
            const w = words[i].replace(/[^\p{L}\p{N}]/gu, '')
            if (!w) continue
            if (NEGAZ.has(w)) { negate = 1; continue }
            if (INTENS.has(w)) { boost = 2; continue }
            let s = 0
            if (POS.has(w)) s = 1
            if (NEG.has(w)) s = -1
            if (s !== 0) {
                s = (negate ? -s : s) * boost
                score += s
                negate = 0; boost = 1
            }
        }
        let classe: 'positivo' | 'negativo' | 'critico' | 'neutro' = 'neutro'
        if (score >= 2) classe = 'positivo'
        else if (score <= -2) classe = 'negativo'
        else if (score < 0) classe = 'critico'
        return { score, classe }
    }

    function eseguiAnalisi() {
        if (!hasOsservazioni.value) return
        analisiRunning.value = true
        temi.value = []
        cluster.value = []
        sentimentAgg.value = { positivo: 0, negativo: 0, critico: 0, neutro: 0 }

        setTimeout(() => {
            const docs = [...raccolta.value.pubblico, ...raccolta.value.enti]

            // Token per documento + frequenze globali
            const tokenDocs = docs.map(o => tokenize(o.testo))
            const globalFreq: Record<string, number> = {}
            tokenDocs.forEach(tk => {
                const tf = termFreq(tk)
                for (const k in tf) globalFreq[k] = (globalFreq[k] || 0) + tf[k]
            })

            // Seleziona K seed (parole più frequenti)
            const sortedTerms = Object.entries(globalFreq).sort((a, b) => b[1] - a[1]).map(([w]) => w)
            const K = Math.min(parametri.value.kTemi, Math.max(2, sortedTerms.length))
            const seeds = sortedTerms.slice(0, K)

            // Assegna doc al seed migliore (euristica)
            const buckets: { idx: number; items: Osservazione[] }[] = Array.from({ length: K }, (_, i) => ({ idx: i, items: [] }))
            docs.forEach((o, di) => {
                const tk = new Set(tokenDocs[di])
                let bestI = 0, bestScore = -Infinity
                seeds.forEach((s, i) => {
                    let sc = 0
                    if (tk.has(s)) sc += 2
                    // bonus per pre/suffissi simili
                    sc += [...tk].filter(t => t.startsWith(s.slice(0, 3))).length * 0.2
                    if (sc > bestScore) { bestScore = sc; bestI = i }
                })
                buckets[bestI].items.push(o)
            })

            // Costruisci temi e cluster
            const topN = Math.max(3, parametri.value.topParoleTema)
            temi.value = buckets.map(b => {
                const tkAll = b.items.flatMap(o => tokenize(o.testo))
                const tfb = termFreq(tkAll)
                const kws = Object.entries(tfb).sort((a, b) => b[1] - a[1]).slice(0, topN).map(([w]) => w)
                return { keywords: kws.length ? kws : ['—'], size: b.items.length }
            })
            cluster.value = buckets.map((b, i) => ({
                label: temi.value[i]?.keywords || [seeds[i]],
                items: b.items
            }))

            // Sentiment aggregato + attacca classe al record
            const sAgg = { positivo: 0, negativo: 0, critico: 0, neutro: 0 }
            docs.forEach(o => {
                const s = sentimentScore(o.testo)
                    ; (o as any).__sentiment = s.classe
                // @ts-ignore
                sAgg[s.classe]++
            })
            sentimentAgg.value = sAgg

            analisiRunning.value = false
        }, 600)
    }

    function resetAnalisi() {
        temi.value = []
        cluster.value = []
        sentimentAgg.value = { positivo: 0, negativo: 0, critico: 0, neutro: 0 }
    }

    /* ------------------------------------
     * Sintesi & Suggerimenti AI (mock)
     * ------------------------------------ */
    const sintesi = ref({ testo: '', citazioni: [] as string[] })
    type Suggerimento = { titolo: string; descrizione: string; fonti: string[] }
    const suggerimenti = ref<Suggerimento[]>([])
    const modificheProposte = ref<string[]>([])

    function sentenceSplit(text: string): string[] {
        return (text || '')
            .replace(/\n+/g, ' ')
            .split(/(?<=[\.\!\?])\s+/)
            .map(s => s.trim())
            .filter(Boolean)
    }

    function generaSintesi() {
        const docs = [...raccolta.value.pubblico, ...raccolta.value.enti]
        if (docs.length === 0) return

        // Ranking frasi per frequenza termini + bonus a critico/negativo
        const allText = docs.map(d => d.testo).join(' ')
        const vocab = termFreq(tokenize(allText))

        type Fr = { s: string; score: number; src: string }
        const pool: Fr[] = []

        docs.forEach(o => {
            const ss = sentenceSplit(o.testo)
            ss.forEach(s => {
                const st = tokenize(s)
                let sc = 0
                st.forEach(w => sc += (vocab[w] || 0))
                const sent = (o as any).__sentiment as string | undefined
                if (sent === 'negativo') sc *= 1.4
                else if (sent === 'critico') sc *= 1.2
                pool.push({ s, score: sc, src: o.id })
            })
        })

        pool.sort((a, b) => b.score - a.score)
        const N = Math.max(3, parametri.value.frasiSintesi)
        const used = new Set<string>()
        const selected: Fr[] = []
        for (const f of pool) {
            const k = f.s.toLowerCase().slice(0, 80)
            if (used.has(k)) continue
            selected.push(f)
            used.add(k)
            if (selected.length >= N) break
        }

        sintesi.value.testo = selected.map(f => `${f.s} [${f.src}]`).join(' ')
        sintesi.value.citazioni = Array.from(new Set(selected.map(s => s.src)))

        rigeneraSuggerimenti()
    }

    function pulisciSintesi() {
        sintesi.value = { testo: '', citazioni: [] }
        suggerimenti.value = []
        modificheProposte.value = []
    }

    function rigeneraSuggerimenti() {
        const out: Suggerimento[] = []

        // Regole semplici in base a keyword di cluster e sentiment aggregato
        cluster.value.forEach((c, i) => {
            const negLike = c.items.filter(o => (o as any).__sentiment === 'negativo' || (o as any).__sentiment === 'critico')
            if (!negLike.length) return
            const label = (temi.value[i]?.keywords || []).slice(0, 3).join(', ') || 'tema'

            const fonti = negLike.slice(0, 6).map(o => o.id)

            // SIA / mitigazioni tecniche
            out.push({
                titolo: `Integrare SIA su "${label}"`,
                descrizione: `Approfondire analisi e mitigazioni specifiche per il tema "${label}" (metodologie, soglie, monitoraggio).`,
                fonti
            })
            // SNT / comunicazione al pubblico
            out.push({
                titolo: `Esplicitare in SNT le risposte su "${label}"`,
                descrizione: `Rendere chiaro l'impatto e le misure in SNT per il pubblico, evidenziando come si risponde alle criticità.`,
                fonti
            })
            // Provvedimento / prescrizioni
            out.push({
                titolo: `Prescrizioni nel Provvedimento su "${label}"`,
                descrizione: `Inserire prescrizioni operative e vincolanti su "${label}" con piano di monitoraggio e reportistica.`,
                fonti
            })
        })

        // De-duplicazione
        const uniq = new Map<string, Suggerimento>()
        out.forEach(s => uniq.set(`${s.titolo}|${s.descrizione}`, s))
        suggerimenti.value = [...uniq.values()]
    }

    function accettaSuggerimento(s: Suggerimento) {
        modificheProposte.value.push(`${s.titolo} — ${s.descrizione}`)
    }

    /* ------------------------------------
     * 5.3) PARERE MOTIVATO FINALE (A.C.)
     * ------------------------------------ */
    type Prescrizione = { id: string; testo: string }
    const parere = ref({
        locked: false,
        intestazione: { ente: '', settore: '', numero: '', data: '' },
        oggetto: '',
        esito: 'Favorevole',
        sintesiEsito: '',
        premesse: { richiamiNormativi: '', considerato: '' },
        valutazioni: '',
        prescrizioni: [] as Prescrizione[],
        dispositivo: '',
        citazioni: [] as string[]
    })

    const hasBozzaParere = computed(() =>
        !!(parere.value.oggetto || parere.value.valutazioni || parere.value.dispositivo)
    )

    function generaNumeroProgressivo(): string {
        const yyyy = new Date().getFullYear()
        const n = Math.floor(Math.random() * 9000) + 1000
        return `${n}/${yyyy}`
    }

    function generaBozzaParere() {
        if (!sintesi.value.testo) return

        // Intestazione base
        const d = new Date()
        parere.value.intestazione.ente = parere.value.intestazione.ente || 'Autorità Competente Regionale'
        parere.value.intestazione.settore = parere.value.intestazione.settore || 'Settore VIA/VAS'
        parere.value.intestazione.numero = parere.value.intestazione.numero || generaNumeroProgressivo()
        parere.value.intestazione.data = parere.value.intestazione.data || d.toISOString().substring(0, 10)

        // Oggetto + esito
        parere.value.oggetto = parere.value.oggetto || 'Parere Motivato Finale — Progetto impianto fotovoltaico'
        parere.value.sintesiEsito = parere.value.sintesiEsito || 'L’istruttoria evidenzia la compatibilità ambientale con opportune misure di mitigazione.'

        // Premesse
        parere.value.premesse.richiamiNormativi = parere.value.premesse.richiamiNormativi || [
            'VISTO il D.Lgs. 152/2006 e s.m.i.;',
            'VISTE le Linee guida ISPRA pertinenti;',
            'VISTA la documentazione istruttoria e le osservazioni pervenute nel periodo di consultazione;'
        ].join('\n')

        const elencoTemi = temi.value.map((t, i) => `"${(t.keywords[0] || 'tema')}" (#${cluster.value[i]?.items.length || 0})`).join(', ')
        parere.value.premesse.considerato = parere.value.premesse.considerato || (elencoTemi
            ? `CONSIDERATO l’esito della consultazione pubblica e degli enti, con temi prevalenti: ${elencoTemi}.`
            : 'CONSIDERATO l’esito della consultazione pubblica e degli enti.'
        )

        // Valutazioni (sintesi + riferimenti)
        if (!parere.value.valutazioni) {
            const blocchi = cluster.value.map((c, i) => {
                const label = (temi.value[i]?.keywords || []).slice(0, 3).join(', ') || `Tema #${i + 1}`
                const neg = c.items.filter(o => (o as any).__sentiment === 'negativo' || (o as any).__sentiment === 'critico').length
                return `• ${label}: ${c.items.length} osservazioni (${neg} critiche/negative).`
            })
            parere.value.valutazioni = [
                'Sulla base delle istruttorie e delle osservazioni ricevute, si evidenziano i seguenti elementi:',
                ...blocchi,
                '',
                'Sintesi della consultazione:',
                sintesi.value.testo
            ].join('\n')
        }

        // Citazioni: cluster + conteggi pubblico/enti
        parere.value.citazioni = []
        cluster.value.forEach((c, i) => {
            const topic = temi.value[i]?.keywords?.[0] || `Tema #${i + 1}`
            parere.value.citazioni.push(`Cluster "${topic}" — osservazioni: ${c.items.map(o => o.id).join(', ')}`)
        })
        const nPub = raccolta.value.pubblico.length
        const nEnti = raccolta.value.enti.length
        parere.value.citazioni.push(`Fonti: pubblico (${nPub}) ed enti (${nEnti}).`)

        // Dispositivo coerente con esito
        if (!parere.value.dispositivo) {
            const base = parere.value.esito === 'Favorevole'
                ? 'Si esprime parere favorevole al progetto, ritenendo le misure proposte idonee a garantire la compatibilità ambientale.'
                : parere.value.esito === 'Favorevole con prescrizioni'
                    ? 'Si esprime parere favorevole con prescrizioni, vincolando l’attuazione al rispetto delle condizioni allegate.'
                    : 'Si esprime parere non favorevole al progetto per le criticità evidenziate nelle valutazioni tecniche.'
            parere.value.dispositivo = base
        }

        // Prescrizioni (se esito condizionato) ispirate ai suggerimenti AI
        if (parere.value.esito.includes('prescrizioni') && parere.value.prescrizioni.length === 0) {
            suggerimenti.value
                .filter(s => /Prescrizioni nel Provvedimento/i.test(s.titolo))
                .slice(0, 5)
                .forEach(s => parere.value.prescrizioni.push({ id: crypto.randomUUID(), testo: s.descrizione }))
        }
    }

    function pulisciBozzaParere() {
        parere.value = {
            locked: false,
            intestazione: { ente: '', settore: '', numero: '', data: '' },
            oggetto: '',
            esito: 'Favorevole',
            sintesiEsito: '',
            premesse: { richiamiNormativi: '', considerato: '' },
            valutazioni: '',
            prescrizioni: [],
            dispositivo: '',
            citazioni: []
        }
    }

    function aggiungiPrescrizione() {
        parere.value.prescrizioni.push({ id: crypto.randomUUID(), testo: '' })
    }
    function rimuoviPrescrizione(i: number) {
        parere.value.prescrizioni.splice(i, 1)
    }

    /* ------------------------------------
     * Verifica (completezza/coerenza/struttura normativa)
     * ------------------------------------ */
    const verifica = ref({
        running: false,
        issues: [] as { severita: 'error' | 'warning' | 'info'; titolo: string; descrizione: string; suggerimento?: string; autoFix?: () => void }[]
    })

    function countIssues(level: 'error' | 'warning' | 'info') {
        return verifica.value.issues.filter(i => i.severita === level).length
    }

    const badgeRisultatoVerifica = computed(() => {
        const e = countIssues('error'), w = countIssues('warning')
        if (e > 0) return { class: 'alert-danger', label: 'Sono presenti errori bloccanti' }
        if (w > 0) return { class: 'alert-warning', label: 'Sono presenti avvisi' }
        return { class: 'alert-success', label: 'Documento coerente' }
    })

    function eseguiVerifica() {
        verifica.value.running = true
        verifica.value.issues = []

        setTimeout(() => {
            const issues: typeof verifica.value.issues = []

            // Sezioni obbligatorie
            if (!parere.value.oggetto.trim()) issues.push({
                severita: 'error',
                titolo: 'Oggetto mancante',
                descrizione: 'L’oggetto del parere è vuoto.',
                suggerimento: 'Compila un oggetto sintetico e chiaro.'
            })
            if (!parere.value.premesse.richiamiNormativi.trim()) issues.push({
                severita: 'error',
                titolo: 'Richiami normativi mancanti',
                descrizione: 'Mancano i richiami VISTO/VISTA.',
                suggerimento: 'Inserisci i riferimenti essenziali (D.Lgs. 152/2006, Linee Guida, atti istruttori).',
                autoFix: () => {
                    parere.value.premesse.richiamiNormativi = [
                        'VISTO il D.Lgs. 152/2006 e s.m.i.;',
                        'VISTE le Linee guida ISPRA pertinenti;',
                        'VISTA la documentazione istruttoria e le osservazioni pervenute;'
                    ].join('\n')
                }
            })
            if (!parere.value.valutazioni.trim()) issues.push({
                severita: 'error',
                titolo: 'Valutazioni tecniche mancanti',
                descrizione: 'La sezione valutazioni è vuota.',
                suggerimento: 'Inserisci sintesi delle valutazioni e rinvii a temi/cluster.',
                autoFix: () => {
                    parere.value.valutazioni = 'Sintesi valutazioni tecniche sulla base di istruttorie e consultazione.'
                }
            })
            if (!parere.value.dispositivo.trim()) issues.push({
                severita: 'error',
                titolo: 'Dispositivo mancante',
                descrizione: 'Il dispositivo finale non è stato indicato.',
                suggerimento: 'Inserisci il dispositivo coerente con l’esito.',
                autoFix: () => {
                    parere.value.dispositivo = 'Si esprime parere favorevole con prescrizioni, come da elenco allegato.'
                }
            })

            // Citazioni
            if (parere.value.citazioni.length === 0) issues.push({
                severita: 'warning',
                titolo: 'Citazioni fonti assenti',
                descrizione: 'Non risultano citazioni automatiche alle fonti (osservazioni/cluster).',
                suggerimento: 'Genera il parere dalla pagina oppure inserisci riferimenti a cluster/osservazioni.',
                autoFix: () => {
                    cluster.value.forEach((c, i) => {
                        const topic = temi.value[i]?.keywords?.[0] || `Tema #${i + 1}`
                        parere.value.citazioni.push(`Cluster "${topic}" — osservazioni: ${c.items.map(o => o.id).join(', ')}`)
                    })
                }
            })

            // Coerenza esito/prescrizioni
            if (parere.value.esito.includes('prescrizioni') && parere.value.prescrizioni.length === 0) issues.push({
                severita: 'warning',
                titolo: 'Esito con prescrizioni ma elenco vuoto',
                descrizione: 'L’esito prevede prescrizioni ma non sono elencate.',
                suggerimento: 'Aggiungere almeno una prescrizione coerente con i temi critici.',
                autoFix: () => {
                    suggerimenti.value
                        .filter(s => /Prescrizioni nel Provvedimento/i.test(s.titolo))
                        .slice(0, 3)
                        .forEach(s => parere.value.prescrizioni.push({ id: crypto.randomUUID(), testo: s.descrizione }))
                }
            })

            // Intestazione
            if (!parere.value.intestazione.data) issues.push({
                severita: 'warning',
                titolo: 'Data assente in intestazione',
                descrizione: 'Manca la data del parere.',
                autoFix: () => parere.value.intestazione.data = new Date().toISOString().substring(0, 10)
            })
            if (!parere.value.intestazione.numero) issues.push({
                severita: 'warning',
                titolo: 'Numero assente in intestazione',
                descrizione: 'Manca il numero progressivo del parere.',
                autoFix: () => parere.value.intestazione.numero = generaNumeroProgressivo()
            })

            // Struttura normativa minima: formule nel dispositivo
            if (!/(parere|si esprime|prescrizion|favorevole|non favorevole)/i.test(parere.value.dispositivo)) {
                issues.push({
                    severita: 'info',
                    titolo: 'Formule dispositive non rilevate',
                    descrizione: 'Il dispositivo non contiene espressioni tipiche (es. "Si esprime parere...").',
                    suggerimento: 'Usa formule tipo "Si esprime parere favorevole (con prescrizioni)".'
                })
            }

            verifica.value.issues = issues
            verifica.value.running = false
        }, 500)
    }

    function applicaAutoFix() {
        verifica.value.issues.forEach(i => { if (i.autoFix) i.autoFix() })
        eseguiVerifica()
    }

    /* ------------------------------------
     * APPROVAZIONE (A.C.)
     * ------------------------------------ */
    const approvazione = ref({
        revisore: '',
        ruolo: '',
        esito: 'Approvato',
        versione: '1.0',
        note: '',
        approvato: false
    })

    const puoApprovare = computed(() =>
        approvazione.value.approvato && approvazione.value.esito === 'Approvato' && hasBozzaParere.value
    )

    const changelog = ref<string[]>([])
    function finalizzaApprovazione() {
        if (!puoApprovare.value) return
        parere.value.locked = true
        const ts = new Date().toLocaleString('it-IT')
        changelog.value.push(`Approvato da ${approvazione.value.revisore} (${approvazione.value.ruolo}) — v${approvazione.value.versione} — ${ts}`)
    }

    /* ------------------------------------
     * EXPORT & PROTOCOLLO
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

    function serializeParereTXT(): string {
        const header = [
            `${parere.value.intestazione.ente} — ${parere.value.intestazione.settore}`,
            `Parere Motivato Finale n. ${parere.value.intestazione.numero} del ${parere.value.intestazione.data}`,
            '',
            `OGGETTO: ${parere.value.oggetto}`,
            `ESITO: ${parere.value.esito}${parere.value.sintesiEsito ? ` — ${parere.value.sintesiEsito}` : ''}`,
            '',
            'PREMESSE:',
            parere.value.premesse.richiamiNormativi || '(richiami assenti)',
            '',
            (parere.value.premesse.considerato ? `CONSIDERATO CHE:\n${parere.value.premesse.considerato}\n` : ''),
            'VALUTAZIONI TECNICHE:',
            parere.value.valutazioni || '(valutazioni assenti)',
            '',
            'DISPOSITIVO:',
            parere.value.dispositivo || '(dispositivo assente)'
        ].join('\n')

        const prescr = [
            '',
            'PRESCRIZIONI:',
            ...(parere.value.prescrizioni.length ? parere.value.prescrizioni.map((p, i) => `${i + 1}) ${p.testo}`) : ['(nessuna)'])
        ].join('\n')

        const cits = [
            '',
            'CITAZIONI FONTI:',
            ...(parere.value.citazioni.length ? parere.value.citazioni : ['(nessuna)']),
            '',
            `Stato approvazione: ${parere.value.locked ? 'APPROVATO' : 'BOZZA'}`
        ].join('\n')

        return [header, prescr, cits].join('\n')
    }

    function exportParereTXT() {
        downloadText('Parere-Motivato-Finale.txt', serializeParereTXT())
    }

    function exportParereJSON() {
        downloadJSON('Parere-Motivato-Finale.json', {
            intestazione: parere.value.intestazione,
            oggetto: parere.value.oggetto,
            esito: parere.value.esito,
            sintesiEsito: parere.value.sintesiEsito,
            premesse: parere.value.premesse,
            valutazioni: parere.value.valutazioni,
            prescrizioni: parere.value.prescrizioni,
            dispositivo: parere.value.dispositivo,
            citazioni: parere.value.citazioni,
            approvazione: {
                revisore: approvazione.value.revisore,
                ruolo: approvazione.value.ruolo,
                esito: approvazione.value.esito,
                versione: approvazione.value.versione,
                note: approvazione.value.note,
                approvato: approvazione.value.approvato
            },
            locked: parere.value.locked
        })
    }

    const payloadProtocollo = ref('')
    function generaPayloadProtocollo() {
        const payload = {
            metadata: {
                tipo: 'Parere Motivato Finale',
                numero: parere.value.intestazione.numero,
                data: parere.value.intestazione.data,
                ente: parere.value.intestazione.ente,
                settore: parere.value.intestazione.settore,
                oggetto: parere.value.oggetto,
                esito: parere.value.esito,
                versione: approvazione.value.versione,
                approvato: parere.value.locked
            },
            allegati: parere.value.prescrizioni.map((p, i) => ({ nome: `Prescrizione ${i + 1}`, tipo: 'text/plain' })),
            riferimenti: {
                clusters: cluster.value.length,
                topics: temi.value.length,
                osservazioni: totali.value.tutte
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
