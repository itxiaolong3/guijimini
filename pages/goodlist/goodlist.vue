<template>
    <view class="uni-product-list">
        <view class="uni-product" v-for="(product,index) in myproductList" :key="index">
            <view class="image-view">
                <image v-if="renderImage" class="uni-product-image" :src="product.productImg"></image>
            </view>
            <view class="uni-product-title">{{product.productName}}</view>
            <view class="uni-product-price">
                <text>单价</text>
                <text class="uni-product-price-original">￥{{product.productPrice}}</text>
                <!-- <text class="uni-product-tip">{{product.tip}}</text> -->
            </view>
        </view>
		<view class="list">
			<view class="onorder" v-if="myproductList.length==0">
				<image src="../../static/img/noorder.png"></image>
				<view class="text">
					该柜机没商品
				</view>
				<view class="back">
					<view class="btn" @tap="toIndex">返回首页</view>
				</view>
			</view>
		</view>
		<uni-popup ref="popup" type="bottom" :maskClick="maskclose">
			<view class="tip" v-if="allmoney>0">您已选购商品如下：一共：{{allmoney}}元</view>
			<view class="choosegood" v-for="(product,index) in userproductList" :key="index" v-if="product.number>0">
				<view class="choosegoodimg">
					<image  class="uni-product-image" :src="product.image"></image>
				</view>
				<view class="desc">
					<view>{{product.name}}</view>
					<view class="price">零售价：{{product.price}}元</view>
				</view>
				<view>数量：x{{product.number}}</view>
			</view>
			<!-- <view class="choosegood">
				<view class="choosegoodimg">
					<image  class="uni-product-image" src="../../static/img/goods/p4.jpg"></image>
				</view>
				<view class="desc">
					<view>商品名称2</view>
					<view class="price">零售价：12元/斤</view>
				</view>
				<view>数量：x1</view>
			</view> -->
		</uni-popup>
		<uni-popup ref="popups" type="center" :maskClick="couponmask">
			<view class="tip">请选中其中一张优惠卡<view class="dosure" @click="postcoupon" style="font-size: 50rpx;font-weight: bold;">确定</view></view>
			
			<view class="coupon-item" v-for="(item,index) in list" :key="index">
				<view class="coupon-money">
					<view class="nick">{{item.title}}</view>
					<view class="layof" :style="{color:theme}" v-if="item.type==1">{{item.ticket}}</view>
					<view class="layof" :style="{color:theme}" v-if="item.type==2">{{item.ticket*100}}%</view>
					<view class="end_time">{{item.termEnd}}前使用</view>
				</view>
				<view class="get-btn" v-if="item.state" :style="{color:color.default, borderColor:color.default, background:solid.default}" @click="docheck(index)">已选</view>
				<view class="get-btn" v-if="!item.state" :style="{color:color, borderColor:color, background:solid}" @click="docheck(index)">选择使用</view>
			</view>
		</uni-popup>
    </view>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
    export default {
        data() {
            return {
				maskclose:false,
				couponmask:false,
				showcan:false,
                title: 'product-list',
                productList: [],
                myproductList: [],
                userproductList: [],
                renderImage: false,
				allmoney:0,
				getticket:'',
				getcoupontype:'',
				couponid:0,
				timerId: null,
				reqTime:2400,
				types:{
					type: String,
					default: ''
				},
				color:{
					type: String,
					default: '#878ea3'
				},
				list: [
					{id:1,title:"日常用品立减10元",termStart:"2019-04-01",termEnd:"2019-05-30",ticket:"10",criteria:"满50使用",state:0,type:0},
					],
				ispay:0,
				waitpayTime: 30,
				timerIdforgood: null,
            };
        },
		components: {uniPopup},
        methods: {
			//支付
			async postpay(openid,ordernum,allmoney,getcoupontype,getticket,body,goodimg,couponid,goodinfo){
				let info= await this.$apis.accountorder({openid:openid,ordernum:ordernum,allmoney:allmoney,getcoupontype:getcoupontype,
				getticket:getticket,body:body,goodimg:goodimg,couponid:couponid,goodinfo:JSON.stringify(goodinfo)});
				uni.showLoading({
					title:'支付中...'
				});
				let t=this;
				if(info.code==1){
						console.log(t.ispay,'是否支付')
						this.timerIdforgood = setInterval(() => {
							t.checkgoodorder(openid,ordernum);
							setTimeout(()=>{
								if(t.ispay==1){
									clearInterval(t.timerIdforgood);
									console.log(t.ispay,'走支付成功')
									uni.hideLoading();
									uni.showModal({
									    title: '购买完成提示',
									    content: '欢迎再次光临！',
										showCancel:this.showcan,
									    success: function (res) {
									        if (res.confirm) {
									            uni.reLaunch({
									            	url:'../../pages/index/index'
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
									t.backyue(openid,ordernum);
									t.waitpayTime=30;
									uni.hideLoading();
									uni.showModal({
									    title: '购买异常提示',
									    content: '请检查微信余额支付是否足以支付此次购买金额，或者网络是否正常，欢迎再次购买！',
										showCancel:this.showcan,
									    success: function (res) {
									        if (res.confirm) {
									            uni.reLaunch({
									            	url:'../../pages/index/index'
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
					//uni.showToast({title:info.msg,duration:1500,icon:'none'});
					uni.showModal({
					    title: '购买异常提示',
					    content: '异常信息：'+info.msg,
						showCancel:this.showcan,
					    success: function (res) {
					        if (res.confirm) {
					            uni.reLaunch({
					            	url:'../../pages/index/index'
					            })
					        }
					    }
					});
				}
				
			},
			//根据订单号查询是否真的支付成功
			async checkgoodorder(openid,out_trade_no){
				let info= await this.$apis.checkgoodorder({openid:openid,out_trade_no:out_trade_no});
				let t=this;
				console.log(info.data,'检查支付返回')
				if(info.data==1){
					t.ispay=1;
				}else{
					t.ispay=0;
				}
				console.log(t.ispay,'t.ispay')
			},
			//后台检查余额恢复
			async backyue(openid,out_trade_no){
				let info= await this.$apis.backyue({openid:openid,out_trade_no:out_trade_no});
			},
			//关门上传商品数据
			async updatecloseorder(allmoney,ordernum,goodinfo,goodtitle,goodimg){
				let info= await this.$apis.updatecloseorder({allmoney:allmoney,ordernum:ordernum,goodinfo:JSON.stringify(goodinfo),goodtitle:goodtitle,goodimg:goodimg});
			},
			//获取我的优惠券
			async mycouponlist(){
				let getopenid=uni.getStorageSync('openid');
				let info= await this.$apis.mycouponlist({openId:getopenid});
				this.list=info.data.couponList;
				if(info.data.couponList.length>0){
					if(this.allmoney>0){
						//不选优惠券一样要上传商品和总价格。防止什么都不选直接关闭逃单
						let goodtitle='';
						let goodimg='';
						for(var i=0;i<this.userproductList.length;i++){
							goodtitle+=this.userproductList[i].name+",";
						}
						goodimg=this.userproductList[0].image;
						let orderId=uni.getStorageSync('ordernum');
						this.updatecloseorder(this.allmoney,orderId,this.userproductList,goodtitle,goodimg);
						this.$refs.popups.open()
					}else{
						//结速购买，返回首页
						uni.showModal({
						    title: '完成提示',
						    content: '欢迎再次光临！',
							showCancel:this.showcan,
						    success: function (res) {
						        if (res.confirm) {
						            uni.reLaunch({
						            	url:'../../pages/index/index'
						            })
						        } else if (res.cancel) {
						            console.log('用户点击取消');
						        }
						    }
						});
					}
				}else{
					//没优惠券，直接提交订单
					if(this.allmoney>0){
						let goodtitle='';
						let goodimg='';
						for(var i=0;i<this.userproductList.length;i++){
							goodtitle+=this.userproductList[i].name+",";
						}
						goodimg=this.userproductList[0].image;
						console.log(this.userproductList,'提交的商品')
						console.log(goodtitle,'提交的商品名称')
						console.log(this.allmoney,'商品总额')
						console.log(goodimg,'提交的商品图片')
						//openid,ordernum,allmoney,getcoupontype,getticket,body,goodimg,couponid,goodinfo
						let orderId=uni.getStorageSync('ordernum');
						//也先提交柜机未支付订单
						this.updatecloseorder(this.allmoney,orderId,this.userproductList,goodtitle,goodimg);
						this.postpay(getopenid,orderId,this.allmoney,0,0,goodtitle,goodimg,0,this.userproductList);
					}else{
						//结速购买，返回首页
						uni.showModal({
						    title: '完成提示',
						    content: '欢迎再次光临！',
							showCancel:this.showcan,
						    success: function (res) {
						        if (res.confirm) {
						            uni.reLaunch({
						            	url:'../../pages/index/index'
						            })
						        } else if (res.cancel) {
						            console.log('用户点击取消');
						        }
						    }
						});
					}
					
					
				}
			},
			docheck(id){
				console.log(id,'22')
				this.list[id].state=!this.list[id].state;
				for(var i=0;i<this.list.length;i++){
					if(i!=id){
							this.list[i].state=0;
					}
				}
			},
			postcoupon(){
				let t=this;
				let getcoupon=[];
				for(var i=0;i<this.list.length;i++){
					if(this.list[i].state){
							getcoupon.push(this.list[i])
					}
				}
				if(getcoupon.length==0){
					uni.showModal({
					    title: '温馨提示',
					    content: '确定不使用任何优惠卡券吗？',
						confirmText:'不稀罕',
					    success: function (res) {
					        if (res.confirm) {
					           console.log('用户点击确定');
							   let goodtitle='';
							   let goodimg='';
							   for(var i=0;i<t.userproductList.length;i++){
							   	goodtitle +=t.userproductList[i].name;
							   }
							   goodimg=t.userproductList[0].image;
							   console.log(goodtitle,'提交的商品名称')
							   console.log(goodimg,'提交的商品图片')
							   console.log(t.allmoney,'商品总额')
							   console.log(t.userproductList,'提交的商品')
							  //没选择优惠券，直接提交
							  //openid,ordernum,allmoney,getcoupontype,getticket,body,goodimg,couponid,goodinfo
							  let orderId=uni.getStorageSync('ordernum');
							  let openid=uni.getStorageSync('openid');
							  //也先提交柜机未支付订单
							  this.updatecloseorder(t.allmoney,orderId,t.userproductList,goodtitle,goodimg);
							  t.postpay(openid,orderId,t.allmoney,0,0,goodtitle,goodimg,0,t.userproductList);
					        } else if (res.cancel) {
					            console.log('用户点击取消');
					        }
					    }
					});
				}else{
					t.getticket=getcoupon[0].ticket;
					t.getcoupontype=getcoupon[0].type;
					t.couponid=getcoupon[0].id;
					let goodtitle='';
					let goodimg='';
					for(var i=0;i<t.userproductList.length;i++){
						goodtitle+=t.userproductList[i].name;
					}
					goodimg=t.userproductList[0].image;
					console.log(goodtitle,'提交的商品名称')
					console.log(goodimg,'提交的商品图片')
					console.log(this.allmoney,'商品总额')
					console.log(this.userproductList,'提交的商品')
					console.log(getcoupon[0].ticket,'优惠金额')
					console.log(getcoupon[0].type,'优惠类型')
					console.log(getcoupon[0].id,'优惠id')
					//有选择优惠券，提交订单
					console.log(getcoupon,'选中的优惠券')
					//openid,ordernum,allmoney,getcoupontype,getticket,body,goodimg,couponid,goodinfo
					let orderId=uni.getStorageSync('ordernum');
					let openid=uni.getStorageSync('openid');
					//也先提交柜机未支付订单
					this.updatecloseorder(t.allmoney,orderId,t.userproductList,goodtitle,goodimg);
					this.postpay(openid,orderId,t.allmoney,getcoupon[0].type,getcoupon[0].ticket,goodtitle,goodimg,getcoupon[0].id,t.userproductList);
				}
				
			},
			showmode(){
				this.$refs.popup.open()
			},
			hiddenmode(){
				this.$refs.popup.close()
			},
			//获取柜机商品
			async getallgood(sn){
				let info= await this.$apis.getallgood({sn:sn});
				console.log(info.data,'返回商品')
				this.myproductList=info.data;
			},
			//用户所拿商品
			async getgood(orderId){
				let info= await this.$apis.getgood({orderId:orderId});
				console.log(info.data,'返回用户商品')
				if(info.data.data.products.length>0){
					this.showmode()
				}
				if(info.data.data.close){
					clearInterval(this.timerId);
					this.hiddenmode();
					//检查是否有优惠券
					this.mycouponlist()
					// uni.showToast({
					// 	title:'已关门'
					// })
					
				}
				this.userproductList=info.data.data.products;
				this.totalmoney(info.data.data.products)
			},
			toIndex() {
				clearInterval(this.timerId);
				uni.reLaunch({
					url:'../../pages/index/index'
				})
			},
			//计算价格
			totalmoney(data){
				var selectArr = data;   //已选择的商品
				    var totalPrice = 0;
				    if(selectArr.length){  //如果存在商品就计算价格
				      for(var i=0;i<selectArr.length;i++){
				        totalPrice += selectArr[i].number * selectArr[i].price;
				      }
				      totalPrice = totalPrice.toFixed(2);  //乘法有点问题, 需要保留一下小数
				      console.log("计算价格:",totalPrice)
				      this.allmoney=totalPrice;
				    } else{  //不存在商品就把总价格置为 0
				      this.allmoney=0;
				    }
			}
        },
        onLoad(option) {
			console.log(option.productNumber,'传过来')
			//this.$refs.popups.open()
			//this.mycouponlist()
			this.getallgood(option.productNumber)
            setTimeout(() => {
                this.renderImage = true;
            }, 300);
			let orderId=uni.getStorageSync('ordernum');
			this.timerId = setInterval(() => {
					var reqTime = this.reqTime;
					reqTime--;
					this.reqTime = reqTime;
					if (reqTime < 1) {
						clearInterval(this.timerId);
						uni.reLaunch({
							url:'../../pages/index/index'
						})
						//30分种后不关就报估计异常
					}
					// console.log(reqTime,'请求时间')
					this.getgood(orderId);
				},
				500);
			
			
        }
    };
</script>

<style lang="scss">
    /* product */
    page {
        background: #F8F8F8;
    }

    view {
        font-size: 28upx;
    }

    .uni-product-list {
        display: flex;
        width: 100%;
        flex-wrap: wrap;
        flex-direction: row;
    }

    .uni-product {
        padding: 20upx;
        display: flex;
        flex-direction: column;
    }

    .image-view {
        height: 330upx;
        width: 330upx;
        margin: 12upx 0;
    }

    .uni-product-image {
        height: 330upx;
        width: 330upx;
    }

    .uni-product-title {
        width: 300upx;
        word-break: break-all;
        display: -webkit-box;
        overflow: hidden;
        line-height: 1.5;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
    }

    .uni-product-price {
        margin-top: 10upx;
        font-size: 28upx;
        line-height: 1.5;
        position: relative;
    }

    .uni-product-price-original {
        color: #e80080;
    }

    .uni-product-price-favour {
        color: #888888;
        text-decoration: line-through;
        margin-left: 10upx;
    }

    .uni-product-tip {
        position: absolute;
        right: 10upx;
        background-color: #ff3333;
        color: #ffffff;
        padding: 0 10upx;
        border-radius: 5upx;
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
	.price{
		color: #848484;
		padding-top: 20rpx;
	}
	.choosegoodimg image{
		width: 140rpx;
		height: 160rpx;
	}
	.list{
		width: 90%;
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
	}
	.back{
		width: 50%;
		margin:0 auto;
		.btn{
			padding: 0 50upx;
			height: 70upx;
			display: flex;
			justify-content: center;
			border: solid 2upx #f06c7a;
			color: #f06c7a;
			align-items: center;
			border-radius: 10upx;
			font-size: 34upx;
		}
	}
	.dosure{
		position: absolute;
		right: 25upx;
		top: 20upx;
	}
	.coupon-item {
		width:100%; height:auto; display:table; border-radius:10upx; padding:0 20upx; margin-top:22upx; border:1px solid #eeeeee; position:relative;
		.coupon-money {
			width:465upx; height:auto; display:table; float:left; padding:26upx 0; border-style:none dotted none none; border-color:#eeeeee;
			
			.nick { width:100%; height:50upx; line-height:30upx; font-size:24upx; color:#999999; }
			.tit { width:100%; height:50upx; line-height:50upx; font-size:24upx; color:#999999; }
			.demand { width:100%; height:30upx; line-height:30upx; font-size:24upx; color:#999999; }
			
			.layof { width:100%; height:48upx; line-height:30upx; font-size:44upx; color:#ff9000; font-weight:bold; }
			.end_time { width:100%; height:30upx; line-height:30upx; font-size:24upx; color:#999999; }
		}
		.get-btn { width:146upx; height:65upx; line-height:65upx; position:absolute; top:50%; right:26upx; margin-top:-26upx; text-align:center; border-radius:60upx; color:#ff9000; border:1px solid #ff9000; font-size:32upx; float:right; }
	}
	.coupon-item:after { width:40upx; height:20upx; position:absolute; left:460upx; top:-1px; border-radius:0 0 40upx 40upx; content:""; display:block; background:#ffffff; border:1px solid #eeeeee; border-top:0px; }
	.coupon-item:before { width:40upx; height:20upx; position:absolute; left:460upx; bottom:-1px; border-radius:40upx 40upx 0 0; content:""; display:block; background:#ffffff; border:1px solid #eeeeee; border-bottom:0px; }
	
</style>
