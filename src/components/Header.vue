<template>
  <header>
    <div class="github">
      <n-button
        href="https://github.com/hasbai/jrjtcsm"
        tag="a"
        target="view_window"
        :bordered="false"
      >
        <span style="margin-right: 0.5rem">Github Repo</span>
        <n-icon :size="'1.5rem'"><GithubFilled></GithubFilled></n-icon>
      </n-button>
    </div>
  </header>
</template>

<script>
import { NButton, NIcon, NText } from 'naive-ui'
import { GithubFilled } from '@vicons/antd'

export default {
  name: 'Header',
  components: {
    NIcon,
    GithubFilled,
    NText,
    NButton,
  },
}
</script>

<style scoped></style>
