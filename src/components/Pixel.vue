<template>
  <div class="pixel-info">
    <div v-for="(value, i) in [x, y]" :key="i">
      <span>{{ i === 0 ? 'X' : 'Y' }}</span>
      <span>：</span>
      <span>{{ value }}</span>
    </div>
    <div>编辑次数：{{ modify_times }}</div>
    <div>上次编辑：{{ modifyTime }}</div>
    <div>#{{ color }}</div>

  </div>
</template>

<script>
  import {NCard} from "naive-ui";
  import {timeDifference} from "@/utils";

  export default {
    name: 'Pixel',
    components: {NCard},
    props: {
      id: Number,
      x: Number,
      y: Number,
      color: String,
      modify_times: Number,
      modify_time: String
    },
    computed: {
      modifyTime() {
        return timeDifference(this.modify_time)
      }
    }
  }
</script>

<style scoped>
    .pixel-info {
        position: relative;
        left: 125%;
        top: -50%;
        width: 6em;
        background-color: #CCCCCC;
        padding: 1em;
    }

    /*.pixel-info:before {*/
    /*    content: "";*/
    /*    width: 0;*/
    /*    height: 0;*/
    /*    border-top: 0.5em solid transparent;*/
    /*    border-bottom: 0.5em solid transparent;*/
    /*    border-right: 0.5em solid #CCCCCC;*/
    /*    position: absolute;*/
    /*    top: 12.5%;*/
    /*    left: -16.666%;*/
    /*}*/
</style>
