<template>
  <div id="app" class="app-container">
    <div class="version-box">
      <div>electronVersion: {{ electronVersion }}</div>
      <div>chromeVersion: {{ chromeVersion }}</div>
    </div>
    <!-- keep-alive 缓存规则：默认启用缓存，路由设置了 keepAlive: false 就不缓存 -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive !== false"></router-view>
    </keep-alive>
    <router-view v-if="$route.meta.keepAlive === false"></router-view>

  </div>
</template>

<script>
import { remote } from 'electron'
// import path from 'path'

const currentWindow = remote.getCurrentWindow()
const isMacOS = process.platform === 'darwin'
const root = document.querySelector('html')

export default {
  computed: {
    electronVersion () {
      return process.versions.electron
    },
    chromeVersion () {
      return process.versions.chrome
    },
  },
  methods: {
    addOSClass () {
      // https://stackoverflow.com/a/27862868
      // const isMacOS = navigator.platform.includes('Mac')
      const OS = isMacOS ? 'macOS' : 'windowsOS'
      root.classList.add(OS)
    },
  },
  created () {
    this.addOSClass()
  }
}
</script>

<style lang="scss">
@import '@/styles/variable.scss';

.version-box {
  background: lightblue;
}
</style>
