<template>
  <div
    class="pixel-info"
    v-if="active"
    :style="{
        height: ratio + 'px',
        width: ratio + 'px',
        top: frameTop + 'px',
        left: frameLeft + 'px'
      }"
  >
    <Pixel :="pixelData" :is-loading="isLoading"></Pixel>
  </div>
</template>

<script>
import Pixel from "@/components/Pixel.vue";
import {mapState} from 'vuex'
import bus from 'vue3-eventbus'

export default {
  name: "PixelInfo",
  components: {Pixel,},
  data() {
    return {
      active: false,
      isLoading: false,
      frameTop: 0,
      frameLeft: 0
    }
  },
  computed: {
    ...mapState(['x', 'y', 'dx', 'dy', 'ratio', 'pixelData']),
  },
  watch: {},
  methods: {
    async getPixel(x = this.x, y = this.y) {
      let r = await fetch(`/api/pixels?x=${x}&y=${y}`)
      this.$store.commit('setPixelData', await r.json())
    },
    async show() {
      this.active = true
      this.frameTop = this.dy + (this.y - 1) * this.ratio - 1  // 1是边框宽度
      this.frameLeft = this.dx + (this.x - 1) * this.ratio - 1
      this.isLoading = true
      await this.getPixel()
      this.isLoading = false
    },
    hide() {
      this.active = false
      this.frameTop = 0
      this.frameLeft = 0
    }
  },
  created() {
    bus.on('showPixelInfo', this.show)
    bus.on('hidePixelInfo', this.hide)
  }
}
</script>

<style scoped>
.pixel-info {
  position: absolute;
  border: 1px solid black;
}


</style>
