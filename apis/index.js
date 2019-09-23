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


