/**
 * @Description: OSS代理中间件
 * @Author: daixu
 * @Date: 2024-04-18 12:36:56
 */

import { Context, Next } from "koa";
import stream from "stream";
import oss from "@/utils/oss";
import { _ALI } from "@/config/env";

// 不需要加水印的图片路径
const NO_WATERMARK_PATH = ["/*", "/image/user", "/image/comment"];

export default function () {
  return async function (ctx: Context, next: Next) {
    await next();

    if (/\.\w+$/.test(ctx.path)) {
      try {
        const {
          res: { headers }
        } = await oss.head(ctx.path.slice(1));

        const contentType = headers["content-type"];
        ctx.set("Content-Type", contentType);

        if (
          contentType.startsWith("image/") &&
          !NO_WATERMARK_PATH.some(path => ctx.path.startsWith(path))
        ) {
          const process = _ALI.OSS.ALI_OSS_IMAGE_WATERMARK
            ? `style/${_ALI.OSS.ALI_OSS_IMAGE_WATERMARK}`
            : undefined;

          const { content } = await oss.get(ctx.path.slice(1), { process });
          ctx.body = stream.Readable.from([content]);
        } else {
          const { content } = await oss.get(ctx.path.slice(1));
          ctx.body = stream.Readable.from([content]);
        }
      } catch (error) {
        ctx.status = 404;
      }
    }
  };
}
