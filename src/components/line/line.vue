<template>
	<div class="line-title">
		<div class="line"></div>
		<div class="text"><slot></slot></div>
		<div class="line"></div>
	</div>
</template>

<script>
	export default{}
</script>

<style lang='less'>
	.line-title{
		display: flex;width:80%;margin:0 auto;margin:28px auto 40px auto;
		.line{flex: 1;position: relative; top: -6px;border-bottom: 1px solid rgba(255, 255, 255, 0.2);}
		.text{padding: 0 12px;font-weight: 700;font-size: 14px;}
	}
</style>
