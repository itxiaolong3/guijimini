<template>
	<view>
		<!-- 顶部导航 -->
		<view class="topTabBar" :style="{position:headerPosition,top:headerTop}">
			<view class="grid" v-for="(grid,tbIndex) in orderType" :key="tbIndex" @tap="showType(tbIndex)">
				<view class="text" :class="[tbIndex==tabbarIndex?'on':'']">{{grid}}</view>
			</view>
		</view>
		<!-- 考虑非APP端长列表和复杂的DOM使用scroll-view会卡顿，所以漂浮顶部选项卡使用page本身的滑动 -->
		<view class="order-list">
			<view class="list">
				<view class="onorder" v-if="list.length==0">
					<image src="../../../static/img/noorder.png"></image>
					<view class="text">
						没有相关订单
					</view>
				</view>
				<view class="row" v-for="(row,index) in list" :key="index">
					<view class="type">{{typeText[row.state]}}</view>
					<view class="order-info">
						<view class="left">
							<image :src="row.goodimg"></image>
						</view>
						<view class="right">
							<view class="name">
								{{row.goodtitle}}
							</view>
							<view class="spec" v-if="row.paytype==0">免密支付</view>
							<view class="spec" v-if="row.paytype==1">余额支付</view>
							<!-- <view class="price-number">
								￥<view class="price">{{row.ordermoney}}</view>
								x<view class="number">{{row.allnum}}</view>
							</view> -->
						</view>
						
					</view>
					<view class="detail">
						<view class="number">共{{row.allnum}}件商品</view><view class="sum">合计￥<view class="price">{{row.ordermoney}}</view></view><view class="nominal">(优惠金额 ￥{{row.giftnum?row.giftnum:0}})</view>
					</view>
					<view class="btns">
						<block v-if="row.state==0"><view class="default" v-if="row.allnum>1" @click="showdetail(row.products)">查看更多</view><view class="pay" @tap="toPayment(row.id,row.ordermoney)">去付款</view></block>
						<block v-if="row.state==1"><view class="default" v-if="row.allnum>1" @click="showdetail(row.products)">查看更多</view><view class="default" style="border: none;"><button class="kfbt" open-type="contact" >申请售后</button></view></block>
						<block v-if="row.state==2"><view class="default" v-if="row.allnum>1" @click="showdetail(row.products)">查看更多</view><view class="default">查看进度</view></block>
					</view>
				</view>
			</view>
		</view>
		<uni-popup ref="popup" type="bottom" :maskClick="maskclose">
			<view class="dosure" @click="closeit">关闭</view>
			<view class="choosegood" v-for="(product,index) in detailgoodlist" :key="index">
				<view class="choosegoodimg">
					<image  class="uni-product-image" :src="product.image"></image>
				</view>
				<view class="desc">
					<view>{{product.name}}</view>
					<view class="price">零售价：{{product.price}}元</view>
				</view>
				<view class="nums">数量：x{{product.number}}</view>
			</view>
		</uni-popup>
	</view>
</template>
<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		data() {
			return {
				maskclose:true,
				headerPosition:"fixed",
				headerTop:"0px",
				typeText:[
					'等待付款',
					'已付款',
					'售后订单'
				],
				orderType: ['全部','待付款','已付款','售后订单'],
				//订单列表 演示数据
				orderList:[
					[],
					[],
					[],
					[],
					[
						{ type:"received",ordersn:1,goods_id: 1, img: '/static/img/goods/p5.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168',payment:168.00,freight:12.00,spec:'规格:S码',numner:1 }
					],
					[
						{ type:"refunds",ordersn:1,goods_id: 1, img: '/static/img/goods/p5.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168',payment:168.00,freight:12.00,spec:'规格:S码',numner:1 }
					]
					
				],
				list:[],
				tabbarIndex:0,
				detailgoodlist:[],
				ispay:0,
				waitpayTime: 25,
				timerIdforgood: null,
				showcan:false,
				
			};
		},
		onLoad(option) {
			//option为object类型，会序列化上个页面传递的参数
			console.log("option: " + JSON.stringify(option));
			let tbIndex = parseInt(option.tbIndex);
			//this.list = this.orderList[tbIndex];
			this.tabbarIndex = tbIndex;
			//兼容H5下排序栏位置
			// #ifdef H5
				let Timer = setInterval(()=>{
					let uniHead = document.getElementsByTagName('uni-page-head');
					if(uniHead.length>0){
						this.headerTop = uniHead[0].offsetHeight+'px';
						clearInterval(Timer);//清除定时器
					}
				},1);
			// #endif
		},
		onPageScroll(e){
			return;
			//兼容iOS端下拉时顶部漂移
			this.headerPosition = e.scrollTop>=0?"fixed":"absolute";
		},
		onShow(){
			let getopenid=uni.getStorageSync('openid');
			this.orderlist(getopenid);
			
		},
		components: {uniPopup},
		methods: {
			//根据订单号查询是否真的支付成功
			async checkgoodorder(oid){
				let info= await this.$apis.checkgoodorder({oid:oid});
				let t=this;
				console.log(info.data,'检查支付返回')
				if(info.data==1){
					t.ispay=1;
				}else{
					t.ispay=0;
				}
				console.log(t.ispay,'t.ispay')
			},
			//后台检查余额恢复接口
			async backyue(oid){
				let info= await this.$apis.backyue({oid:oid});
			},
			async orderlist(openid){
				uni.showLoading({
					title:'加载中...'
				})
				let info= await this.$apis.orderlist({openid:openid});
				if(info.code==1){
					uni.hideLoading();
				}else{
					setTimeout(function(){
							uni.hideLoading()
					},3000)
				}
				this.orderList[0]=info.data.all;
				this.orderList[1]=info.data.wait;
				this.orderList[2]=info.data.ispay;
				this.orderList[3]=info.data.back;
				this.list = this.orderList[this.tabbarIndex];
				console.log(this.orderList[this.tabbarIndex])
				
			},
			async wxpaytwo(oid){
				let info= await this.$apis.wxpaytwo({oid:oid});
				uni.showLoading({
					title:'支付中...'
				});
				let t=this;
				if(info.code==1){
						console.log(t.ispay,'是否支付')
						this.timerIdforgood = setInterval(() => {
							t.checkgoodorder(oid);
							setTimeout(()=>{
								if(t.ispay==1){
									clearInterval(t.timerIdforgood);
									console.log(t.ispay,'走支付成功')
									uni.hideLoading();
									console.log('已隐藏1'+oid)
									uni.showModal({
									    title: '购买完成提示',
									    content: '欢迎再次光临！',
										showCancel:this.showcan,
									    success: function (res) {
									        if (res.confirm) {
									            uni.reLaunch({
									            	url:'../../../pages/index/index'
									            })
									        } else if (res.cancel) {
									            console.log('用户点击取消');
									        }
									    }
									});
									
								}
							},200);
								var watitime = this.waitpayTime;
								watitime--;
								this.waitpayTime=watitime;
								if (watitime < 1) {
									clearInterval(this.timerIdforgood);
									//后台检查订单状态是否真的未支付，恢复所扣余额
									t.backyue(oid);
									t.waitpayTime=25;
									uni.hideLoading();
									console.log('已隐藏2'+oid)
									uni.showModal({
									    title: '购买异常提示',
									    content: '请检查微信余额支付是否足以支付此次购买金额，或者网络是否正常，欢迎再次购买！',
										showCancel:this.showcan,
									    success: function (res) {
									        if (res.confirm) {
									            uni.reLaunch({
									            	url:'../../../pages/index/index'
									            })
									        }
									    }
									});
									
								}
								console.log('请求支付结果'+watitime)
							},400);
					
				}else{
					console.log('走支付流程失败')
					uni.hideLoading();
					uni.showModal({
					    title: '购买异常提示',
					    content: '异常信息：'+info.msg,
						showCancel:this.showcan,
					    success: function (res) {
					        if (res.confirm) {
					            uni.reLaunch({
					            	url:'../../../pages/index/index'
					            })
					        }
					    }
					});
				}
			},
			showType(tbIndex){
				this.tabbarIndex = tbIndex;
				this.list = this.orderList[tbIndex];
			},
			showdetail(info){
				this.detailgoodlist=info;
				if(this.detailgoodlist.length>0){
					this.$refs.popup.open()
				}
				
			},
			closeit(){
				this.$refs.popup.close()
			},
			
			toPayment(id,allmoney){
				//本地模拟订单提交UI效果
				let t=this;
				uni.showModal({
				    title: '温馨提示',
				    content: '即将支付金额为：'+allmoney+'元，是否确定完成支付？',
				    success: function (res) {
				        if (res.confirm) {
				          t.wxpaytwo(id)
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
				
			}
		}
	}
</script>

<style lang="scss">
page{
	background-color: #f3f3f3;
}
.kfbt{
	width: 100%;
	background-color: #ffffff;
	border-radius: 65rpx;
	font-size: 22rpx;
	button::after{ border: none; }
	border: solid 1upx #ccc;
	color: #666;
	padding: 0rpx 20rpx;
}
.topTabBar{
	width: 100%;
	position: fixed;
	top: 0;
	z-index: 10;
	background-color: #f8f8f8;
	height: 80upx;
	display: flex;
	justify-content: space-around;
	.grid{
		width: 20%;
		height: 80upx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #444;
		font-size: 28upx;
		.text{
			height: 76upx;
			display: flex;
			align-items: center;
			&.on{
				color: #f06c7a;
				border-bottom: solid 4upx #f06c7a;
			}
		}
		
	}
}
.order-list{
	margin-top: 80upx;
	padding-top: 20upx;
	width: 100%;
	.list{
		width: 94%;
		margin: 0 auto;
		.onorder{
			width: 100%;
			height: 50vw;
			display: flex;
			justify-content: center;
			align-content: center;
			flex-wrap: wrap;
			image{
				width: 20vw;
				height: 20vw;
				border-radius: 100%;
			}
			.text{
				width: 100%;
				height: 60upx;
				font-size: 28upx;
				color: #444;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
		.row{
			width: calc(100% - 40upx);
			padding: 10upx 20upx;
			border-radius: 10upx;
			background-color: #fff;
			margin-bottom: 20upx;
			.type{
				font-size: 26upx;
				color: #ec652f;
				height: 50upx;
				display: flex;
				align-items: center;
			}
			.order-info{
				width: 100%;
				display: flex;
				.left{
					flex-shrink: 0;
					width: 25vw;
					height: 25vw;
					image{
						width: 25vw;
						height: 25vw;
						border-radius: 10upx;
					}
				}
				.right{
					width: 100%;
					margin-left: 10upx;
					position: relative;
					.name{
						width: 100%;
						font-size: 28upx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
					}
					.spec{
						color: #a7a7a7;
						font-size: 22upx;

					}
					.price-number{
						position: absolute;
						bottom: 0;
						width: 100%;
						display: flex;
						justify-content: flex-end;
						font-size: 22upx;
						color: #333;
						display: flex;
						align-items: flex-end;
						.price{
							font-size: 24upx;
							margin-right: 5upx;
						}
						
					}
				}
			}
			.detail{
				display: flex;
				justify-content: flex-end;
				align-items: flex-end;
				height: 60upx;
				font-size: 26upx;
				.sum{
					padding: 0 8upx;
					display: flex;
					align-items: flex-end;
					.price{
						font-size: 30upx;
					}
				}
				
			}
			.btns{
				height: 80upx;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				view{
					min-width: 120upx;
					height: 50upx;
					padding: 0 20upx;
					border-radius: 50upx;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 28upx;
					margin-left: 20upx;
				}
				.default{
					border: solid 1upx #ccc;
					color: #666;
				}
				.pay{
					border: solid 1upx #ec652f;
					color: #ec652f;
				}
			}
		}
	}
}
.tip{
		color: #008001;
		margin-bottom: 15rpx;
	}
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
.dosure{
		position: absolute;
		right: 25upx;
		top: 20upx;
	}
</style>
