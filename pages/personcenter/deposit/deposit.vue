<template>
	<view>
		<view class="block">
			<!-- <view class="title">
				我的账户
			</view> -->
			<view class="content">
				<view class="my">
					我的账户余额：{{userinfo['money']?userinfo['money']:'...'}} 元
				</view>
			</view>
		</view>
		<view class="block">
			<view class="title">
				充值金额
			</view>
			<view class="content">
				<view class="amount">
					<view class="list">
						<view v-if="!giftamountList.length" class="box" v-for="(amount,index) in amountList" :key="index" @tap="select(amount,index)" :class="{'on':amount == inputAmount}">
							{{amount}}元
						</view>
						<view v-if="giftamountList.length" class="box" v-for="(amount,index) in amountList" :key="index" @tap="select(amount,index)" :class="{'on':amount == inputAmount}">
							{{amount}}元送{{giftamountList[index]}}元
						</view>
					</view>
					<view class="num">
						<view class="text">
							自定义充值金额
						</view>
						<view class="input">
							<input type="number" v-model="inputAmount" placeholder="输入10的整数" @input='inputamountchange'/>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="block">
			<view class="title">
				选择支付方式
			</view>
			<view class="content">
				<view class="pay-list">
					<view class="row" @tap="paytype='alipay'">
							<view class="left">
								<image src="../../../static/img/mmi.png"></image>
							</view>
							<view class="center">
								微信免密支付
							</view>
							<view class="right">
								<radio :checked="paytype=='alipay'" color="#f06c7a" />
							</view>
					</view>
					<!-- <view class="row" @tap="paytype='wxpay'">
							<view class="left">
								<image src="/static/img/wxpay.png"></image>
							</view>
							<view class="center">
								微信支付
							</view>
							<view class="right">
								<radio :checked="paytype=='wxpay'" color="#f06c7a" />
							</view>
					</view> -->
				</view>
			</view>
		</view>
		<uni-popup ref="popup" type="center" :maskClick="maskclose" :custom="custom">
			<view class="order">
				<view class="colseorder" @click="doclose">
				<image src="../../../static/img/close.png"></image>
				</view>
				<view class="ordercontent">
					<view class="title">订单信息</view>
					<view class="info">
						<view class="infolist">
							<view class="addnumtitle">类型:</view>
							<view class="addnumtitle">余额充值</view>
						</view>
						<view class="infolist">
							<view class="addnumtitle">支付金额:</view>
							<view class="addnum">{{inputAmount}}元</view>
						</view>
						<view class="infolist">
							<view class="addnumtitle">优惠金额:</view>
							<view class="addnum">{{gitmoney}}元</view>
						</view>
						<view class="infolist">
							<view class="addnumtitle">到账金额:</view>
							<view class="addnum">{{(Number(inputAmount)+Number(gitmoney))}}元</view>
						</view>
					</view>
					<view class="addbt" @click="doaddmoney">确认充值</view>
				</view>
			</view>
		</uni-popup>
		<view class="pay">
			<view class="btn" @tap="doDeposit">立即充值</view>
			<view class="tis">
				点击立即充值，即代表您同意
				<view class="terms">
					<navigator url="../../../pages/xieyi/xieyi?type=1">
						《条款协议》
					</navigator>
					
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		data() {
			return {
				maskclose:false,
				custom:true,
				inputAmount:'',//金额
				amountList:[10,50,100],//预设3个可选快捷金额
				giftamountList:[],//送金额
				paytype:'alipay',//支付类型，
				userinfo:[],
				seleteindex:-1,//选中赠送列表下标
				gitmoney:'0',
				ispay:0,
				waitpayTime: 7,
				btstatus:false,
				timerId: null,
			};
		},
		components: {uniPopup},
		onReady() {
				let t=this;
				uni.showLoading({
					title: '加载中...',
					mask: true
				});
				uni.login({
					success:function(e){
						t.getapiinfo(e.code)
					}
				})
		},
		methods:{
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
			async getapiinfo(code){
				let info= await this.$apis.chencklogin({code:code});
				let t=this;
				if(info.code==0){
					uni.reLaunch(
					{url:"../../pages/auth/auth"}
					)
				}else{
					this.userinfo=info.data;
					uni.setStorageSync('openid',info.data.openid)
					t.getaddmoneyact(info.data.openid)
					uni.hideLoading();
					console.log(this.userinfo,'已登录返回用户信息')
				}
			},
			//获取充值活动数据
			async getaddmoneyact(){
				let info= await this.$apis.getaddmoneyact({});
				if(info.data.amountList!=''){
					this.amountList=info.data.amountList;
					this.giftamountList=info.data.giftamountList;
				}
				
			},
			//是否签约
			async ismmsign(){
				let getopenid=uni.getStorageSync('openid');
				let info= await this.$apis.ismmsign({openid:getopenid});
				let t=this;
				if(info.data){
					if (parseFloat(this.inputAmount).toString() == "NaN") {
						uni.showToast({title:'请输入正确金额',icon:'none'});
						return ;
					}
					if(this.inputAmount%10!=0){
						// uni.showToast({title:'请输入10的整数金额',icon:'none'});
						// return ;
					}
					if(parseFloat(this.inputAmount).toFixed(2)!=parseFloat(this.inputAmount)){
						uni.showToast({title:'最多只能输入两位小数哦~',icon:'none'});
						return ;
					}
					if(parseFloat(this.giftamountList[this.seleteindex]).toString() != "NaN"){
						this.gitmoney=parseFloat(this.giftamountList[this.seleteindex]).toString();
						console.log(this.gitmoney,'有优惠券金额');
					}
					//找到指定元素在数组中的位置
					Array.prototype.indexVf=function(arr){
					            for(var i=0;i<this.length;i++){
					                if(this[i]==arr){
					                    return i;
					                }
					                
					            }
					        }
					
					var aa = this.amountList;
					let getindex=aa.indexVf(this.inputAmount) //得到1在aa中的下标0
					if(this.giftamountList.length>0){
						this.gitmoney=this.giftamountList[getindex];
					}
					this.$refs.popup.open();
					
				}else{
					//还没签约
					uni.showModal({
					    title: '温馨提示',
					    content: '请完成完成微信免密支付签约',
						confirmText:'去签约',
					    success: function (res) {
					        if (res.confirm) {
					            t.getsingparm()
					        }
					    }
					});
				}
			},
			//支付
			async dopay(openid,total_fee,gifnum){
				console.log('openid='+openid+'totalfee='+total_fee+'gifnum='+gifnum,'提交的数据')
				let info= await this.$apis.dowxpay({openid:openid,total_fee:total_fee,gifnum:gifnum});
				uni.showLoading({
					title:'支付中...'
				});
				let t=this;
				if(info.code==1){
						console.log(t.ispay,'是否支付')
						this.timerId = setInterval(() => {
							t.checkorderstate(openid,info.data);
							setTimeout(()=>{
								if(t.ispay==1){
									clearInterval(t.timerId);
									console.log(t.ispay,'走支付成功')
									uni.showToast({
										title:'支付成功'
									});
									uni.hideLoading();
									uni.redirectTo({
										url:'../../personcenter/paysuccess/paysuccess?amount='+this.inputAmount
									});
									
								}
							},200);
								var watitime = this.waitpayTime;
								watitime--;
								this.waitpayTime=watitime;
								if (watitime < 1) {
									clearInterval(this.timerId);
									t.waitpayTime=7;
									uni.hideLoading();
									uni.showToast({title:'支付异常，请检查微信余额是否充足',duration:1500,icon:'none'});
									t.btstatu=false;
								}
								console.log('请求支付结果'+watitime)
							},400);
					
				}else{
					console.log('走支付流程失败')
					t.btstatu=false;
					uni.hideLoading();
					uni.showToast({title:info.msg,duration:1500,icon:'none'});
				}
				
			},
			//根据订单号查询是否真的支付成功
			async checkorderstate(openid,out_trade_no){
				let info= await this.$apis.checkorderstate({openid:openid,out_trade_no:out_trade_no});
				let t=this;
				console.log(info.data,'检查支付返回')
				if(info.data==1){
					t.ispay=1;
				}else{
					t.ispay=0;
				}
				console.log(t.ispay,'t.ispay')
			},
			select(amount,index){
				this.inputAmount = amount;
				this.seleteindex=index;
			},
			inputamountchange(val){
				console.log(val.target.value,'输入')
			},
			doDeposit(){
				this.ismmsign();
			},
			doclose(){
				this.btstatus=false;
				this.$refs.popup.close()
			},
			doaddmoney(){
				if(this.btstatus==true){
					return false;
				}
				this.btstatus=true;
				var getmoney=this.inputAmount;
				var getgifmoney=this.gitmoney;
				let openid=uni.getStorageSync('openid');
				//调起微信/支付宝
				this.dopay(openid,getmoney,getgifmoney);
				console.log(getgifmoney+'--'+this.inputAmount,'金额');
				
				
			}
		},
		onLoad() {
			
		},
	}
</script>

<style lang="scss">
	.block{
		width: 94%;
		padding: 20upx 3%;
		.title{
			width: 100%;
			font-size: 34upx;
		}
		.content{
			.my{
				width: 100%;
				height: 120upx;
				display: flex;
				align-items: center;
				font-size: 30upx;
				border-bottom: solid 1upx #eee;
			}
			.amount{
				width: 100%;
				
				.list{
					display: flex;
					flex-flow:row wrap;
					justify-content: space-between;
					padding: 20upx 0;
					
					.box{
						width: 31%;
						height: 120upx;
						display: flex;
						justify-content: center;
						align-items: center;
						border-radius: 10upx;
						box-shadow: 0upx 5upx 20upx rgba(0,0,0,0.05);
						font-size: 36upx;
						background-color: #00bca2;
						color: #FFFFFF;
						margin-top:15upx;
					
						&.on{
							background-color: #f06c7a;
							color: #fff;
						}
					}
				}
				.num{
					margin-top: 10upx;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					.text{
						padding-right: 10upx;
						font-size: 30upx;
					}
					.input{
						width: 30.2vw;
						border-bottom: solid 2upx #999;
						
						justify-content: flex-end;
						align-items: center;
						input{
							margin: 0 20upx;
							height: 60upx;
							font-size: 30upx;
							color: #f06c7a;
							justify-content: flex-end;
							align-items: center;
						}
					}
				}
			}
			.pay-list{
				width: 100%;
				border-bottom: solid 1upx #eee;
				.row{
					width: 100%;
					height: 120upx;
					display: flex;
					align-items: center;
					.left{
						width: 100upx;
						flex-shrink: 0;
						display: flex;
						align-items: center;
						image{
							width: 60upx;
							height: 60upx;
						}
					}
					.center{
						width: 100%;
						font-size: 30upx;
					}
					.right{
						width: 100upx;
						flex-shrink: 0;
						display: flex;
						justify-content: flex-end;
					}
				}
			}
		}
	}
	.pay{
		margin-top: 20upx;
		width: 100%;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		.btn{
			width: 70%;
			height: 80upx;
			border-radius: 80upx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
			background-color: #f06c7a;
			box-shadow: 0upx 5upx 10upx rgba(0,0,0,0.2);
		}
		.tis{
			margin-top: 20upx;
			width: 100%;
			font-size: 24upx;
			display: flex;
			justify-content: center;
			align-items: baseline;
			color: #999;
			.terms{
				color: #5a9ef7;
			}
		}
	}
	.order{
		width: 550rpx;
		height: 580rpx;
		background-color: #FFFFFF;
		border-radius: 25rpx;
	}
	.colseorder{
		 position: absolute;
		  right: -8px;
		  top: -8px;
		image{
			width: 60rpx;
			height: 60rpx;
		}
	}
	.ordercontent{
		padding: 20rpx;
	}
	.title{
		color:#444f62;
		border-bottom: 1rpx #e7e8ea solid;
	}
	.infolist{
		padding: 20rpx 5rpx;
		display: flex;
		justify-content: space-around;
		border-bottom: 1rpx #e7e8ea solid;
		align-items: center;
	}
	.addnum{
		color: #ff1f3a;
		font-weight: bold;
		margin-left: 50rpx;
		font-size: 30rpx;
	}
	.addnumtitle{
		margin-left: -50rpx;
		color:#444f62;
		
	}
	.addnumtitle{
		margin-left: -50rpx;
		color: #49586d;
		font-size: 30rpx;
	}
	.addbt{
		color: #FFFFFF;
		font-size: 35rpx;
		background-color: #00bca2;
		padding: 10rpx 30rpx;
		display: flex;
		justify-content: center;
		margin-top: 30rpx;
		border-radius: 15rpx;
	}
</style>
