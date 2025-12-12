
<template>

        <div class="d-flex align-center justify-space-between">
            <div class="text-subtitle-1">
                {{ filename }} <span class="text-medium-emphasis">({{ mimeType }})</span>
            </div>

            <v-btn :disabled="downloading"
                   icon
                   variant="text"
                   color="primary"
                   @click="simulateDownload"
                   aria-label="Scarica file">
                <v-icon>mdi-download</v-icon>
            </v-btn>
        </div>

        <!-- Progresso simulato -->
        <v-progress-linear v-if="downloading"
                           class="mt-3"
                           :model-value="progress"
                           color="primary"
                           height="6"
                           rounded
                           striped />

        <!-- Snackbar di conferma -->
        <v-snackbar v-model="snackbar" timeout="2500" color="primary" variant="tonal">
            Download avviato: <strong>{{ filename }}</strong>
            <template #actions>
                <v-btn variant="text" @click="snackbar = false">Chiudi</v-btn>
            </template>
        </v-snackbar>

</template>

<script setup lang="ts">
import { ref } from 'vue'

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

const downloading = ref(false)
const progress = ref(0)
const snackbar = ref(false)

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
      snackbar.value = true
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

    // Cleanup
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (err) {
    console.error('Errore nel download simulato:', err)
  }
}
</script>

<style scoped>
    /* Optional: estetica */
</style>
