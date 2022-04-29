<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import Header from '@/components/Header.vue'
import {NMessageProvider} from 'naive-ui'</script>

<template>
  <n-message-provider>
    <Header></Header>
    <router-view></router-view>
    <footer></footer>
  </n-message-provider>
</template>

<style></style>
