/**
 * @Description: 参数解析中间件
 * @Author: daixu
 * @Date: 2023-04-22 20:36:55
 */

import { Context, Next } from "koa";

export default function () {
  return async function (ctx: Context, next: Next) {
    const method = ctx.method.toLocaleLowerCase();
    if (method === "post" || method === "patch" || method === "put") {
      ctx.params = ctx.request.body;
    } else if (method === "get" || method === "delete") {
      ctx.params = ctx.query;
    }
    await next();
  };
}
