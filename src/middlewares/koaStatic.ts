import koaStatic from "koa-static";
import { ASSET_DIR, URL } from "@/config/env";
import mime from "mime-types";
import path from "path";

/**
 * @description 静态资源中间件
 * @param {string} root 静态资源根目录
 * @return {Middleware} koaStatic
 */
export default function (root = `${ASSET_DIR}/`) {
  return koaStatic(root, {
    // 浏览器缓存：30天
    maxAge: 1000 * 60 * 60 * 24 * 30,
    setHeaders: (res, filePath) => {
      const contentType = mime.contentType(path.extname(filePath));

      contentType && res.setHeader("Content-Type", contentType);
      res.setHeader("Content-Disposition", "inline");
      res.setHeader("Accept-Ranges", "bytes");
      res.setHeader("Author", URL);
    }
  });
}
