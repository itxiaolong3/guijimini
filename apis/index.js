import http from "./http.js";
import config from "@/config/index.config.js";

// 获取用户资料
export const chencklogin = (data) => http.POST(`${config.baseUrl}/index/chenckislogin`, data);
//保存个人信息
export const savainfo = (data) => http.POST(`${config.baseUrl}/index/savauserinfo`, data);
//openid获取个人信息
export const openidtogetinfo = (data) => http.POST(`${config.baseUrl}/index/openidtogetinfo`, data);
//获取手机号
export const getphone = (data) => http.POST(`${config.baseUrl}/index/getphone`, data);
//保存手机号
export const savephone = (data) => http.POST(`${config.baseUrl}/index/savephone`, data);
//获取签约参数
export const getsingparm = (data) => http.POST(`${config.baseUrl}/index/getsingparm`, data);
//判断该用户是否已签约
export const ismmsign = (data) => http.POST(`${config.baseUrl}/index/ismmsign`, data);
//保存签约协议ID
export const savesingres = (data) => http.POST(`${config.baseUrl}/index/savesingres`, data);
//轮播图列表
export const bannerlist = (data) => http.POST(`${config.baseUrl}/minapi/bannerlist`, data);
//广告
export const getadv = (data) => http.POST(`${config.baseUrl}/minapi/getadv`, data);
//用户协议
export const xieyi = (data) => http.POST(`${config.baseUrl}/minapi/xieyi`, data);
//获取短信验证码
export const sendsms = (data) => http.POST(`${config.baseUrl}/minapi/sendsmsnew`, data);
//注册手机号
export const regphone = (data) => http.POST(`${config.baseUrl}/minapi/regphonenew`, data);
//获取充值活动数据
export const getaddmoneyact = (data) => http.POST(`${config.baseUrl}/minapi/getaddmoneyact`, data);
//微信免密扣款
export const dowxpay = (data) => http.POST(`${config.baseUrl}/index/dowxpay`, data);
//查询订单是否支付
export const checkorderstate = (data) => http.POST(`${config.baseUrl}/index/checkorderstate`, data);
//获取优惠券接口
export const couponlist = (data) => http.POST(`${config.baseUrl}/minapi/couponlist`, data);
//获取我的优惠券列表
export const mycouponlist = (data) => http.POST(`${config.baseUrl}/minapi/mycouponlist`, data);
//领取优惠券
export const getcoupon = (data) => http.POST(`${config.baseUrl}/minapi/getcoupon`, data);
//开柜
export const opendoor = (data) => http.POST(`${config.baseUrl}/minapi/opendoor`, data);
//获取柜机所有商品
export const getallgood = (data) => http.POST(`${config.baseUrl}/minapi/getallgood`, data);
//实时获取上下货商品-新
export const getupgood = (data) => http.POST(`${config.baseUrl}/minapi/getupgood`, data);
//获取用户所拿商品
export const getgood = (data) => http.POST(`${config.baseUrl}/minapi/getgood`, data);
//提交订单进行支付
export const accountorder = (data) => http.POST(`${config.baseUrl}/minapi/accountorder`, data);
//检查商品订单
export const checkgoodorder = (data) => http.POST(`${config.baseUrl}/minapi/checkgoodorder`, data);
//订单列表
export const orderlist = (data) => http.POST(`${config.baseUrl}/minapi/orderlist`, data);
//检查是否有未支付订单
export const checknopayorder = (data) => http.POST(`${config.baseUrl}/minapi/checknopayorder`, data);
//订单二次付款
export const wxpaytwo = (data) => http.POST(`${config.baseUrl}/minapi/wxpaytwo`, data);
//混合支付模式下,用户余额不足免密扣款,而导致系统余额减少,需要调用后台检查余额恢复接口
export const backyue = (data) => http.POST(`${config.baseUrl}/minapi/backyue`, data);
//上下货开柜接口
export const shopen = (data) => http.POST(`${config.baseUrl}/minapi/shopen`, data);
//上下货开柜接口-新
export const shopennew = (data) => http.POST(`${config.baseUrl}/minapi/shopennew`, data);
//手动关柜
export const shclose = (data) => http.POST(`${config.baseUrl}/minapi/shclose`, data);
//上下货记录
export const updowngood = (data) => http.POST(`${config.baseUrl}/minapi/updowngood`, data);
//提交上下货数据-新
export const postupdowninfo = (data) => http.POST(`${config.baseUrl}/minapi/postupdowninfo`, data);
//检查优惠券更新提示
export const coupontip = (data) => http.POST(`${config.baseUrl}/minapi/coupontip`, data);
//补接口,关门立即发送保存商品和价格数据到后台
export const updatecloseorder = (data) => http.POST(`${config.baseUrl}/minapi/updatecloseorder`, data);
//反馈意见
export const feelback = (data) => http.POST(`${config.baseUrl}/minapi/feelback`, data);
//提现申请
export const withdrawreply = (data) => http.POST(`${config.baseUrl}/minapi/withdrawreply`, data);
//提现列表
export const withdrawlist = (data) => http.POST(`${config.baseUrl}/minapi/withdrawlist`, data);
//促销活动领取红包
export const getactivecoupon = (data) => http.POST(`${config.baseUrl}/minapi/getactivecoupon`, data);
//上货记录列表
export const getsqrecord = (data) => http.POST(`${config.baseUrl}/minapi/getsqrecord`, data);
//上下架货记录中商品
export const getsqrecordgood = (data) => http.POST(`${config.baseUrl}/minapi/getsqrecordgood`, data);
export const dotest = (data) => http.POST(`${config.baseUrl}/minapi/dotest`, data);

