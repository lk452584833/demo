<template>
  <div id="app">
    <v-header v-bind:seller="seller"></v-header>
    <div class="tab border-1px">
			<div class="tab-item"><router-link to="/goods">商品</router-link></div>
			<div class="tab-item"><router-link to="/ratings">评论</router-link></div>
			<div class="tab-item"><router-link to="/seller">商家</router-link></div>
		</div>
   <!-- 路由出口 -->
  <!-- 路由匹配到的组件将渲染在这里 keep-alive保留状态避免重新渲染-->
	<keep-alive>
		<router-view :seller="seller"></router-view>
	</keep-alive>
  </div>
</template>

<script>
	// 当做父组件，引用，注册，使用子组件
	import vheader from './components/header/header.vue'
	import {urlParam} from './common/js/utils.js'
	const ERROR_OK = 0
	export default {
		data() {
			return {
				seller: {
					id: (() => { // 立即执行函数，获取id
						let queryParam = urlParam()
						return queryParam.id
					})()
				}
			}
		},
		components: {
			'v-header': vheader
		},
		created() {
			// mock 模拟数据
			this.axios.get('/api/seller?id=' + this.seller.id).then((response) => {
				response = response.data
				if (response.errno === ERROR_OK) {
					this.seller = Object.assign({}, this.seller, response.data)
				}
			})
		}
	}
</script>

<style lang="less" >
	html,body{
		font-style: normal;font-weight: 200;
	}
	#app {
	.tab{
			display: flex;width:100%;height:40px;line-height: 40px;.border-1px(rgba(7,12,27,0.1));
			.tab-item{
				flex: 1;text-align: center;
				& >a{display: block;font-size: 14px;color:rgb(77,85,93)}
				& >a.active{color:rgb(240,20,20)}
				}
			}
	}
</style>
