<template>
	<view>
		<view class="main" style="background:#FFF; padding:20rpx;">
		<!-- <u-parse :content="article" @preview="preview" @navigate="navigate" ></u-parse> -->
		<rich-text :nodes="article"></rich-text>
		</view>
	</view>
</template>

<script>
	import uParse from '@/components/u-parse/u-parse.vue'
	export default {
		components: {
		    uParse
		  },
		data() {
			return {
				adid:0,
				article: '<div>无数据</div>'
			}
		},
		onLoad(option) {
			console.log("option: " + JSON.stringify(option));
			let getadid = parseInt(option.adid);
			this.adid=getadid;
			this.getadv(this.adid);
		},
		methods: {
			async getadv(adid){
				let info= await this.$apis.getadv({adid:adid});
				this.article=info.data.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ');
			},
			preview(src, e) {
			      // do something
				  console.log(src,'图片地址')
				  console.log(e,'图片e')
			    },
			    navigate(href, e) {
			      // do something
			    }
		}
	}
</script>

<style lang="scss">
	.main{
		color: #808080;
		font-size: 30rpx;
	}
// @import "../../components/u-parse/u-parse.css";
</style>
