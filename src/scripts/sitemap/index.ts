/**
 * @Description: Sitemap自动更新脚本
 * @Author: daixu
 * @Date: 2023-04-16 21:23:59
 */

import fs from "fs-extra";
import { SitemapStream, streamToPromise, SitemapItemLoose, EnumChangefreq } from "sitemap";
import { Readable } from "stream";
import { errorLogger } from "@/utils/log4";
import schedule from "node-schedule";
import { SITE_URL, ASSET_DIR, PM2_INSTANCE } from "@/config/env";
import Article from "@/models/article";
import dayjs from "dayjs";
import baseLinks from "@/scripts/sitemap/baseLinks";

// 只在PM2第一个进程运行该脚本
if (PM2_INSTANCE === "0") {
  // 初始化执行一次
  updateSiteMap();

  // 每天00:00执行一次
  schedule.scheduleJob("0 0 0 * * *", updateSiteMap);
}

/**
 * @description 获取文章链接
 * @return {Promise<SitemapItemLoose[]>} 文章链接列表
 */
function getArticles() {
  return new Promise<SitemapItemLoose[]>(async (resolve, reject) => {
    try {
      const links: SitemapItemLoose[] = [];

      const articleList = await Article.findAll();
      for (const item of articleList) {
        const article = item.dataValues;

        links.push({
          url: `${SITE_URL}/article/${article.articleId}`,
          changefreq: EnumChangefreq.WEEKLY,
          priority: 0.9,
          lastmod: article.updatedAt,
          lastmodISO: dayjs(article.updatedAt).toISOString()
        });
      }

      resolve(links);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * @description 生成/更新 sitemap.xml
 */
async function updateSiteMap() {
  const articles = await getArticles();

  const smStream = new SitemapStream({ hostname: SITE_URL });

  streamToPromise(Readable.from([...baseLinks, ...articles]).pipe(smStream))
    .then(data => {
      fs.outputFile(`${ASSET_DIR}/site/sitemap.xml`, data.toString());
    })
    .catch(err => {
      errorLogger(err);
    });
}
