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
        <n-button size="small" type="primary" :disabled="!validated" @click="modifyPixel">✓</n-button>
        <n-button size="small" type="error" @click="cancel">✗</n-button>
      </div>
    </transition>

  </div>
</template>

<script>
import {NButton} from 'naive-ui'
import bus from 'vue3-eventbus'

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
    async modifyPixel() {
      const data = {
        'color': this.pixelData.color
      }
      this.displayChoose = false
      bus.emit('hidePixelInfo')
      const r = await fetch(`/api/pixels/${this.pixelData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      if (r.status === 429) {
        bus.emit('updatePixel', this.oldData)
      }
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
  }
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
  justify-content: space-around;
  margin-top: 1rem;
}

.choose button {
  width: 30%;
}
</style>
