/**
 * @Description: Token鉴权封装
 * @Author: daixu
 * @Date: 2023-04-22 21:06:58
 */

import jwt, { Secret, SignOptions, JwtPayload } from "jsonwebtoken";
import { _JWT } from "@/config/env";
import redis from "@/utils/redis";

/**
 * @description 生成Token
 * @param {string | Buffer | object} payload 植入token的数据
 * @param {Secret} secretOrPrivateKey token密钥
 * @param {SignOptions} signOptions 其他配置
 * @return {string}
 */
export const sign = function (
  payload: string | Buffer | object,
  secretOrPrivateKey: Secret = _JWT.SECRET_KEY,
  signOptions: SignOptions = _JWT.options
) {
  const token = jwt.sign(payload, secretOrPrivateKey, signOptions);
  redis.set(token, JSON.stringify(payload), "EX", 60 * 60 * 24 * 7);

  return token;
};

/**
 * @description 校验token是否合法
 * @param {string} token
 * @return {Promise<JwtPayload|string>} 植入token的数据
 */
export const verifyToken = function (token: string): Promise<JwtPayload | string> {
  return new Promise(async (resolve, reject) => {
    try {
      // 去除 Bearer 获取token
      const authorization = token.startsWith("Bearer ") ? token.replace("Bearer ", "") : token;

      if (await redis.get(authorization)) {
        // 校验token真实性
        return resolve(jwt.verify(authorization, _JWT.SECRET_KEY));
      }
      reject({ code: 401, message: "登录过期" });
    } catch (error: any) {
      switch (error.name) {
        case "JsonWebTokenError":
          return reject({ code: 401, message: "非法登录" });
        case "TokenExpiredError":
          return reject({ code: 401, message: "登录过期" });
        default:
          reject(error);
      }
    }
  });
};
