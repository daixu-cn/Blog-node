/**
 * @Description: 日志中间件
 * @Author: daixu
 * @Date: 2023-04-22 20:36:55
 */

import { Context, Next } from "koa";
import { httpLogger } from "@/utils/log4";
import geoip from "geoip-lite";
import { truncateData } from "@/utils/api";

/**
 * @description 生成路由日志
 * @param {Context} ctx 上下文对象
 * @param {number} startTime 接口请求开始时间
 * @param {string[]} Extras 自定义额外日志
 * @return {string}
 */
function generateLogs(ctx: Context, startTime: number, Extras: string[] = []) {
  // 请求方法
  const method = ctx.method;
  let paramsInfo: string[] = [];

  // 是否为跨域的预检接口
  const isCors = method.toLocaleUpperCase() === "OPTIONS";
  if (!isCors) {
    paramsInfo = [
      `Authorization: ${ctx.request.header.authorization}`,
      `Params: ${JSON.stringify(ctx.params)}`
    ];
  }

  const body = ctx.response.body as IBody | null;

  const geo = geoip.lookup(ctx.clientIp);
  const address = geo ? ` (${geo.country}-${geo.region}-${geo.city})` : "";
  return [
    // 请求方法 请求路径 响应时间（ms） ip
    `[${method}] ${ctx.url} ${new Date().valueOf() - startTime}ms ${ctx.clientIp}${address}`,
    // 用户代理：确定用户所使用的操作系统版本、CPU 类型、浏览器版本等信息
    `User Agent: ${ctx.header["user-agent"]}`,
    // 参数信息
    ...paramsInfo,
    // 响应信息
    `Response: ${JSON.stringify({
      status: ctx.response.status,
      message: ctx.response.message,
      body: truncateData({ data: body?.data })
    })}`,
    ...Extras,
    "\n"
  ].join("\n");
}

export default function () {
  return async function (ctx: Context, next: Next) {
    const startTime = new Date().valueOf();

    try {
      await next();
      httpLogger(generateLogs(ctx, startTime));
    } catch (error: any) {
      ctx.status = 200;
      ctx.body = {
        code: Number.isInteger(error?.code) ? error?.code : 500,
        data: error?.data ?? null,
        message: error?.message ?? "服务器异常,请联系管理员"
      };

      httpLogger(
        generateLogs(ctx, startTime, [`Description: ${JSON.stringify(error?.message ?? error)}`]),
        "error"
      );
    }
  };
}
