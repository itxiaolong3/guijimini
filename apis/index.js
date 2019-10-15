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
