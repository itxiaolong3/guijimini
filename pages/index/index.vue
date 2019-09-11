<template>
    <view class="content">
        <hchPosition :storeData="storeData" :markers="markers"></hchPosition>
    </view>
</template>

<script>
import hchPosition from "../../wxcomponents/hch-position/hch-position"
export default {
	
    data() {
        return {
			storeData:[//门店信息展示  id name address tel 必填
				{
					id:1,
					name:'门店XXXXX1号',
					address:'厦门市思明区汇景商业广场XXX1号',
					tel:'12345678900',
				},{
					id:2,
					name:'门店XXXXX2号',
					address:'厦门市思明区汇景商业广场XXX2号',
					tel:'12345678900',
				},
			],
			markers: [//门店在地图上的标记 以下字段必填 
				{
				id:1,
			    latitude: 22.656830122431952,
			    longitude: 114.01990361901852,
			    iconPath: '../../static/hch-position/门店.png',
				callout:{
					content:"柜机投放地福田大厦",
					borderRadius:10,
					padding:10,
					display:"ALWAYS",
				}
			}, {
				id:2,
			    latitude: 22.663465,
			    longitude: 114.023343,
			    iconPath: '../../static/hch-position/门店.png',
				callout:{
					content:"门店XXXXX2号店",
					borderRadius:10,
					padding:10,
					display:"ALWAYS",
				}
			}],
        }
    },
	components:{
		hchPosition,
	}, 
	onLoad() {
		let t=this;
		uni.login({
			success:function(e){
				console.log(e.code,'code')
				t.getapiinfo(e.code)
			}
		})
		
	},
    methods: {
		async getapiinfo(code){
			let info= await this.$apis.chencklogin({code:code});
			if(info.code==0){
				uni.reLaunch(
				{url:"../../pages/auth/auth"}
				)
			}else{
				console.log('已登录')
			}
		},
    },
	onShow() {
		
	}
}
</script>

<style lang="scss">
	
	
</style>
