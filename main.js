import Vue from 'vue'
import App from './App'
import * as $apis from './apis/index.js'
Vue.config.productionTip = false
Vue.prototype.$apis = $apis;
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
