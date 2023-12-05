/**
 * @Description: 视频转换为HLS播放中间件
 * @Author: daixu
 * @Date: 2023-12-05 13:15:09
 */

import { Context, Next } from "koa";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";
import { ASSET_DIR, ASSET_PREFIX } from "@/config/env";
import fs from "fs-extra";
import { toHLS } from "@/utils/video";
import path from "path";

ffmpeg.setFfmpegPath(ffmpegPath);

export default function () {
  return async (ctx: Context, next: Next) => {
    await next();

    if (
      ctx.status !== 404 &&
      ctx.path.startsWith("/video") &&
      !ctx.path.startsWith("/video/m3u8") &&
      fs.existsSync(`${ASSET_DIR}${ctx.path}`)
    ) {
      const filename = path.basename(ctx.path, path.extname(ctx.path));

      if (!fs.existsSync(`${ASSET_DIR}/video/m3u8/${filename}.m3u8`)) {
        await toHLS(`${ASSET_DIR}${ctx.path}`, filename);
      }

      ctx.redirect(`${ASSET_PREFIX}/video/m3u8/${filename}.m3u8`);
    }
  };
}
