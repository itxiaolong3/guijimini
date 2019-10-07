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
				type:0,
				article: '<div>无数据</div>'
			}
		},
		onLoad(option) {
			let gettype = parseInt(option.type);
			this.type=gettype;
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
