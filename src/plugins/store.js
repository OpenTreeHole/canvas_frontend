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
      x: 0,
      y: 0,
      pixelData: {},
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
    setCoordinate(state, coordinate) {
      state.x = coordinate[0]
      state.y = coordinate[1]
    },
    setPixelData(state, data) {
      state.pixelData = data
    },
  },
})

export default store
