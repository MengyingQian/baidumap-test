// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import element from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import echarts from 'echarts'

Vue.use(element)

Vue.config.productionTip = false

Vue.prototype.$echarts = echarts;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
