<template>
	<view class="content">
		<view class="updown">
			<view class="item" @click="upgood">
				<view>
					<image src="../../../static/img/upgood.png"></image>
				</view>
				<view>
					上货
				</view>
			</view>
			<view class="item" @click="downgood">
				<view>
					<image src="../../../static/img/downgood.png"></image>
				</view>
				<view>
					卸货
				</view>
			</view>
		</view>
		<view class="other">
			<view class="item" @click="closedoor">
				关门
			</view>
			<view class="item" @click="showrecord">
				上货记录
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			async shclose(sn){
				let info= await this.$apis.shclose({sn:sn});
				if(info.code==1){
					uni.showToast({title: '已关门',duration: 2500,icon:'none'});
					uni.reLaunch({
						url:'../../../pages/index/index'
					})
				}else{
					uni.showToast({title: '手动关门失败：'+info.msg,duration: 3000,icon:'none'});
				}
			},
			async shopennew(sn,type){
				let openid=uni.getStorageSync('openid');
				uni.setStorageSync('shsn',sn)
				let info= await this.$apis.shopennew({sn:sn,openId:openid,type:type});
				if(info.code==1){
					uni.hideLoading();
					if(type==0){
						uni.reLaunch({url:'../upgood/upgoodnew?sn='+sn}) 
					}else{
						uni.reLaunch({url:'../downgood/downgoodnew?sn='+sn}) 
					}
					
				}else{
					uni.showToast({title: '开柜失败:'+info.msg,duration: 3000,icon:'none'});
				}
			},
			closedoor(){
				let t=this;
				let sn=uni.getStorageSync('shsn');
				uni.showModal({
				    title: '温馨提示',
				    content: '是否完成上下架操作进行关门？',
					confirmText:'确定关门',
				    success: function (res) {
				        if (res.confirm) {
				            uni.showLoading({
				            	title:'正在关门...'
				            })
							t.shclose(sn)
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			showrecord(){
				//uni.showToast({title: '点击查看记录',duration: 3000,icon:'none'});
				let getsn=uni.getStorageSync('shsn')
				uni.navigateTo({url:'../updownrecord/updownrecord?sn='+getsn})
			},
			upgood(){
				//旧模式
				// let getsn=uni.getStorageSync('shsn')
				// uni.navigateTo({url:'../upgood/upgood?sn='+getsn}) 

				uni.showLoading({
					title:'开柜中...'
				})
				let t=this;
				uni.scanCode({
					success:function(e){
						var getpath=e.path;
						var arr=getpath.split('=');
						t.shopennew(arr[1],0)
						//t.opendoor(getopenid,arr[1])
						console.log(arr[1],'扫码成功返回')
						
					},fail:function(e){
						console.log(e,'扫码失败返回')
						uni.hideLoading()
						uni.showToast({title: '开柜失败',duration: 3000,icon:'none'});
					}
				})
			},
			downgood(){
				//旧模式
				// let getsn=uni.getStorageSync('shsn')
				// uni.navigateTo({url:'../downgood/downgood?sn='+getsn}) 
				uni.showLoading({
					title:'开柜中...'
				})
				let t=this;
				uni.scanCode({
					success:function(e){
						var getpath=e.path;
						var arr=getpath.split('=');
						t.shopennew(arr[1],1)
						//t.opendoor(getopenid,arr[1])
						console.log(arr[1],'扫码成功返回')
						
					},fail:function(e){
						console.log(e,'扫码失败返回')
						uni.hideLoading()
						uni.showToast({title: '开柜失败',duration: 3000,icon:'none'});
					}
				})
			}
			
		},
		onLoad(option) {
			console.log(option.sn,'传过来')
			uni.setStorageSync('shsn',option.sn)
			
		}
	}
</script>

<style lang="scss">
.updown{
	display: flex;
	height: 300rpx;
	width:100%;
	justify-content:center;
	align-items:center;
	.item{
		width: 60%;
		height: 200rpx;
		border:1px #333333 solid;
		border-radius: 10rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin: 10rpx;
		image{
			width: 120rpx;
			height: 120rpx;
		}
	}
}
.other{
	display: flex;
	height: 300rpx;
	width:100%;
	justify-content:center;
	align-items:center;
	.item{
		width: 60%;
		height: 200rpx;
		border:1px #333333 solid;
		border-radius: 10rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin: 10rpx;
		
	}
}
</style>
