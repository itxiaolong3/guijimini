(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/index/index"],{"0d26":function(t,n,e){"use strict";var i=function(){var t=this,n=t.$createElement;t._self._c},o=[];e.d(n,"a",function(){return i}),e.d(n,"b",function(){return o})},1393:function(t,n,e){"use strict";var i=e("bb1c"),o=e.n(i);o.a},3430:function(t,n,e){"use strict";e.r(n);var i=e("0d26"),o=e("61d0");for(var a in o)"default"!==a&&function(t){e.d(n,t,function(){return o[t]})}(a);e("1393");var r=e("2877"),s=Object(r["a"])(o["default"],i["a"],i["b"],!1,null,null,null);n["default"]=s.exports},"4e69":function(t,n,e){"use strict";(function(t){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var i=o(e("a34a"));o(e("3430"));function o(t){return t&&t.__esModule?t:{default:t}}function a(t,n,e,i,o,a,r){try{var s=t[a](r),u=s.value}catch(c){return void e(c)}s.done?n(u):Promise.resolve(u).then(i,o)}function r(t){return function(){var n=this,e=arguments;return new Promise(function(i,o){var r=t.apply(n,e);function s(t){a(r,i,o,s,u,"next",t)}function u(t){a(r,i,o,s,u,"throw",t)}s(void 0)})}}var s=function(){return e.e("components/tabBar").then(e.bind(null,"07d1"))},u={data:function(){return{showdots:!0,bannerlist:[{imgs:"../../static/img/goods/p2.jpg",adid:1},{imgs:"../../static/img/goods/p1.jpg",adid:2},{imgs:"../../static/img/goods/p3.jpg",adid:3},{imgs:"../../static/img/goods/p4.jpg",adid:4},{imgs:"../../static/img/goods/p5.jpg",adid:5}],imgList:["../../static/img/goods/p2.jpg","../../static/img/goods/p1.jpg","../../static/img/goods/p3.jpg","../../static/img/goods/p4.jpg","../../static/img/goods/p5.jpg"],userinfo:[],showcan:!1}},onLoad:function(){console.log("index-onload"),this.bannerlist1()},components:{tabBar:s},methods:{handleChange:function(n){console.log(n,"点击轮播图"),t.navigateTo({url:"../advdetail/advdetail?adid="+n})},bannerlist1:function(){var t=r(i.default.mark(function t(){var n;return i.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,this.$apis.bannerlist({});case 2:n=t.sent,this.bannerlist=n.data;case 4:case"end":return t.stop()}},t,this)}));function n(){return t.apply(this,arguments)}return n}(),openidtogetinfoforindex:function(){var n=r(i.default.mark(function n(e){var o;return i.default.wrap(function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,this.$apis.openidtogetinfo({openid:e});case 2:o=n.sent,this.userinfo=o.data,2==o.data.status&&t.showModal({title:"异常提示",content:"非常遗憾通知您，您的账号被禁用，请联系客服处理！",showCancel:this.showcan,success:function(n){n.confirm?t.navigateTo({url:"../../pages/personcenter/personcenter"}):n.cancel&&console.log("用户点击取消")}}),t.setStorageSync("phone",o.data.phone),console.log(this.userinfo,"首页得到用户信息");case 7:case"end":return n.stop()}},n,this)}));function e(t){return n.apply(this,arguments)}return e}()},onShow:function(n){console.log("首页显示");var e=t.getStorageSync("openid");""!=e&&null!=e&&(console.log("有openid"),this.openidtogetinfoforindex(e))}};n.default=u}).call(this,e("543d")["default"])},5842:function(t,n,e){"use strict";var i=e("bb05"),o=e.n(i);o.a},"61d0":function(t,n,e){"use strict";e.r(n);var i=e("d36e"),o=e.n(i);for(var a in i)"default"!==a&&function(t){e.d(n,t,function(){return i[t]})}(a);n["default"]=o.a},"7a6d":function(t,n,e){"use strict";e.r(n);var i=e("4e69"),o=e.n(i);for(var a in i)"default"!==a&&function(t){e.d(n,t,function(){return i[t]})}(a);n["default"]=o.a},bb05:function(t,n,e){},bb1c:function(t,n,e){},d36e:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var i={data:function(){return{imgList:["../../static/detail/swiper2.png","../../static/detail/swiper2.png","../../static/detail/swiper2.png","../../static/detail/swiper2.png","../../static/detail/swiper2.png"]}}};n.default=i},d5c9:function(t,n,e){"use strict";e.r(n);var i=e("e26b"),o=e("7a6d");for(var a in o)"default"!==a&&function(t){e.d(n,t,function(){return o[t]})}(a);e("5842");var r=e("2877"),s=Object(r["a"])(o["default"],i["a"],i["b"],!1,null,null,null);n["default"]=s.exports},e26b:function(t,n,e){"use strict";var i=function(){var t=this,n=t.$createElement;t._self._c},o=[];e.d(n,"a",function(){return i}),e.d(n,"b",function(){return o})}},[["2346","common/runtime","common/vendor"]]]);