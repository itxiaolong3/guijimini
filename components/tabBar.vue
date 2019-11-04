<template>
	<view class="zdTabBar page">
		<view class="ul">
			<view :class="['li',current == index?'cur' :'']" v-for="(item,index) in taBbarList" :key="index" @click="goto(item.url)">
				<view class="img" v-if="item.type == 0">
					<image :src="current == index ? item.selectIcon : item.icon" mode="widthFix"></image>
				</view>
				<view class="ic" v-if="item.type == 1">[ - ]</view>
				<view class="p">{{item.name}}</view>
			</view>
		</view>
		<uni-popup ref="popupcoupon" type="center" :maskClick="!maskclose" :custom="maskclose" style="padding: 0;margin: 0;border-radius: 30rpx;">
			<view style="width: 550rpx;height: 600rpx;padding: 0;margin: 0;">
				<image :src="tipimg" style="width: 100%;height: 100%;"/>
				<image src="../static/img/close.png" class="closeimg" @click="closeimg"/>
			</view>
		</uni-popup>
		<uni-popup ref="popup" type="center" :maskClick="maskclose">
			<view class="s-page-wrapper is-100vh">
				<view class="is-33vh has-mgt-10">
					<view class="is-flex is-column is-justify-center  is-align-center is-height-100">
						<image src="/static/logo.jpg" mode="aspectFit" class="logoimg"></image>
					</view>
				</view>
				<view class="registercontent">
					<view class="has-mglr-10 ">
						<view class=" has-mgtb-10 ">
							<input type="number" maxlength="11" placeholder="请输入手机号" class="is-input1 " @input="BindInput" data-val="phone" />
						</view>
						<view class=" has-mgtb-11 ">
							<input type="number" maxlength="6" placeholder="短信验证码" class="is-input1 " @input="BindInput" data-val="code" />
							<view class="codeimg" @tap="getsmscode">{{smsbtn.text}}</view>
						</view>
			
						<view class=" registerbtn has-radius has-mgtb-20">
							<button @click="doreg">注 册</button>
						</view>
					</view>
				</view>
				<view class="is-20vh has-mgt-80">
					<navigator url="../../pages/xieyi/xieyi?type=0" class=" has-radius is-center is-grey " hover-class="">
						<text>注册即表示同意</text><text class="is-blue">《用户协议》</text>
					</navigator>
				</view>
			</view>
		</uni-popup>
	</view>

</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		props: {
			current: {
				type: Number,
				default: 0
			}
		},
		
		data() {
			return {
				maskclose:true,
				senderro:false,
				smsbtn: {
					text: '获取验证码',
					status: false,
					codeTime: 60
				},
				register: {
					phone:"",
					code:""
				},
				timerId: null,
				taBbarList: [{
						type: 0,
						icon: '/static/img/myorder.png',
						selectIcon: '/static/img/myorder.png',
						name: '我的订单',
						url: 1
					},
					{
						type: 1,
						icon: '/static/img/myorder.png',
						selectIcon: '/static/img/myorder.png',
						name: '扫一扫',
						url: 2
					},
					{
						type: 0,
						icon: '/static/img/my.png',
						selectIcon: '/static/img/my.png',
						name: '我的',
						url: 3
					}
				],
				userinfo:[],
				extra_data:{},
				nopaymsg:'',
				tipimg:''	
			}
		},
		onReady() {
				let t=this;
				
				uni.login({
					success:function(e){
						console.log(e.code,'code')
						t.getapiinfo(e.code)
					}
				})
		},
		components: {uniPopup},
		methods: {
			//优惠券提示
			async coupontip(openid){
				let info= await this.$apis.coupontip({openid:openid});
				let t=this;
				if(info.data.ids){
					console.log(info,'返回')
					this.tipimg=info.data.img;
					setTimeout(function(){
						t.$refs.popupcoupon.open()
					},500)
					
				}
				console.log(info,'返回2')
			},
			closeimg(){
				let t=this;
				t.$refs.popupcoupon.close()
			},
			//检查是否有未支付订单
			async checknopayorder(openid){
				let info= await this.$apis.checknopayorder({openid:openid});
				let t=this;
				if(info.code){
					uni.hideLoading();
					uni.showModal({
					    title: '温馨提示',
					    content: info.msg,
						showCancel:t.senderro,
					    success: function (res) {
					        if (res.confirm) {
					            uni.navigateTo({url:'../../pages/personcenter/orderlist/orderlist?tbIndex=1'})
					        } else if (res.cancel) {
					            console.log('用户点击取消');
					        }
					    }
					});
				}else{
					uni.scanCode({
						success:function(e){
							var getpath=e.path;
							var arr=getpath.split('=');
							t.opendoor(openid,arr[1])
							console.log(e,'扫码成功返回')
							
						},fail:function(e){
							console.log(e,'扫码失败返回')
							uni.hideLoading()
						}
					})
				}
			},
			async getapiinfo(code){
				let info= await this.$apis.chencklogin({code:code});
				let t=this;
				if(info.code==0){
					// uni.reLaunch(
					// {url:"../../pages/auth/auth"}
					// )
				}else{
					this.userinfo=info.data;
					uni.setStorageSync('openid',info.data.openid)
					t.coupontip(info.data.openid)
					console.log(this.userinfo,'已登录')
				}
			},
			//更新个人信息
			async openidtogetinfo(openid){
				let info= await this.$apis.openidtogetinfo({openid:openid});
				this.userinfo=info.data;
			},
			//开柜
			async opendoor(openid,sn){
				let info= await this.$apis.opendoor({openid:openid,sn:sn});
				console.log(info.data,'开柜返回')
				if(info.code){
					uni.setStorageSync('ordernum',info.data.ordernum)
					uni.setStorageSync('sn',sn)
					console.log('已开')
					uni.reLaunch({
						url:"../../pages/goodlist/goodlist?productNumber="+sn
					})
				}else{
					uni.showToast({title: '开柜失败,原因：'+info.msg,duration: 3000,icon:'none'});
					
				}
			},
			async savaphone(openid,phone){
				this.$apis.savephone({openid:openid,phone:phone});
				this.openidtogetinfo(openid)
			},
			async getphone(code,iv,encryptedData){
				let info= await this.$apis.getphone({code:code,iv:iv,encryptedData:encryptedData});
				console.log(info.data.phoneNumber,'手机授权返回')
				let getopenid=uni.getStorageSync('openid');
				this.savaphone(getopenid,info.data.phoneNumber);
			},
			//获取签约参数
			async getsingparm(){
				let info= await this.$apis.getsingparm();
				let t=this;
				uni.showLoading({
				    title: '跳转中...'
				});
				if(info.code==1){
					console.log(info.data,'返回参数')
					console.log(info.data.appid,'返回appid')
					console.log(info.data.sign,'返回sign')
					console.log(info.data.mch_id,'返回mch_id')
					console.log(info.data.timestamp,'返回timestamp')
					uni.hideLoading();
					this.extra_data=info.data
					//console.log(this.extra_data,'传参数')
					uni.navigateToMiniProgram({
					  appId: 'wxbd687630cd02ce1d',
					  path: 'pages/index/index',
					  extraData:{
						  "appid":info.data.appid,
						  "mch_id":info.data.mch_id,
						  "notify_url":info.data.notify_url,
						  "contract_code":info.data.contract_code,
						  "contract_display_account":info.data.contract_display_account,
						  "plan_id":info.data.plan_id,
						  "request_serial":info.data.request_serial,
						  "timestamp":info.data.timestamp,
						  "sign":info.data.sign
					  },
					  success(res) {
					    // 打开成功
						console.log(res,'打开成功')
					  },
					  fail(res){
						  console.log(res,'打开失败')
					  }
					})
				}
			},
			//是否已签约
			async ismmsign(){
				let getopenid=uni.getStorageSync('openid');
				let info= await this.$apis.ismmsign({openid:getopenid});
				let t=this;
				console.log(info,'是否签约')
				if(info.data){
					uni.showLoading({
						title:'操作中...'
					})
					//判断是否有未支付订单,把扫码放里面
					t.checknopayorder(getopenid);
					
				}else{
					//还没签约
					uni.showModal({
					    title: '温馨提示',
					    content: '请完成完成微信免密支付签约',
						confirmText:'去签约',
					    success: function (res) {
					        if (res.confirm) {
					            t.getsingparm()
					        } else if (res.cancel) {
					            console.log('用户点击取消');
					        }
					    }
					});
				}
			},
			goto(e){
				console.log(e,'选中')
				let getphone=uni.getStorageSync('phone')
				if(e==1){
					uni.navigateTo({url:'../../pages/personcenter/orderlist/orderlist?tbIndex=0'})
					// if(this.userinfo.phone==null||this.userinfo.phone==''){
					// 	if(getphone==null||getphone==''){
					// 		this.$refs.popup.open()
					// 	}else{
					// 		uni.navigateTo({url:'../../pages/personcenter/orderlist/orderlist?tbIndex=0'})
					// 	}
					// 	
					// }else{
					// 	uni.navigateTo({url:'../../pages/personcenter/orderlist/orderlist?tbIndex=0'})
					// }
					
				}else if(e==2){
					//先判断是否手机号注册
					console.log(getphone,'getphone')
					let getopenid=uni.getStorageSync('openid');
					if(getopenid==''||getopenid==null){
						uni.navigateTo({url:'../../pages/auth/auth'})
					}else{
						if(this.userinfo.phone==null||this.userinfo.phone==''){
							if(getphone==null||getphone==''){
								this.$refs.popup.open()
							}else{
								this.ismmsign()
							}
							
						}else{
							this.ismmsign()
						}
					}
					
					
				}else if(e==3){
					uni.navigateTo({url:'../../pages/personcenter/personcenter'})
					// if(this.userinfo.phone==null||this.userinfo.phone==''){
					// 	if(getphone==null||getphone==''){
					// 		this.$refs.popup.open()
					// 	}else{
					// 		uni.navigateTo({url:'../../pages/personcenter/personcenter'})
					// 	}
					// 	
					// }else{
					// 	uni.navigateTo({url:'../../pages/personcenter/personcenter'})
					// }
					
				}
			},
			getsmscode: function() {
				if (this.smsbtn.status == true ) {
					uni.showToast({title: '别着急！短信已发',duration: 2000,icon:'none'});
					return false;
				}
				if (!this.checkphone(this.register.phone)) {
					uni.showToast({title: '手机号有误',duration: 2000,icon:'none'});
					return false;
				}
				this.sendsms(this.register.phone);
				
				//this.smsbtn.status = true; // 这段代码其实应该加在你request请求 短信发送成功后 
				this.timerId = setInterval(() => {
						var codeTime = this.smsbtn.codeTime;
						codeTime--;
						this.smsbtn.codeTime = codeTime;
						this.smsbtn.text = codeTime + "S";
						if (codeTime < 1||this.senderro) {
							clearInterval(this.timerId);
							this.smsbtn.text = "重新获取";
							this.smsbtn.codeTime = 60;
							this.smsbtn.status = false;
						}
						console.log('执行')
					},
					1000);
				return false;
			},
			checkphone:function(tel){
				if (tel.match(/^(13[0-9]|14(5|7)|15(0|1|2|3|5|6|7|8|9)|18[0-9])\d{8}$/) != null) {  
				       return true; 
				    } else {  
				        return false;
				    }  
			},
			BindInput:function(e){
				var dataval = e.currentTarget.dataset.val;
				this.register[dataval] = e.detail.value; 
			},
			//发送验证码
			async sendsms(phone){
				let info= await this.$apis.sendsms({phone:phone});
				console.log(info.data,'dddd')
				if(info.data=='1'){
					uni.showToast({title: info.msg,duration: 2000,icon:'none'});
					this.smsbtn.status = true;
					this.senderro=false;
				}else{
					uni.showToast({title: info.msg,duration: 2000,icon:'none'});
					this.senderro=true;
				}
			},
			//注册
			async regphone(phone,code,openid){
				let info= await this.$apis.regphone({phone:phone,code:code,openid:openid});
				if(info.data=="1"){
					this.openidtogetinfo(openid);
					this.$refs.popup.close()
				}else{
					uni.showToast({title: info.msg,duration: 2000,icon:'none'});
				}
			},
			doreg:function(){
				console.log(this.register.phone,'手机号')
				console.log(this.register.code,'验证码')
				let getopenid=uni.getStorageSync('openid');
				if (!this.checkphone(this.register.phone)) {
					uni.showToast({title: '请正确填写手机号',duration: 2000,icon:'none'});
					return false;
				}
				this.regphone(this.register.phone,this.register.code,getopenid);				
			}
			
		}
	}
</script>
<style lang="scss">
	page {
		min-height: 100%;
		background-color: #FFFFFF;
	}
	.s-page-wrapper{
		// width: 100%;
		padding: 80rpx;
	}
.has-mgtb-11{
	margin-top: 25rpx;
}
	.registercontent {
		width: 100%;
		margin: 0 auto;
	}

	.logoimg {
		width: 200rpx;
		height: 200rpx;
		border-radius: 50%;
		margin: 0 auto;
	}
.closeimg{
	position: absolute;
	left:45%;
	top:97%;
	width: 70rpx;
	height: 70rpx;
	z-index: 3;
}
	.is-input1 {
		height: 88rpx;
		width: 100%;
		line-height: 88rpx;
		padding: 12rpx;
		color: #353535;
		font-size: 28rpx;
		box-sizing: border-box;
		appearance: none;
		border: 2rpx solid #e5e5e5;
		box-shadow: none;
		border-radius: 44rpx;
		outline: 0;
		display: block;
		padding-left: 30rpx;
		margin: 0;
		font-family: inherit;
		background: #fff;
		resize: none;
	}

	.iconfont {
		position: absolute;
		font-size: 40rpx;
		right: 12%;
		z-index: 999;
		width: 105rpx;
		text-align: center;
		color: #353535;
		margin-top: -11%;
		background: #fff;
		border-top-right-radius: 44rpx;
		border-bottom-right-radius: 44rpx;
		height: 80rpx;
		line-height: 80rpx;
	}

	.codeimg {	
		position: absolute;
		font-size: 28rpx;
		right: 21%;
		z-index: 999;
		width: 150rpx;
		text-align: center;
		color: #353535;
		margin-top: -13%;
		background: #fff;
		border-top-right-radius: 44rpx;
		border-bottom-right-radius: 44rpx;
		height: 60rpx;
		line-height: 60rpx;

		
	}
.has-mgtb-20{
	margin-top: 20rpx;
}
	.registerbtn button {
		margin-top: 20rpx;
		height: 88rpx;
		width: 100%;
		line-height: 88rpx;
		color: #ffffff;
		font-size: 28rpx;
		border-radius: 44rpx;
		outline: 0;
		display: block;
		margin: 0;
		font-family: inherit;
		background: #008001;
		opacity: 0.8;
	}
.has-mgt-80{
	font-size: 25rpx;
	color: #818383;
	width: 100%;
	padding: 15rpx;
	margin: 0 auto;
}
	button:after {
		border: 2rpx solid #f2f2f2;
	}
	
</style>
