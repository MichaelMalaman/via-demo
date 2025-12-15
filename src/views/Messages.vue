
<template>
    <v-container fluid class="pa-10 d-flex flex-column h-100">
        <!-- Toolbar superiore -->
        <v-toolbar flat class="px-4">
            <v-toolbar-title>Messaggi</v-toolbar-title>

            <v-spacer />

            <!-- Ricerca conversazioni -->
            <v-text-field v-model="search"
                          prepend-inner-icon="mdi-magnify"
                          hide-details
                          placeholder="Cerca..."
                          density="comfortable"
                          variant="outlined"
                          class="mx-4"
                          style="max-width: 320px" />

            <!-- Filtro stato -->
            <v-select v-model="filters.status"
                      :items="statusOptions"
                      label="Stato"
                      hide-details
                      density="comfortable"
                      variant="outlined"
                      class="mr-4">
                <template #selection="{ item }">
                    <v-chip v-if="item?.title" :color="statusColor(item.title)" size="small" label>
                        {{ item.title }}
                    </v-chip>
                </template>
                <template #item="{ item, props }">
                    <v-list-item v-bind="props" :title="undefined">
                        <template #title>
                            <v-chip :color="statusColor(item.title)" size="small" label>
                                {{ item.title }}
                            </v-chip>
                        </template>
                    </v-list-item>
                </template>
            </v-select>

            <!-- Nuovo Messaggio -->
            <v-btn color="primary" prepend-icon="mdi-plus" @click="newMessageDialog = true">
                Nuovo messaggio
            </v-btn>
        </v-toolbar>

        <v-divider />

        <!-- Layout principale: sidebar conversazioni + area chat -->
        <div class="d-flex flex-grow-1 min-h-0">
            <!-- Sidebar conversazioni -->
            <aside class="messages-sidebar">
                <!-- Filtri rapidi -->
                <div class="px-4 py-2 d-flex align-center ga-2">
                    <v-chip :color="filters.pinned ? 'primary' : undefined"
                            variant="tonal"
                            size="small"
                            label
                            @click="filters.pinned = !filters.pinned">
                        <v-icon start>mdi-pin</v-icon>
                        Pinned
                    </v-chip>
                    <v-chip :color="filters.unreadOnly ? 'primary' : undefined"
                            variant="tonal"
                            size="small"
                            label
                            @click="filters.unreadOnly = !filters.unreadOnly">
                        <v-icon start>mdi-email</v-icon>
                        Non letti
                    </v-chip>
                </div>

                <v-divider />

                <!-- Lista conversazioni -->
                <v-virtual-scroll :items="filteredConversations"
                                  height="100%"
                                  class="flex-grow-1"
                                  item-height="80">
                    <template #default="{ item }">
                        <v-list-item :active="selectedConversation?.id === item.id"
                                     @click="selectConversation(item)"
                                     class="py-3">
                            <template #prepend>
                                <v-avatar size="40">
                                    <v-img src="https://i.pravatar.cc/50"></v-img>
                                </v-avatar>
                            </template>

                            <template #title>
                                <div class="d-flex align-center ga-2">
                                    <span class="text-subtitle-1 font-weight-medium">{{ item.title }}</span>
                                    <v-chip v-if="item.pinned" size="x-small" color="primary" variant="tonal" label>
                                        Pinned
                                    </v-chip>
                                </div>
                            </template>

                            <template #subtitle>
                                <div class="d-flex justify-space-between align-center">
                                    <span class="text-body-2 text-truncate">{{ item.lastMessagePreview }}</span>
                                    <span class="text-caption text-medium-emphasis">
                                        {{ formatTime(item.updatedAt) }}
                                    </span>
                                </div>
                            </template>

                            <template #append>
                                <v-badge v-if="item.unreadCount > 0" :content="item.unreadCount" color="error" />
                            </template>
                        </v-list-item>

                        <v-divider />
                    </template>
                </v-virtual-scroll>
            </aside>

            <!-- Area chat -->
            <section class="messages-chat">
                <!-- Header conversazione -->
                <div class="px-4 py-3 d-flex align-center justify-space-between">
                    <div class="d-flex align-center ga-3">
                        <v-avatar size="44">
                            <v-img src="https://i.pravatar.cc/44"/>

                        </v-avatar>
                        <div>
                            <div class="text-subtitle-1 font-weight-medium">
                                {{ selectedConversation?.title ?? 'Seleziona una conversazione' }}
                            </div>
                            <div class="text-caption text-medium-emphasis">
                                {{ selectedConversation ? participantsText(selectedConversation) : '' }}
                            </div>
                        </div>
                    </div>

                    <div class="d-flex align-center ga-2">
                        <v-btn icon :color="selectedConversation?.pinned ? 'primary' : undefined"
                               @click="togglePin(selectedConversation)">
                            <v-icon>mdi-pin</v-icon>
                        </v-btn>
                        <v-btn icon @click="openConversationInfo(selectedConversation)">
                            <v-icon>mdi-information-outline</v-icon>
                        </v-btn>
                        <v-btn icon @click="deleteConversation(selectedConversation)">
                            <v-icon color="error">mdi-delete</v-icon>
                        </v-btn>
                    </div>
                </div>

                <v-divider />

                <!-- Lista messaggi -->
                <div class="messages-thread" ref="threadRef">
                    <template v-if="selectedConversation">
                        <div v-for="(group, gi) in groupedMessages" :key="gi" class="px-4">
                            <!-- Separatore data -->
                            <div class="d-flex justify-center my-3">
                                <v-chip size="small" variant="tonal" color="grey">
                                    {{ formatDate(group.date) }}
                                </v-chip>
                            </div>

                            <!-- Messaggi del gruppo -->
                            <div v-for="message in group.items" :key="message.id"
                                 class="my-2 d-flex"
                                 :class="message.isMine ? 'justify-end' : 'justify-start'">
                                <div class="message-bubble"
                                     :class="message.isMine ? 'bg-primary text-on-primary' : 'bg-surface'">
                                    <!-- Header (nome + ora) -->
                                    <div class="d-flex align-center justify-space-between mb-1">
                                        <span class="text-caption font-weight-medium">
                                            {{ message.senderName }}
                                        </span>
                                        <span class="text-caption text-medium-emphasis">
                                            {{ formatTime(message.sentAt) }}
                                        </span>
                                    </div>

                                    <!-- Testo -->
                                    <div class="text-body-2" style="white-space: pre-wrap">
                                        {{ message.text }}
                                    </div>

                                    <!-- Allegati -->
                                    <div v-if="message.attachments?.length" class="d-flex ga-2 mt-2 flex-wrap">
                                        <v-chip v-for="(att, i) in message.attachments"
                                                :key="i"
                                                size="small"
                                                variant="outlined"
                                                :prepend-icon="attachmentIcon(att.type)"
                                                label>
                                            {{ att.name }}
                                        </v-chip>
                                    </div>

                                    <!-- Stato consegna (solo miei) -->
                                    <div v-if="message.isMine" class="mt-1 d-flex align-center ga-1">
                                        <v-icon size="16" :color="deliveryColor(message.delivery)">
                                            {{ deliveryIcon(message.delivery) }}
                                        </v-icon>
                                        <span class="text-caption text-medium-emphasis">
                                            {{ deliveryLabel(message.delivery) }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>

                    <template v-else>
                        <div class="h-100 d-flex align-center justify-center text-medium-emphasis">
                            Seleziona una conversazione dalla lista.
                        </div>
                    </template>
                </div>

                <v-divider />

                <!-- Composer -->
                <div class="px-4 py-3 d-flex align-center ga-2">
                    <v-btn icon @click="openEmojiPicker">
                        <v-icon>mdi-emoticon-outline</v-icon>
                    </v-btn>

                    <v-btn icon @click="triggerFileInput">
                        <v-icon>mdi-paperclip</v-icon>
                    </v-btn>
                    <input ref="fileInputRef" type="file" multiple class="d-none" @change="onFilesChosen" />

                    <v-textarea v-model="draft"
                                auto-grow
                                rows="1"
                                max-rows="6"
                                hide-details
                                density="comfortable"
                                variant="outlined"
                                placeholder="Scrivi un messaggio..."
                                class="flex-grow-1"
                                @keydown.enter.exact.prevent="send()"
                                @keydown.enter.shift.exact="newline()" />

                    <v-btn color="primary" :disabled="!canSend" prepend-icon="mdi-send" @click="send">
                        Invia
                    </v-btn>
                </div>
            </section>
        </div>

        <!-- Dialog: Nuovo messaggio -->
        <v-dialog v-model="newMessageDialog" max-width="560">
            <v-card>
                <v-card-title>Nuovo messaggio</v-card-title>
                <v-card-text class="d-flex flex-column ga-3">
                    <v-text-field v-model="newMessage.title"
                                  label="Titolo conversazione"
                                  variant="outlined"
                                  hide-details />
                    <v-combobox v-model="newMessage.participants"
                                :items="allUsers"
                                label="Destinatari"
                                multiple
                                chips
                                clearable
                                variant="outlined"
                                hide-details
                                prepend-inner-icon="mdi-account-multiple" />
                    <v-textarea v-model="newMessage.initialText"
                                label="Messaggio iniziale"
                                variant="outlined"
                                auto-grow
                                rows="2"
                                hide-details />
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="text" @click="newMessageDialog = false">Annulla</v-btn>
                    <v-btn color="primary" @click="createConversation">Crea</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'

/** ---------- Tipi ---------- */
type Attachment = { name: string; type: 'file' | 'image' | 'pdf' | 'doc' }
type DeliveryStatus = 'sending' | 'sent' | 'delivered' | 'read'
type Message = {
  id: number
  senderId: number
  senderName: string
  text: string
  sentAt: Date
  isMine: boolean
  attachments?: Attachment[]
  delivery?: DeliveryStatus
}
type Conversation = {
  id: number
  title: string
  avatar: string
  participants: string[]
  messages: Message[]
  unreadCount: number
  pinned: boolean
  updatedAt: Date
  lastMessagePreview: string
}

/** ---------- Stato UI ---------- */
const search = ref('')
const filters = ref({
  status: 'Tutte',
  pinned: false,
  unreadOnly: false,
})
const statusOptions = ['Tutte', 'Non lette', 'Archiviate']

const newMessageDialog = ref(false)
const newMessage = ref({
  title: '',
  participants: [] as string[],
  initialText: '',
})

/** ---------- Mock utenti ---------- */
const allUsers = ['Mario Rossi', 'Laura Bianchi', 'Paolo Verdi', 'Team Progetti', 'Supporto']

/** ---------- Mock conversazioni ---------- */
const conversations = ref<Conversation[]>([
  {
    id: 1,
    title: 'Team Progetti',
    avatar: 'https://i.pravatar.cc/64',
    participants: ['Tu', 'Mario Rossi', 'Laura Bianchi'],
    messages: [
      {
        id: 101,
        senderId: 2,
        senderName: 'Mario Rossi',
        text: 'Ciao! Aggiorno la milestone entro oggi.',
        sentAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
        isMine: false,
      },
      {
        id: 102,
        senderId: 1,
        senderName: 'Tu',
        text: 'Perfetto, grazie!',
        sentAt: new Date(Date.now() - 1000 * 60 * 60 * 4 + 1000 * 60 * 10),
        isMine: true,
        delivery: 'read',
      },
    ],
    unreadCount: 2,
    pinned: true,
    updatedAt: new Date(Date.now() - 1000 * 60 * 3),
    lastMessagePreview: 'Perfetto, grazie!',
  },
  {
    id: 2,
    title: 'Supporto',
      avatar: 'https://i.pravatar.cc/233',
    participants: ['Tu', 'Supporto'],
    messages: [
      {
        id: 201,
        senderId: 3,
        senderName: 'Supporto',
        text: 'Abbiamo preso in carico la richiesta.',
        sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        isMine: false,
        attachments: [{ name: 'ticket.pdf', type: 'pdf' }],
      },
    ],
    unreadCount: 0,
    pinned: false,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 23),
    lastMessagePreview: 'Abbiamo preso in carico la richiesta.',
  },
])

const selectedConversation = ref<Conversation | null>(conversations.value[0] ?? null)

/** ---------- Selettori, filtri, formattazioni ---------- */
const filteredConversations = computed(() => {
  let list = conversations.value.slice()

  if (filters.value.pinned) {
    list = list.filter(c => c.pinned)
  }
  if (filters.value.unreadOnly) {
    list = list.filter(c => c.unreadCount > 0)
  }

  const s = search.value.trim().toLowerCase()
  if (s) {
    list = list.filter(c =>
      c.title.toLowerCase().includes(s) ||
      c.lastMessagePreview.toLowerCase().includes(s) ||
      c.participants.some(p => p.toLowerCase().includes(s)),
    )
  }

  // Finto filtro "Stato" (adatta alla tua logica reale)
  switch (filters.value.status) {
    case 'Non lette':
      list = list.filter(c => c.unreadCount > 0)
      break
    case 'Archiviate':
      list = list.filter(c => !c.pinned && c.unreadCount === 0)
      break
    default:
      break
  }

  // Ordina per aggiornamento
  list.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  return list
})

const groupedMessages = computed(() => {
  const conv = selectedConversation.value
  if (!conv) return []
  // Raggruppa per giorno
  const groups: { date: string; items: Message[] }[] = []
  const fmt = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString()

  for (const msg of conv.messages) {
    const key = fmt(msg.sentAt)
    let g = groups.find(x => x.date === key)
    if (!g) {
      g = { date: key, items: [] }
      groups.push(g)
    }
    g.items.push(msg)
  }
  return groups
})

function formatTime(d: Date) {
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}
function formatDate(dIso: string) {
  const d = new Date(dIso)
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
}

function participantsText(c: Conversation) {
  return c.participants.join(' • ')
}

function statusColor(s: string) {
  switch ((s || '').toLowerCase()) {
    case 'non lette': return 'warning'
    case 'archiviate': return 'grey'
    default: return 'primary'
  }
}

/** ---------- Azioni conversazioni ---------- */
function selectConversation(c: Conversation) {
  selectedConversation.value = c
  // Simula "segnato come letto"
  c.unreadCount = 0
}

function togglePin(c?: Conversation | null) {
  if (!c) return
  c.pinned = !c.pinned
}

function openConversationInfo(c?: Conversation | null) {
  if (!c) return
  // In un caso reale apri un dialog/route con i dettagli
  console.log('Info conversazione:', c)
}

function deleteConversation(c?: Conversation | null) {
  if (!c) return
  const idx = conversations.value.findIndex(x => x.id === c.id)
  if (idx >= 0) {
    conversations.value.splice(idx, 1)
    if (selectedConversation.value?.id === c.id) {
      selectedConversation.value = conversations.value[0] ?? null
    }
  }
}

/** ---------- Composer ---------- */
const draft = ref('')
const draftAttachments = ref<Attachment[]>([])
const threadRef = ref<HTMLElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

const canSend = computed(() =>
  !!draft.value.trim() || draftAttachments.value.length > 0,
)

function triggerFileInput() {
  fileInputRef.value?.click()
}
function onFilesChosen(e: Event) {
  const input = e.target as HTMLInputElement
  const files = input.files
  if (!files?.length) return
  for (const f of Array.from(files)) {
    const ext = (f.name.split('.').pop() || '').toLowerCase()
    const type: Attachment['type'] =
      ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext) ? 'image'
      : ext === 'pdf' ? 'pdf'
      : ['doc', 'docx'].includes(ext) ? 'doc'
      : 'file'
    draftAttachments.value.push({ name: f.name, type })
  }
  input.value = ''
}

function openEmojiPicker() {
  // Integra un emoji picker esterno se vuoi; qui simuliamo:
  draft.value += (draft.value ? ' ' : '') + '🙂'
}

function newline() {
  draft.value += '\n'
}

function send() {
  if (!selectedConversation.value || !canSend.value) return
  const newMsg: Message = {
    id: Date.now(),
    senderId: 1,
    senderName: 'Tu',
    text: draft.value.trim(),
    sentAt: new Date(),
    isMine: true,
    attachments: draftAttachments.value.slice(),
    delivery: 'sending',
  }
  selectedConversation.value.messages.push(newMsg)
  selectedConversation.value.lastMessagePreview = newMsg.text || (newMsg.attachments?.[0]?.name ?? '')
  selectedConversation.value.updatedAt = newMsg.sentAt

  // Reset draft
  draft.value = ''
  draftAttachments.value = []

  // Simula avanzamento stato di consegna
  setTimeout(() => { newMsg.delivery = 'sent' }, 400)
  setTimeout(() => { newMsg.delivery = 'delivered' }, 1200)
  setTimeout(() => { newMsg.delivery = 'read' }, 2400)

  // Scrolla in fondo
  nextTick(() => {
    threadRef.value?.scrollTo({ top: threadRef.value.scrollHeight, behavior: 'smooth' })
  })
}

/** ---------- Dialog: nuovo messaggio ---------- */
function createConversation() {
  const title = newMessage.value.title.trim() || (newMessage.value.participants[0] ?? 'Nuova conversazione')
  const conv: Conversation = {
    id: Date.now(),
    title,
      avatar: 'https://i.pravatar.cc/64',
    participants: ['Tu', ...newMessage.value.participants],
    messages: [],
    unreadCount: 0,
    pinned: false,
    updatedAt: new Date(),
    lastMessagePreview: '',
  }
  conversations.value.unshift(conv)
  selectedConversation.value = conv
  newMessageDialog.value = false

  // Se esiste testo iniziale, invialo subito
  if (newMessage.value.initialText.trim()) {
    draft.value = newMessage.value.initialText.trim()
    send()
  }

  // Reset form
  newMessage.value = { title: '', participants: [], initialText: '' }
}

/** ---------- Icone & etichette ---------- */
function attachmentIcon(t: Attachment['type']) {
  switch (t) {
    case 'image': return 'mdi-image'
    case 'pdf': return 'mdi-file-pdf-box'
    case 'doc': return 'mdi-file-word-box'
    default: return 'mdi-paperclip'
  }
}
function deliveryIcon(s?: DeliveryStatus) {
  switch (s) {
    case 'sending': return 'mdi-progress-clock'
    case 'sent': return 'mdi-check'
    case 'delivered': return 'mdi-check-all'
    case 'read': return 'mdi-check-all'
    default: return 'mdi-check'
  }
}
function deliveryColor(s?: DeliveryStatus) {
  switch (s) {
    case 'sending': return 'warning'
    case 'sent': return 'grey'
    case 'delivered': return 'primary'
    case 'read': return 'success'
    default: return 'grey'
  }
}
function deliveryLabel(s?: DeliveryStatus) {
  switch (s) {
    case 'sending': return 'Invio...'
    case 'sent': return 'Inviato'
    case 'delivered': return 'Consegnato'
    case 'read': return 'Letto'
    default: return ''
  }
}

/** ---------- UX: scroll iniziale in fondo ---------- */
onMounted(() => {
  nextTick(() => {
    threadRef.value?.scrollTo({ top: threadRef.value.scrollHeight })
  })
})
</script>

<style scoped>
    /* Layout responsivo */
    .messages-sidebar {
        width: 360px;
        min-width: 280px;
        border-right: 1px solid rgba(0,0,0,0.06);
        display: flex;
        flex-direction: column;
        min-height: 0; /* permettere flex child con overflow */
    }

    .messages-chat {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        min-width: 0;
        min-height: 0;
    }

    /* Area thread scrollabile */
    .messages-thread {
        flex: 1 1 auto;
        overflow: auto;
        background: rgb(var(--v-theme-surface));
    }

    /* Bolla messaggio */
    .message-bubble {
        max-width: min(680px, 80%);
        border-radius: 12px;
        padding: 10px 12px;
        box-shadow: 0 1px 2px rgba(0,0,0,0.06);
    }

    /* Tema scuro adattamento */
    :deep(.v-theme--dark) .messages-sidebar {
        border-right-color: rgba(255,255,255,0.08);
    }

    /* Mobile: sidebar sotto o nascondi a scelta */
    @media (max-width: 960px) {
        .messages-sidebar {
            display: none; /* in mobile si può nascondere la lista e usare un'ic    display: none; /* in mobile si può nascondere la lista e usare un'icona per aprirla */
        }
    }
    </style>