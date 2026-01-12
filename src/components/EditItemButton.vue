<!-- UploadModalButton.vue -->
<template>
    <!-- Bottone che apre la modale (stile simile al tuo esempio) -->
    <button type="button"
            class="btn btn-primary text"
            data-bs-toggle="modal"
            data-bs-target="#uploadFileModal">
        <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-pencil`"></use></svg>

        <span class="visually-hidden">Carica nuovo documento</span>
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
                    EDIT FILE
                    {{item}}
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

    type Item = {
        id: number
        nomeProgetto: string
        dataInizio: string
        ente: string
        scadenza: string
    }

    const props = defineProps<{
        item: Item
        id?: string
        variant?: string
        size?: 'sm' | 'md' | 'lg'
        confirm?: boolean
    }>()

</script>

<style scoped>
</style>