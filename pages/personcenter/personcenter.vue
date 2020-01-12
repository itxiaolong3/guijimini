<template>
	<view>
		<view class="header" v-bind:class="{'status':isH5Plus}">
			<view class="userinfo">
				<view class="face"><image :src="userinfo.user_logo"></image></view>
				<view class="info">
					<view class="username">{{userinfo.user_name}}</view>
					<view class="integral" v-if="userinfo.phone">手机号:{{userinfo.phone}}</view>
					<view  v-if="!userinfo.phone">
						<button class="getphoncss" open-type="getPhoneNumber" @getphonenumber="dogetphone">获取手机号</button>
						</view>
				</view>
			</view>
			<!-- <view class="setting"><image src="../../static/HM-PersonalCenter/setting.png"></image></view> -->
		</view>
		<view class="orders">
			<view class="box">
				<view class="label" v-for="(row,index) in orderTypeLise" :key="row.name" hover-class="hover"  @tap="toOrderType(index)">
					<view class="icon"><view class="badge" v-if="row.badge>0">{{row.badge}}</view><image :src="'../../static/HM-PersonalCenter/'+row.icon"></image></view>
					{{row.name}}
				</view>
			</view>
		</view> 
		<view class="balance-info">
			<view class="left">
				<!-- <view class="box">
					<view class="num">{{user.integral}}</view>
					<view class="text">积分</view>
				</view> -->
				<view class="box" @click="tocoupon">
					<view class="num">
						<view class="icon" v-if="counponnum==0"><image src="../../static/img/coupon.png"></image></view>
						<view class="num" v-if="counponnum>0">{{counponnum}}</view>
					</view>
					<view class="text">优惠券</view>
				</view>
				<view class="box">
					<view class="num">{{userinfo.money}}</view>
					<view class="text">余额</view>
				</view>
			</view>
			<view class="right">
				<view class="box" @tap="toDeposit">
					<view class="img">
						<view class="icon chongzhi"><image src="../../static/img/addmoney.png"></image></view>
					</view>
					<view class="text">充值</view>
				</view>
			</view>
		</view>
		<view class="list" v-for="(list,list_i) in severList" :key="list_i">
			<view class="li" v-for="(li,li_i) in list" @tap="toPage(list_i,li_i)" v-bind:class="{'noborder':li_i==list.length-1}"  hover-class="hover" :key="li.name" v-if="li.isshow==true">
				<view  class="icon"><image :src="'../../static/HM-PersonalCenter/sever/'+li.icon"></image></view>
				<view class="text" v-if="!li.isbt">{{li.name}}</view>
				<view v-if="li.isbt" class="text"><button class="text kfbt" open-type="contact" >{{li.name}}</button></view>
				<image class="to" src="../../static/HM-PersonalCenter/to.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//个人信息,
				user:{
					username:'游客1002',
					face:'../../static/img/my.png',
					signature:'点击昵称跳转登录/注册页',
					integral:0,
					balance:0,
					envelope:0
				},
				userinfo:[],
				//#ifdef APP-PLUS
				isH5Plus:true,
				//#endif
				//#ifndef APP-PLUS
				//isH5Plus:false,
				//#endif
				orderTypeLise:[
					//name-标题 icon-图标 badge-角标
					{name:'全部订单',icon:'l4.png',badge:0},
					{name:'待付款',icon:'l1.png',badge:0},
					{name:'已付款',icon:'l2.png',badge:0},
					{name:'售后订单',icon:'l5.png',badge:0}
				],
				severList:[
					// [
					// 	// {name:'我要充值',icon:'skv.png'},
					// 	// {name:'售后申请',icon:'sellafter.png'},
					// 	{name:'我要上货',icon:'upgood.png',isshow:true},
					// 	{name:'反馈意见',icon:'comment.png',isshow:true}
					// ],
					// [
					// 	// {name:'历史记录',icon:'history.png'},
					// 	{name:'联系客服',icon:'kefu.png',isshow:true},
					// 	{name:'关于平台',icon:'about.png',isshow:true}
					// ]
				],
				isshowitem:false,
				counponnum:0
				
			}
		},
		onLoad() {
			//加载
			this.init();
		},
		onReady() {
				let t=this;
				uni.login({
					success:function(e){
						t.getapiinfo(e.code)
					}
				})
		},
		onShow(){
			let t=this;
			uni.login({
				success:function(e){
					t.getapiinfo(e.code)
				}
			})
			t.mycouponlist()
		},
		methods: {
			//我的优惠券
			async mycouponlist(){
				let getopenid=uni.getStorageSync('openid');
				let info= await this.$apis.mycouponlist({openId:getopenid});
				this.counponnum=info.data.couponList.length;
			},
			async shopen(sn){
				let info= await this.$apis.shopen({sn:sn});
				if(info.code==1){
					uni.navigateTo({url:'./checkuptype/checkuptype?sn='+sn}) 
				}else{
					uni.showToast({title: '开柜失败:'+info.msg,duration: 3000,icon:'none'});
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
					if(info.data.auth_type==1){
						this.severList=[
							[
								// {name:'我要充值',icon:'skv.png'},
								// {name:'售后申请',icon:'sellafter.png'},
								{name:'我要上货',icon:'upgood.png',isshow:true,isbt:false},
								{name:'反馈意见',icon:'comment.png',isshow:true,isbt:false}
							],
							[
								// {name:'历史记录',icon:'history.png'},
								{name:'联系客服',icon:'kefu.png',isshow:true,isbt:true},
								{name:'关于平台',icon:'about.png',isshow:true,isbt:false}
							]
						];
					}else{
						this.severList=[
							[
								// {name:'我要充值',icon:'skv.png'},
								// {name:'售后申请',icon:'sellafter.png'},
								{name:'我要上货',icon:'upgood.png',isshow:false,isbt:false},
								{name:'反馈意见',icon:'comment.png',isshow:true,isbt:false}
							],
							[
								// {name:'历史记录',icon:'history.png'},
								{name:'联系客服',icon:'kefu.png',isshow:true,isbt:false},
								{name:'关于平台',icon:'about.png',isshow:true,isbt:false}
							]
						];
					}
					console.log(this.userinfo,'已登录')
				}
			},
			async openidtogetinfo(openid){
				let info= await this.$apis.openidtogetinfo({openid:openid});
				this.userinfo=info.data;
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
			dogetphone(e){
				let t=this;
				uni.login({
					success:function(ee){
						t.getphone(ee.code,e.detail.iv,e.detail.encryptedData)
					}
				})
				console.log(e,'返回信息')
			},
			init() {
				//用户信息
				this.userinfo={
					user_logo:'../../static/hch-position/person.png',
					user_name:"昵称",
					phone:""
				}		
			},
			//用户点击订单类型
			toOrderType(index){
				//uni.showToast({title: this.orderTypeLise[index].name});
				uni.navigateTo({url:'./orderlist/orderlist?tbIndex='+index}) 
			},
			//用户点击列表项
			toPage(list_i,li_i){
				if(this.severList[list_i][li_i].name=="我要上货"){
					uni.navigateTo({url:'./checkuptype/checkuptype'})
					//以前手动上货版
					// let getopenid=uni.getStorageSync('openid');
					// uni.showLoading({
					// 	title:'开柜中...'
					// })
					// let t=this;
					// uni.scanCode({
					// 	success:function(e){
					// 		var getpath=e.path;
					// 		var arr=getpath.split('=');
					// 		t.shopen(arr[1])
					// 		//t.opendoor(getopenid,arr[1])
					// 		console.log(arr[1],'扫码成功返回')
					// 		
					// 	},fail:function(e){
					// 		console.log(e,'扫码失败返回')
					// 		uni.hideLoading()
					// 		uni.showToast({title: '开柜失败',duration: 3000,icon:'none'});
					// 	}
					// })
					
				}else if(this.severList[list_i][li_i].name=="反馈意见"){
					uni.navigateTo({url:'./feelback/feelback'}) 
				}else if(this.severList[list_i][li_i].name=="关于平台"){
					uni.navigateTo({url:'../aboutme/aboutme'}) 
				}else{
					//uni.showToast({title: this.severList[list_i][li_i].name});
				}
				
			},
			//点击优惠券
			tocoupon(){
				uni.navigateTo({url:'./coupon/coupon?phone='+this.userinfo.phone}) 
			},
			toDeposit(){
				uni.navigateTo({
					url:'./deposit/deposit'
				})
			},
		}
	}
</script>

<style lang="scss">
page{background-color:#fff}
.kfbt{
	width: 100%;
	text-align: left;
	background-color: #ffffff;
	button::after{ border: none; } 
}
button::after{
border:none;
}
.header{
	&.status{padding-top:var(--status-bar-height);}
	background-color:#7db8ec;width:92%;height:30vw;padding:0 4%;display:flex;align-items:center;
	.userinfo{
		width:90%;display:flex;
		.face{flex-shrink:0;width:15vw;height:15vw;
			image{width:100%;height:100%;border-radius:100%}
		}
		.info{
			display:flex;flex-flow:wrap;padding-left:30upx;
			.username{width:100%;color:#fff;font-size:40upx}
			.integral{display:flex;align-items:center;padding:0 20upx;height:40upx;color:#fff;background-color:rgba(0,0,0,0.1);border-radius:20upx;font-size:24upx}
		}
	}
	.setting{
		flex-shrink:0;width:6vw;height:6vw;
		image{width:100%;height:100%}
	}
}
.hover{background-color:#eee}
.orders{
	background-color:#7db8ec;width:94%;height:11vw;padding:0 4%;margin-bottom:calc(11vw + 40upx);display:flex;align-items:flex-start;border-radius:0 0 100% 100%;margin-top: -1upx;
	.box{
		width:98%;padding:0 1%;height:22vw;background-color:#fefefe;border-radius:24upx;box-shadow:0 0 20upx rgba(0,0,0,0.15);margin-bottom:40upx;display:flex;align-items:center;justify-content:center;
		.label{
			display:flex;align-items:center;justify-content:center;flex-flow:wrap;width:100%;height:16vw;color:#666666;font-size:26upx;
			.icon{
				position:relative;width:7vw;height:7vw;margin:0 1vw;
				.badge{position:absolute;width:4vw;height:4vw;background-color:#ec6d2c;top:-1vw;right:-1vw;border-radius:100%;font-size:20upx;color:#fff;display:flex;align-items:center;justify-content:center;z-index: 10;}
				image{width:7vw;height:7vw;z-index: 9;}
			}
		}
	}
}
.list{
	width:100%;border-bottom:solid 2upx #f1f1f1;
	.li{
		width:92%;height:100upx;padding:0 4%;border-bottom:solid 1upx #e7e7e7;display:flex;align-items:center;
	&.noborder{border-bottom:0}
		.icon{
			flex-shrink:0;width:50upx;height:50upx;
			image{width:55upx;height:55upx}
		}
		.text{padding-left:20upx;width:100%;color:#666}
		.to{flex-shrink:0;width:40upx;height:40upx}
	}
}
.getphoncss{
	background: none;
	font-size: 26rpx;
	height: 40rpx;
	color: #fff;
	line-height: 40rpx;

}
.balance-info{
			display: flex;
			padding: 10upx 0;
			box-shadow:0 0 10upx rgba(0,0,0,0.15);margin-bottom:40upx;
			.left{
				width: 75%;
				display: flex;
				.box{
					width: 50%;
					font-size: 35upx;
					
					.num{
						width: 100%;
						height: 50upx;
						display: flex;
						justify-content: center;
						align-items: flex-end;
						color: #f9a453;
					}
					.text{
						width: 100%;
						display: flex;
						justify-content: center;
						color: #3d3d3d;
						font-size: 28upx;
					}
				}
			}
			.right{
				border-left: solid 1upx #17e6a1;
				width: 25%;
				.box{
					
					.img{
						width: 100%;
						height: 50upx;
						display: flex;
						justify-content: center;
						align-items: flex-end;
						.icon{
							font-size: 45upx;
							color: #e78901;
						}
					}
					.text{
						width: 100%;
						display: flex;
						justify-content: center;
						font-size: 28upx;
						color: #3d3d3d;
					}
				}
			}
		}
</style>
