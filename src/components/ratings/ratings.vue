<template>
	<div class="ratings" ref='ratings'>
		<div class="ratings-content">
			<div class="overview">
				<div class="overview-left">
					<h1 class="score">{{seller.score}}</h1>
					<div class="title">综合得分</div>
					<div class="rank">高于周边商家{{seller.rankRate}}%</div>
				</div>
				<div class="overview-right">
					<div class="score-wrapper">
						<span class="title">服务态度</span>
						<star :size='36' :score="seller.serviceScore"></star>
						<span class="score">{{seller.serviceScore}}</span>
					</div>
					<div class="score-wrapper">
						<span class="title">商品评分</span>
						<star :size='36' :score="seller.foodScore"></star>
						<span class="score">{{seller.foodScore}}</span>
					</div>
					<div class="delivery-wrapper">
						<span class="title">送达时间</span>
						<span class="delivery">{{seller.deliveryTime}}分钟</span>
					</div>
				</div>
			</div>
			<split></split>
			<ratingselect :ratings="ratings" :selectType.sync="selectType" :onlyContent.sync="onlyContent" :desc="desc"></ratingselect>
			<div class="rating-wrapper">
				<ul>
					<li v-for="(rating,index) in ratings" v-show="needShow(rating.rateType,rating.text)" class="rating-item" :key="index">
						<div class="avatar"><img :src="rating.avatar" alt="" width="28" height="28"></div>
						<div class="content">
							<h1 class="name">{{rating.username}}</h1>
							<div class="star-wrapper">
								<star :size="24" :score="rating.score"></star>
								<span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
							</div>
							<p class="text">{{rating.text}}</p>
							<div class="recommend " v-show="rating.recommend && rating.recommend.length">
								<span class="icon-thumb_up"></span>
								<span v-for="(item,index) in rating.recommend" :key="index" class="item">{{item}}</span>
							</div>
							<div class="time">
								{{rating.rateTime | formatDate}}
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import BScroll from 'better-scroll'
	import formatDate from '../../common/js/date.js'
	import star from '../../components/star/star'
	import split from '../../components/split/split'
	import ratingselect from '../../components/ratingselect/ratingselect'
	const ERROR_OK = 0
	const ALL = 2
	export default{
		props: {
			seller: {
				type: Object
			}
		},
		data() {
			return {
				ratings: [],
				showFlag: false,
				selectType: ALL,
				onlyContent: false,
				desc: {
					all: '全部',
					positive: '满意',
					negative: '不满意'
				}
			}
		},
		created() {
			this.$http.get('/api/ratings').then((response) => {
				response = response.body
				if (response.errno === ERROR_OK) {
					this.ratings = response.data
					this.$nextTick(function() {
						if (!this.scroll) {
							this.scroll = new BScroll(this.$refs.ratings, {
								click: true
							})
						} else {
							this.scroll.refresh()
						}
					})
				}
			})
		},
		methods: {
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
					console.log('father know seletType change')
					this.scroll.refresh()
				})
			},
			onlyContent() {
					this.$nextTick(function() {
					console.log('father know onlyContent change')
					this.scroll.refresh()
				})
			}
		},
		filters: {
			formatDate(time) {
				let date = new Date(time)
				return formatDate(date, 'yyyy-MM-dd hh:mm')
			}
		},
		components: {
			star: star,
			ratingselect: ratingselect,
			split: split
		}
	}
</script>

<style lang="less">
	.ratings{
		position: absolute;top:174px;bottom:0;width:100%;overflow: hidden;
		.overview{
			display: flex;padding:18px 0;
			.overview-left{
				flex:0 0 137px;padding-bottom: 6px;width:137px;border-right: 1px solid rgba(7,17,27,0.4);text-align: center;
				.score{margin-bottom: 6px;line-height: 28px;font-size: 24px;color:rgb(255,133,0);}
				.title{margin-bottom: 8px;line-height: 12px;font-size: 12px;color:rgb(7,17,27);}
				.rank{line-height: 10px;font-size: 10px;color:rgb(147,153,159);}
				@media screen and (min-width:320px) and (max-width:375px) {
					flex:0 0 112px;
				}
			}
			.overview-right{
				flex:1;padding:6px 0 6px 24px;
				@media screen and (min-width:320px) and (max-width:375px) {
					padding-left:6px;
				}
				.score-wrapper{
					margin-left: 8px;font-size: 0;
					.title{font-size: 12px;color:rgb(7,17,27);line-height: 18px;}
					.star{display: inline-block;margin:0 12px;vertical-align: top;}
					.score{display: inline-block;line-height: 18px;vertical-align: top;font-size: 12px;color:rgb(255,153,0);}
				}
				.delivery-wrapper{
					margin-left: 8px;font-size: 0;
					.title{line-height: 18px;font-size: 12px;color:rgb(7,17,27);}
					.delivery{margin-left: 12px;font-size: 12px;color:rgb(147,153,159);}
				}
			}
		}
		.rating-wrapper{
			padding:0 18px;
			.rating-item{
				display: flex;padding: 18px;.border-1px(rgba(7,17,27,0.1));
				&:last-child{.border-none();}
				.avatar{
					flex: 0 0 28px;width:28px;margin-right:12px;
					img{border-radius: 50%;}
				}
				.content{
					position: relative;flex:1;
					.name{font-size: 10px;line-height: 12px;color:rgb(7,17,27);margin-bottom: 4px;}
					.star-wrapper{
						margin-bottom: 6px;font-size: 0;
						.star{
							display: inline-block;vertical-align: top;margin-right: 6px;
						}
						.delivery{
							display: inline-block;vertical-align: top;font-size: 10px;line-height: 12px;color:rgb(147,153,159);
						}
					}
					.text{line-height: 18px;color:rgb(7,17,27);font-size: 12px;}
					.recommend{
						line-height: 16px;font-size:0;margin-top: 8px;
						.icon-thumb_up,.item{
							display: inline-block;margin:0 8px 4px 0;font-size: 9px;
						}
						.icon-thumb_up{color:rgb(0,160,220);}
						.item{padding: 0 6px;border:1px solid rgba(7,17,27,0.1);border-radius: 1px;color:rgb(147,153,159);background-color: #fff;}
					}
					.time{
						position: absolute;top:0;right:0;line-height: 12px;font-size: 10px;color:rba(7,17,227);
					}
				}
			}
		}
	}
</style>
