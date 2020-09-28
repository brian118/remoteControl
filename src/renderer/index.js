import Vue from 'vue'
import router from '@/router/router'
import App from './App'

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

new Vue({
  el: '#app',
  router,
  render: h => h(App),
})
