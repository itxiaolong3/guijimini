<script>
	export default {
		onLaunch: function() {
			//console.log('App onLaunch')
			 
		},
		methods: {
			//更新个人信息
			async savesingres(openid,contract_id){
				let info= await this.$apis.savesingres({openid:openid,contract_id:contract_id});
			},
		},
		onShow: function(res) {
			console.log(res,'app中显示')
			if(res.query.productNumber){
				console.log(res.query.productNumber,'不为空')
				// uni.reLaunch(
				// {url:"../../pages/goodlist/goodlist?productNumber="+res.query.productNumber}
				// )
			}
			if (res.scene === 1038) { // 场景值1038：从被打开的小程序返回
			    const { appId, extraData } = res.referrerInfo
			    if (appId == 'wxbd687630cd02ce1d') { // appId为wxbd687630cd02ce1d：从签约小程序跳转回来
			        if (typeof extraData == 'undefined'){
			            // TODO
			            // 客户端小程序不确定签约结果，需要向商户侧后台请求确定签约结果
						if(res){
							console.log(res,'不确定签约结果')
						}
			            return;
			        }
			        if(extraData.return_code == 'SUCCESS'){
			            // TODO
			            // 客户端小程序签约成功，需要向商户侧后台请求确认签约结果
			            var contract_id = extraData.contract_id;
						let openid=uni.getStorageSync('openid');
						//this.savesingres(openid,contract_id)
						console.log(contract_id,'签约协议ID')
			            return;
			        } else {
			            // TODO
			            // 签约失败
						console.log(contract_id,'签约失败')
			            return;
			        }
			    }
			}
		},
		onHide: function() {
			// console.log('App Hide')
		}
	}
</script>

<style lang="less">
@import 'style/base.less';
.page{
	// color: #FFFFFF;
	// background-color: #333333;
}
</style>
