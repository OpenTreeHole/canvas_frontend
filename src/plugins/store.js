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
      dx: 0, // The x coordinate in the canvas at which to place the top-left corner of the source image
      dy: 0, // The y coordinate in the canvas at which to place the top-left corner of the source image
      pixelData: {},
      metaData: {
        online: 0,
        canvas_size: 500,
      },
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
    setDxDy(state, coordinate) {
      state.dx = coordinate[0]
      state.dy = coordinate[1]
    },
    setPixelData(state, data) {
      state.pixelData = data
    },
    setMetaData(state, data) {
      state.metaData = data
    },
  },
})

export default store
