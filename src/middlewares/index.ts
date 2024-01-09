/**
 * @Description: 通过compose合并所有中间件
 * @Author: daixu
 * @Date: 2023-04-22 20:36:55
 */
import compose from "koa-compose";
import compress from "koa-compress";
import ip from "@/middlewares/ip";
import params from "@/middlewares/params";
import log4 from "@/middlewares/log4";
import cors from "@/middlewares/cors";
import helmet from "@/middlewares/helmet";
import ratelimit from "@/middlewares/ratelimit";
import koaBody from "koa-body";
import hls from "@/middlewares/hls";
import koaStatic from "@/middlewares/koaStatic";
import auth from "@/middlewares/auth";
import watermark from "@/middlewares/watermark";
import routes from "@/routes";

export default compose([
  cors(),
  ip(),
  log4(),
  helmet(),
  koaBody(),
  params(),
  compress(),
  watermark(),
  hls(),
  koaStatic(),
  auth(-1),
  // ratelimit(),
  routes()
]);
