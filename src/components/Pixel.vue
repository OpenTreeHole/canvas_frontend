<template>
  <div class="pixel">
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
      <div class="value">
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
      id: {type: Number, default: 1},
      x: {type: Number, default: 1},
      y: {type: Number, default: 1},
      color: {type: String, default: ''},
      modify_times: {type: Number, default: 0},
      modify_time: {type: String, default: ''}
    },
    computed: {
      modifyTime() {
        return timeDifference(this.modify_time)
      }
    }
  }
</script>

<style scoped>
    .pixel {
        position: relative;
        left: 125%;
        top: -50%;
        width: max-content;
        background-color: rgba(204, 204, 204, 0.5);
        padding: 1em;
    }

    /* 此时一个点大小为 24 px */
    .pixel:before {
        content: "";
        width: 0;
        height: 0;
        border-top: 6px solid transparent;
        border-bottom: 6px solid transparent;
        border-right: 6px solid rgba(204, 204, 204, 0.5);
        position: absolute;
        left: -6px;
    }

    .coordinates {
        display: flex;
        justify-content: space-around;
    }

    .color {
        display: flex;
        justify-content: space-between;
    }

    .color .value {
        margin-left: 1em;
    }


    .color-block {
        color: transparent;
        margin-left: 0.25em;
    }

    hr {
        border: 0.5px solid rgba(128, 128, 128, 0.42);
    }
</style>
