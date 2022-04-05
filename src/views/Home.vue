<template>
  <main>
    <canvas id="canvas" :height="h" :width="w"
            :style="{transform: `scale(${transformRatio}, ${transformRatio})`}">
    </canvas>
  </main>
</template>

<script>
import {
  NButton,
  NCard,
  NCollapse,
  NCollapseItem,
  NDivider,
  NImage,
  NSlider,
} from 'naive-ui'
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
      imgSrc: 'img/ran.jpg',
      w: 0,
      h: 0,
      transformRatio: 1,
      canvas: null,
      ctx: null
    }
  },
  computed: {

  },
  methods: {
    async onMounted(){
      const loadImage = async () => {
        let img = new Image()
        img.src = this.imgSrc
        img.crossOrigin = 'Anonymous'
        await new Promise(r => img.onload = r)
        this.w = img.width
        this.h = img.height
        return img
      }
      const img = await loadImage()
      this.ctx.drawImage(img, 0, 0, this.w, this.h)
    },
    onWheel(e){
      this.canvas.style.transformOrigin = `${e.offsetX}px ${e.offsetY}px`
      let level = - e.deltaY / 200 * 0.25 // 正值为放大，负值为缩小
      this.transformRatio = Math.max(this.transformRatio + level, 0.5)
      // console.log('transform ratio:', this.transformRatio.toFixed(1))
      // this.ctx.scale(ratio, ratio)
    }
  },
  mounted() {
    this.canvas = document.getElementById('canvas')
    this.ctx = this.canvas.getContext('2d',{ alpha: false })
    this.onMounted()
    this.canvas.addEventListener('wheel', this.onWheel, false)
  },
}
</script>

<style scoped></style>
