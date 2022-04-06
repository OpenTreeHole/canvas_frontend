<template>
  <div class="pixel-info">
    <div class="coordinates">
      <div v-for="(value, i) in [x, y]" :key="i" class="bold">
        <span>{{ i === 0 ? 'X' : 'Y' }}：{{ value }}</span>
      </div>
    </div>
    <div>编辑次数：{{ modify_times }}</div>
    <div>上次编辑：{{ modifyTime }}</div>
    <hr>
    <div class="color bold">
      <span>HEX</span>
      <div>
        <span>#{{ color.toUpperCase() }}</span>
        <span class="color-block" :style="{backgroundColor: '#' + color}">向晚</span>
      </div>
    </div>

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
        width: max-content;
        background-color: #CCCCCC;
        padding: 1em;
    }

    .coordinates {
        display: flex;
        justify-content: space-around;
    }

    .color {
        display: flex;
        justify-content: space-between;
    }

    .color-block {
        color: transparent;
        margin-left: 0.25em;
    }


    hr {
        border: 0.5px solid rgba(128, 128, 128, 0.42);
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
