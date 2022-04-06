import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

const store = createStore({
  plugins: [
    createPersistedState({
      paths: [],
    }),
  ],
  state() {
    return {
      ratio: 1,
    }
  },
  getters: {
    // data() {
    //   return JSON.parse(localStorage.getItem('csm-data')) || []
    // },
  },
  mutations: {
    setRatio(state, ratio) {
      state.ratio = ratio
    },
  },
})

export default store
