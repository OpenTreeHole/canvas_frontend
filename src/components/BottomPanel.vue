<template>
  <div class="bottom">
    <div class="info">
      <div class="align">
        <Icon size="1rem">
          <LocationOnFilled/>
        </Icon>
        ({{ x > 0 && y > 0 ? `${x}, ${y}` : '-, -' }})
      </div>
      <div class="align online">
        <Icon size="1rem">
          <PeopleAltFilled/>
        </Icon>
        &nbsp;{{ online }}
      </div>
    </div>
    <ColorSelector @updatePixel="onUpdatePixel"></ColorSelector>
  </div>
</template>

<script>
  import ColorSelector from "@/components/ColorSelector.vue"
  import {LocationOnFilled, PeopleAltFilled} from '@vicons/material'
  import {Icon} from '@vicons/utils'
  import {mapState} from "vuex";

  export default {
    name: 'BottomPanel',
    components: {ColorSelector, LocationOnFilled, Icon, PeopleAltFilled},
    props: {},
    data() {
      return {}
    },
    computed: {
      ...mapState(['x', 'y', 'ratio']),
      online() {
        return this.$store.state.metaData.online || 0
      }
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

    .info {
        display: flex;
        align-items: center;
        width: max-content;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem 0.25rem 0 0;
        background-image: linear-gradient(-180deg, rgba(241, 241, 241, 0.8) 0%, rgba(227, 227, 227, 0.8) 100%);
    }

    .align {
        display: flex;
        align-items: center;
    }

    .online {
        margin-left: 1rem;
    }
</style>
