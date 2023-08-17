/**
 * @Description: Token鉴权中间件，在需要使用的路由中使用
 * @Author: daixu
 * @Date: 2023-04-22 20:36:55
 */

import { Context, Next, Middleware } from "koa";
import { verifyToken } from "@/utils/jsonwebtoken";
import User from "@/models/user";
import redis from "@/utils/redis";
import { JwtPayload } from "jsonwebtoken";

/**
 * @description
 * @param {number} role 角色(-1:不需要校验,0:管理员、1:普通用户)
 * @return {Middleware}
 */
export default function auth(role = 1): Middleware {
  return async function (ctx: Context, next: Next) {
    try {
      const authorization = ctx.request.headers.authorization;
      if (authorization) {
        // 校验token是否合法
        const { userId } = (await verifyToken(authorization)) as JwtPayload;

        if (userId) {
          const user = await User.findByPk(userId);
          const userRole = user?.dataValues.role;

          if (role === 0 && userRole !== 0) {
            throw {
              code: 403,
              message: "权限不足"
            };
          }

          Object.assign(ctx.params ?? {}, { userId, role: userRole });
          redis.expire(authorization, 60 * 60 * 24 * 7);
          await next();
        } else {
          throw {
            code: 401,
            message: "登录过期"
          };
        }
      } else {
        throw {
          code: 401,
          message: "非法访问"
        };
      }
    } catch (error: any) {
      if (role === -1 && (error?.code === 401 || error?.message === 403)) {
        await next();
      } else {
        throw {
          code: error?.code,
          data: error?.data,
          message: error?.message
        };
      }
    }
  };
}
