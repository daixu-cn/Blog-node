/**
 * @Description: 跨域配置中间件
 * @Author: daixu
 * @Date: 2023-04-22 20:36:55
 */

import cors from "koa2-cors";
import { Options } from "koa2-cors";
import { TRUSTED_DOMAINS } from "@/config/env";

const config: Options = {
  origin: function (ctx) {
    const url = (ctx.request.header.origin ?? ctx.request.header.referer?.slice(0, -1)) || "";

    if (url) {
      return TRUSTED_DOMAINS.filter(item => {
        return url.includes(item);
      }).length
        ? url
        : "";
    }
    return url;
  },
  maxAge: 5, //指定本次预检请求的有效期，单位为秒。
  credentials: true //是否允许发送Cookie
};

export default function () {
  return cors(config);
}
