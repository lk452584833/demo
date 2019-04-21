<template>
	<div class="shopcart-warpper">
		<div class="shopcart">
			<div class="content" @click="toggleList">
				<div class="content-left">
					<div class="logo-wrapper">
						<div class="logo" :class="{'hightlight':totalCount>0}">
							<i class="icon-shopping_cart" :class="{'hightlight':totalCount>0}"></i>
						</div>
						<div class="num" v-show="totalCount>0">{{totalCount}}</div>
					</div>
					<div class="price" :class="{'hightlight':totalPrice>0}">¥{{totalPrice}}元</div>
					<div class="desc">另需配送费¥{{deliveryPrice}}元</div>
				</div>
				<div class="content-right" @click.stop.prevent="pay">
					<div class="pay" :class="payClass">{{payDesc}}</div>
				</div>
			</div>
			<div class="ball-container">
				<transition-group name="drop" tag="div"
				v-on:before-enter="beforeEnter"
				v-on:enter="enter"
				v-on:after-enter="afterEnter"
				>
					<div v-for="(ball,index) in balls" v-show="ball.show" :key="'ball'+index" class="ball">
						<div class="inner inner-hook"></div>
					</div>
				</transition-group>
			</div>
			<transition name="fold">
				<div class="shopcart-list" v-show="listShow">
					<div class="list-header">
						<h1 class="title">购物车</h1>
						<span class="empty" @click="empty">清空</span>
					</div>
					<div class="list-content" ref="listContent">
						<ul>
							<li class="food" v-for="(food,index) in sellectFoods" :key="index">
								<span class="name">{{food.name}}</span>
								<div class="price">
									<span>¥{{food.price*food.count}}</span>
								</div>
								<div class="cartcontral-wrapper">
									<cartcontrol :food="food"></cartcontrol>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</transition>
		</div>
		<transition name="fade">
			<div class="list-mask" @click="hideList" v-show="listShow"></div>
		</transition>
	</div>
</template>

<script>
	// npm install velocity-animate@beta
	// import Velocity from 'velocity-animate'
	import BScroll from 'better-scroll'
	import cartcontrol from '../../components/cartcontrol/cartcontrol'
	export default {
		props: {
			sellectFoods: {
				type: Array,
				default() {
					return []
				}
			},
			deliveryPrice: {
				type: Number,
				default: 0
			},
			minPrice: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				balls: [{show: false}, {show: false}, {show: false}, {show: false}, {show: false}],
				dropBalls: [],
				fold: true // 购物车折叠
			}
		},
		computed: {
			totalPrice() {
				let total = 0
				this.sellectFoods.forEach((food) => {
					total += food.price * food.count
				})
				return total
			},
			totalCount() {
				let count = 0
				this.sellectFoods.forEach((food) => {
					count += food.count
				})
				return count
			},
			payDesc() {
				if (this.totalPrice === 0) {
					return '¥' + this.minPrice + '元起送'
				} else if (this.totalPrice < this.minPrice) {
					let les = this.minPrice - this.totalPrice
					return '还差¥' + les + '元起送'
				} else {
					return '去结算'
				}
			},
			payClass() {
				if (this.totalPrice < this.minPrice) {
					return 'not-enough'
				} else {
					return 'enough'
				}
			},
			listShow() { // 计算属性值提供getter 只读。所以想更改，就要用set方法 或者监听listShow做变化
				if (!this.totalCount) { // this.fold 不直接用在 v-show 上面 是因为 当count 为0时不显示 。需要计算一下
					return false
				}
				let show = !this.fold
				return show
			}
		},
		methods: {
			// 组件cartcontrol 里面addCart() 点击事件 每次点击才会触发drop 并记录dropBlls
			// 每次点击事件只会调用一个小球，如果之前有小球被调用，继续循环查找下一个未被使用的小球并使用，然后return 结束循环
			drop(el) {
				for (let i = 0; i < this.balls.length; i++) {
					let ball = this.balls[i]
					if (!ball.show) { // 修改ball.show同时给当前ball[i]
						ball.show = true
						ball.el = el // 设置当前小球的el属性为一个dom对象
						this.dropBalls.push(ball) // 对象添加到dropBalls(对象是通过地址引用)
						return
					}
				}
			},
			beforeEnter(el) {
				let count = this.balls.length
				while (count--) {
					let ball = this.balls[count]
					if (ball.show) {
						let react = ball.el.getBoundingClientRect()
						let x = react.left - 32
						let y = -(window.innerHeight - react.top - 22)
						el.style.display = ''
						el.style.webkitTransform = `translate3d(0,${y}px,0)`
						el.style.transform = `translate3d(0,${y}px,0)`
						let inner = el.getElementsByClassName('inner-hook')[0]
						inner.style.webkitTransform = `translate3d(${x}px,0,0)`
						inner.style.transform = `translate3d(${x}px,0,0)`
					}
				}
			},
			enter(el) {
/* eslint-disable no-new */
// let rf = el.offsetHeight
				this.$nextTick(() => {
					el.style.webkitTransform = 'translate3d(0,0,0)'
					el.style.transform = 'translate3d(0,0,0)'
					let inner = el.getElementsByClassName('inner-hook')[0]
					inner.style.webkitTransform = 'translate3d(0,0,0)'
					inner.style.transform = 'translate3d(0,0,0)'
					// el.addEventListener('transitioned', done)
				})
			},
			afterEnter(el) {
				// 当前小球的动画结束(1个小球运行时间为0.4s)。初始化小球，之后再点击，循环的时候会找到这个小球，继续触发动画。
				let ball = this.dropBalls.shift() // 删除this.dropBalls 第一个元素，并传递 这个元素 的地址
				if (ball) { // ball 指向 el对象的地址
					ball.show = false
					el.style.display = 'none'
				}
			},
			toggleList() {
				if (!this.totalCount) {
					return
				}
				this.fold = !this.fold
			},
			hideList() {
				this.fold = true
			},
			empty() { // 清空购物车
				this.sellectFoods.forEach((food) => {
					food.count = 0
				})
			},
			pay() {
				if (this.totalPrice < this.minPrice) {
					return
				}
				console.log('支付' + this.totalPrice + '元')
			}
		},
		watch: {
			listShow() { // 监听listShow
				if (!this.totalCount) {
					this.fold = true
					return false
				}
				let show = !this.fold
				if (show) {
					this.$nextTick(() => {
						if (!this.scroll) {
							this.scroll = new BScroll(this.$refs.listContent, {
								click: true
							})
						} else {
							this.scroll.refresh()
						}
					})
				}
			}
		},
		components: {
			cartcontrol: cartcontrol
		}
	}
</script>

<style lang="less">
	// @import "../../common/css/index.less";
	.shopcart-warpper{
		.shopcart{
			position: fixed;left:0;bottom:0;width:100%;z-index: 100;height:48px;
			.content{
				display: flex;background:#000;
				.content-left{
					flex: 1;
					.logo-wrapper{
						display: inline-block;position: relative;top:-10px;margin:0 12px;padding:6px;width:56px;height:56px;box-sizing: border-box;vertical-align: top;border-radius: 50%;background: #141d27; text-align: center;
						.logo{
							width:100%;height:100%;border-radius: 50%;background: #2b343c;
							&.hightlight{background: rgb(0,160,220);}
							i{
								line-height: 44px;font-size: 24px;color: #80858a;
								&.hightlight{color:#fff;}
							}
						}
						.num{position: absolute;top:0;right:0;width:24px;height: 16px;line-height: 16px;text-align: center;border-radius: 16px;font-size: 9px;font-weight: 700;color:#fff;background: rgb(240,20,20);box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4);}
					}
					.price{
						display: inline-block;vertical-align: top;margin-top:12px;line-height: 24px;padding-right: 12px;box-sizing: border-box;border-right: 1px solid rgba(255,255,255,0.1);font-size: 16px;font-weight: 700;color:rgba(255,255,255,0.4);
						&.hightlight{color:#fff;}
					}
					.desc{display: inline-block;vertical-align: top;margin:12px 0 0 12px;line-height: 24px;color:rgba(255,255,255,0.4);font-size: 10px;}
				}
				.content-right{
					flex:0 1 105px;
					.pay{
						height: 48px;line-height: 48px;text-align: center;font-size: 12px;font-weight: 700;color:rgba(255,255,255,0.4);background: #2b333b;
						&.not-enough{background: #2b333b;}
						&.enough{background: #00b43c;color:#fff;}
					}
				}
			}
			.ball-container{
				.ball{
					position: fixed;left:32px;bottom:22px;z-index: 200;
					&.drop-enter-active,&.drop-leave-active{
						transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
						.inner{
							transition: all 0.4s linear;
						}
					}
					.inner{
						width:16px;height:16px;border-radius: 50%;background: rgb(0, 160, 200)
					}
				}
			}
			.shopcart-list{
				position: absolute;left:0;top:0;z-index: -1;width:100%;transform: translate3d(0, -100%, 0);
				&.fold-enter-active{
					transition: all 0.5s;
				}
				&.fold-leave-active{
					transition: all 0.5s;transform: translate3d(0,0,0);
				}
				&.fold-enter,&fold-leave-to{
					transform: translate3d(0,0,0);
				}
				.list-header{
					height: 40px;line-height: 40px;padding:0 18px;background: #f3f5f7;border-bottom: 2px solid rgba(7,17,27,0.1);
					.title{float:left;font-size: 14px;color:rgb(7,17,27);}
					.empty{float:right;font-size: 12px;color:rgb(0,160,220);}
				}
				.list-content{
					padding:0 18px;max-height: 217px;overflow: hidden;background: #fff;
					.food{
						position: relative;padding:12px 0;box-sizing: border-box;.border-1px(rgba(7,17,27,0.1));
						.name{line-height: 24px;font-size: 14px;color:rgb(7,17,27);}
						.price{position: absolute;right:90px;bottom:12px;line-height: 24px;font-size: 14px;font-weight: 700;color:rgb(240,20,20);}
						.cartcontral-wrapper{position: absolute;right:0;bottom: 6px;}
					}
				}
			}
		}
		.list-mask{
			position: fixed;left:0;top:0;width:100%;height:100%;z-index: 40;backdrop-filter:blur(10px);background: rgba(7,17,27,0.6);
			&.fade-enter-active,&.fade-leave-active{
				transition: all 0.5s;opacity: 1;
			}
			&.fade-enter,&.fade-leave{
				opacity: 0;background: rgba(7,17,27,0);
			}
		}
	}
</style>
