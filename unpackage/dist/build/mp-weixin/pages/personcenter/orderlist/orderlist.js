(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/personcenter/orderlist/orderlist"],{"06c5":function(t,e,n){"use strict";n.r(e);var o=n("2365"),i=n("534c");for(var r in i)"default"!==r&&function(t){n.d(e,t,function(){return i[t]})}(r);n("6acb");var a=n("2877"),s=Object(a["a"])(i["default"],o["a"],o["b"],!1,null,null,null);e["default"]=s.exports},2365:function(t,e,n){"use strict";var o=function(){var t=this,e=t.$createElement;t._self._c},i=[];n.d(e,"a",function(){return o}),n.d(e,"b",function(){return i})},"534c":function(t,e,n){"use strict";n.r(e);var o=n("ffce"),i=n.n(o);for(var r in o)"default"!==r&&function(t){n.d(e,t,function(){return o[t]})}(r);e["default"]=i.a},"6acb":function(t,e,n){"use strict";var o=n("a750"),i=n.n(o);i.a},a750:function(t,e,n){},ffce:function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o=i(n("a34a"));function i(t){return t&&t.__esModule?t:{default:t}}function r(t,e,n,o,i,r,a){try{var s=t[r](a),c=s.value}catch(u){return void n(u)}s.done?e(c):Promise.resolve(c).then(o,i)}function a(t){return function(){var e=this,n=arguments;return new Promise(function(o,i){var a=t.apply(e,n);function s(t){r(a,o,i,s,c,"next",t)}function c(t){r(a,o,i,s,c,"throw",t)}s(void 0)})}}var s=function(){return n.e("components/uni-popup/uni-popup").then(n.bind(null,"bf97"))},c={data:function(){return{maskclose:!0,headerPosition:"fixed",headerTop:"0px",typeText:["等待付款","已付款","售后订单"],orderType:["全部","待付款","已付款","售后订单"],orderList:[[],[],[],[],[{type:"received",ordersn:1,goods_id:1,img:"/static/img/goods/p5.jpg",name:"商品名称商品名称商品名称商品名称商品名称",price:"￥168",payment:168,freight:12,spec:"规格:S码",numner:1}],[{type:"refunds",ordersn:1,goods_id:1,img:"/static/img/goods/p5.jpg",name:"商品名称商品名称商品名称商品名称商品名称",price:"￥168",payment:168,freight:12,spec:"规格:S码",numner:1}]],list:[],tabbarIndex:0,detailgoodlist:[],ispay:0,waitpayTime:25,timerIdforgood:null,showcan:!1}},onLoad:function(t){console.log("option: "+JSON.stringify(t));var e=parseInt(t.tbIndex);this.tabbarIndex=e},onPageScroll:function(t){},onShow:function(){var e=t.getStorageSync("openid");this.orderlist(e)},components:{uniPopup:s},methods:{checkgoodorder:function(){var t=a(o.default.mark(function t(e){var n,i;return o.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,this.$apis.checkgoodorder({oid:e});case 2:n=t.sent,i=this,console.log(n.data,"检查支付返回"),1==n.data?i.ispay=1:i.ispay=0,console.log(i.ispay,"t.ispay");case 7:case"end":return t.stop()}},t,this)}));function e(e){return t.apply(this,arguments)}return e}(),backyue:function(){var t=a(o.default.mark(function t(e){return o.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,this.$apis.backyue({oid:e});case 2:t.sent;case 3:case"end":return t.stop()}},t,this)}));function e(e){return t.apply(this,arguments)}return e}(),orderlist:function(){var e=a(o.default.mark(function e(n){var i;return o.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return t.showLoading({title:"加载中..."}),e.next=3,this.$apis.orderlist({openid:n});case 3:i=e.sent,1==i.code?t.hideLoading():setTimeout(function(){t.hideLoading()},3e3),this.orderList[0]=i.data.all,this.orderList[1]=i.data.wait,this.orderList[2]=i.data.ispay,this.orderList[3]=i.data.back,this.list=this.orderList[this.tabbarIndex],console.log(this.orderList[this.tabbarIndex]);case 11:case"end":return e.stop()}},e,this)}));function n(t){return e.apply(this,arguments)}return n}(),wxpaytwo:function(){var e=a(o.default.mark(function e(n){var i,r,a=this;return o.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.$apis.wxpaytwo({oid:n});case 2:i=e.sent,t.showLoading({title:"支付中..."}),r=this,1==i.code?(console.log(r.ispay,"是否支付"),this.timerIdforgood=setInterval(function(){r.checkgoodorder(n),setTimeout(function(){1==r.ispay&&(clearInterval(r.timerIdforgood),console.log(r.ispay,"走支付成功"),t.hideLoading(),console.log("已隐藏1"+n),t.showModal({title:"购买完成提示",content:"欢迎再次光临！",showCancel:a.showcan,success:function(e){e.confirm?t.reLaunch({url:"../../../pages/index/index"}):e.cancel&&console.log("用户点击取消")}}))},200);var e=a.waitpayTime;e--,a.waitpayTime=e,e<1&&(clearInterval(a.timerIdforgood),r.backyue(n),r.waitpayTime=25,t.hideLoading(),console.log("已隐藏2"+n),t.showModal({title:"购买异常提示",content:"请检查微信余额支付是否足以支付此次购买金额，或者网络是否正常，欢迎再次购买！",showCancel:a.showcan,success:function(e){e.confirm&&t.reLaunch({url:"../../../pages/index/index"})}})),console.log("请求支付结果"+e)},400)):(console.log("走支付流程失败"),t.hideLoading(),t.showModal({title:"购买异常提示",content:"异常信息："+i.msg,showCancel:this.showcan,success:function(e){e.confirm&&t.reLaunch({url:"../../../pages/index/index"})}}));case 6:case"end":return e.stop()}},e,this)}));function n(t){return e.apply(this,arguments)}return n}(),showType:function(t){this.tabbarIndex=t,this.list=this.orderList[t]},showdetail:function(t){this.detailgoodlist=t,this.detailgoodlist.length>0&&this.$refs.popup.open()},closeit:function(){this.$refs.popup.close()},toPayment:function(e,n){var o=this;t.showModal({title:"温馨提示",content:"即将支付金额为："+n+"元，是否确定完成支付？",success:function(t){t.confirm?o.wxpaytwo(e):t.cancel&&console.log("用户点击取消")}})}}};e.default=c}).call(this,n("543d")["default"])}},[["9f89","common/runtime","common/vendor"]]]);