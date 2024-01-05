/**
 * @Description: swagger路由配置
 * @Author: daixu
 * @Date: 2023-04-22 20:36:55
 */

import Router from "koa-router";
const router = new Router();
import swaggerJsDoc from "swagger-jsdoc";
import { koaSwagger } from "koa2-swagger-ui";
import path from "path";
import { URL, ASSET_PREFIX } from "@/config/env";
import fs from "fs-extra";

router.prefix("/swagger");

const swaggerSpec = swaggerJsDoc({
  swaggerDefinition: {
    failOnErrors: true,
    openapi: "3.0.3",
    info: {
      title: "DAIXU BLOG",
      description: "DAIXU BLOG API DOCS",
      version: JSON.parse(fs.readFileSync(path.join(__dirname, "../../package.json"), "utf8"))
        ?.version,
      contact: {
        name: "daixu",
        url: "https://daixu.cn",
        email: "daixu.cn@outlook.com"
      }
    },
    servers: [
      {
        url: URL,
        description: "server url"
      }
    ],
    components: {
      securitySchemes: {
        Authorization: {
          type: "http",
          scheme: "bearer"
        }
      }
    },
    security: [
      {
        Authorization: []
      }
    ]
  },
  apis: [
    path.join(__dirname, "./*.ts"),
    path.join(__dirname, "../controllers/*.ts"),
    path.join(__dirname, "../controllers/*/*.ts"),
    path.join(__dirname, "../global/*.ts")
  ]
}) as Record<string, unknown>;

router.get(
  "/",
  async (ctx, next) => {
    ctx.set("Content-Security-Policy", "");
    await next();
  },
  koaSwagger({
    title: "DAIXU BLOG - Swagger UI",
    favicon: `${ASSET_PREFIX}/image/favicon.ico`,
    routePrefix: false,
    hideTopbar: true,
    swaggerOptions: {
      spec: swaggerSpec,
      docExpansion: "none"
    },
    customCSS: `
      .swagger-ui .parameter__empty_value_toggle {
        display: none;
      }

      .swagger-ui .model-box-control:focus,
      .swagger-ui .models-control:focus,
      .swagger-ui .opblock-summary-control:focus {
        outline: none;
      }
    `
  })
);

export default router;
