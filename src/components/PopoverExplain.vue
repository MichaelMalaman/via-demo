
<template>
    <!-- Variante con bottone -->

    <button v-if="!iconOnly"
            ref="triggerRef"
            type="button"
            :class="buttonClass"
            data-bs-toggle="popover"
            data-bs-trigger="manual"
            :data-bs-placement="placement"
            :data-bs-custom-class="computedCustomClass"
            :data-bs-content="text"
            @click.stop="onToggle">
        <svg v-if="icon"
             class="icon me-1"
             :class="iconColorClass"
             :style="iconInlineStyle"
             aria-hidden="true">
            <use :href="`${spritesHref}#${icon}`">
            </use>
        </svg>

        <slot></slot>
    </button>

    <!-- Variante solo icona (niente bottone visibile) -->
    <span v-else
          ref="triggerRef"
          role="button"
          tabindex="0"
          class="icon-only-trigger"
          data-bs-toggle="popover"
          data-bs-trigger="manual"
          :data-bs-placement="placement"
          :data-bs-custom-class="computedCustomClass"
          :data-bs-content="text"
          @click.stop="onToggle"
          @keydown.enter.prevent="onToggle"
          @keydown.space.prevent="onToggle"
          :aria-label="ariaLabel"
          :title="''">
        <svg v-if="icon"
             class="icon"
             :class="iconColorClass"
             :style="iconInlineStyle"
             aria-hidden="true">
            <use :href="`${spritesHref}#${icon}`">
            </use>
        </svg>

  </span>
</template>

<script setup lang="ts">
    import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'

    const templateWithHeader =
        '<div class="popover" role="tooltip">' +
        '<div class="popover-arrow"></div>' +
        '<h3 class="popover-header"></h3>' +
        '<div class="popover-body"></div>' +
        '</div>'

    const templateWithoutHeader =
        '<div class="popover" role="tooltip">' +
        '<div class="popover-arrow"></div>' +
        '<div class="popover-body"></div>' + 
        '</div>'

    /**
     * Props:
     * - spritesHref: string del file sprite Bootstrap Italia (es. import '.../sprites.svg?url')
     * - icon: id dell'icona (senza #), es. 'it-info-circle'
     * - color: colore del BOTTONE (palette BI) ('primary'|'secondary'|'success'|'danger'|'warning'|'info'|'light'|'dark')
     * - iconColor: colore dell'ICONA (accetta palette BI o qualunque CSS color es. '#0dcaf0', 'rgb(…)', 'var(--bs-primary)')
     * - text: contenuto del popover (testo descrittivo)
     * - title: titolo del popover (se omesso o vuoto o se hideTitle=true NON viene mostrato l'header)
     * - hideTitle: forza l’assenza del titolo (solo contenuto)
     * - placement: 'top'|'bottom'|'left'|'right'|'auto' (o varianti bootstrap come 'top-start', ecc.)
     * - outline: se true usa btn-outline-*
     * - size: 'xs'|'sm'|'md'|'lg' (xs aggiunge stile locale compatto)
     * - customClass: classe extra per personalizzare il popover (es. 'explain-popover')
     * - iconOnly: se true mostra solo l’icona senza bottone
     * - ariaLabel: label accessibile per la variante solo icona
     */
    const props = defineProps<{
        spritesHref: string
        icon?: string
        color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
        iconColor?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | string
        text: string
        title?: string
        hideTitle?: boolean
        placement?: string
        outline?: boolean
        size?: 'xs' | 'sm' | 'md' | 'lg'
        customClass?: string
        iconOnly?: boolean
        ariaLabel?: string
    }>()

    const {
        spritesHref,
        icon = 'it-info-circle',
        color = 'primary',           // bottone
        iconColor,                   // icona (può essere undefined)
        text,
        title,                       // di default nessun titolo: se vuoi header, passalo
        hideTitle = false,
        placement = 'top',
        outline = true,
        size = 'xs',
        customClass = '',
        iconOnly = false,
        ariaLabel = 'Apri informazioni'
    } = props

    declare global { interface Window { bootstrap?: any } }

    const triggerRef = ref<HTMLElement | null>(null)
    let popoverInstance: any | null = null

    /** Chiude tutti i popover aperti nella pagina */
    function hideAllPopovers() {
        const Pop = window.bootstrap?.Popover
        if (!Pop) return
        document.querySelectorAll<HTMLElement>('[data-bs-toggle="popover"]').forEach(el => {
            Pop.getInstance(el)?.hide()
        })
    }

    /** Toggle del popover corrente */
    function onToggle() {
        const Pop = window.bootstrap?.Popover
        if (!Pop || !popoverInstance) return
        hideAllPopovers()
        const tip = (popoverInstance as any).getTipElement?.()
        const isShown = tip?.classList.contains('show')
        isShown ? popoverInstance.hide() : popoverInstance.show()
    }

    /** Chiudi al click fuori */
    function onDocumentClick(e: MouseEvent) {
        const target = e.target as HTMLElement
        const isTrigger = !!target.closest('[data-bs-toggle="popover"]')
        const isInsidePopover = !!target.closest('.popover')
        if (!isTrigger && !isInsidePopover) {
            hideAllPopovers()
        }
    }


    const effectiveTitle = computed(() => {
        if (hideTitle) return ''        
        return (title ?? '').trim()      
    })


    onMounted(() => {
        const Pop = window.bootstrap?.Popover
        if (!Pop || !triggerRef.value) return

        popoverInstance = Pop.getOrCreateInstance(triggerRef.value, {
            trigger: 'manual',
            container: 'body',
            boundary: 'viewport',
            placement,
            customClass: computedCustomClass.value,
            content: text,
            title: effectiveTitle.value, // se null, nessun header
            html: false
        })

        document.addEventListener('click', onDocumentClick, true)
    })

    onBeforeUnmount(() => {
        document.removeEventListener('click', onDocumentClick, true)
        popoverInstance?.dispose()
        popoverInstance = null
    })

    /** Aggiorna dinamicamente contenuto/titolo/placement se cambiano */
    watch(() => text, (val) => {
        if (popoverInstance) {
            // BS5: setContent disponibile con API; in alternativa reinizializza
            popoverInstance._config.content = val
            const tip = popoverInstance.getTipElement?.()
            if (tip?.classList.contains('show')) {
                popoverInstance.setContent?.({ '.popover-body': val })
            }
        }
    })

    watch(effectiveTitle, (val) => {
        if (popoverInstance) {
            popoverInstance._config.title = val
            // Se il popover è aperto, rigenera i nodi per riflettere header on/off
            const tip = popoverInstance.getTipElement?.()
            if (tip?.classList.contains('show')) {
                popoverInstance.hide()
                popoverInstance.show()
            }
        }
    })

    watch(() => placement, (val) => {
        if (popoverInstance) {
            popoverInstance._config.placement = val
            const tip = popoverInstance.getTipElement?.()
            if (tip?.classList.contains('show')) {
                popoverInstance.hide()
                popoverInstance.show()
            }
        }
    })

    /** Classi del bottone */
    const buttonClass = computed(() => {
        const base = ['btn']
        // colore
        base.push(outline ? `btn-outline-${color}` : `btn-${color}`)
        // dimensione
        if (size === 'sm') base.push('btn-sm')
        if (size === 'lg') base.push('btn-lg')
        if (size === 'xs') base.push('btn-xs') // classe locale nel <style>
        return base.join(' ')
    })

    /** Classe custom effettiva del popover */
    const computedCustomClass = computed(() => customClass || 'explain-popover')

    /** Colore icona: se è una palette BI -> 'text-<color>'; altrimenti inline style (color) */
    const PALETTE = new Set(['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'])
    const iconColorClass = computed(() => {
        if (!iconColor) return ''
        return PALETTE.has(String(iconColor)) ? `text-${iconColor}` : ''
    })
    const iconInlineStyle = computed(() => {
        if (!iconColor) return {}
        return PALETTE.has(String(iconColor)) ? {} : { color: String(iconColor) }
    })
</script>

<style scoped>
    /* bottone extra-compatto "xs" */
    .btn-xs {
        --bs-btn-padding-y: .15rem;
        --bs-btn-padding-x: .40rem;
        --bs-btn-font-size: .76rem;
        line-height: 1.1;
    }

    /* stile popover demo (se non passi customClass) */
    .explain-popover {
        max-width: 360px;
        font-size: .9rem;
    }

    /* dimensioni icona BI */
    .icon {
        width: 16px;
        height: 16px;
    }

    /* trigger solo icona: accessibile e cliccabile */
    .icon-only-trigger {
        display: inline-flex;
        align-items: center;
        cursor: pointer;
        user-select: none;
    }

        /* focus visibile per tastiera */
        .icon-only-trigger:focus-visible {
            outline: 2px solid var(--bs-primary);
            outline-offset: 2px;
            border-radius: .25rem;
        }



    .icon-only-trigger {
        display: inline-flex;
        align-items: center;
        cursor: pointer;
        user-select: none;
        line-height: 1; /* evita micro-shift verticali */
        padding: 0; /* niente padding */
        border: 0; /* niente bordo */
        background: none; /* nessuno sfondo */
    }

        /* focus visibile e accessibile da tastiera */
        .icon-only-trigger:focus-visible {
            outline: 2px solid var(--bs-primary);
            outline-offset: 2px;
            border-radius: .25rem;
        }

</style>
