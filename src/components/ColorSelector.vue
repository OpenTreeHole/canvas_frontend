<template>
  <div class="color-selector">
    <div class="colors">
      <n-button
        class="color"
        size="small"
        v-for="(color, i) in colors" :key="i"
        :color="color"
        @click="choose(color)"
      >
      </n-button>
    </div>
    <transition name="top">
      <div class="choose" v-if="displayChoose">
        <div v-if="displayCounter" style="margin: 0 auto 0.5rem">Please wait {{ countDown }}s to continue</div>
        <div class="buttonGroup">
          <n-button size="small" type="primary" :disabled="(!validated) || displayCounter" @click="modifyPixel">✓</n-button>
          <n-button size="small" type="error" @click="cancel">✗</n-button>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
import {NButton} from 'naive-ui'
import bus from 'vue3-eventbus'
import axios from '@/apis/axios'
export default {
  name: 'ColorSelector',
  components: {NButton},
  props: {},
  data() {
    return {
      colors: [
        '#d32f2f',
        '#c2185b',
        '#7b1fa2',
        '#512da8',
        '#303f9f',
        '#1976d2',
        '#0288d1',
        '#0097a7',
        '#00796b',
        '#388e3c',
        '#689f38',
        '#afb42b',
        '#fbc02d',
        '#ffa000',
        '#f57c00',
        '#e64a19',
        '#5d4037',
        '#616161',
        '#455a64',
        '#ffffff',
        '#000000',
      ],
      displayChoose: false,
      displayCounter: false,
      countDown: 0
    }
  },
  computed: {
    pixelData() {
      return this.$store.state.pixelData
    },
    validated() {
      return Boolean(this.pixelData.id)
    }
  },
  watch: {},
  methods: {
    choose(color) {
      if (!this.validated) {
        return
      }
      this.displayChoose = true
      this.oldData = JSON.parse(JSON.stringify(this.pixelData))
      this.pixelData.color = color.slice(1, 10)
      bus.emit('updatePixel', this.pixelData)
    },
    countDownTimer () {
        if (this.countDown > 0) {
            setTimeout(() => {
                this.countDown -= 1
                this.countDownTimer() 
                if (this.countDown == 0) {
                  this.displayCounter = false 
                }
            }, 1000)
        } 
    },
    async modifyPixel() {
      const data = {
        'color': this.pixelData.color
      }
      this.displayChoose = false
      bus.emit('hidePixelInfo')
      let requestUrl = '/api/pixels/' + this.pixelData.id
      this.countDown = 10 // 6 requests per minute
      this.countDownTimer()
      this.displayCounter = true
      const request = await axios({
          url: requestUrl,
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          data: JSON.stringify(data)
      }).catch(err => {
        if (err.response.status == 429) window.$message.error('Rate limit, try again later.', {keepAliveOnHover: true, duration: 10000})
        else {
          window.$message.error(err.message, {keepAliveOnHover: true, duration: 10000})
        }
        bus.emit('updatePixel', this.oldData)
        console.log(err)
      })
    },
    cancel() {
      bus.emit('updatePixel', this.pixelData)
      this.displayChoose = false
      bus.emit('hidePixelInfo')
    },
    onClick() {
      if (this.displayChoose) {
        this.cancel()
      }
    }
  },
  created() {
    bus.on('click', this.onClick)
    this.countDownTimer()
  },
}
</script>

<style scoped>
.color-selector {
  display: flex;
  flex-direction: column;
  overflow-x: auto;
  padding: 1rem 1.5rem 0.75rem 1rem;
  border-radius: 0.5rem;
  background-image: linear-gradient(-180deg, rgba(241, 241, 241, 0.8) 0%, rgba(227, 227, 227, 0.8) 100%);
}

.colors {
  display: flex;
}

.color {
  height: 1.5rem;
  width: 1.5rem;
  margin: 0 0.25rem;
}

.choose {
  display: flex;
  flex-direction: column;
  margin: 0.5rem auto 0;
}

.choose .buttonGroup {
  display: flex;
  justify-content: space-between;
}

.choose button {
  width: 10rem;
  margin: 0 0.5rem
}
</style>
