<template>
	<view>
		<view class="main" style="background:#FFF; padding:20rpx;">
		<rich-text :nodes="article"></rich-text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type:2,
				article: '<div>无数据</div>'
			}
		},
		onLoad(option) {
			this.getxieyi(this.type);
		},
		methods: {
			async getxieyi(type){
				let info= await this.$apis.xieyi({type:type});
				this.article=info.data.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ');
			}
		}
	}
</script>

<style lang="scss">
	.main{
		color: #808080;
		font-size: 30rpx;
	}
</style>
