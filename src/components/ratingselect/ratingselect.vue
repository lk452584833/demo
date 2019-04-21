<template>
	<div class="ratingselect">
		<div class="rating-type border-1px">
			<span @click="select(2)" class="block positive" :class="{'active':selectType === 2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
			<span @click="select(0)" class="block positive" :class="{'active':selectType === 0}">{{desc.positive}}<span class="count">{{positive.length}}</span></span>
			<span @click="select(1)" class="block negative" :class="{'active':selectType === 1}">{{desc.negative}}<span class="count">{{negative.length}}</span></span>
		</div>
		<div class="switch" @click="toggleContent" :class="{'on':onlyContent}">
			<span class="icon-check_circle"></span>
			<span class="text">只看内容评价</span>
		</div>
	</div>
</template>

<script>
	// 选择类型 所有2，正面0，负面1 更具数据中rateType
	const POSITIVE = 0
	const NEGATIVE = 1
	const ALL = 2
	export default{
		props: {
			ratings: {
				type: Array,
				default() {
					return []
				}
			},
			selectType: {
				type: Number,
				default: ALL
			},
			onlyContent: {
				type: Boolean,
				default: false
			},
			desc: {
				type: Object,
				default() {
					return {
						all: '全部',
						positive: '满意',
						negative: '不满意'
					}
				}
			}
		},
		methods: {
			// props 单向数据流
			// 1.派发事件,可以实现非父子组件之间通讯
			// 2.父组件使用.sync 进行双向绑定 (vue2.0+ 后不再是双向绑定,如果要进行双向绑定需要特殊处理)
			select(type) {
				// this.$root.eventHub.$emit('ratingtype.select', type)
				this.$emit('update:selectType', type)
			},
			toggleContent() {
				// this.$root.eventHub.$emit('content.toggle', !this.onlyContent)
				this.$emit('update:onlyContent', !this.onlyContent)
			}
		},
		computed: {
			positive() { // 根据数据里的rateType进行过滤
				return this.ratings.filter((rating) => {
					return rating.rateType === POSITIVE
				})
			},
			negative() {
				return this.ratings.filter((rating) => {
					return rating.rateType === NEGATIVE
				})
			}
		}
	}
</script>

<style lang="less">
	// @import "../../common/css/index.less";
	.ratingselect{
		.rating-type{
			padding:18px 0;margin:0 18px;.border-1px(rgba(7,17,27,0.1));font-size: 0;
			.block{
				display:inline-block;padding: 8px 12px;margin-right:8px;border-radius: 1px;color:rgb(77,85,93);font-size: 12px;line-height: 16px;
				&.active{color:#fff;}
				&.positive{
					background:rgba(0,160,220,0.2);
					&.active{background: rgb(0,160,220)}
				}
				&.negative{
					background:rgba(77,85,93,0.2);
					&.active{background:rgb(77,85,93);}
				}
				.count{font-size: 8px;margin-left: 2px;}
			}
		}
		.switch{
			padding: 12px 18px;
			line-height: 24px;
			border-bottom:1px solid rgba(7,17,27,0.1);
			color:rgb(147,153,159);
			font-size: 0;
			&.on{
				.icon-check_circle{
					color:#00c850
				}
			}
			.icon-check_circle{
				display: inline-block;
				margin-right: 4px;
				font-size: 24px;
				vertical-align: top;
			}
			.text{
				display: inline-block;
				font-size: 12px;
			}
		}
	}
</style>
