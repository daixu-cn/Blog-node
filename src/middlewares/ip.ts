/**
 * @Description: IP获取/存储
 * @Author: daixu
 * @Date: 2023-04-22 20:36:55
 */
import { Context, Next } from "koa";
import requestIp from "request-ip";
import redis from "@/utils/redis";
import response from "@/config/response";

export default function () {
  return async function (ctx: Context, next: Next) {
    ctx.clientIp = requestIp.getClientIp(ctx) ?? ctx.ip;

    if (await redis.sismember("ipBlackList", ctx.clientIp)) {
      ctx.body = response({ code: 429, message: "您被禁止访问" });
    } else {
      await next();
    }
  };
}
