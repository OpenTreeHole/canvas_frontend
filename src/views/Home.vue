<template>
  <main ref="main">
    <div
      :class="['frame', frameDisplay ? '' : 'hidden']"
      :style="{
        height: ratio + 'px',
        width: ratio + 'px',
        top: frameTop + 'px',
        left: frameLeft + 'px',
        backgroundColor: 'blue'
      }"
    >
      <Pixel :data="pixelData"/>
    </div>
    <canvas
      id="canvas" ref="canvas"
      :width="w" :height="h"
      @wheel="onWheel"
      @mousemove="onMouseMove"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
    >
    </canvas>
    <div class="bottom">
      <n-card size="small"> {{ x > 0 && y > 0 ? `${x}, ${y}` : '-, -' }}</n-card>
    </div>
  </main>
</template>


<script>
  import {NButton, NCard, NCollapse, NCollapseItem, NDivider, NImage, NSlider,} from 'naive-ui'
  import Pixel from "@/components/Pixel.vue";

  export default {
    name: 'Home',
    components: {
      Pixel,
      NCard,
      NButton,
      NCollapse,
      NCollapseItem,
      NSlider,
      NDivider,
      NImage,
    },
    data() {
      return {
        imgSrc: '/api/picture',
        wsUrl: 'ws://localhost:3000/api/ws',
        originalSize: 0,
        w: 0,  // canvas width
        h: 0,  // canvas height
        dx: 0,  // The x coordinate in the canvas at which to place the top-left corner of the source image
        dy: 0,  // The y coordinate in the canvas at which to place the top-left corner of the source image
        x: 0,  // x coordinate of the pixel
        y: 0,  // y coordinate of the pixel
        frameTop: 0,
        frameLeft: 0,
        frameDisplay: false,
        pixelData: {},
      }
    },
    computed: {
      ratio() {
        return this.$store.state.ratio
      },
      currentSize() {
        return Math.floor(this.originalSize * this.ratio)
      },
    },
    methods: {
      async getPixel() {
        let r = await fetch(`/api/pixels?x=${this.x}&y=${this.y}`)
        this.pixelData = await r.json()
      },
      async modifyPixel() {
        const data = {
          'color': '654321'
        }
        const r = await fetch(`/api/pixels/${this.pixelData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        })
      },
      updatePixel(pixel) {
        const imageData = this.fixedCtx.createImageData(1, 1)
        for (let i = 0; i < 3; i++) {
          imageData.data[i] = parseInt(pixel.color.slice(2 * i, 2 * i + 2), 16)
        }
        imageData.data[3] = 255
        this.fixedCtx.putImageData(imageData, pixel.x - 1, pixel.y - 1)
        this.drawImage()
      },
      clearImage() {
        this.ctx.fillStyle = 'white'
        this.ctx.fillRect(0, 0, this.w, this.h)
      },
      drawImage(r = this.ratio, x = this.x, y = this.y) {
        this.dx = this.dx - (r - this.ratio) * x
        this.dy = this.dy - (r - this.ratio) * y
        this.$store.commit('setRatio', r)
        this.ctx.imageSmoothingEnabled = false
        this.clearImage()
        this.ctx.drawImage(this.canvas, this.dx, this.dy, this.currentSize, this.currentSize)
      },
      moveImage(x, y) {
        this.dx += x
        this.dy += y
        this.drawImage()
      },
      onKeyDown(e) {
        const px = 25
        if (e.key === 'w' || e.key === 'ArrowUp') {
          this.moveImage(0, px)
        } else if (e.key === 'a' || e.key === 'ArrowLeft') {
          this.moveImage(px, 0)
        } else if (e.key === 's' || e.key === 'ArrowDown') {
          this.moveImage(0, -px)
        } else if (e.key === 'd' || e.key === 'ArrowRight') {
          this.moveImage(-px, 0)
        }
      },
      calculateCoordinate(e) {
        const calculate = (offset, d) => {
          return Math.ceil((offset - d) / this.ratio)
        }
        this.x = calculate(e.offsetX, this.dx)
        this.y = calculate(e.offsetY, this.dy)
      },
      onClick(e) {
        this.calculateCoordinate(e)
        this.frameTop = this.dy + (this.y - 1) * this.ratio
        this.frameLeft = this.dx + (this.x - 1) * this.ratio
        this.frameDisplay = true
        // TODO: 延迟消失
        // setTimeout(() => {
        //   this.frameDisplay = false
        //   this.frameTop = this.frameLeft = 0
        // }, 1000)
        this.getPixel()
      },
      onMouseMove(e) {
        if (this.mouseDown) {
          this.moveImage(e.movementX, e.movementY)
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
        // this.canvas.style.transformOrigin = `${e.offsetX}px ${e.offsetY}px`
        let level = -e.deltaY > 0 ? 1 : -1 // 正值为放大，负值为缩小
        this.drawImage(Math.max(this.ratio + level, 1))
        // this.ctx.scale(ratio, ratio)
      },
      async onMounted() {
        // load image
        let img = new Image()
        img.src = this.imgSrc
        img.crossOrigin = 'Anonymous'
        await new Promise((r) => (img.onload = r))
        // set data
        this.originalSize = img.width
        this.dx = Math.floor((this.w - this.originalSize) / 2)
        this.dy = Math.floor((this.h - this.originalSize) / 2)
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
          return new WebSocket(this.wsUrl)
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
      }
    },
    mounted() {
      // init canvas
      this.w = this.$refs.main.offsetWidth
      this.h = this.$refs.main.offsetHeight
      this.ctx = this.$refs.canvas.getContext('2d', {alpha: false})
      this.clearImage()
      this.onMounted()
      document.addEventListener('keydown', this.onKeyDown)
      this.connectWs()
    }
    ,
  }
</script>

<style scoped></style>
