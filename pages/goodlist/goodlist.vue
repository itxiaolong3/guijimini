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
			<view class="tip">您已选购商品如下：一共：{{allmoney}}元</view>
			<view class="choosegood" v-for="(product,index) in userproductList" :key="index">
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
		<uni-popup ref="popups" type="bottom" :maskClick="couponmask">
			<view class="tip">请选中其中一张优惠卡<view class="dosure" @click="postcoupon">确定</view></view>
			
			<view class="coupon-item" v-for="(item,index) in list" :key="index">
				<view class="coupon-money">
					<view class="nick">{{item.title}}</view>
					<view class="layof" :style="{color:theme}">{{item.ticket}}</view>
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
				reqTime:3600,
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
					]
            };
        },
		components: {uniPopup},
        methods: {
			//获取我的优惠券
			async mycouponlist(){
				let getopenid=uni.getStorageSync('openid');
				let info= await this.$apis.mycouponlist({openId:getopenid});
				this.list=info.data.couponList;
				if(info.data.couponList.length>0){
					this.$refs.popups.open()
				}else{
					//没优惠券，直接提交订单
					console.log(this.userproductList,'提交的商品')
					
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
							   console.log(this.userproductList,'提交的商品')
							  //没选择优惠券，直接提交
					        } else if (res.cancel) {
					            console.log('用户点击取消');
					        }
					    }
					});
				}else{
					t.getticket=getcoupon[0].ticket;
					t.getcoupontype=getcoupon[0].type;
					t.couponid=getcoupon[0].id
					console.log(this.userproductList,'提交的商品')
					console.log(getcoupon[0].ticket,'优惠金额')
					console.log(getcoupon[0].type,'优惠类型')
					console.log(getcoupon[0].id,'优惠id')
					//有选择优惠券，提交订单
					console.log(getcoupon,'选中的优惠券')
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
					uni.showToast({
						title:'已关门'
					})
					
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
		.get-btn { width:146upx; height:52upx; line-height:50upx; position:absolute; top:50%; right:26upx; margin-top:-26upx; text-align:center; border-radius:60upx; color:#ff9000; border:1px solid #ff9000; font-size:24upx; float:right; }
	}
	.coupon-item:after { width:40upx; height:20upx; position:absolute; left:460upx; top:-1px; border-radius:0 0 40upx 40upx; content:""; display:block; background:#ffffff; border:1px solid #eeeeee; border-top:0px; }
	.coupon-item:before { width:40upx; height:20upx; position:absolute; left:460upx; bottom:-1px; border-radius:40upx 40upx 0 0; content:""; display:block; background:#ffffff; border:1px solid #eeeeee; border-bottom:0px; }
	
</style>
