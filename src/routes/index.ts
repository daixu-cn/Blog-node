/**
 * @Description: 通过combineRouters合并路由
 * @Author: daixu
 * @Date: 2023-04-22 20:36:55
 */

import combineRouters from "koa-combine-routers";

import swagger from "@/routes/swagger";
import server from "@/routes/server";
import upload from "@/routes/upload";
import user from "@/routes/user";
import article from "@/routes/article";
import comment from "@/routes/comment";
import reply from "@/routes/reply";
import link from "@/routes/link";
import update from "@/routes/update";
import file from "@/routes/file";

export default combineRouters(
  swagger,
  server,
  upload,
  user,
  article,
  comment,
  reply,
  link,
  update,
  file
);
