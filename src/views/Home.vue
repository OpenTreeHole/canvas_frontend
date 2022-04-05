<template>
  <main ref="main">
    <canvas id="canvas" :width="w" :height="h">
    </canvas>
    <div id="zoom" :style="{transform: `scale(${ratio})`}">
    </div>
  </main>
</template>


<script>
  import {NButton, NCard, NCollapse, NCollapseItem, NDivider, NImage, NSlider,} from 'naive-ui'

  export default {
    name: 'Home',
    components: {
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
        data: [],
        // imgSrc: '/api/picture',
        imgSrc: 'img/ran.png',
        size: 0,
        w: 0,  // canvas width
        h: 0,  // canvas height
        dx: 0,  // The x coordinate in the canvas at which to place the top-left corner of the source image
        dy: 0,  // The y coordinate in the canvas at which to place the top-left corner of the source image
        ratio: 1,
        canvas: null,
        ctx: null,
      }
    },
    computed: {
      currentSize() {
        return Math.floor(this.size * this.ratio)
      }
    },
    methods: {
      clearImage() {
        this.ctx.fillStyle = 'white'
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
      },
      drawImage(
        r = 1,
        x = Math.floor(this.size / 2),
        y = Math.floor(this.size / 2),
      ) {
        this.dx = this.dx - (r - 1) * x
        this.dy = this.dy - (r - 1) * y
        this.ctx.imageSmoothingEnabled = false
        this.clearImage()
        this.ctx.drawImage(this.bitmap, this.dx, this.dy, this.currentSize, this.currentSize)
      },
      async onMounted() {
        let img = new Image()
        img.src = this.imgSrc
        img.crossOrigin = 'Anonymous'
        await new Promise((r) => (img.onload = r))
        this.size = img.width
        this.dx = Math.floor((this.w - this.size) / 2)
        this.dy = Math.floor((this.h - this.size) / 2)
        this.bitmap = await createImageBitmap(img)
        this.drawImage()
      },
      async onWheel(e) {
        // this.canvas.style.transformOrigin = `${e.offsetX}px ${e.offsetY}px`
        let level = (-e.deltaY / 200) * 0.25 // 正值为放大，负值为缩小
        this.ratio = Math.max(this.ratio * (1 + level), 1)

        this.drawImage(this.ratio)
        // this.ctx.scale(ratio, ratio)
      },
    },
    mounted() {
      this.canvas = document.getElementById('canvas')
      this.w = this.$refs.main.offsetWidth
      this.h = this.$refs.main.offsetHeight
      this.ctx = this.canvas.getContext('2d', {alpha: false})
      this.onMounted()
      this.canvas.addEventListener('wheel', this.onWheel, false)
    },
  }
</script>

<style scoped></style>
