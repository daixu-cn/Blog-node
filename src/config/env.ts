/**
 * @Description: 全局变量
 * @Author: daixu
 * @Date: 2023-04-22 20:31:09
 */

import { RedisOptions } from "ioredis";
import { SignOptions } from "jsonwebtoken";

// 是否生产环境
export const PRODUCTION = process.env.NODE_ENV === "production";
// PM2进程
export const PM2_INSTANCE = process.env.PM2_INSTANCE;
// 启动端口
export const APP_PORT = Number(process.env.APP_PORT);
// websocket端口
export const WS_SERVER_PORT = Number(process.env.WS_SERVER_PORT);
// 请求协议
export const SCHEME = process.env.SCHEME;
// 请求端口
export const PORT = Number(process.env.PORT);
// 请求域名
export const DOMAIN = process.env.DOMAIN;
// 请求地址
export const URL = `${SCHEME}://${DOMAIN}:${PORT}`;
// 图片前缀
export const IMG_PREFIX = `${SCHEME}://${DOMAIN}:${PORT}/upload/`;

// mysql配置
export const _MYSQL = {
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  multipleStatements: false
};

// redis配置
export const _REDIS: RedisOptions = {
  port: Number(process.env.REDIS_PORT),
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
  family: Number(process.env.REDIS_FAMILY),
  db: Number(process.env.REDIS_DB)
};

// JWT鉴权配置
export const _JWT: { SECRET_KEY: string; options: SignOptions } = {
  // TOKEN 密钥
  SECRET_KEY: process.env.JWT_SECRET_KEY,
  options: {
    // 过期时间，一周
    // expiresIn: 60 * 60 * 24 * 7
  }
};

// 第三方授权平台密钥
export const _SECRET = {
  qq: {
    AppID: process.env.SECRET_QQ_APPID,
    APPKey: process.env.SECRET_QQ_APPKEY
  },
  github: {
    clientId: process.env.SECRET_GITHUB_CLIENTID,
    clientSecret: process.env.SECRET_GITHUB_CLIENTSECRET
  }
};

// 邮箱服务配置
export const _EMAIL = {
  USER_EMAIL: process.env.EMAIL_USER,
  options: {
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  }
};

// 阿里云OSS配置
export const _ALIOSS = {
  region: process.env.ALIOSS_REGION,
  accessKeyId: process.env.ALIOSS_ACCESSKEYID,
  accessKeySecret: process.env.ALIOSS_ACCESSKEYSECRET,
  bucket: process.env.ALIOSS_BUCKET
};
