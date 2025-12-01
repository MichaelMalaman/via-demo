
import { createStore } from 'vuex'

export default createStore({

    state: {
        message: 'Hello Vuex!',
        email: '',
        password: '' // ⚠️ usata solo in modo effimero
    },
    mutations: {
        setMessage(state, newMessage) {
            state.message = newMessage
        },
        setEmail(state, newEmail) {
            state.email = newEmail
        },
        setPassword(state, newPassword) {
            state.password = newPassword
        },
        clearPassword(state) {
            state.password = ''
        }
    },
    actions: {
        updateMessage({ commit }, newMessage) {
            commit('setMessage', newMessage)
        },
        updateEmail({ commit }, newEmail) {
            commit('setEmail', newEmail)
        },
        updatePassword({ commit }, newPassword) {
            commit('setPassword', newPassword)
        },
        // esempio: login + pulizia password
        async doLogin({ state, commit }) {
            // qui chiameresti la tua API di autenticazione
            // await api.login({ email: state.email, password: state.password })
            // se ok: salva token (non la password) in un altro modulo/chiave
            commit('clearPassword')
        }
    },
    getters: {
        message: state => state.message,
        email: state => state.email,
        // non esporre la password via getter in contesti reali
        hasEmail: state => !!state.email
    }
})
