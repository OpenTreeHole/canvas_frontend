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
      data: [],
    }
  },
  getters: {
    data() {
      return JSON.parse(localStorage.getItem('csm-data')) || []
    },
  },
  mutations: {
    setData(state, data) {
      state.data = data
      localStorage.setItem('csm-data', JSON.stringify(data))
    },
  },
})

export default store
