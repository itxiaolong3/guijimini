<template>
	<view class="content">
		<view  v-for="(obj,index) in list"  :key="index"   :options="obj.id"  >
			<view class="contBox">
				<!-- <view class="circleBox" @click.stop="inp(obj.id)"> -->
					<view class="circleBox">
					<image src="../../../static/bbh-shopCar/icon/circleCachee.png"  class="circle"  v-if="!obj.check"></image>
					<image src="../../../static/bbh-shopCar/icon/circleCacheef.png" class="circle"  v-if="obj.check"></image>
				</view>
				<view class="goodBox">
					<view>{{obj.productName}}<text>{{obj.productPrice}}</text></view>
					<view class="countBox">
						<view class="sign" @click="signCount(obj.id)">
							<image src="../../../static/bbh-shopCar/icon/signf.png"  v-if="obj.count>0"></image>
							<image src="../../../static/bbh-shopCar/icon/signe.png"  v-if="obj.count==0"></image>
						</view>
						<view class="count">{{obj.count}}</view>
						<view class="add" @click="addCount(obj.id)">
							<image src="../../../static/bbh-shopCar/icon/addf.png" ></image>
							<!-- <image src="../../../static/bbh-shopCar/icon/adde.png"   v-if="obj.stock==obj.count"></image> -->
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="allBox">
			<view>
				<!-- <view @click="all()">
					<image src="../../../static/bbh-shopCar/icon/circleCacheef.png"  v-if="flag"></image>
					<image src="../../../static/bbh-shopCar/icon/circleCachee.png"   v-if="!flag"></image>
					<text>全选</text>
				</view> -->
				<view><text>总上货数量</text></view>
				<text class="total">数量:{{checkcount}}</text>
			</view>
			<view @click="goPay()">提交</view>
		</view>
	</view>
</template>

<script>
	// import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue';
	export default {
		data() {
			return {
				list : [	//这里的check后台如果没有给相关参数判断，自己拿到接口数据后，可以增加一个这样的对象；
					
				],
				flag  : false,				//判断是否全选
				money : 0,					//总金额
				num   : 0 					,//删除数据后，用来判断是否全选
				checkcount:0
			}
		},
		// created() {						//上面是模拟数据，以下是接口获取数据，
		// 	var _this = this;
		// 	uni.request({
		// 		url : "",
		// 		data:{},
		// 		method: 'POST',
		// 		header : {'content-type':'application/x-www-form-urlencoded',"Access-Control-Allow-Origin":"*","Access-Control-Allow-Credentials":"true","Access-Control-Allow-Methods":"*","Access-Control-Allow-Headers":"Content-Type,Access-Token"},
		// 		dataType: 'json',
		// 		success: function (data) {	
		// 			data.forEach((item)=>{				//data实际根据你的数据类型对象来
		// 				_this.$set(item,"check",false); //每条数据增加一个check字段；
		// 			});
		// 			_this.list = data;
		// 			console.log(JSON.stringify(_this.list));
		// 		}
		// 	})
		// },
		// components:{
		// 	uniSwipeAction
		// },
		methods: {
			//获取柜机商品
			async getallgood(sn){
				let info= await this.$apis.getallgood({sn:sn});
				console.log(info.data,'返回商品')
				this.list=info.data;
			},
			async updowngood(openid,goodinfo,sn,allnum){
				let info= await this.$apis.updowngood({type:1,openid:openid,goodinfo:goodinfo,sn:sn,allnum:allnum});
				console.log(info.data,'上架返回')
				if(info.data.code==200){
					uni.showToast({
						title:'上架成功'
					})
					setTimeout(function(){
						uni.navigateBack({
							delta:1
						})
					},1500)
				}
				
			},
			all(index) { //全选
				this.flag = !this.flag;
				if (this.flag) {
					for (var i = 0; i < this.list.length; i++) {
						this.list[i].check = true;
					}
					this.num = this.list.length;
					this.total();
				} else {
					for (var i = 0; i < this.list.length; i++) {
						this.list[i].check = false;
					}
					this.num = 0;
					this.money = 0;
					this.checkcount=0;
				}
			},
			signCount(id) { //减少商品
				for (var i = 0; i < this.list.length; i++) {
					var obj = this.list[i];
					if (obj.id == id) {
						if (obj.count > 0) {
							obj.count--;
						}
						break;
					}
				}
				this.total();
			},
			addCount(id) { //增加商品
				for (var i = 0; i < this.list.length; i++) {
					var obj = this.list[i];
					if (obj.id == id) {
						obj.count++;
						obj.check=true;
						// if (obj.count < obj.stock) {
						// 	obj.count++;
						// } else {
						// 	uni.showToast({
						// 		title: "当前库存不足"
						// 	});
						// }
						break;
					}
				}
				this.total();
			},
			inp(index) { //商品选择
				for (var i = 0; i < this.list.length; i++) {
					if (this.list[i].id == index) {
						this.list[i].check = !this.list[i].check;
						if (this.list[i].check == false) {	  		 //如果有条数据没选择，就取消全选
							this.flag = false;
							this.num -= 1;
							this.money -= this.list[i].price * this.list[i].count;
							//??
							this.checkcount-=this.list[i].count;
						} else {
							this.num += 1;
							this.money += this.list[i].price * this.list[i].count;
							this.checkcount +=this.list[i].count;
							if (this.num == this.list.length) {		//如果全部选中了
								this.flag = true;
							}
						}
					}
				}
			},
			removeM(id) { //商品删除
				var _this = this;
				for(var i = 0; i < this.list.length; i++) {
					var obj = this.list[i];
					if (obj.ID == id) {
						uni.showModal({
							title: '',
							content: '确定删除,不再看看吗',
							confirmText: '确定',
							success: function(res) {
								if (res.confirm) {
									_this.list.splice(i, 1);
									if (obj.check) {			//如果选中状态下删除
										_this.num--;
										_this.total();
									}
									if (_this.num == 0) {		//删除后还需要判断下当前的num是否跟当前的数据长度相同，是否显示全选
										_this.flag = false;
									} else {
										if (_this.num == _this.list.length) {
											_this.flag = true;
										}
									}
								}
							}
						});
						break;
					}
				}
			},
			total() { //计算总价---只计算选中的；
				this.money = 0;
				this.checkcount=0;
				for (var i = 0; i < this.list.length; i++) {
					if (this.list[i].check == true) {
						this.money += this.list[i].price * this.list[i].count;
						this.checkcount+=this.list[i].count;
					}
					if(this.list[i].count<1){
						this.list[i].check = false;
						console.log('为0了')
					}else{
						this.list[i].check == true;
						console.log('不为0了')
					}
				}
				console.log(this.checkcount,'当前总数量')
			},
			goPay() { //去结算
				const arry = this.list.filter(function(item) { //结算过虐选中的数据，arry这个数组就是最后你要提交的数据
					return item.check === true;
				})
				
				console.log("arry: " + JSON.stringify(arry));
				console.log(this.checkcount,'总数量')
				if (arry.length == 0) {
					uni.showToast({
						title: "您还没有选中要结算的商品",
						icon: "none"
					});
					return
				}
				//openid,goodinfo,sn,allnum
				let openid=uni.getStorageSync('openid');
				let sn=uni.getStorageSync('shsn');
				this.updowngood(openid,JSON.stringify(arry),sn,this.checkcount)
			}
		},
		onLoad(option) {
			console.log(option.sn,'传过来')
			//this.getallgood(option.sn) 
			this.getallgood(option.sn)
		}
	}
</script>

<style lang="scss">
	.contBox{
		width: 100%;
		height: 160rpx;
		position: relative;
		z-index: 1;
		box-sizing: border-box;
		background:rgba(255,255,255,1);
		border-radius:16rpx;
		
	}
	/* input选项 */
	.circleBox{
		width:88rpx;
		height: 100%;
		display: flex;
		align-items: center;
		position: absolute;
		top: 0rpx;
		left: 80rpx;
		z-index: 2;
	}
	.circle{
		width: 48rpx;
		height:48rpx;
	} 
	/* 主体内容 */
	.goodBox{
		width: 670rpx;
		height: 160rpx;
		padding-left: 112rpx;
		box-sizing: border-box;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #f5f5f5;
		margin: 0 auto;
		border-radius: 16rpx;
	}
	
	/* 加减模块 */
	.countBox{
		width:200rpx;
		height:80rpx;
		display: flex;
		align-items: center;
		margin-right: 32rpx;
	}
	.countBox image{
		width: 48rpx;
		height: 48rpx;
	}
	.sign,.add{
		width: 80rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.count{
		width:40px;
		text-align: center;
		font-size: 28rpx;
	}
	/* 加减模块结束 */
	/* 主体内容结束 */
	
	/* 底部样式 */
	.allBox {
		width: 100%;
		height: 98upx;
		position: fixed;
		bottom: 0upx;
		left: 0upx;
		display: flex;
		z-index: 1001;
		border: 1rpx solid #e0e0e0;
		margin-top: 100rpx;
	}
	.allBox image {
		width: 44upx;
		height: 44upx;
		margin-right:12upx;
		vertical-align: middle;
		margin-top: -8upx;
	}
	.allBox>view:nth-of-type(1) {
		flex-grow: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 32upx;
		font-weight: 300;
		color: rgba(20, 23, 30, 1);
		padding: 0upx 46upx 0upx 42upx;
		background: white;
	}
	.allBox>view:nth-of-type(2) {
		width: 260upx;
		height: 100%;
		line-height: 98upx;
		text-align: center;
		color: white;
		font-size: 32upx;
		font-weight: bold;
		background: #CC3347;
	}
	.total {
		font-weight: bold !important;
		color: #cc3374 !important;
	}
</style>
