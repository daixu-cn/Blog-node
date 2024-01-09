import { EnumChangefreq } from "sitemap";

export interface Router {
  url: string;
  // 默认：EnumChangefreq.WEEKLY
  changefreq?: EnumChangefreq;
  // 默认：1.0
  priority?: number;
}
