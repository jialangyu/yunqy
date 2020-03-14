import Vue from 'vue'

import '@/styles/reset.scss'

import App from './App'
import router from './router'
import store from '@/store'
import '@/utils/filter'

import '@/icons'
import './permission'

const FastClick = require('fastclick')
FastClick.attach(document.body)

import { TransferDom, LoadingPlugin, ToastPlugin, ConfirmPlugin, Group, Box, XInput, XButton, Cell } from 'vux'
Vue.directive('transfer-dom', TransferDom)
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)
Vue.component('group', Group)
Vue.component('box', Box)
Vue.component('x-input', XInput)
Vue.component('x-button', XButton)
Vue.component('cell', Cell)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created() {
    // this.$store.dispatch('getDictuList')
    this.$store.dispatch('getDictType')
  }
})
