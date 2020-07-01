import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import fastclick from 'fastclick'
import router from './router'
import store from './store'
import './common/stylus/index.styl'
import Vuelazyload from 'vue-lazyload'
import loading from 'src/common/image/default.png'
Vue.config.productionTip = false
Vue.use(Vuelazyload, {
  loading
})

fastclick.attach(document.body)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
