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


