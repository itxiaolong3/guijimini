<template>
	<view>
		<view class="choosegood" v-for="(product,index) in detailgoodlist" :key="index">
			<view class="choosegoodimg">
				<image  class="uni-product-image" :src="product.productImage"></image>
			</view>
			<view class="desc">
				<view>{{product.productName}}</view>
				<view class="price">货架：{{product.floor}}</view>
			</view>
			<view class="nums" v-if="product.inNumber">上货数量：x{{product.inNumber}}</view>
			<view class="nums" v-if="product.outNumber">下架数量：x{{product.outNumber}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detailgoodlist:[]
			}
		},
		methods: {
			async getsqrecordgood(identifier){
				let info= await this.$apis.getsqrecordgood({recordIdentifier:identifier});
				this.detailgoodlist=info.data;
			},
		},
		onLoad(option) {
			console.log(option.identifier,'传过来')
			this.getsqrecordgood(option.identifier)
			
		}
		
	}
</script>

<style lang="scss">
.choosegood{
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 20rpx 1px;
	}
	.desc{
		margin-left: -100rpx;
	}
	.price,.nums{
		color: #848484;
		padding-top: 20rpx;
	}
	.choosegoodimg image{
		width: 140rpx;
		height: 160rpx;
	}
</style>
