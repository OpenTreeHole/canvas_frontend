<template>
  <div class="pixel-info">
    <div v-for="(value, i) in [x, y]" :key="i">
      <span>{{ i === 0 ? 'X' : 'Y' }}</span>
      <span>: </span>
      <span>{{ value }}</span>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'Pixel',
    components: {},
    props: {
      id: Number,
      x: Number,
      y: Number,
      color: String,
      modify_times: Number,
      modify_time: String
    }
  }
</script>

<style scoped></style>
