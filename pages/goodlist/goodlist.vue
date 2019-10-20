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
    </view>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
    export default {
        data() {
            return {
				maskclose:false,
                title: 'product-list',
                productList: [],
                myproductList: [],
                userproductList: [],
                renderImage: false,
				allmoney:0,
				timerId: null,
				reqTime:3600
            };
        },
		components: {uniPopup},
        methods: {
            loadData(action = 'add') {
                const data = [{
                        image: '../../static/img/goods/p1.jpg',
                        title: 'Apple iPhone X 256GB 深空灰色 移动联通电信4G手机',
                        originalPrice: 9999,
                        favourPrice: 8888,
                        tip: '自营'
                    },
                    {
                        image: '../../static/img/goods/p2.jpg',
                        title: 'Apple iPad 平板电脑 2018年新款9.7英寸',
                        originalPrice: 3499,
                        favourPrice: 3399,
                        tip: '优惠'
                    },
                    {
                        image: '../../static/img/goods/p3.jpg',
                        title: 'Apple MacBook Pro 13.3英寸笔记本电脑（2017款Core i5处理器/8GB内存/256GB硬盘 MupxT2CH/A）',
                        originalPrice: 12999,
                        favourPrice: 10688,
                        tip: '秒杀'
                    },
                    {
                        image: '../../static/img/goods/p4.jpg',
                        title: 'Kindle Paperwhite电纸书阅读器 电子书墨水屏 6英寸wifi 黑色',
                        originalPrice: 999,
                        favourPrice: 958,
                        tip: '秒杀'
                    },
                    {
                        image: '../../static/img/goods/p5.jpg',
                        title: '微软（Microsoft）新Surface Pro 二合一平板电脑笔记本 12.3英寸（i5 8G内存 256G存储）',
                        originalPrice: 8888,
                        favourPrice: 8288,
                        tip: '优惠'
                    }
                ];

                if (action === 'refresh') {
                    this.productList = [];
                }

                data.forEach(item => {
                    this.productList.push(item);
                });
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
					this.hiddenmode()
					uni.showToast({
						title:'已关门'
					})
					clearInterval(this.timerId);
				}
				this.userproductList=info.data.data.products;
				this.totalmoney(info.data.data.products)
			},
			toIndex() {
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
			this.getallgood(option.productNumber)
            //this.loadData();
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
							url:'../../../pages/index/index'
						})
						//30分种后不关就报估计异常
					}
					this.getgood(orderId);
				},
				500);
			
			
        },
		
        // onPullDownRefresh() {
        //     this.loadData('refresh');
        //     // 实际开发中通常是网络请求，加载完数据后就停止。这里仅做演示，加延迟为了体现出效果。
        //     setTimeout(() => {
        //         uni.stopPullDownRefresh();
        //     }, 2000);
        // },
        // onReachBottom() {
        //     this.loadData();
        // }
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
</style>
