import Vue from 'vue'
import Router from 'vue-router'
import Goods from '@/components/goods/goods.vue'
import Ratings from '@/components/ratings/ratings'
import Seller from '@/components/seller/seller.vue'

Vue.use(Router)

// 1. 定义 (路由) 组件。可以从其他文件 import 进来
// const Goods = { template:'<div>商品</div>'}

// 2. 定义路由每个路由应该映射一个组件。 ，
//  其中"component" 可以是通过 Vue.extend()创建的组件构造器
// 或者，只是一个组件配置对象。
	const routes = [
  { path: '/goods', component: Goods },
  { path: '/ratings', component: Ratings },
	{ path: '/seller', component: Seller }
]

export default new Router({
  // routes: routes
	routes,
	linkActiveClass: 'active'
})
