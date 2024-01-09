import koaStatic from "koa-static";
import { ASSET_DIR, SITE_URL } from "@/config/env";
import mime from "mime-types";
import path from "path";

// 不缓存的文件列表
const noCacheList = ["sitemap.xml", "robots.txt"];

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
      const fileName = filePath.split("/").slice(-1)[0];

      const contentType = mime.contentType(path.extname(filePath));

      contentType && res.setHeader("Content-Type", contentType);
      res.setHeader("Author", SITE_URL);
      res.setHeader("Content-Disposition", "inline");
      res.setHeader("Accept-Ranges", "bytes");

      // 如果数字开头或者在不缓存列表中的文件，则不缓存
      if (noCacheList.includes(fileName) || !/^\d+\..+$/.test(fileName)) {
        res.setHeader("Cache-Control", "no-store");
      }
    }
  });
}
