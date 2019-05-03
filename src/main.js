	// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import axios from 'axios'
import VueAxios from 'vue-axios'
import FastClick from 'fastclick'
import store from './store'
import utils from './common/js/utils.js' // 引入自定义工具类
import './common/css/icon.css' // 引入自定义svg生成的小图标
// 引入mock模拟数据
require('./mock')
Vue.use(utils)
Vue.use(VueAxios, axios)
FastClick.attach(document.body)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: router,
  store: store,
  data: {
	eventHub: new Vue()
  },
  components: { App },
  template: '<App/>',
	methods: {
		goBack() {
			window.history.length > -1 ? this.$router.go(-1) : this.$router.push('/')
		}
	},
	created() {
		// 初始化路由
		this.$router.push({path: '/goods'})
	}
})
