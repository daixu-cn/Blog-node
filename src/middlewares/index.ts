/**
 * @Description: 通过compose合并所有中间件
 * @Author: daixu
 * @Date: 2023-04-22 20:36:55
 */

import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === "development" ? ".env.development" : ".env.production"
  )
});

import compose from "koa-compose";
import compress from "koa-compress";
import ip from "@/middlewares/ip";
import params from "@/middlewares/params";
import log4 from "@/middlewares/log4";
import cors from "@/middlewares/cors";
import helmet from "koa-helmet";
import ratelimit from "@/middlewares/ratelimit";
import koaBody from "koa-body";
import koaStatic from "@/middlewares/koaStatic";
import auth from "@/middlewares/auth";
import routes from "@/routes";

export default compose([
  cors(),
  ip(),
  log4(),
  helmet(),
  koaBody(),
  params(),
  compress(),
  koaStatic(),
  auth(-1),
  ratelimit(),
  routes()
]);
