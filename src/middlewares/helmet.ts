/**
 * @Description: 标头配置中间件
 * @Author: daixu
 * @Date: 2023-04-22 20:36:55
 */

import helmet from "koa-helmet";

export default function () {
  return helmet({
    crossOriginResourcePolicy: {
      // 允许跨域访问的资源（如果不想其他网站使用图片的话建议使用 “same-site” 选项）
      policy: "cross-origin"
    }
  });
}
