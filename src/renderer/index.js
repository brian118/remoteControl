import Vue from 'vue'
import router from './router'
import App from './App'
import ElementUI from 'element-ui'

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

Vue.use(ElementUI)

new Vue({
  el: '#app',
  router,
  render: h => h(App),
})
