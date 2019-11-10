<template>
	<view>
		<view class="tabr" :style="{top:headerTop}">
			<view :class="{on:typeClass=='valid'}" @tap="switchType('valid')">提现申请</view><view :class="{on:typeClass=='invalid'}"  @tap="switchType('invalid')">提现记录</view>
			<view class="border" :class="typeClass"></view>
		</view>
		<view class="place" ></view>
		<view class="list">
			<!-- 申请提现 -->
			<view class="sub-list valid" :class="subState">
				<view class="txmain">
					<view class="moneytitle">可提现金额：<span>{{userinfo['money']}}</span>元</view>
					<view class="moneytip">提现金额：<input type="text" v-model="inputAmount" placeholder="输入提现金额" @input='inputamountchange'/><view class="all" @click="settmoney()">全部</view></view>
					<view class="btnContent">
					         <view
					           class="btn df"
					           @click="submit"
					         >提交</view>
					</view>
				</view>
			</view>
			<view class="sub-list invalid" :class="subState">
				<view class="listtitle">
					<view class="listmoney">提现金额</view>
					<view class="listtime">申请时间</view>
					<view class="liststate">状态</view>
				</view>
				<view class="tis" v-if="couponValidList.length==0">暂无数据~</view>
				<view class="row" v-for="(row,index) in couponValidList" :key="index" >
					<view class="listvalue">
						<view class="valuemoney">{{row.money}}</view>
						<view class="valuetime">{{row.addtime}}</view>
						<view class="valuestate">{{row.state == 1?'已提现':(row.state == 2?'已拒绝':'提现中') }}</view>
					</view>
				
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>

	export default {
		data() {
			return {
				showcan:false,
				inputAmount:'',//金额
				getmoney:20,
				userinfo:[],
				couponValidList:[],
				headerTop:0,
				//控制滑动效果
				typeClass:'valid',
				subState:'',
				theIndex:null,
				oldIndex:null,
				isStop:false
			}
		},
		onPageScroll(e){
			
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
		    setTimeout(function () {
		        uni.stopPullDownRefresh();
		    }, 1000);
		},
		onLoad(option) {
			let getphone = parseInt(option.phone);
			let getopenid=uni.getStorageSync('openid');
			this.openidtogetinfo(getopenid);
			console.log(getphone,'传过来的手机号')
			//兼容H5下排序栏位置
			// #ifdef H5
				//定时器方式循环获取高度为止，这么写的原因是onLoad中head未必已经渲染出来。
				let Timer = setInterval(()=>{
					let uniHead = document.getElementsByTagName('uni-page-head');
					if(uniHead.length>0){
						this.headerTop = uniHead[0].offsetHeight+'px';
						clearInterval(Timer);//清除定时器
					}
				},1);
			// #endif
		},
		methods: {
			async openidtogetinfo(openid){
				let info= await this.$apis.openidtogetinfo({openid:openid});
				this.userinfo=info.data;
				this.getmoney=info.data.money
			},
			//提现列表
			async withdrawlist(openid){
				let info= await this.$apis.withdrawlist({openid:openid});
				this.couponValidList=info.data;
			},
			//申请提现
			async withdrawreply(openid,money){
				let info= await this.$apis.withdrawreply({openid:openid,money:money});
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
			inputamountchange(val){
				if(val.target.value>this.getmoney){
					uni.showToast({title:'提现金额不可超过余额',duration:1500,icon:'none'});
					this.inputAmount=this.getmoney
				}
				console.log(val.target.value,'输入')
			},
			settmoney(){
				this.inputAmount=this.getmoney
			},
			submit(){
				let t=this;
				let openid=uni.getStorageSync('openid');
				if(this.inputAmount<=0){
					uni.showToast({title:'提现金额无效',duration:1500,icon:'none'});
					return '';
				}
				uni.showModal({
					title: '温馨提示',
					content: '提现金额为：'+this.inputAmount,
					confirmText: '确定',
					success: function(res) {
						if (res.confirm) {
							t.withdrawreply(openid,t.inputAmount)
						}
					}
				});
			},
			switchType(type){
			
				if(this.typeClass==type){
					return ;
				}
				let openid=uni.getStorageSync('openid')
				this.withdrawlist(openid);
				this.openidtogetinfo(openid);
				uni.pageScrollTo({
					scrollTop:0,
					duration:0
				})
				this.typeClass = type;
				this.subState = this.typeClass==''?'':'show'+type;
				setTimeout(()=>{
					this.oldIndex = null;
					this.theIndex = null;
					this.subState = this.typeClass=='valid'?'':this.subState;
				},200)
			},
			
			
			
		}
	}
</script>
<style lang="scss">
	view{
		display: flex;
		flex-wrap: wrap;
		
	}
	page{position: relative;background-color: #f5f5f5;}
	@font-face {font-family:"HMfont-home";src:url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2');}
	.icon {
		font-family:"HMfont-home" !important;
		font-size:60upx;
		font-style:normal;
		color:#000000;
		&.jia {
			&:before{content:"\e641";}
		}
		&.jian {
			&:before{content:"\e643";}
		}
		&.shixiao {
			&:before{content:"\e669";}
		}
		
	}
	.hidden{
		display: none !important;
	}
	.place{
		width: 100%;
		height: 95upx;
	}
	.tabr{
		background-color: #fff;
		width: 94%;
		height: 95upx;
		padding: 0 3%;
		border-bottom: solid 1upx #dedede;
		position: fixed;
		top: 0;
		z-index: 10;
		view{
			width: 50%;
			height: 90upx;
			justify-content: center;
			align-items: center;
			font-size: 32upx;
			color: #999;
		}
		.on{
			color: #f06c7a;
		}
		.border{
			height: 4upx;
			background-color: #f06c7a;
			transition: all .3s ease-out;
			&.invalid{
				transform: translate3d(100%,0,0);
			}
		}
		
	}
	.list{
		width: 100%;
		display: block;
		position: relative;
	}
	@keyframes showValid {
		0% {transform: translateX(-100%);}100% {transform: translateX(0);}
	}
	@keyframes showInvalid {
		0% {transform: translateX(0);}100% {transform: translateX(-100%);}
	}
	.sub-list{
		&.invalid{
			position: absolute;
			top: 0;
			left:100%;
			display: none;
		}
		&.showvalid{
			display: flex;
			animation: showValid 0.20s linear both;
		}
		&.showinvalid{
			display: flex;
			animation: showInvalid 0.20s linear both;
		}
		width: 100%;
		padding: 20upx 0 120upx 0;
		.tis{
			width: 100%;
			height: 60upx;
			justify-content: center;
			align-items: center;
			color: #C0C0C0;
			font-size: 32upx;
		}
		.btnContent {
		      padding: 0 30rpx;
		      width: 100%;
		      .btn {
		        height: 80rpx;
		        background: linear-gradient(
		          90deg,
		          rgba(58, 48, 207, 1),
		          rgba(65, 104, 238, 1)
		        );
		        border-radius: 40rpx;
		        font-size: 28rpx;
		        font-family: SourceHanSansSC-Regular;
		        font-weight: 400;
				display: flex;
				justify-content: center;
				align-items: center;
		        color: rgba(255, 255, 255, 1);
				width: 53%;
				margin: 0 auto;

		      }
		    }
	}
	.txmain{
		margin: 20rpx;
		.all{
			color: red;
			padding: 5rpx 10rpx;
			background-color: #fff;
			border-radius: 8rpx;
			font-size: 28rpx;
			margin-right: 30rpx;
		}
	}
	.moneytitle{
		margin: 20rpx;
		font-size: 35rpx;
		font-family: SourceHanSansCN-Regular;
		font-weight: 400;
		color: rgba(153, 153, 153, 1);
		span{
			color: red;
			
		}
	}
	.moneytip{
		margin: 25rpx;
		font-size: 35rpx;
		font-family: SourceHanSansCN-Regular;
		font-weight: 400;
		color: rgba(153, 153, 153, 1);
		input{
			width: 290rpx;
			font-size: 35rpx;
			color: red;
		}
	}
	.listtitle{
		width: 100%;
		height: 50rpx;
		display: flex;
		justify-content: space-around;
		padding: 5px;
		background-color: #C8C7CC;
		color: rgba(255, 255, 255, 1);
	}
	.row{
		width:100%;
		.listvalue{
			width: 100%;
			height: 50rpx;
			display: flex;
			justify-content: space-around;
			padding: 5px;
			color:#666666;
			.valuetime{
				font-size: 30rpx;
				font-family: SourceHanSansCN-Regular;
				font-weight: 400;
				color: rgba(153, 153, 153, 1);
			}
		}
	}
</style>
