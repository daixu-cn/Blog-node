/**
 * @Description: 参数解析中间件
 * @Author: daixu
 * @Date: 2023-04-22 20:36:55
 */

import { Context, Next } from "koa";

export default function (extra?: object) {
  return async function (ctx: Context, next: Next) {
    ctx.params = { ...ctx.request.body, ...ctx.query, ...ctx.params, ...extra };
    await next();
  };
}
