<template>
  <div class="header">
		<div class="content-wrapper">
			<div class="avater">
				<img v-bind:src="seller.avatar" width="64" height="64" alt="">
			</div>
			<div class="content">
				<div class="title">
					<span class="brand"></span>
					<span class="name">{{ seller.name }}</span>
				</div>
				<div class="description">
					{{ seller.description }}/{{seller.deliveryTime}}分钟送达
				</div>
				<div v-if="seller.supports" class="support">
					<icon class="icon-box" :num="1" :cls="classMap[seller.supports[0].type]"></icon>
					<span class="text">{{seller.supports[0].description}}</span>
				</div>
			</div>
			<div v-if="seller.supports" class="support-count" @click="showDetail">
				<span class="count">{{seller.supports.length}}个</span>
				<i class="icon-keyboard_arrow_right"></i>
			</div>
		</div>
		<div class="bulletin-wrapper" @click="showDetail">
			<span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
			<i class="icon-keyboard_arrow_right"></i>
		</div>
		<div class="background">
			<img :src="seller.avatar" alt="" width="100%" height="100%">
		</div>
		<transition name="fade">
			<div class="detail" v-show="detailShow" >
				<div class="detail-wrapper clearfix">
					<div class="detail-main">
						<h1 class="name">{{seller.name}} {{GetSellerStar}}分</h1>
						<div class="setstar">
							评分: <input type="text" :placeholder="GetSellerStar" ref="updateage" class="starnum">
							<span @click="updateAge" class="btn">提交</span>
						</div>
						<div class="star-wrapper">
							<star :size="48" :score="GetSellerStar"></star>
						</div>
						<fline>优化信息</fline>
						<ul v-if="seller.supports" class="supports">
							<li class="support-item" v-for="(item,index) in seller.supports" :key='index'>
								<icon class="icon-box" :num="2" :cls="classMap[seller.supports[index].type]"></icon>
								<span class="text">{{ seller.supports[index].description }}</span>
							</li>
						</ul>
						<fline>商家公告</fline>
						<div class="bulletin">
							<p>{{seller.bulletin}}</p>
						</div>
					</div>
				</div>
				<div class="detail-close" @click="hideDetail"><i class="icon-close"></i></div>
			</div>
		</transition>
</div>
</template>

<script>
	import {mapState, mapGetters, mapActions} from 'vuex'
	import star from '../../components/star/star'
	import fline from '../../components/line/line'
	import icon from '../../components/icon/icon'
	export default{
		props: {
			seller: {
				type: Object
			}
		},
		data() {
			return {
				detailShow: false
			}
		},
		computed: {
			...mapState({ // 直接获取属性
				GetSellerStar: state => state.sellerInfo.star
			}),
			...mapGetters('sellerInfo', { // 通过sellerInfo下getters里面的返回方法获取属性
				GetSellerName: 'getSellerName', // sellerInfo 映射
				GetSellerStarLen: 'getSellerStarLen'
				// GetSellerStar: 'getSellerStar'
			})
		},
		methods: {
			...mapActions('sellerInfo', [ // 调用sellerInfo 中的actions 中的setAge
				'setStar' // 注册方法
			]),
			updateAge() { // 处理逻辑层
				const star = this.$refs.updateage.value
				if (star) {
					if (star >= 0 && star <= this.GetSellerStarLen) {
						this.setStar(Number(Number(star).toFixed(1)))
						this.$nextTick(() => {
							this.$refs.updateage.value = this.GetSellerStar
						})
					} else {
						const words = `请输入0~${this.GetSellerStarLen}之间的评分`
						this.$_showBackMsg(words)
					}
				} else {
					this.$_showBackMsg('请输入评分再提交')
				}
			},
			showDetail() {
				this.detailShow = true
			},
			hideDetail() {
				this.detailShow = false
			}
		},
		created() {
			this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
		},
		components: {
			star: star,
			fline: fline,
			icon: icon
		}
	}
</script>

<style lang="less">
	// @import "../../common/css/index.less";
	.header{position:relative;color:#fff;background:rgba(7,17,25,0.5);overflow: hidden;
		.content-wrapper{position: relative;padding:24px 12px 18px 24px;font-size:0;
			.avater{display: inline-block;vertical-align: top;border-radius: 2px;overflow: hidden;}
			.content{display: inline-block;margin-left:16px;font-size:14px;
				.title{margin:2px 0 8px 0;
					.brand{display: inline-block;vertical-align: top;width:30px;height:18px;.bg-image('/../brand');background-size:30px 18px;background-repeat: no-repeat;}
					.name{margin-left:6px;font-size: 16px;line-height: 18px;font-weight: bold;}
				}
				.description{
					margin-bottom: 10px ;line-height: 12px;font-size: 12px;
				}
				.support{
					font-size: 0;
					.icon-box{
						display: inline-block;vertical-align: top;margin-right: 4px;width:12px;height:12px;vertical-align: top;
					}
					.text{line-height: 12px;font-size: 10px;}
				}
			}
			.support-count{
				position: absolute;right:12px;bottom:18px;padding:0 8px;height:24px;line-height: 24px;border-radius: 12px;background: rgba(0,0,0,0.2);text-align: center;
				.count{display: inline-block;font-size: 10px;line-height: 24px;}
				i{margin-left: 2px;line-height: 24px;font-size: 10px;}
			}
		}
		.bulletin-wrapper{
			position:relative;line-height: 28px;padding:0 22px 0 12px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;background: rgba(7,17,27,0.2);
			.bulletin-title{
				display:inline-block;margin-top:7px;vertical-align: top;width:22px;height:12px;.bg-image('/../bulletin');background-size: 22px 12px;background-repeat: no-repeat;
			}
			.bulletin-text{vertical-align: top;margin:0 4px;font-size: 10px;line-height: 28px;}
			i{position: absolute;right:12px;top:8px;font-size: 10px;}
		}
		.background{
			position: absolute;top:0;left:0;width:100%;height:100%;z-index: -1;filter:blur(10px);
		}
		.detail{
			position: fixed;z-index: 999;width:100%;height:100%;top:0;left:0;overflow: auto;background:rgba(7,17,25,0.8);
			&.fade-enter-active,&.fade-leave-active{transition: all 0.5s; backdrop-filter: blur(10px);}
			&.fade-enter,&.fade-leave-to{opacity: 0;background: rgba(7,17,27,0);}
			.detail-wrapper{
				min-height:100%;width:100%;
				.detail-main{
					padding-top: 64px;
					padding-bottom:64px;
					.name{line-height: 16px;text-align: center;font-size: 16px;font-weight: 700;}
					.star-wrapper{
						margin-top: 18px;padding:2px 0;text-align: center;
					}
					.setstar{
						margin: 10px ;text-align: center; font-size: 12px; line-height: 16px;
						.starnum{width:10%;line-height: 16px;height:16px;vertical-align: top;border-radius: 2px;text-indent: 5px;}
						.btn{padding:0 3px; background: #f3f5f7;border-radius: 2px;color:rgb(7,17,27) }
					}
					.title{
						display:flex;width:80%;margin:28px auto 40px auto;
						.line{flex:1;position: relative;top:-6px;border-bottom:1px solid rgba(255,255,255,0.2);}
						.text{padding:0 12px;font-weight: 700;font-size: 14px;}
					}
					.supports{
						width:80%;margin:0 auto;
						.support-item{
							padding:0 12px;margin-bottom:12px;font-size: 0;
							&:last-child{margin-bottom: 0;}
							.icon-box{
								display: inline-block;width:16px;height:16px;margin-right: 6px;vertical-align: top;
							}
							.text{font-size: 12px;line-height: 16px;}
						}
					}
					.bulletin{
						width:80%;margin:0 auto;
						p{padding:0 12px; line-height: 24px;font-size: 12px;}
					}
				}
			}
			.detail-close{
				position: relative;width:32px;height:32px;margin:-64px auto 0 auto;font-size: 32px;clear: both;
			}
		}
}
</style>
