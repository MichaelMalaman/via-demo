
<template>
    <div class="container-fluid py-3">
        <div class="row g-3">
            <!-- Lista conversazioni -->
            <aside class="col-12 col-lg-4 col-xl-3">
                <div class="card shadow-sm">
                    <div class="card-header">
                        <div class="input-group">
                            <span class="input-group-text bg-white border-end-0">
                                <span class="icon it-search"></span>
                            </span>
                            <input type="search"
                                   class="form-control border-start-0"
                                   placeholder="Cerca conversazioni"
                                   v-model="state.search">
                        </div>
                    </div>
                    <div class="list-group list-group-flush">
                        <button v-for="c in filteredConversations"
                                :key="c.id"
                                class="list-group-item list-group-item-action d-flex justify-content-between"
                                :class="{ active: c.id === state.activeConversationId }"
                                @click="openConversation(c.id)">
                            <div class="d-flex align-items-center gap-3">
                                <div class="avatar size-md rounded-circle bg-primary text-white d-flex align-items-center justify-content-center">
                                    {{ initials(c.title) }}
                                </div>
                                <div>
                                    <div class="fw-semibold">{{ c.title }}</div>
                                    <small class="text-secondary">{{ c.subtitle }}</small>
                                </div>
                            </div>
                            <div class="text-end">
                                <small class="text-secondary">{{ c.lastTime }}</small>
                                <span v-if="c.unread" class="badge bg-primary">{{ c.unread }}</span>
                            </div>
                        </button>
                    </div>
                </div>
            </aside>

            <!-- Thread messaggi -->
            <section class="col-12 col-lg-8 col-xl-6">
                <div class="card shadow-sm h-100">
                    <div class="card-header d-flex align-items-center justify-content-between">
                        <h6 class="mb-0">{{ activeConversation?.title || 'Seleziona una conversazione' }}</h6>
                        <small class="text-secondary">
                            {{ activeConversation?.presence === 'online' ? 'Online' : 'Offline' }}
                        </small>
                    </div>
                    <div class="card-body p-0 d-flex flex-column" style="height: 65vh;">
                        <div ref="threadContainer" class="flex-grow-1 overflow-auto p-3 bg-light">
                            <template v-if="activeConversation">
                                <div v-for="m in activeConversation.messages"
                                     :key="m.id"
                                     class="d-flex mb-3"
                                     :class="m.from === me.id ? 'justify-content-end' : 'justify-content-start'">
                                    <div class="p-2 rounded-3"
                                         :class="m.from === me.id ? 'bg-primary text-white' : 'bg-white border'"
                                         style="max-width: 70%; word-break: break-word;">
                                        <div>{{ m.text }}</div>
                                        <small :class="m.from === me.id ? 'text-white-50' : 'text-secondary'">{{ m.time }}</small>
                                    </div>
                                </div>
                            </template>
                            <div v-else class="text-center text-secondary mt-5">Seleziona una conversazione per iniziare.</div>
                        </div>

                        <!-- Composer -->
                        <div class="border-top p-3">
                            <div class="input-group">
                                <textarea class="form-control"
                                          rows="1"
                                          placeholder="Scrivi un messaggio…"
                                          v-model="state.composerText"
                                          @keydown="onComposerKeydown"></textarea>
                                <button class="btn btn-primary"
                                        :disabled="!state.composerText.trim()"
                                        @click="sendMessage">
                                    <span class="icon it-arrow-right"></span>
                                </button>
                            </div>
                            <small class="text-secondary d-block mt-1">
                                Invia con <kbd>Enter</kbd> · A capo con <kbd>Shift</kbd>+<kbd>Enter</kbd>
                            </small>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
    import { reactive, ref, computed, nextTick } from 'vue'

    const me = { id: 999, name: 'Michael Malaman' }

    const state = reactive({
        search: '',
        conversations: [
            {
                id: 1,
                title: 'Andrea Cozzolino',
                subtitle: 'Ultimo: A dopo!',
                unread: 2,
                lastTime: '14:20',
                presence: 'online',
                messages: [
                    { id: 'm1', from: 1, text: 'Ciao Michael, ci sei per la call?', time: '14:02' },
                    { id: 'm2', from: me.id, text: 'Sì, tra 5 minuti', time: '14:05' },
                    { id: 'm3', from: 1, text: 'Perfetto, grazie!', time: '14:20' }
                ]
            },
            {
                id: 2,
                title: 'Team Progetto X',
                subtitle: 'Nuove specifiche caricate',
                unread: 0,
                lastTime: '09:31',
                presence: 'offline',
                messages: [
                    { id: 'g1', from: 12, text: 'Specifiche aggiornate su SharePoint', time: '09:22' },
                    { id: 'g2', from: me.id, text: 'Grazie, le guardo subito', time: '09:31' }
                ]
            }
        ],
        activeConversationId: 1,
        composerText: ''
    })

    const threadContainer = ref(null)

    const activeConversation = computed(() =>
        state.conversations.find(c => c.id === state.activeConversationId)
    )

    const filteredConversations = computed(() => {
        const q = state.search.trim().toLowerCase()
        if (!q) return state.conversations
        return state.conversations.filter(c =>
            c.title.toLowerCase().includes(q) ||
            (c.subtitle && c.subtitle.toLowerCase().includes(q))
        )
    })

    function openConversation(id) {
        state.activeConversationId = id
        nextTick(scrollToBottom)
    }

    function scrollToBottom() {
        const el = threadContainer.value
        if (el) el.scrollTop = el.scrollHeight
    }

    function sendMessage() {
        const text = state.composerText.trim()
        if (!text || !activeConversation.value) return
        const now = new Date()
        const hh = String(now.getHours()).padStart(2, '0')
        const mm = String(now.getMinutes()).padStart(2, '0')

        activeConversation.value.messages.push({
            id: 'local-' + Math.random().toString(36).slice(2),
            from: me.id,
            text,
            time: `${hh}:${mm}`
        })

        state.composerText = ''
        nextTick(scrollToBottom)
    }

    function onComposerKeydown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    function initials(name) {
        return (name || '')
            .split(' ')
            .map(s => s[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()
    }
</script>

<style scoped>
    .avatar.size-md {
        width: 40px;
        height: 40px;
        font-weight: 600;
    }
</style>
``
