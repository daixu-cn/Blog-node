/**
 * @Description: 标头配置中间件
 * @Author: daixu
 * @Date: 2023-04-22 20:36:55
 */

import helmet from "koa-helmet";

export default function () {
  return helmet({
    crossOriginResourcePolicy: {
      // 允许同站跨域访问的资源
      policy: "same-site"
    }
  });
}
