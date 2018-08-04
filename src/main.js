// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import './assets/reset.css'
import 'element-ui/lib/theme-chalk/index.css'
import http from './http'

Vue.config.productionTip = false
Vue.prototype.$http = http

Vue.use(ElementUI)

Vue.filter('timeFormat', function timeFormat (timestamp, format = 'yyyy-MM-dd hh:mm') {
  if (/\d{13}/.test(timestamp + '')) {
    const date = new Date(+timestamp)
    const args = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      S: date.getMilliseconds()
    }
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (const i in args) {
      const n = args[i]
      if (new RegExp(`(${i})`).test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ('00' + n).substr(('' + n).length))
      }
    }
    return format
  } else {
    return timestamp
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})


