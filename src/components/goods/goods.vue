<template>
	<div class="goods">
		<div class="menu-wrapper">
			<ul>
				<li v-for="(item,index) in goods" :key="index" class="menu-item" :class="{'current':currentIndex === index}" @click="selectMemu(index)">
					<span class="text border-1px">
						<icon v-show="item.type>0" :num="3" class="icon-box" :cls="classMap[item.type]"></icon>{{item.name}}
					</span>
				</li>
			</ul>
		</div>
		<div class="foods-wrapper" ref="foodsWapper">
			<ul>
				<li v-for="(item,index) in goods" class="food-list food-list-hook" :key="index">
					<h1 class="title">{{item.name}}</h1>
					<ul>
						<li @click="selectFood(food)" v-for="(food,index) in item.foods" class="food-item" :key="index">
							<div class="icon"><img width="57" height="57" :src="food.icon" alt=""></div>
							<div class="content">
								<h2 class="name">{{food.name}}</h2>
								<p class="desc">{{food.description}}</p>
								<div class="extra">
									<span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
								</div>
								<div class="price">
									<span class="now">¥{{food.price}}</span><span v-show="food.oldPrice" class="old">¥{{food.oldPrice}}</span>
								</div>
								<div class="cartcontral-wrapper">
									<cartcontrol :food="food"></cartcontrol>
								</div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<shopcart ref="shopcart" :sellectFoods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
		<food @cartadd="cartAdd" :food="selectedFood" ref='childfood'></food>
		<!-- cartAdd相对于监听到了子组件的cartadd属性后做的操作 -->
	</div>
</template>

<script>
	import BScroll from 'better-scroll'
	import icon from '../../components/icon/icon'
	import shopcart from '../../components/shopcart/shopcart'
	import cartcontrol from '../../components/cartcontrol/cartcontrol'
	import food from '../../components/food/food'
	const ERROR_OK = 0
	export default{
		props: {
			seller: {
				type: Object
			}
		},
		data() {
			return {
				goods: [],
				listHeight: [], // 记录每个列表的高度组成的数组，递增
				scrollY: 0, // 记录当前滚动的高度
				selectedFood: {} // 选中的某一物品
			}
		},
		computed: {
			currentIndex() { // 计算当前current
				for (let i = 0; i < this.listHeight.length; i++) {
					let height1 = this.listHeight[i]
					let height2 = this.listHeight[i + 1]
					if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
						return i
					}
				}
				return 0
			},
			selectFoods() { // 传递数据到子组件 shopcart
				let foods = []
				this.goods.forEach((good) => {
					good.foods.forEach((food) => {
						if (food.count) {
							foods.push(food)
						}
					})
				})
				return foods
			}
		},
		created() {
			this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
			this.$http.get('/api/goods').then((response) => {
				response = response.body
				if (response.errno === ERROR_OK) {
					this.goods = response.data
					this.$nextTick(function() { // dom更新之后 触发
						this._initScroll()
						this._calculateHeight()
					})
				}
			})
			// 绑定子组件cartcontrol,派发的 car-add事件,并获取到派发数据.再传递到子组件购物车，shopcart里去
			// 接收子组件food.vue 里面的字组件cartcontrol 派发的car-add事件，非父子组件通讯
			this.$root.eventHub.$on('cart-add', (target) => {
				console.log('通过eventHub 派发，实现非父子组件通讯')
				this._drop(target)
			})
		},
		// 最好在组件销毁前清除事件监听
		beforeDestroy() {
			this.$root.eventHub.$off('cart-add', (target) => {
				this._drop(target)
			})
		},
		methods: {
			selectFood(food) {
				this.selectedFood = food
				this.$refs.childfood.show() // 调用子组件的show方法
			},
			selectMemu(index) {
				let foodList = this.$refs.foodsWapper.querySelectorAll('.food-list-hook')
				let el = foodList[index]
				this.foodsScroll.scrollToElement(el, 300)
			},
			cartAdd(target) { // 接收food直接子组件派发
				console.log('通过$emit 派发，实现父子组件通讯')
				this._drop(target)
			},
			_drop(target) {
				// 优化，异步指向下落动画
				this.$nextTick(() => {
					// 获取到子组件cartcontrol 的数据后， 访问子组件shopcart 并调用子组件drop 传递数据
					this.$refs.shopcart.drop(target)
				})
			},
			_initScroll() { // 初始化better-scroll
				this.menuScroll = new BScroll('.menu-wrapper', {
					click: true
				})
				this.foodsScroll = new BScroll('.foods-wrapper', {
					click: true, // 允许better-scroll列表上的点击事件
					probeType: 3 // 让better-scroll监听scroll事件
				})
				this.foodsScroll.on('scroll', (pos) => {
					this.scrollY = Math.abs(Math.round(pos.y))
				})
			},
			_calculateHeight() { // 计算每个列表的高度，累加，组成递增数组。用在计算属性
				let foodList = this.$refs.foodsWapper.querySelectorAll('.food-list-hook')
				let height = 0
				this.listHeight.push(height)
				for (let i = 0; i < foodList.length; i++) {
					height += foodList[i].clientHeight
					this.listHeight.push(height)
				}
			}
		},
		components: {
			icon: icon,
			shopcart: shopcart,
			cartcontrol: cartcontrol,
			food: food
		}
	}
</script>

<style lang="less">
	// @import "../../common/css/index.less";
	.goods{
		display: flex;position: absolute;width:100%;top:174px;bottom:46px;overflow:hidden;
		.menu-wrapper{
			flex: 0 0 80px;width:80px;background-color: #f3f5f7;
			.menu-item{
				display: table;height:54px;width: 56px;line-height: 14px;padding:0 12px;
				&.current{
					position: relative;z-index: 10;margin-top:-1px;font-weight: 700;background: #fff;
					.text{.border-none()}
				}
				.icon-box{
					display: inline-block;margin-right: 2px;width:12px;height:12px;
				}
				.text{
					display: table-cell;width:56px;vertical-align: middle;.border-1px(rgba(7,17,27,0.1));font-size: 12px;
					span{font-size: 12px;}
				}
			}
		}
		.foods-wrapper{
			flex:1;
			.title{
				padding-left:14px;height:26px;line-height: 26px;border-left:2px solid #d9dde1;font-size: 12px;color:rgb(147,153,159);background: #f3f5f7;
			}
			.food-item{
				display: flex;margin:18px;padding-bottom:18px;.border-1px(rgba(7,17,27,0.1));
				&:last-child{margin-bottom:0;.border-none();}
				.icon{flex: 0 0 57px;margin-right:10px}
				.content{
					flex:1;
					.name{margin: 2px 0 8px;height:14px;line-height: 14px;font-size: 14px;color:rgb(7,17,27);}
					.desc,.extra{line-height: 10px;font-size: 10px;color:rgb(147,153,159);}
					.desc{margin-bottom: 8px;line-height: 12px;}
					.extra{
						.count{margin-right: 12px;}
					}
					.price{
						font-weight: 700;line-height: 24px;
						.now{margin-right: 8px;font-size: 14px;color:rgb(240,20,20);}
						.old{font-size: 10px;text-decoration: line-through;color:rgb(147,153,159);}
					}
					.cartcontral-wrapper{
						position: absolute;right:0;bottom:12px;
					}
				}
			}
		}
	}
</style>
