<template>
	<transition name="move">
		<div v-show='showFlag' class="food" ref='betterscoll'>
			<div class="food-content">
				<div class="img_header">
					<img :src="food.image" alt="">
					<div class="back" @click="hide"><i class="icon-arrow_lift"></i></div>
				</div>
				<div class="content">
					<h1 class="title">{{food.name}}</h1>
					<div class="detail">
						<span class="sell-count">月售{{food.sellCount}}份</span>
						<span class="rating">好评率{{food.rating}}%</span>
					</div>
					<div class="price">
						<span class="now">¥{{food.price}}</span><span v-show="food.oldPrice" class="old">¥{{food.oldPrice}}</span>
					</div>
					<div class="cartcontral-wrapper">
						<cartcontrol :food="food"></cartcontrol>
					</div>
					<transition name="fade">
						<div class="buy" @click.stop.prevent="addFirst" v-show="!food.count || food.count === 0">加入购物车</div>
					</transition>
				</div>
				<split v-show="food.info"></split>
				<div class="info" v-show="food.info">
					<h1 class="title">商品信息</h1>
					<p class="text">{{food.info}}</p>
				</div>
				<split></split>
				<div class="rating">
					<h1 class="title">商品评价</h1>
					<!-- .sync 父子组件数据双向绑定 -->
					<ratingselect :ratings="food.ratings" :selectType.sync="selectType" :onlyContent.sync="onlyContent" :desc="desc"></ratingselect>
					<div class="rating-wrapper">
						<ul v-show="food.ratings && food.ratings.length">
							<li v-show="needShow(rating.rateType, rating.text)" v-for='(rating,index) in food.ratings' class="rating-item" :key='index'>
								<div class="user">
									<span class="name">{{rating.username}}</span>
									<img :src="rating.avatar" alt="" class="avatar" width="12" height="12">
								</div>
								<div class="time" >{{rating.rateTime | formatDate}}</div>
								<p class="text">
									<span :class="{'icon-thumb_up':rating.rateType === 0,'icon-thumb_down':rating.rateType === 1}"></span>{{rating.text}}
								</p>
							</li>
						</ul>
						<div class="no-rating" v-show="!food.ratings"></div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	import Vue from 'vue'
	import BScroll from 'better-scroll'
	import cartcontrol from '../../components/cartcontrol/cartcontrol'
	import split from '../../components/split/split'
	import ratingselect from '../../components/ratingselect/ratingselect'
	import formatDate from '../../common/js/date.js'
	// 选择类型 所有2，正面0，负面1 更具数据中rateType
// 	const POSITIVE = 0
// 	const NEGATIVE = 1
	const ALL = 2
	export default{
		props: {
			food: {
				type: Object
			}
		},
		data() {
			return {
				showFlag: false,
				selectType: ALL,
				onlyContent: false,
				desc: {
					all: '全部',
					positive: '推荐',
					negative: '吐槽'
				}
			}
		},
		filters: {
			formatDate(time) {
				let date = new Date(time)
				return formatDate(date, 'yyyy-MM-dd hh:mm')
			}
		},
		methods: {
			show() { // 数据加载初始化
				this.showFlag = true
				this.selectType = ALL
				this.onlyContent = false
				this.$nextTick(function() {
					if (!this.scroll) {
						this.scroll = new BScroll(this.$refs.betterscoll, {
							click: true
						})
					} else {
						this.scroll.refresh()
					}
				})
			},
			hide() {
				this.showFlag = false
			},
			addFirst(event) { // 派发事件 eventHub 可以实现非父子组件通讯 $emit 实现父子组件通讯
				// this.$root.eventHub.$emit('cart-add', event.target)
				this.$emit('cartadd', event.target)
				Vue.set(this.food, 'count', 1)
			},
			needShow(type, text) {
				if (this.onlyContent && !text) {
					return false
				}
				if (this.selectType === ALL) {
					return true
				} else {
					return type === this.selectType
				}
			}
		},
		watch: {
			selectType() {
				this.$nextTick(function() {
					this.scroll.refresh()
				})
			},
			onlyContent() {
					this.$nextTick(function() {
					this.scroll.refresh()
				})
			}
		},
		components: {
			cartcontrol: cartcontrol,
			split: split,
			ratingselect: ratingselect
		}
	}
</script>

<style lang="less">
	// @import "../../common/css/index.less";
	.food{
		position: fixed;left:0;top:0;z-index: 30;width:100%;bottom:48px;background-color: #fff;transform: translate(0,0);
		&.move-enter-active,&.move-leave-active{
			transition:all 0.2s linear;transform: translate(0,0);
		}
		&.move-enter,&.move-leave-to{
			transform: translate(100%,0);
		}
		.img_header{
			.back{
				position: absolute;top:10px;left:0;
				i{display: block;padding:10px;font-size: 20px;color:#fff;}
			}
		}
		.content{
			padding: 18px;position: relative;
			.title{
				line-height: 14px;margin-bottom: 8px;font-size: 14px;font-weight: 700;color:rgb(7,17,27);
			}
			.detail{
				margin-bottom: 18px;line-height: 10px;font-size: 0;
				.sell-count,.rating{font-size: 10px;color:rgb(147,153,159);}
				.sell-count{margin-right:12px;}
			}
			.price{
				font-weight: 700;line-height: 24px;
				.now{margin-right: 8px;font-size: 14px;color:rgb(240,20,20);}
				.old{font-size: 10px;text-decoration: line-through;color:rgb(147,153,159);}
			}
			.cartcontral-wrapper{
				position: absolute;right:12px;bottom:12px;
			}
			.buy{
				position: absolute;right:18px;bottom:18px;z-index: 10;line-height: 24px;padding:0 12px;box-sizing: border-box;font-size: 10px;border-radius: 12px;color:#fff;background-color: rgb(0,160,220);
				&.fade-enter-active,&.fade-leave-active{
					transition: all 0.2s;opacity: 1;
				}
				&.fade-enter,&.fade-leave-to{
					opacity: 0;
				}
			}
		}
		.info{
			padding:18px;
			.title{
				line-height: 14px;margin-bottom: 6px;font-size: 14px;color:rgb(7,17,27);
			}
			.text{
				line-height: 24px;padding:0 8px;font-size: 12px;color:rgba(77,85,93);
			}
		}
		.rating{
			padding-top: 18px;
			.title{
				line-height: 14px;margin-left: 18px;font-size: 14px;color:rgb(7,17,27);
			}
			.rating-wrapper{
				padding: 0 18px;
				.rating-item{
					position: relative;padding: 16px 0;.border-1px(rgba(7,17,27,0.1));
					.user{
						position: absolute;right:0;top:16px;line-height: 12px;font-size: 0;
						.name{display: inline-block;margin-right: 6px;vertical-align: top;font-size: 10px;color:rgb(147,153,159);}
						.avatar{border-radius: 50%;}
					}
					.time{
						margin-bottom: 6px;line-height: 12px;font-size: 10px;color:rgb(147,153,159);
					}
					.text{
						line-height: 16px;font-size: 12px;color:rgb(7,17,27);
						.icon-thumb_down,.icon-thumb_up{
							margin-right: 4px;line-height: 16px;font-size: 12px;
						}
						.icon-thumb_up{color:rgb(0,160,220);}
						.icon-thumb_down{color:rgb(147,153,159);}
					}
				}
			}
		}
	}
</style>
