
<template>
    <div class="container-fluid px-4">
        <!-- Header azioni -->
        <div class="d-flex align-items-center justify-content-between">
            <div class="text-subtitle-1">
                {{ filename }}
                <span class="text-medium-emphasis">({{ mimeType }})</span>
            </div>

            <button class="btn btn-icon btn-outline-primary"
                    :disabled="downloading"
                    @click="simulateDownload"
                    aria-label="Scarica file"
                    type="button">

                <svg class="icon"><use :href="`${spritesHref}#it-download`"></use></svg>


            </button>
        </div>

        <!-- Progresso simulato  -->
        <div v-if="downloading" class="mt-3">
            <div class="progress" style="height: 6px;">
                <div class="progress-bar progress-bar-striped"
                     role="progressbar"
                     :style="{ width: progress + '%' }"
                     :aria-valuenow="progress"
                     aria-valuemin="0"
                     aria-valuemax="100"></div>
            </div>
        </div>

        <!-- Snackbar (Vuetify) -> Toast (Bootstrap Italia) -->
        <div class="toast position-fixed bottom-0 end-0 m-3"
             role="alert"
             aria-live="assertive"
             aria-atomic="true"
             ref="toastRef"
             data-bs-delay="2500">
            <div class="toast-header">
                <svg class="icon me-2">
                    <svg class="icon"><use :href="`${spritesHref}#it-download`"></use></svg>
                </svg>
                <strong class="me-auto">Download</strong>
                <small>Ora</small>
                <button type="button" class="btn-close" aria-label="Chiudi" @click="hideToast"></button>
            </div>
            <div class="toast-body">
                Download avviato: <strong>{{ filename }}</strong>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, watch } from 'vue'
    import spritesUrl from 'bootstrap-italia/dist/svg/sprites.svg?url'

    declare global {
        interface Window {
            bootstrap?: any
        }
    }

    /**
     * Props:
     * - filename: nome file da scaricare
     * - content: stringa di contenuto (simulata) o testo reale
     * - mimeType: tipo MIME (es. 'text/plain', 'application/pdf')
     */
    const props = withDefaults(defineProps<{
        filename?: string
        content?: string
        mimeType?: string
    }>(), {
        filename: 'documento.txt',
        content: 'Questo è un file di esempio generato per simulare il download.\nLinea 2.',
        mimeType: 'text/plain'
    })

    // Icon sprite href (BI)
    const spritesHref = spritesUrl

    // Stato
    const downloading = ref(false)
    const progress = ref(0)
    const snackbar = ref(false) // mantiene naming originale; ora attiva il Toast BI

    // Toast ref + instance
    const toastRef = ref<HTMLElement | null>(null)
    let toastInstance: any = null

    onMounted(() => {
        // Inizializza Toast quando disponibile
        if (window.bootstrap && toastRef.value) {
            toastInstance = window.bootstrap.Toast.getOrCreateInstance(toastRef.value)
        }
    })

    // Mostra/Nasconde il toast quando cambia "snackbar"
    watch(snackbar, (val) => {
        if (!toastInstance && window.bootstrap && toastRef.value) {
            toastInstance = window.bootstrap.Toast.getOrCreateInstance(toastRef.value)
        }
        if (val) {
            toastInstance?.show?.()
        } else {
            toastInstance?.hide?.()
        }
    })

    function hideToast() {
        snackbar.value = false
    }

    function simulateDownload() {
        if (downloading.value) return
        downloading.value = true
        progress.value = 0

        // Simula avanzamento finto (durata totale ~1.5s)
        const stepMs = 150
        const stepInc = 20
        const timer = setInterval(() => {
            progress.value = Math.min(progress.value + stepInc, 100)
            if (progress.value >= 100) {
                clearInterval(timer)
                startRealDownload()
                downloading.value = false
                snackbar.value = true // -> mostra Toast BI
            }
        }, stepMs)
    }

    /** Avvia un download reale in locale usando Blob + ObjectURL */
    function startRealDownload() {
        try {
            const blob = new Blob([props.content ?? ''], { type: props.mimeType })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = props.filename || 'download.txt'
            a.style.display = 'none'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        } catch (err) {
            console.error('Errore nel download simulato:', err)
        }
    }
</script>

<style scoped>
    /* Estetica opzionale: puoi aggiungere una tinta "primary" al toast via utilità */
    .toast .toast-header svg.icon {
        /* esempio di colorazione icona con currentColor */
        color: var(--bs-primary);
    }

    </style>
