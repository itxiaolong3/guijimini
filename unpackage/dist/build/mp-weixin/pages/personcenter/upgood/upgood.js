(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/personcenter/upgood/upgood"],{"3b41":function(t,n,i){"use strict";(function(t){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var e=s(i("a34a"));function s(t){return t&&t.__esModule?t:{default:t}}function o(t,n,i,e,s,o,c){try{var l=t[o](c),u=l.value}catch(a){return void i(a)}l.done?n(u):Promise.resolve(u).then(e,s)}function c(t){return function(){var n=this,i=arguments;return new Promise(function(e,s){var c=t.apply(n,i);function l(t){o(c,e,s,l,u,"next",t)}function u(t){o(c,e,s,l,u,"throw",t)}l(void 0)})}}var l={data:function(){return{list:[],flag:!1,money:0,num:0,checkcount:0}},methods:{getallgood:function(){var t=c(e.default.mark(function t(n){var i;return e.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,this.$apis.getallgood({sn:n});case 2:i=t.sent,console.log(i.data,"返回商品"),this.list=i.data;case 5:case"end":return t.stop()}},t,this)}));function n(n){return t.apply(this,arguments)}return n}(),updowngood:function(){var n=c(e.default.mark(function n(i,s,o,c){var l;return e.default.wrap(function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,this.$apis.updowngood({type:1,openid:i,goodinfo:s,sn:o,allnum:c});case 2:l=n.sent,console.log(l.data,"上架返回"),200==l.data.code&&(t.showToast({title:"上架成功"}),setTimeout(function(){t.navigateBack({delta:1})},1500));case 5:case"end":return n.stop()}},n,this)}));function i(t,i,e,s){return n.apply(this,arguments)}return i}(),all:function(t){if(this.flag=!this.flag,this.flag){for(var n=0;n<this.list.length;n++)this.list[n].check=!0;this.num=this.list.length,this.total()}else{for(n=0;n<this.list.length;n++)this.list[n].check=!1;this.num=0,this.money=0,this.checkcount=0}},signCount:function(t){for(var n=0;n<this.list.length;n++){var i=this.list[n];if(i.id==t){i.count>0&&i.count--;break}}this.total()},addCount:function(t){for(var n=0;n<this.list.length;n++){var i=this.list[n];if(i.id==t){i.count++,i.check=!0;break}}this.total()},inp:function(t){for(var n=0;n<this.list.length;n++)this.list[n].id==t&&(this.list[n].check=!this.list[n].check,0==this.list[n].check?(this.flag=!1,this.num-=1,this.money-=this.list[n].price*this.list[n].count,this.checkcount-=this.list[n].count):(this.num+=1,this.money+=this.list[n].price*this.list[n].count,this.checkcount+=this.list[n].count,this.num==this.list.length&&(this.flag=!0)))},removeM:function(n){for(var i=this,e=0;e<this.list.length;e++){var s=this.list[e];if(s.ID==n){t.showModal({title:"",content:"确定删除,不再看看吗",confirmText:"确定",success:function(t){t.confirm&&(i.list.splice(e,1),s.check&&(i.num--,i.total()),0==i.num?i.flag=!1:i.num==i.list.length&&(i.flag=!0))}});break}}},total:function(){this.money=0,this.checkcount=0;for(var t=0;t<this.list.length;t++)1==this.list[t].check&&(this.money+=this.list[t].price*this.list[t].count,this.checkcount+=this.list[t].count),this.list[t].count<1?(this.list[t].check=!1,console.log("为0了")):(this.list[t].check,console.log("不为0了"));console.log(this.checkcount,"当前总数量")},goPay:function(){var n=this.list.filter(function(t){return!0===t.check});if(console.log("arry: "+JSON.stringify(n)),console.log(this.checkcount,"总数量"),0!=n.length){var i=t.getStorageSync("openid"),e=t.getStorageSync("shsn");this.updowngood(i,JSON.stringify(n),e,this.checkcount)}else t.showToast({title:"您还没有选中要结算的商品",icon:"none"})}},onLoad:function(t){console.log(t.sn,"传过来"),this.getallgood(t.sn)}};n.default=l}).call(this,i("543d")["default"])},4021:function(t,n,i){"use strict";i.r(n);var e=i("3b41"),s=i.n(e);for(var o in e)"default"!==o&&function(t){i.d(n,t,function(){return e[t]})}(o);n["default"]=s.a},"6a8d":function(t,n,i){"use strict";var e=i("feeb"),s=i.n(e);s.a},a271:function(t,n,i){"use strict";i.r(n);var e=i("ac40"),s=i("4021");for(var o in s)"default"!==o&&function(t){i.d(n,t,function(){return s[t]})}(o);i("6a8d");var c=i("2877"),l=Object(c["a"])(s["default"],e["a"],e["b"],!1,null,null,null);n["default"]=l.exports},ac40:function(t,n,i){"use strict";var e=function(){var t=this,n=t.$createElement;t._self._c},s=[];i.d(n,"a",function(){return e}),i.d(n,"b",function(){return s})},feeb:function(t,n,i){}},[["86c4","common/runtime","common/vendor"]]]);