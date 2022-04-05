<template>
  <main ref="main">
    <canvas
      id="canvas" :width="w" :height="h"
      @wheel="onWheel"
      @mousemove="onMouseMove"
      @mousedown="isMoving = true"
      @mouseup="isMoving = false"
    >
    </canvas>
    <div class="bottom">
      <n-card size="small"> {{ x > 0 && y > 0 ? `${x}, ${y}` : '-, -' }}</n-card>
    </div>
    <!--    <div id="zoom" :style="{transform: `scale(${ratio})`}">-->
    <!--    </div>-->
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
        // imgSrc: '/api/picture',
        imgSrc: 'img/ran.png',
        originalSize: 0,
        w: 0,  // canvas width
        h: 0,  // canvas height
        dx: 0,  // The x coordinate in the canvas at which to place the top-left corner of the source image
        dy: 0,  // The y coordinate in the canvas at which to place the top-left corner of the source image
        x: 0,  // x coordinate of the pixel
        y: 0,  // y coordinate of the pixel
        isMoving: false,
        ratio: 1,
        canvas: null,
        ctx: null,
      }
    },
    computed: {
      currentSize() {
        return Math.floor(this.originalSize * this.ratio)
      }
    },
    methods: {
      clearImage() {
        this.ctx.fillStyle = 'white'
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
      },
      drawImage(r = this.ratio, x = this.x, y = this.y) {
        this.dx = this.dx - (r - this.ratio) * x
        this.dy = this.dy - (r - this.ratio) * y
        this.ratio = r
        this.ctx.imageSmoothingEnabled = false
        this.clearImage()
        this.ctx.drawImage(this.bitmap, this.dx, this.dy, this.currentSize, this.currentSize)
      },
      moveImage(x, y) {
        this.dx += x
        this.dy += y
        this.drawImage()
      },
      onKeyDown(e) {
        console.log(e.key)
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
      onMouseMove(e) {
        if (this.isMoving) {
          this.moveImage(e.movementX, e.movementY)
        }
        const calculate = (offset, d) => {
          return Math.ceil((offset - d) / this.ratio)
        }
        this.x = calculate(e.offsetX, this.dx)
        this.y = calculate(e.offsetY, this.dy)
      },
      async onWheel(e) {
        // this.canvas.style.transformOrigin = `${e.offsetX}px ${e.offsetY}px`
        let level = -e.deltaY > 0 ? 1 : -1 // 正值为放大，负值为缩小
        this.drawImage(Math.max(this.ratio + level, 1))
        // this.ctx.scale(ratio, ratio)
      }
      ,
      async onMounted() {
        let img = new Image()
        img.src = this.imgSrc
        img.crossOrigin = 'Anonymous'
        await new Promise((r) => (img.onload = r))
        this.originalSize = img.width
        this.dx = Math.floor((this.w - this.originalSize) / 2)
        this.dy = Math.floor((this.h - this.originalSize) / 2)
        this.bitmap = await createImageBitmap(img)
        this.drawImage(1, Math.floor(this.originalSize / 2), Math.floor(this.originalSize / 2))
      }
      ,
    },
    mounted() {
      this.canvas = document.getElementById('canvas')
      this.w = this.$refs.main.offsetWidth
      this.h = this.$refs.main.offsetHeight
      this.ctx = this.canvas.getContext('2d', {alpha: false})
      this.onMounted()
      document.addEventListener('keydown', this.onKeyDown)
    }
    ,
  }
</script>

<style scoped></style>
