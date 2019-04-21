<template>
	<div class="seller" ref="seller">
		<div class="seller-content">
			<div class="overview">
				<h1 class="title">{{seller.name}}</h1>
				<div class="des">
					<star :size="36" :score="seller.score"></star>
					<span class="text">({{seller.ratingCount}})</span>
					<span class="text">月售{{seller.sellCount}}单</span>
				</div>
				<ul class="remark">
					<li class="block">
						<h2>起送价</h2>
						<div class="content">
							<span class="stress">{{seller.minPrice}}</span>元
						</div>
					</li>
					<li class="block">
						<h2>商家配送</h2>
						<div class="content">
							<span class="stress">{{seller.deliveryPrice}}</span>元
						</div>
					</li>
					<li class="block">
						<h2>评价配送时间</h2>
						<div class="content">
							<span class="stress">{{seller.deliveryTime}}</span>分钟
						</div>
					</li>
				</ul>
				<div class="favorite" @click="toggleFavorite">
					<span class="icon-favorite" :class="{'active':favorite}"></span>
					<span class="text">{{favoriteText}}</span>
				</div>
			</div>
			<split></split>
			<div class="bulletin">
				<h1 class="title">公告与活动</h1>
				<div class="content-wrapper">
					<p class="content">{{seller.bulletin}}</p>
				</div>
				<div class="supports" v-show="seller.supports && seller.supports.length > 0">
					<ul>
						<li v-for="(support,index) in seller.supports" :key="index" class="support-item">
							<icon class="support-icon" :cls="classMap[support.type]" :num="3"></icon>
							<span class="text">{{support.description}}</span>
						</li>
					</ul>
				</div>
			</div>
			<split v-show="seller.pics && seller.pics.length > 0"></split>
			<div class="seller-pics" v-show="seller.pics && seller.pics.length > 0">
				<h1 class="title">商家实景</h1>
				<div class="pic-wapper" ref="pics">
					<ul class="pic-list" ref="piclist">
						<li class="pic-item" v-for="(pic,index) in seller.pics" :key="index">
							<img :src="pic" alt="" width="120" height="90">
						</li>
					</ul>
				</div>
			</div>
			<split></split>
			<div class="info">
				<h1 class="title">商家信息</h1>
				<div class="info-wapper">
					<ul>
						<li v-for="(info,index) in seller.infos" :key="index" class="info-item">{{info}}</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {saveToLocal, loadFromLocal} from '../../common/js/store.js'
	import BScroll from 'better-scroll'
	import star from '../../components/star/star'
	import split from '../../components/split/split'
	import icon from '../../components/icon/icon'
	export default{
		props: {
			seller: {
				type: Object
			}
		},
		data() {
			return {
				favorite: (() => { // id, key, def
					return loadFromLocal(this.seller.id, 'favorite', false)
				})()
			}
		},
		created() {
			this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
		},
		computed: {
			favoriteText() {
				return this.favorite ? '已收藏' : '收藏'
			}
		},
		mounted() {
			this.$nextTick(function() {
				// 代码保证 this.$el 在 document 中
				this._initScroll()
				this._initPicScroll()
			})
		},
		methods: {
			_initScroll() {
				this.$nextTick(function() {
					if (!this.scroll) {
						this.scroll = new BScroll(this.$refs.seller, {
							click: true
						})
					} else {
						this.scroll.refresh()
					}
				})
			},
			_initPicScroll() {
					if (this.seller.pics) {
						const picwidth = 120
						const picmr = 6
						const _with = (picwidth + picmr) * this.seller.pics.length - picmr
						this.$refs.piclist.style.width = _with + 'px'
						this.$nextTick(function() {
							if (!this.picscroll) {
								this.picscroll = new BScroll(this.$refs.pics, {
									click: true,
									scrollX: true,
									eventPassthrouugh: 'vertical'
								})
							} else {
								this.picscroll.refresh()
							}
						})
					}
			},
			toggleFavorite() {
				this.favorite = !this.favorite
				saveToLocal(this.seller.id, 'favorite', this.favorite)
			}
		},
		watch: {
			seller() {
				this._initScroll()
				this._initPicScroll()
			}
		},
		components: {
			star: star,
			split: split,
			icon: icon
		}
	}
</script>

<style lang="less">
	.seller{
		position:absolute;top:174px;left:0;bottom:0;width:100%;overflow:hidden;
		.seller-content{
			h1.title{margin-bottom: 8px;line-height: 14px;color:rgb(7,17,27);font-size: 14px;}
			.overview{
				padding: 18px;
				.des{
					padding-bottom: 18px;line-height: 18px;.border-1px(rgba(7,17,27,0.1));font-size: 0;
					.star{display: inline-block;margin-right: 8px;vertical-align: top;}
					.text{display: inline-block;margin-right: 12px;vertical-align: top;font-size: 10px;color:rgb(77,85,93);}
				}
				.remark{
					display: flex;padding-top:18px;
					.block{
						flex:1;text-align: center;border-right: 1px solid rgba(7,17,27,0.1);
						&:last-child{border:none;}
						h2{margin-bottom: 4px;line-height: 10px;font-size: 10px;color:rgb(147,153,159);}
						.content{
							line-height: 24px;font-size: 10px;color:rgb(7,17,27);
							.stress{font-size: 24px;}
						}
					}
				}
				.favorite{
					position: absolute;right:11px;top:18px;text-align: center;width:50px;
					.icon-favorite{
						display: block;margin-bottom: 4px;font-size: 24px;line-height:24px;color:#d4d6d9;
						&.active{color:rgb(240,20,20);}
					}
					.text{font-size: 10px;line-height: 10px;color:rgb(77,85,93)}
				}
			}
			.bulletin{
				padding: 18px 18px 0 18px;
				.content-wrapper{
					padding: 0 12px 16px 12px;font-size: 12px;line-height: 28px;.border-1px(rgba(7,17,27,0.1));
					p{color:rgb(240,20,20);}
				}
				.supports{
					font-size: 0;
					.support-item{
						padding:16px 12px;.border-1px(rgba(7,17,27,0.1));
						&:last-child{.border-none()}
						.support-icon{
							display: inline-block;width:16px;height:16px;margin-right: 6px;vertical-align: top;
						}
						.text{
							display: inline-block;vertical-align: top;font-size: 12px;line-height: 16px;color:rgb(7,17,27);
						}
					}
				}
			}
			.seller-pics{
				padding:18px;
				.pic-wapper{
					width:100%;overflow: hidden;white-space: nowrap;
					.pic-list{
						font-size: 0;
						.pic-item{
							display: inline-block;margin-right: 6px;width:120px;height:90px;
							&:last-chld{margin-right: 0;}
						}
					}
				}
			}
			.info{
				padding:18px;
				.title{padding-bottom:12px;margin-bottom:0;.border-1px(rgba(7,17,27,0.1));}
				.info-item{
					padding:16px 12px;font-size: 12px;line-height: 16px;color:rgb(7,17,27);.border-1px(rgba(7,17,27,0.1));
					&:last-child{.border-none();}
				}
			}
		}
	}
</style>
