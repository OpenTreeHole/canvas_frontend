<template>
  <main ref="main">
    <PixelInfo></PixelInfo>
    <HomeLoader v-if="imgLoading">
    </HomeLoader>
    <canvas
      v-else
      id="canvas" ref="canvas"
      :width="w" :height="h"
      @wheel="onWheel"
      @mousemove="onMouseMove"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
    >
    </canvas>
    <BottomPanel></BottomPanel>
  </main>
</template>


<script>
import bus from 'vue3-eventbus'
import {mapState} from "vuex"
import BottomPanel from "@/components/BottomPanel.vue"
import PixelInfo from "@/components/PixelInfo.vue"
import HomeLoader from "@/components/HomeLoader.vue";

export default {
  name: 'Home',
  components: {
    HomeLoader,
    PixelInfo,
    BottomPanel,
  },
  data() {
    return {
      w: 0,  // canvas width
      h: 0,  // canvas height
      targetRatio: 24,  // 点击放大后的 ratio
      imgLoading: true
    }
  },
  computed: {
    ...mapState(['ratio', 'x', 'y', 'dx', 'dy', 'pixelData', 'metaData']),
    originalSize() {
      return this.metaData.canvas_size
    },
    validCoordinate() {
      return this.x > 0 && this.y > 0 && this.x <= this.originalSize && this.y <= this.originalSize
    },
    currentSize() {
      return Math.floor(this.originalSize * this.ratio)
    },
  },
  methods: {
    async modifyPixel(pixel = this.pixelData) {
      const data = {
        'color': pixel.color
      }
      const r = await fetch(`/api/pixels/${pixel.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
    },
    updatePixel(pixel = this.pixelData) {
      const imageData = this.fixedCtx.createImageData(1, 1)
      for (let i = 0; i < 3; i++) {
        imageData.data[i] = parseInt(pixel.color.slice(2 * i, 2 * i + 2), 16)
      }
      imageData.data[3] = 255
      this.fixedCtx.putImageData(imageData, pixel.x - 1, pixel.y - 1)
      this.drawImage()
    },
    clearImage() {
      // clear canvas
      this.ctx.fillStyle = 'white'
      this.ctx.fillRect(0, 0, this.w, this.h)
    },
    drawImage(r = this.ratio, x = this.x, y = this.y) {
      this.$store.commit('setDxDy', [
        this.dx - (r - this.ratio) * x,
        this.dy - (r - this.ratio) * y
      ])
      this.$store.commit('setRatio', r)
      this.ctx.imageSmoothingEnabled = false
      this.clearImage()
      this.ctx.drawImage(this.canvas, this.dx, this.dy, this.currentSize, this.currentSize)
    },
    moveImage(x, y) {
      this.$store.commit('setDxDy', [
        this.dx + x,
        this.dy + y
      ])
      this.drawImage()
    },
    calculateCoordinate(e) {
      const calculate = (offset, d) => {
        return Math.ceil((offset - d) / this.ratio)
      }
      const x = calculate(e.offsetX, this.dx)
      const y = calculate(e.offsetY, this.dy)
      this.$store.commit('setCoordinate', [x, y])
    },
    onUpdatePixel(e) {
      if (e.request) {
        this.modifyPixel(e.data)
      } else {
        this.updatePixel(e.data)
      }
    },
    async onKeyDown(e) {
      const _move = (px = 4) => {
        if (e.key === 'w' || e.key === 'ArrowUp') {
          this.moveImage(0, px)
        } else if (e.key === 'a' || e.key === 'ArrowLeft') {
          this.moveImage(px, 0)
        } else if (e.key === 's' || e.key === 'ArrowDown') {
          this.moveImage(0, -px)
        } else if (e.key === 'd' || e.key === 'ArrowRight') {
          this.moveImage(-px, 0)
        }
      }
      for (let i = 0; i < 12; i++) {
        _move()
        await new Promise((r) => setTimeout(r, 2))
      }
      bus.emit('hidePixelInfo')
    },
    async onClick(e) {
      this.calculateCoordinate(e)
      if (!this.validCoordinate) {
        return
      }
      // transition
      let r = this.ratio
      const step = r < this.targetRatio ? 0.2 : -0.2
      while (r > this.targetRatio + 0.01 || r < this.targetRatio - 0.01) {
        r += step
        this.drawImage(r)
        await new Promise((r) => setTimeout(r, 1))
      }
      this.drawImage(this.targetRatio)
      // show pixel info
      bus.emit('showPixelInfo')
      bus.emit('click')
    },
    onMouseMove(e) {
      if (this.mouseDown) {
        this.moveImage(e.movementX, e.movementY)
        bus.emit('hidePixelInfo')
      }
      this.calculateCoordinate(e)
    },
    onMouseDown(e) {
      this.mouseDown = true
      this.mouseClientX = e.clientX
      this.mouseClientY = e.clientY
    },
    onMouseUp(e) {
      this.mouseDown = false
      if (this.mouseClientX === e.clientX && this.mouseClientY === e.clientY) {
        this.onClick(e)
      }
    },
    async onWheel(e) {
      let level = -e.deltaY > 0 ? 1 : -1 // 正值为放大，负值为缩小
      level *= Math.ceil(this.ratio / 8)
      this.drawImage(Math.max(this.ratio + level, 1))
    },
    async onMounted() {
      // load image
      let img = new Image()
      img.src = '/api/picture'
      img.crossOrigin = 'Anonymous'
      await new Promise((r) => (img.onload = r))
      await new Promise(r => setTimeout(r, 1000))
      this.imgLoading = false
      await this.$nextTick()
      // init canvas
      this.w = this.$refs.main.offsetWidth
      this.h = this.$refs.main.offsetHeight
      this.ctx = this.$refs.canvas.getContext('2d', {alpha: false})
      this.clearImage()
      await this.$nextTick()
      // set data
      this.$store.commit('setDxDy', [
        Math.floor((this.w - this.originalSize) / 2),
        Math.floor((this.h - this.originalSize) / 2)
      ])
      // create a fixed canvas
      let canvas = document.createElement('canvas')
      canvas.width = canvas.height = this.originalSize
      const ctx = canvas.getContext('2d', {alpha: false})
      ctx.drawImage(img, 0, 0, img.width, img.width)
      this.canvas = canvas
      this.fixedCtx = ctx
      // draw to the real canvas
      const center = Math.floor(this.originalSize / 2)
      this.drawImage(1, center, center)
    },
    connectWs() {
      const connect = () => {
        return new WebSocket(window.location.origin.replace('http', 'ws') + '/api/ws')
      }
      let ws = connect()
      ws.onopen = () => {
        console.log('websocket connected')
      }
      ws.onerror = () => {
        console.log('websocket connect failed')
        ws = connect()
      }
      ws.onclose = () => {
        console.log('websocket disconnected')
        ws = connect()
      }
      ws.onmessage = this.onMessage
    },
    onMessage(e) {
      const data = JSON.parse(e.data)
      if (data.type === 'pixel') {
        this.updatePixel(data.data)
      }
      if (data.type === 'meta') {
        this.$store.commit('setMetaData', data.data)
      }
    }
  },
  mounted() {
    this.onMounted()
    document.addEventListener('keydown', this.onKeyDown)
    this.connectWs()
  },
  created() {
    bus.on('updatePixel', this.onUpdatePixel)
  }
}
</script>

<style scoped>

</style>
