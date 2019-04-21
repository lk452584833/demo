<template>
	<div><span class="icon" :class="backClass"  ></span></div>
</template>

<script>
	export default{
		props: ['num', 'cls'],
		computed: {
			backClass() {
				return (this.cls ? this.cls : '') + ' icon-style' + (this.num ? this.num : 1)
			}
		}
	}
</script>

<style lang="less">
	// @import "../../common/css/index.less";
	.icon{
		display: inline-block;vertical-align: top;width:100%;height:100%;background-size: 100% 100%;background-repeat: no-repeat;
	}
	.icon-style1{
		&.decrease{.bg-image('/../decrease_1');}
		&.discount{.bg-image('/../discount_1');}
		&.guarantee{.bg-image('/../guarantee_1');}
		&.invoice{.bg-image('/../invoice_1');}
		&.special{.bg-image('/../special_1');}
	}
	.icon-style2{
		&.decrease{.bg-image('/../decrease_2');}
		&.discount{.bg-image('/../discount_2');}
		&.guarantee{.bg-image('/../guarantee_2');}
		&.invoice{.bg-image('/../invoice_2');}
		&.special{.bg-image('/../special_2');}
	}
	.icon-style3{
		&.decrease{.bg-image('/../decrease_3');}
		&.discount{.bg-image('/../discount_3');}
		&.guarantee{.bg-image('/../guarantee_3');}
		&.invoice{.bg-image('/../invoice_3');}
		&.special{.bg-image('/../special_3');}
	}
	.icon-style4{
		&.decrease{.bg-image('/../decrease_4');}
		&.discount{.bg-image('/../discount_4');}
		&.guarantee{.bg-image('/../guarantee_4');}
		&.invoice{.bg-image('/../invoice_4');}
		&.special{.bg-image('/../special_4');}
	}
</style>
