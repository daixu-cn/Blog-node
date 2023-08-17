/**
 * @Description: 访问限制中间件
 * @Author: daixu
 * @Date: 2023-04-22 20:36:55
 */

import { RateLimit } from "koa2-ratelimit";
import redis from "@/utils/redis";

export default function () {
  return RateLimit.middleware({
    interval: { sec: 1 },
    max: 30,
    message: "您被禁止访问",
    headers: false,
    keyGenerator(ctx) {
      return new Promise<string>(resolve => {
        resolve(ctx.clientIp);
      });
    },
    onLimitReached(ctx) {
      return new Promise<void>(async resolve => {
        await redis.sadd("ipBlackList", ctx.clientIp);
        resolve();
      });
    }
  });
}
