<template>
  <div class="bottom">
    <div class="coordinate">
      <Icon>
        <LocationOnFilled/>
      </Icon>
      ({{ x > 0 && y > 0 ? `${x}, ${y}` : '-, -' }})
    </div>
    <ColorSelector @updatePixel="onUpdatePixel"></ColorSelector>
  </div>
</template>

<script>
  import ColorSelector from "@/components/ColorSelector.vue";
  import {LocationOnFilled} from '@vicons/material'
  import {Icon} from '@vicons/utils'
  import {mapState} from "vuex";

  export default {
    name: 'BottomPanel',
    components: {ColorSelector, LocationOnFilled, Icon},
    props: {},
    data() {
      return {}
    },
    computed: {
      ...mapState(['x', 'y', 'ratio'])
    },
    methods: {
      onUpdatePixel(e) {
        console.log(e)
      }
    }
  }
</script>

<style scoped>
    .bottom {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: fixed;
        bottom: 0;
    }

    .coordinate {
        display: flex;
        align-items: center;
        width: max-content;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem 0.25rem 0 0;
        background-image: linear-gradient(-180deg, rgba(241, 241, 241, 0.8) 0%, rgba(227, 227, 227, 0.8) 100%);
    }
</style>
