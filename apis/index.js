import http from "./http.js";
import config from "@/config/index.config.js";

// 获取用户资料
export const chencklogin = (data) => http.POST(`${config.baseUrl}/index/chenckislogin`, data);
export const savainfo = (data) => http.POST(`${config.baseUrl}/index/savauserinfo`, data);


