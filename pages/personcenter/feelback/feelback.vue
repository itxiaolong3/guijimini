<template>
	<view>
		<view class="tip">您的投诉或反馈：</view>
		<view class="textContent">
		        <textarea
		          name
		          id
		          cols="30"
		          rows="10"
		          maxlength="100"
		          placeholder="反馈内容:"
		          v-model="content"
		        ></textarea>
		        <view class="tips">{{content.length}}/100</view>
		 </view>
		<view class="btnContent">
		         <view
		           class="btn df"
		           @click="submit"
		         >提交</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content: "",
				showcan:false
			}
		},
		methods: {
			async feelback(openid,content){
				let info= await this.$apis.feelback({openid:openid,content:content});
				if(info.code==1){
					uni.showModal({
						title: '成功提示',
						content: info.msg,
						confirmText: '确定',
						showCancel:this.showcan,
						success: function(res) {
							if (res.confirm) {
								uni.navigateBack({
									delta:1
								})
							}
						}
					});
				}else{
					uni.showToast({title:info.msg,duration:1500,icon:'none'});
				}
			},
			submit(){
				let getopenid=uni.getStorageSync('openid')
				this.feelback(getopenid,this.content)
				console.log(this.content,'反馈内容')
			}
		}
	}
</script>

<style lang="scss">
.textContent {
      width: 86%;
      height: 380rpx;
      position: relative;
	  margin:20rpx;
      textarea {
        width: 100%;
        height: 100%;
        padding-top: 50rpx;
        padding-left: 50rpx;
        font-size: 30rpx;
        font-family: SourceHanSansCN-Regular;
        font-weight: 400;
        color: #000;
        border: 2rpx solid rgba(210, 210, 210, 1);
        border-radius: 10rpx;
      }

      textarea::-webkit-input-placeholder {
        /* WebKit browsers */
        font-size: 30rpx;
        font-family: SourceHanSansCN-Regular;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
      }
      .tips {
        position: absolute;
        right: 30rpx;
        bottom: 26rpx;
        font-size: 24rpx;
        font-family: SourceHanSansCN-Regular;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
      }
    }
	.btnContent {
	      padding: 0 40rpx;
	      width: 86%;
	      .btn {
	        height: 80rpx;
	        background: linear-gradient(
	          90deg,
	          rgba(58, 48, 207, 1),
	          rgba(65, 104, 238, 1)
	        );
	        border-radius: 40rpx;
	        margin-top: 110rpx;
	        font-size: 28rpx;
	        font-family: SourceHanSansSC-Regular;
	        font-weight: 400;
			display: flex;
			justify-content: center;
			align-items: center;
	        color: rgba(255, 255, 255, 1);
	      }
	    }
		.tip {
		      width: 100%;
		      margin: 26rpx;
		      text-align: left;
			  font-size: 28rpx;
			  color: #999999;
		}
</style>
