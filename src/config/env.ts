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
// 资源存放路径
export const ASSET_DIR = process.env.ASSET_DIR;
// 资源获取路径前缀
export const ASSET_PREFIX = process.env.ASSET_PREFIX;
// 网站服务地址（前端页面）
export const SITE_URL = process.env.SITE_URL;

// 受信任的域名（用于跨域等版块使用）
export const TRUSTED_DOMAINS = ["127.0.0.1", "localhost", "daixu.cn", "thund.com"];
// 数据库最小时间
export const MIN_DATE = "1970-01-01 00:00:00";

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

// 阿里云服务配置
export const _ALI = {
  ALI_ACCESS_KEY_ID: process.env.ALI_ACCESS_KEY_ID,
  ALI_ACCESS_KEY_SECRET: process.env.ALI_ACCESS_KEY_SECRET,
  OSS: {
    ALI_OSS_REGION: process.env.ALI_OSS_REGION,
    ALI_OSS_BUCKET: process.env.ALI_OSS_BUCKET,
    ALI_OSS_IMAGE_WATERMARK: process.env.ALI_OSS_IMAGE_WATERMARK,
    ALI_OSS_ASSET_PREFIX: process.env.ALI_OSS_ASSET_PREFIX
  }
};
