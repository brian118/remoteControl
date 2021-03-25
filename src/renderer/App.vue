<template>
  <div id="app" class="app-container">
    <router-view></router-view>
  </div>
</template>

<script>
import { remote } from 'electron'
// import path from 'path'
const si = require('systeminformation')

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
    }
  },
  async created () {
    const system = await si.system();

    console.log("system",system)
    this.addOSClass()
  }
}
</script>

<style lang="scss">
@import '@/styles/variable.scss';

html, body, h1, h2, h3, h4, h5, h6, ul, li, ol {
  padding: 0;
  margin: 0;
  font-size: 1rem;
  font-weight: normal;
}
html, body {
  height: 100%;
  overflow: hidden;
}
html {
  box-sizing: border-box;
  &.noPadding,
  &.macOS {
    padding: 0;
    body {
      border-radius: 0;
    }
    .v-modal {
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      // margin: 0;
      border-radius: 0;
      width: 100%;
      height: 100%;
    }
  }

  &.borderRadius {
    body {
      border-radius: 10px;
    }
  }
}
body {
  // transform: scale(0.9);
  // border: 1px solid #fff;
  border-radius: 10px;
  // body 加上阴影，会导致：窗口内容还没有，用户看到了透明窗口的阴影
  // box-shadow: 0px 2px $shadowWidth 0px rgba(0,0,0,0.3);
  // background: #eee;
  -webkit-user-select: none;
}
.app-container {
  // height: calc(100% - 16px);
  height: 100%;
}
textarea:focus, input:focus {
  outline: 0;
}
img {
  // -webkit-user-select: none;
  -webkit-user-drag: none;
}
body, input, textarea {
  color: #000;
  font-family: PingFangSC-Regular,PingFang SC;
}
h1, h2, h3 {
  font-family: PingFangSC-Medium,PingFang SC;
}
.version-box {
  background: lightblue;
}
</style>
