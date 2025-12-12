
<template>
    <v-card class="pa-3">
        <!-- Header -->
        <div class="d-flex align-center justify-space-between mb-2">
            <div class="text-h6">Stato workflow di approvazione</div>
            <v-chip :color="statusColorComputed" variant="tonal" label>
                Stato attuale: {{ currentStatus || '—' }}
            </v-chip>
        </div>

        <!-- Timeline scrollabile -->
        <div class="timeline-scroll" :style="{ maxHeight: height, overflowY: 'auto' }">
            <v-timeline side="end" density="compact" align="start" class="pr-2">
                <!-- Eventi storici (ordinati per data ascendente) -->
                <v-timeline-item v-for="(ev, idx) in sortedEvents"
                                 :key="ev.id ?? idx"
                                 :dot-color="eventColor(ev.type)"
                                 :icon="eventIcon(ev.type)"
                                 size="small">
                    <!-- Data a sinistra -->
                    <template #opposite>
                        <span class="text-caption text-medium-emphasis">
                            {{ formatDate(ev.date) }}
                        </span>
                    </template>

                    <!-- Card evento -->
                    <v-card class="pa-3" elevation="0" variant="tonal">
                        <div class="d-flex align-center mb-1">
                            <v-avatar class="mr-2" size="28" color="primary" variant="tonal">
                                <v-icon size="20">mdi-account</v-icon>
                            </v-avatar>
                            <div class="text-body-2">
                                <strong>{{ ev.author || 'Autore sconosciuto' }}</strong>
                                <v-chip class="ml-2"
                                        size="x-small"
                                        :color="eventColor(ev.type)"
                                        variant="tonal"
                                        label>
                                    {{ typeLabel(ev.type) }}
                                </v-chip>
                            </div>
                        </div>

                        <div class="text-body-2">
                            {{ ev.comment || '—' }}
                        </div>
                    </v-card>
                </v-timeline-item>

                <!-- Nodo conclusivo: stato attuale -->
                <v-timeline-item :dot-color="statusColorComputed" icon="mdi-flag-checkered" size="small">
                    <template #opposite>
                        <span class="text-caption text-medium-emphasis">
                            {{ formatDate(currentStatusDate) }}
                        </span>
                    </template>

                    <v-card class="pa-3" elevation="0" variant="tonal">
                        <div class="d-flex align-center justify-space-between">
                            <div class="text-body-2">
                                <strong>Stato attuale</strong>
                                <div class="mt-1">{{ statusDescription(currentStatus || '') }}</div>
                            </div>

                            <v-chip :color="statusColorComputed" variant="tonal" label>
                                {{ (currentStatus || '').trim() || '—' }}
                            </v-chip>
                        </div>
                    </v-card>
                </v-timeline-item>
            </v-timeline>

            <!-- Messaggio vuoto (se non ci sono eventi) -->
            <div v-if="sortedEvents.length === 0" class="text-center py-4 text-medium-emphasis">
                Nessun evento da mostrare.
            </div>
        </div>
    </v-card>
</template>

<script setup lang="ts">
    import { computed } from 'vue'

    /**
     * Tipi dati evento timeline
     */
    type TimelineEventType = 'created' | 'edited' | 'approved' | 'rejected' | 'submitted'
    type TimelineEvent = {
        id?: string | number
        author: string
        date: string | Date            // ISO 'YYYY-MM-DD', 'YYYY-MM-DDTHH:mm:ss' o Date
        comment: string
        type: TimelineEventType
    }

    /**
     * Props:
     * - events: lista eventi storici (non serve già ordinata; li ordiniamo noi per data asc)
     * - currentStatus: stato finale ("pending", "approvato", "respinto", "bozza", ...)
     * - currentStatusDate: data dello stato attuale
     * - height: altezza massima area scorrevole (default: '360px')
     */
    const props = withDefaults(defineProps<{
        events: TimelineEvent[] | null | undefined
        currentStatus: string
        currentStatusDate: string | Date
        height?: string
    }>(), {
        height: '360px'
    })

    /* -------- Guardia: events sempre array -------- */
    const eventsList = computed<TimelineEvent[]>(() =>
        Array.isArray(props.events) ? props.events : []
    )

    /* -------- Helpers data -------- */
    function toDate(val: string | Date): Date {
        if (val instanceof Date) return val
        // prova parse standard, fallback a mezzanotte locale
        const d = new Date(val)
        if (!isNaN(d.getTime())) return d
        return new Date(`${val}T00:00:00`)
    }
    function formatDate(val: string | Date): string {
        try {
            const d = toDate(val)
            const dd = String(d.getDate()).padStart(2, '0')
            const mm = String(d.getMonth() + 1).padStart(2, '0')
            const yyyy = d.getFullYear()
            return `${dd}/${mm}/${yyyy}`
        } catch {
            return '—'
        }
    }

    /* -------- Ordinamento eventi per data ASC -------- */
    const sortedEvents = computed<TimelineEvent[]>(() =>
        [...eventsList.value].sort((a, b) => {
            const ta = toDate(a.date).getTime()
            const tb = toDate(b.date).getTime()
            return ta - tb
        })
    )

    /* -------- Icone, colori e label per tipo evento -------- */
    function eventIcon(type: TimelineEventType | undefined) {
        switch (type) {
            case 'created': return 'mdi-file-plus'
            case 'submitted': return 'mdi-send'
            case 'edited': return 'mdi-pencil'
            case 'approved': return 'mdi-check-circle'
            case 'rejected': return 'mdi-close-circle'
            default: return 'mdi-information'
        }
    }
    function eventColor(type: TimelineEventType | undefined) {
        switch (type) {
            case 'created': return 'primary'
            case 'submitted': return 'indigo'
            case 'edited': return 'orange'
            case 'approved': return 'green'
            case 'rejected': return 'red'
            default: return 'grey'
        }
    }
    function typeLabel(type: TimelineEventType | undefined) {
        switch (type) {
            case 'created': return 'Creato'
            case 'submitted': return 'Inviato'
            case 'edited': return 'Modificato'
            case 'approved': return 'Approvato'
            case 'rejected': return 'Respinto'
            default: return 'Evento'
        }
    }

    /* -------- Stato attuale: colore e descrizione -------- */
    const statusColorComputed = computed(() => {
        const s = (props.currentStatus || '').toLowerCase()
        if (s.includes('pending') || s.includes('attesa')) return 'warning'
        if (s.includes('approv')) return 'green'
        if (s.includes('respint') || s.includes('reject')) return 'red'
        if (s.includes('bozza') || s.includes('draft')) return 'grey'
        return 'primary'
    })
    function statusDescription(status: string) {
        const s = (status || '').toLowerCase()
        if (s.includes('pending') || s.includes('attesa')) return 'La pratica è in attesa di approvazione.'
        if (s.includes('approv')) return 'La pratica è stata approvata.'
        if (s.includes('respint') || s.includes('reject')) return 'La pratica è stata respinta.'
        if (s.includes('bozza') || s.includes('draft')) return 'La pratica è in stato di bozza.'
        return 'Stato corrente.'
    }
</script>

<style scoped>
    .timeline-scroll {
        border-radius: 8px;
    }
</style>
