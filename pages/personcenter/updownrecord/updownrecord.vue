<template>
	<view>
		<!-- 记录列表 -->
		<view class="record-list">
			<view class="product-list">
				<view class="product" v-for="(item) in recordlist" :key="item.identifier" @tap="toGoods(item.identifier)">
					<view class="item">
						<view class="itemtop">
							<view>{{item.locationName}}</view>
							<view>{{item.deviceName}}</view>
						</view>
						<view class="itembottom">
							<view>{{item.phoneNumber}}</view>
							<view>{{item.updateTime}}</view>
						</view>
						
					</view>
				</view>
			</view>
			<view class="loading-text">{{loadingText}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				recordlist:[],
				loadingText:"正在加载...",
				isover:false,
				page:1,
				sn:1
			}
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
		    setTimeout(()=>{
				this.reload();
		        uni.stopPullDownRefresh();
		    }, 1000);
		},
		//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
		// onReachBottom(){
		// 	//uni.showToast({title: '触发上拉加载'});
		// 	if(this.isover){
		// 		this.loadingText="到底了";
		// 		return false;
		// 	}else{
		// 		let getpage=this.page;
		// 		this.page=getpage+1;
		// 		this.loadingText="正在加载...";
		// 		this.getsqrecord(this.sn,getpage+1)
		// 	}
		// },
		methods: {
			//获取上下货列表
			async getsqrecord(sn,page){
				let info= await this.$apis.getsqrecord({sn:sn,pageNumber:page});
				//this.recordlist=info.data;
				if(info.data.length<=9){
					this.isover=true;
				}else{
					let t=this;
				this.recordlist=info.data;
				
					//this.recordlist.concat(info.data);
					
				}
			},
			reload(){
				this.page=1;
				this.getsqrecord(this.sn,1)
			},
			toGoods(id){
				console.log(id,'得到ID')
			}
		},
		onLoad(option) {
			console.log(option.sn,'传过来')
			//this.sn=option.sn;
			//this.getsqrecord(option.sn,1)
			this.loadingText="到底了";
			this.getsqrecord(this.sn,1)
		}
	}
</script>

<style lang="scss">
.item{
	border-bottom:  1px #878ea3 solid;
	height: 120rpx;
	padding: 10rpx;
	
}
.loading-text{
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 60upx;
			color: #979797;
			font-size: 24upx;
		}
.itemtop{
		display: flex;
		justify-content: space-between;
	}
	.itembottom{
		display: flex;
		justify-content: space-between;
		color: #878ea3;
	}
</style>
