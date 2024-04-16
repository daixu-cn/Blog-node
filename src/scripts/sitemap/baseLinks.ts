import { SITE_URL } from "@/config/env";
import { SitemapItemLoose, EnumChangefreq } from "sitemap";
import { Router } from "./types";

const routers: Router[] = [
  {
    url: "/article"
  },
  {
    url: "/community"
  },
  {
    url: "/links"
  },
  {
    url: "/creations",
    changefreq: EnumChangefreq.MONTHLY
  },
  {
    url: "/updates"
  },
  {
    url: "/creations/final-choice"
  }
];

const baseLinks: SitemapItemLoose[] = routers.map(item => {
  return {
    url: `${SITE_URL}${item.url}`,
    changefreq: item.changefreq ?? EnumChangefreq.WEEKLY,
    priority: item.priority ?? 1.0
  };
});

export default baseLinks;
