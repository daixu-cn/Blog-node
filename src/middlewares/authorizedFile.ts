/**
 * @Description: 文件访问鉴权中间件
 * @Author: daixu
 * @Date: 2023-04-22 20:36:55
 */

import { Context, Next, Middleware } from "koa";
import { verifyToken } from "@/utils/jsonwebtoken";
import User from "@/models/user";
import { JwtPayload } from "jsonwebtoken";
import querystring from "querystring";

/**
 * @description
 * @return {Middleware}
 */
export default function authorizedFile(): Middleware {
  return async function (ctx: Context, next: Next) {
    try {
      const [path, query] = ctx.url.split("?");

      // 如果是日志文件
      if (path.endsWith(".log")) {
        const params = querystring.parse(query);
        const authorization = `Bearer ${params.token}`;

        const { userId } = (await verifyToken(authorization)) as JwtPayload;

        const user = await User.findByPk(userId);
        const userRole = user?.dataValues.role;

        if (userRole === 0) {
          await next();
        } else {
          throw {
            code: 403,
            message: "权限不足"
          };
        }
      } else {
        await next();
      }
    } catch (error: any) {
      throw {
        code: error?.code,
        data: error?.data,
        message: error?.message
      };
    }
  };
}
