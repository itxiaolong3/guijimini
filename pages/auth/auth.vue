<template>
	<view>
	<view class="auth">
	  <image src="../../static/weixin.png" class="img" mode="aspectFill"></image>
	  <view class="title">微信授权页面</view>
	  <view class="describe">此页面是微信授权页面，点击下方按钮弹出授权或跳转页面</view>

	  <button class="btn" open-type="getUserInfo" v-if="canIUse" @getuserinfo="wxGetUserInfo" withCredentials="true">微信授权获取用户信息</button>
	  <navigator v-if="!canIUse" class="btn" url="/pages/auth/auth" open-type="reLaunch" hover-class="other-navigator-hover">已经授权点击调转</navigator>
	</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				canIUse: uni.canIUse('button.open-type.getUserInfo')
			}
		},
		methods: {
		  wxGetUserInfo() {
			  let t=this;
			  uni.login({
			    provider: 'weixin',
			    success: function (loginRes) {
			      // 获取用户信息
			      uni.getUserInfo({
			        provider: 'weixin',
			        success: function (infoRes) {
						console.log(infoRes,'所有信息');
			          console.log('用户昵称为：' + infoRes.userInfo.nickName);
			          console.log('用户头像：' + infoRes.userInfo.avatarUrl);
					  uni.login({
					  	success:function(e){
					  		t.savainfo(e.code,infoRes.userInfo.nickName,infoRes.userInfo.avatarUrl)
					  	}
					  })
			        }
			      });
			    }
			  });
			  // uni.getSetting({
			  // 	success:function(res){
					// console.log(res,'授权信息')
					// provider: 'weixin'
			  // 		if (res.authSetting["scope.userInfo"]) {
			  // 		  uni.reLaunch({
			  // 		    url:'../../pages/index/index'
			  // 		  })
			  // 		}
			  // 	}
			  // })
		  
		  },
		  async savainfo(code,nickname,headerimg){
		  	let info= await this.$apis.savainfo({code:code,nickname:nickname,headerimg:headerimg});
		  	if(info.code==1){
		  		uni.redirectTo(
		  		{url:"../../pages/index/index"}
		  		)
		  	}else{
		  		console.log('已登录')
		  	}
		  },
		}
	}
</script>

<style lang="scss">
	/* 开始 */
	
	.auth {
	  margin-top: 0;
	  text-align: center;
	  display: table-cell;
	  flex-direction: column;
	  flex-wrap: wrap;
	  justify-content: center;
	  align-items: flex-start;
	  padding: 100rpx;
	  vertical-align: middle;
	}
	
	.img {
	  border-radius: 50%;
	  border: 1px solid #fff;
	  background-color: #fff;
	  margin: 0 0 60rpx;
	  display: inline-block;
	  width: 200rpx;
	  height: 200rpx;
	  line-height: 0;
	}
	
	.title {
	  display: inline-block;
	  width: 100%;
	  margin: 0 0 60rpx;
	}
	
	.describe {
	  color: #a7aaa9;
	  font-size: 26rpx;
	  margin: 0 0 60rpx;
	  border-radius: 50%;
	  text-align: center;
	  display: inline-block;
	  width: 100%;
	}
	
	.btn {
	  padding: 0 60rpx;
	  background-color: #19be6b;
	  margin: 20rpx 0 200rpx;
	  text-align: center;
	  vertical-align: middle;
	  touch-action: manipulation;
	  cursor: pointer;
	  background-image: none;
	  white-space: nowrap;
	  user-select: none;
	  font-size: 14px;
	  border: 0 !important;
	  position: relative;
	  text-decoration: none;
	  height: 44px;
	  line-height: 44px;
	  box-shadow: inset 0 0 0 1px #19be6b;  
	  background: #fff !important;
	  color: #19be6b !important;
	  display: inline-block;
	  border-radius: 10rpx;
	}

</style>
