import { createStore } from 'vuex'

/* --------- Helpers (solo interni allo store) --------- */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const value = bytes / Math.pow(1024, i)
  return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${sizes[i]}`
}
function getExtension(name) {
  const ext = name.split('.').pop() || ''
  return ext.toUpperCase()
}
function todayDDMMYYYY() {
  const d = new Date()
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

export default createStore({
  state: {
    // stato generico esistente
    message: '',//scritta generica
    username: '',
    password: '',

    // -------- Stato documenti & filtri (globale) --------
    items: [
      { nomeFile: 'VALUTAZIONE TERRENO', dataUltimaModifica: '15/02/2022', statoPratica: 'chiusa', tipoFile: 'PDF', size: '110 KB', funzioni: '' },
      { nomeFile: 'MATERIALI COSTRUZIONE', dataUltimaModifica: '28/07/2023', statoPratica: 'in attesa di approvazione', tipoFile: 'PDF', size: '342 KB', funzioni: '' },
      { nomeFile: 'IMPIANTO ELETTRICO', dataUltimaModifica: '09/11/2024', statoPratica: 'respinta', tipoFile: 'CAD', size: '342 KB', funzioni: '' },
      { nomeFile: 'MODELLO 3D PROGETTO', dataUltimaModifica: '21/03/2025', statoPratica: 'chiusa', tipoFile: 'PDF', size: '110 KB', funzioni: '' },
      { nomeFile: 'MAPPE ZONA SCAVI', dataUltimaModifica: '04/08/2022', statoPratica: 'chiusa', tipoFile: 'PDF', size: '342 KB', funzioni: '' },
      { nomeFile: 'VALUTAZIONE TERRENO', dataUltimaModifica: '17/01/2024', statoPratica: 'chiusa', tipoFile: 'PDF', size: '342 KB', funzioni: '' },
      { nomeFile: 'MATERIALI COSTRUZIONE', dataUltimaModifica: '30/09/2023', statoPratica: 'chiusa', tipoFile: 'PDF', size: '110 KB', funzioni: '' },
      { nomeFile: 'IMPIANTO ELETTRICO', dataUltimaModifica: '12/06/2022', statoPratica: 'chiusa', tipoFile: 'CAD', size: '342 KB', funzioni: '' },
      { nomeFile: 'MODELLO 3D PROGETTO', dataUltimaModifica: '08/05/2025', statoPratica: 'chiusa', tipoFile: 'CAD', size: '342 KB', funzioni: '' },
      { nomeFile: 'PARCO MONTALE', dataUltimaModifica: '19/10/2024', statoPratica: 'chiusa', tipoFile: 'PDF', size: '110 KB', funzioni: '' },
      { nomeFile: 'MATERIALI COSTRUZIONE', dataUltimaModifica: '03/03/2023', statoPratica: 'chiusa', tipoFile: 'PDF', size: '342 KB', funzioni: '' },
      { nomeFile: 'IMPIANTO ELETTRICO', dataUltimaModifica: '27/07/2022', statoPratica: 'chiusa', tipoFile: 'PDF', size: '342 KB', funzioni: '' },
      { nomeFile: 'IMPIANTO EOLICO', dataUltimaModifica: '14/02/2025', statoPratica: 'chiusa', tipoFile: 'PDF', size: '110 KB', funzioni: '' },
      { nomeFile: 'IMPIANTO ELETTRICO', dataUltimaModifica: '06/11/2023', statoPratica: 'chiusa', tipoFile: 'JPEG', size: '342 KB', funzioni: '' }
    ],
    filters: {
      nomeFile: null,
      dataDal: null, // ISO 'YYYY-MM-DD'
      dataAl: null,
      statoPratica: null
    }
  },

  mutations: {
    // --- esistenti ---
    setMessage(state, newMessage) {
      state.message = newMessage
    },
    setUsername(state, payload) {
      state.username = payload
    },
    setPassword(state, newPassword) {
      state.password = newPassword
    },
    clearPassword(state) {
      state.password = ''
    },

    // --- items ---
    setItems(state, newItems) {
      state.items = Array.isArray(newItems) ? [...newItems] : []
    },
    unshiftItem(state, newItem) {
      state.items.unshift(newItem)
    },
    deleteItem(state, payload) {
      // payload può essere index o l'oggetto item stesso
      if (typeof payload === 'number') {
        if (payload >= 0 && payload < state.items.length) state.items.splice(payload, 1)
        return
      }
      if (payload && typeof payload === 'object') {
        const idx = state.items.indexOf(payload)
        if (idx !== -1) {
          state.items.splice(idx, 1)
          return
        }
        // fallback match per campo chiave
        const idx2 = state.items.findIndex(i =>
          i.nomeFile === payload.nomeFile &&
          i.dataUltimaModifica === payload.dataUltimaModifica &&
          i.tipoFile === payload.tipoFile &&
          i.size === payload.size
        )
        if (idx2 !== -1) state.items.splice(idx2, 1)
      }
    },

    // --- filtri ---
    setFilters(state, newFilters) {
      state.filters = { ...state.filters, ...newFilters }
    },
    setFilterField(state, { key, value }) {
      if (key in state.filters) state.filters[key] = value
    },
    resetFilters(state) {
      state.filters = { nomeFile: null, dataDal: null, dataAl: null, statoPratica: null }
    }
  },

  actions: {
    // --- esistenti (fix email -> username) ---
    updateMessage({ commit }, newMessage) {
      commit('setMessage', newMessage)
    },
    updateUsername({ commit }, newUsername) {
      commit('setUsername', newUsername)
    },
    updatePassword({ commit }, newPassword) {
      commit('setPassword', newPassword)
    },
    // esempio: login + pulizia password
    async doLogin({ state, commit }) {
      // qui chiameresti la tua API di autenticazione
      // await api.login({ username: state.username, password: state.password })
      // se ok: salva token (non la password) in un altro modulo/chiave
      commit('clearPassword')
    },

    // --- items ---
    addFileAsFirstItem({ commit }, file) {
      const nuovo = {
        nomeFile: file.name,
        dataUltimaModifica: todayDDMMYYYY(),
        tipoFile: getExtension(file.name) || 'FILE',
        size: formatBytes(file.size) || '',
          statoPratica: 'in attesa di approvazione',
        funzioni: ''
      }
      commit('unshiftItem', nuovo)
    },
    deleteItem({ commit }, payload) {
      commit('deleteItem', payload)
    },

    // --- filtri ---
    resetFilters({ commit }) {
      commit('resetFilters')
    }
  },

  getters: {
    // --- esistenti ---
    message: state => state.message,
    username: state => state.username,
    hasUsername: state => !!state.username,

    // --- items/filtri ---
    statusOptions: state => {
      const set = new Set()
      for (const i of state.items) {
        const s = (i.statoPratica || '').trim()
        if (s) set.add(s)
      }
      return Array.from(set).sort()
    }
    // (se vuoi il filtraggio direttamente nello store, possiamo aggiungere
    //  un getter filteredItems che prende state.items + state.filters)
  }
})
