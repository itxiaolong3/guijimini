<template>
    <view class="content page">
		<!-- 3D轮播 -->
		<view class="">
			<view class="page-section-spacing">
				<swiper class="swiper" 
					indicator-dots="true" 
					autoplay="true" 
					interval="5000" 
					duration="1000"	>
					<swiper-item v-for="(item , index) in bannerlist" :key="index" @click="handleChange(item.adid)">
						<image :src="item.imgs" mode="aspectFill"></image>
					</swiper-item>
				</swiper>
			</view>
			<!-- <swiper class="imageContainer" :indicator-dots="true" previous-margin="50rpx" next-margin="50rpx" circular  autoplay>
				<block v-for="(item,index) in bannerlist" :key="index">
					<swiper-item class="swiperitem" @click="handleChange(item.adid)">
						<image class="itemImg" :class="currentIndex == index ? 'swiperactive': ''" :src="item.imgs" lazy-load mode="scaleToFill"></image>
					</swiper-item>
				</block>
			</swiper> -->
		</view>
		<view class="gzmain">
			<official-account></official-account>
			<!-- <view class="gongzh">
				<view>
					更多优惠资讯请关注喜果公众号
				</view>
				<view class="gzbt">点我关注</view>
			</view> -->
		</view>
		<view class="bottommain">
			<tab-bar></tab-bar>
		</view>
		
    </view>
</template>

<script>
	import tabBar from '../../components/tabBar.vue';
	import swiperBanner  from '../../components/jing-swiper/jing-swiper.vue';
export default {
	
    data() {
        return {
			showdots:true,
			bannerlist:[
				{
					imgs:'../../static/img/goods/p2.jpg',
					adid:1
				},
				{
					imgs:'../../static/img/goods/p1.jpg',
					adid:2
				},
				{
					imgs:'../../static/img/goods/p3.jpg',
					adid:3
				},
				{
					imgs:'../../static/img/goods/p4.jpg',
					adid:4
				},
				{
					imgs:'../../static/img/goods/p5.jpg',
					adid:5
				}
			],
			imgList:[
			'../../static/img/goods/p2.jpg',
			'../../static/img/goods/p1.jpg',
			'../../static/img/goods/p3.jpg',
			'../../static/img/goods/p4.jpg',
			'../../static/img/goods/p5.jpg'],
        }
    },
	onLoad() {
		console.log('index-onload')
		this.bannerlist1();
	},
	components: {
		tabBar
	},
    methods: {
		handleChange(e){
			console.log(e,'点击轮播图')
			uni.navigateTo({url:'../advdetail/advdetail?adid='+e}) 
		},
		async bannerlist1(){
			let info= await this.$apis.bannerlist({});
			this.bannerlist=info.data;
			
		},
		//更新个人信息
		async openidtogetinfoforindex(openid){
			let info= await this.$apis.openidtogetinfo({openid:openid});
			this.userinfo=info.data;
			uni.setStorageSync('phone',info.data.phone)
			console.log(this.userinfo,'首页得到用户信息')
		},
    },
	onShow(res) {
		let getopenid=uni.getStorageSync('openid');
		if(getopenid!=''&&getopenid!=null){
			console.log('有openid')    
			this.openidtogetinfoforindex(getopenid)
		}
		        
	}
}
</script>

<style lang="scss">
	
	.swiper{
		height: 900upx;
	}
	// swiper-item 里面的图片高度
	swiper-item image{
		width: 100%;
		height: 900upx;
	}
	// 3D轮播样式开始
	// .imageContainer {
	// 	width: 100%;
	// 	height: 870rpx;
	// 	
	// }
	// 
	// .swiperitem {
	// 	/* height: 500rpx; */
	// 	height: 255upx;
	// 	padding: 0upx 20upx;
	// 	box-sizing: border-box;
	// 	position: relative;
	// 	.swiperText {
	// 		display: flex;
	// 		flex-direction: column;
	// 		align-items: center;
	// 		position: absolute;
	// 		top: 56upx;
	// 		left: 51upx;
	// 		z-index: 998;
	// 		width:162upx;
	// 		height:163upx;
	// 		background:rgba(255,255,255,1);
	// 		border-radius:8upx;
	// 		padding:10upx;
	// 		.name {
	// 			font-size:26upx;
	// 			font-weight:500;
	// 			color:rgba(253,57,91,1);
	// 			line-height:37upx;
	// 			margin-bottom: 10upx;
	// 		}
	// 		.zq,.cz {
	// 			font-size:20upx;
	// 			color:rgba(253,57,91,1);
	// 			line-height:35upx;
	// 		}
	// 		.addNl {
	// 			width:120upx;
	// 			height:26upx;
	// 			background:rgba(253,57,91,1);
	// 			border-radius:13upx;
	// 			font-size:20upx;
	// 			font-weight:500;
	// 			color:rgba(255,255,255,1);
	// 			text-align: center;
	// 			line-height: 26upx;
	// 			margin-top: 10upx;
	// 		}
	// 		
	// 	}
	// }
	// 
	// .itemImg {
	// 	position: absolute;
	// 	width: 100%;
	// 	/* height: 380rpx; */
	// 	height: 870rpx;
	// 	border-radius: 15rpx;
	// 	z-index: 1;
	// 	// opacity: 0.7;
	// 	top: 5%;
	// 	box-shadow:0px 4upx 15upx 0px rgba(153,153,153,0.24);
	// }
	// 
	// .swiperactive {
	// 	width: 95%;
	// 	opacity: 1;
	// 	z-index: 2;
	// 	/* height: 430rpx; */
	// 	height: 287upx;
	// 	top: 0%;
	// 	transition: all .2s ease-in 0s;
	// }
	// 
	// .zhankai{
	// 	text-align: center;
	// 	.iconfont{
	// 		margin-left: 10upx;
	// 	}
	// }
	// 轮播图样式结束
	.gzmain{
		background-color:#3F536E;
		border-radius:20upx;
		width:90%;
		margin:0 auto;
		margin-top:10upx;
		.gongzh{
			display: flex;
			padding: 20upx 5upx;
			margin: 20upx 10upx;
			width: 100%;
			height: 40upx;
			font-size: 30upx;
			justify-content:center;
			color:#fff;
			.gzbt{
				color: #f96477;
				font-weight: bold;
				padding-left: 10upx;
			}
		}
	}
	
	
</style>
