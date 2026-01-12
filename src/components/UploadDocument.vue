<!-- UploadModalButton.vue -->
<template>
    <!-- Bottone che apre la modale (stile simile al tuo esempio) -->
    <button type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#uploadFileModal">
        <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-upload`"></use></svg>

        <span >Carica nuovo documento</span>
    </button>

    <!-- Teleport nel body per evitare problemi di stacking/z-index -->
    <Teleport to="body">
        <div class="modal fade"
             id="uploadFileModal"
             tabindex="-1"
             aria-labelledby="uploadFileModalLabel"
             aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">

                    <div class="modal-header">
                        <h2 class="modal-title h5" id="uploadFileModalLabel">Carica un nuovo documento</h2>
                        <button type="button"
                                class="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Chiudi finestra modale"
                                @click="resetLocalState"></button>
                    </div>

                    <div class="modal-body">
                        <!-- Zona upload drag & drop + link per aprire file picker -->
                        <div class="upload-zone border border-2 border-dashed rounded-3 p-5 text-center"
                             @dragover.prevent
                             @drop.prevent="onFileDrop"
                             :class="{ 'is-dragover': isDragOver }"
                             @dragenter.prevent="isDragOver = true"
                             @dragleave.prevent="isDragOver = false"
                             style="position: relative;">
                            <p class="mb-3">

                                <button class="btn btn-outline-primary" @click="onSelectFromPC">Sfoglia dal PC</button>

                            </p>

                            <!-- input file nascosto -->
                            <input ref="fileInputRef"
                                   type="file"
                                   class="d-none"
                                   accept=".pdf,.jpeg,.jpg,.png,.doc,.docx,.xls,.xlsx,.cad"
                                   @change="onFileChosen" />

                            <!-- Preview minimale del file selezionato (facoltativa) -->
                            <div v-if="previewName" class="mt-3">

                                <strong>{{ previewName }}</strong>
                                <small class="text-secondary ms-2">{{ previewSize }}</small>
                            </div>
                        </div>

                        <!-- Messaggi di validazione (opzionali) -->
                        <div v-if="errorMsg" class="alert alert-danger mt-3" role="alert">
                            {{ errorMsg }}
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button class="btn btn-outline-secondary" data-bs-dismiss="modal" @click="resetLocalState">
                            Chiudi
                        </button>
                        <button class="btn btn-primary"
                                :disabled="!selectedFile"
                                @click="confirmUpload"
                                data-bs-dismiss="modal">
                            Conferma upload
                        </button>
                    </div>

                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { useStore } from 'vuex'
    import spritesUrl from 'bootstrap-italia/dist/svg/sprites.svg?url'

    // Sprite BI
    const spritesHref = spritesUrl

    // Vuex store
    const store = useStore()

    // Stato locale della modale
    const fileInputRef = ref<HTMLInputElement | null>(null)
    const selectedFile = ref<File | null>(null)
    const previewName = ref<string | null>(null)
    const previewSize = ref<string | null>(null)
    const errorMsg = ref<string | null>(null)
    const isDragOver = ref<boolean>(false)

    function onSelectFromPC() {
        errorMsg.value = null
        fileInputRef.value?.click()
    }

    function onFileChosen(e: Event) {
        errorMsg.value = null
        const input = e.target as HTMLInputElement
        const file = input.files?.[0]
        if (file) {
            setPreview(file)
            selectedFile.value = file
        }
        if (input) input.value = '' // reset input per permettere stessa selezione consecutiva
    }

    function onFileDrop(e: DragEvent) {
        errorMsg.value = null
        isDragOver.value = false
        const file = e.dataTransfer?.files?.[0]
        if (file) {
            setPreview(file)
            selectedFile.value = file
        }
    }

    function setPreview(file: File) {
        previewName.value = file.name
        previewSize.value = formatBytes(file.size) // helper locale semplice per preview
    }

    function formatBytes(bytes: number) {
        if (bytes === 0) return '0 B'
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
        const i = Math.floor(Math.log(bytes) / Math.log(1024))
        const value = bytes / Math.pow(1024, i)
        return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${sizes[i]}`
    }

    /**
     * Validazione semplice (opzionale). Se vuoi restrizioni, definiscile qui:
     * - dimensione max, tipi consentiti, ecc.
     */
    function validate(file: File) {
        // Esempio: max 20MB e tipi comuni
        const maxBytes = 20 * 1024 * 1024
        const allowed = ['pdf', 'jpeg', 'jpg', 'png', 'doc', 'docx', 'xls', 'xlsx', 'cad']
        const ext = (file.name.split('.').pop() || '').toLowerCase()
        if (file.size > maxBytes) return 'Il file supera i 20MB.'
        if (allowed.length && !allowed.includes(ext)) return `Tipo non consentito: .${ext.toUpperCase()}`
        return null
    }

    function confirmUpload() {
        if (!selectedFile.value) return
        const vErr = validate(selectedFile.value)
        if (vErr) {
            errorMsg.value = vErr
            return
        }
        // Aggiunge il file allo store tramite l’azione richiesta
        store.dispatch('addFileAsFirstItem', selectedFile.value)
        resetLocalState()
    }

    function resetLocalState() {
        errorMsg.value = null
        selectedFile.value = null
        previewName.value = null
        previewSize.value = null
        isDragOver.value = false
    }
</script>

<style scoped>
    /* Zona upload: bordo tratteggiato + effetto dragover */
    .upload-zone {
        border-style: dashed !important;
        transition: background-color 0.2s ease;
    }

        .upload-zone.is-dragover {
            background-color: #f2f6ff;
        }
</style>