	// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
// 引入自定义svg生成的小图标
import './common/css/icon.css'
// 引入mock模拟数据
require('./mock')
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
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
		// this.$router.push({path: '/goods'})
	}
})
