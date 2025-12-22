

<template>
    <button type="button"
            class="btn"
            :class="btnClasses"
            :title="title"
            :disabled="disabled"
            @click="handleClick">
        <!-- Icona Bootstrap Italia (opzionale). Se non usi BI, rimuovi lo <svg> -->
        <svg v-if="showIcon" class="icon me-1" aria-hidden="true">
            <svg class="icon"><use :href="`${spritesHref}#it-delete`"></use></svg>
        </svg>

        <!-- Testo -->
        <slot>Elimina</slot>
    </button>

    <!-- Modale di conferma Bootstrap Italia (opzionale) -->
    <Teleport to="body" v-if="confirmMode === 'modal'">
        <div class="modal fade" ref="confirmModalRef" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-sm modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title h6">Conferma eliminazione</h2>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Chiudi"></button>
                    </div>
                    <div class="modal-body">
                        <p class="mb-0">{{ confirmText }}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Annulla</button>
                        <button class="btn btn-danger" @click="confirmDelete">
                            <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-check`"></use></svg>
                            Conferma
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { useStore } from 'vuex'
import spritesUrl from 'bootstrap-italia/dist/svg/sprites.svg?url'

/**
 * Props:
 * - id: stringa dell'item da eliminare (obbligatoria)
 * - confirm: true/false -> usa window.confirm
 * - confirmMode: 'none' | 'window' | 'modal' -> default 'window'
 * - confirmText: testo conferma (per modal/window)
 * - variant: 'danger' | 'outline-danger' | 'link-danger' -> classi bootstrap
 * - size: 'sm' | 'md' | 'lg' -> dimensione bottone
 * - title: tooltip/aria title
 * - disabled: disabilita bottone
 * - showIcon: mostra icona eliminazione
 */
const props = defineProps<{
  id: string
  confirm?: boolean
  confirmMode?: 'none' | 'window' | 'modal'
  confirmText?: string
  variant?: 'danger' | 'outline-danger' | 'link-danger'
  size?: 'sm' | 'md' | 'lg'
  title?: string
  disabled?: boolean
  showIcon?: boolean
}>()

const emit = defineEmits<{
  (e: 'deleted', id: string): void
  (e: 'cancelled', id: string): void
}>()

const store = useStore()
const spritesHref = spritesUrl

/* ---------- Default props ---------- */
const variant = computed(() => props.variant ?? 'outline-danger')
const size = computed(() => props.size ?? 'sm')
const title = computed(() => props.title ?? 'Elimina documento')
const confirmMode = computed(() => props.confirmMode ?? (props.confirm === false ? 'none' : 'window'))
const confirmText = computed(() => props.confirmText ?? 'Sei sicuro di voler eliminare questo documento?')
const showIcon = computed(() => props.showIcon !== false) // default: true

const btnClasses = computed(() => {
  const classes = []
  if (variant.value === 'danger') classes.push('btn-danger')
  else if (variant.value === 'link-danger') classes.push('btn-link', 'text-danger')
  else classes.push('btn-outline-danger') // default

  if (size.value === 'sm') classes.push('btn-sm')
  if (size.value === 'lg') classes.push('btn-lg')
  return classes
})

/* ---------- Modal BI opzionale ---------- */
declare global { interface Window { bootstrap?: any } }
const confirmModalRef = ref<HTMLElement | null>(null)
let confirmModal: any = null

onMounted(() => {
  if (confirmMode.value === 'modal' && window.bootstrap && confirmModalRef.value) {
    confirmModal =
      window.bootstrap.Modal.getInstance?.(confirmModalRef.value) ??
      new window.bootstrap.Modal(confirmModalRef.value, { backdrop: 'static' })
  }
})
onBeforeUnmount(() => {
  confirmModal?.dispose?.()
  confirmModal = null
})

/* ---------- Azioni ---------- */
function handleClick() {
  if (!props.id || props.disabled) return

  switch (confirmMode.value) {
    case 'none':
      performDelete()
      break
    case 'window':
      if (window.confirm(confirmText.value)) performDelete()
      else emit('cancelled', props.id)
      break
    case 'modal':
      confirmModal?.show()
      break
  }
}
function confirmDelete() {
  performDelete()
  confirmModal?.hide()
}

function performDelete() {
  // Richiama lo store per eliminare per id
  store.dispatch('deleteItem', props.id)
  emit('deleted', props.id)
}
</script>
