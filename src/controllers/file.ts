/**
 * @Description: 文件模块处理层
 * @Author: daixu
 * @Date: 2023-10-25 16:50:31
 */

import { Context } from "koa";
import response from "@/config/response";
import responseError from "@/config/response/error";
import xlsx from "node-xlsx";
import fs from "fs-extra";
import { getDirectories } from "@/utils/file";
import oss from "@/utils/oss";
import { FileResult } from "@/utils/type";

export default {
  /**
   * @openapi
   * components:
   *   schemas:
   *     Directorys:
   *       description: 目录列表
   *       type: object
   *       properties:
   *         name:
   *           type: string
   *           description: 目录名称
   *         subDirectories:
   *           type: array
   *           description: 子目录列表
   *           items:
   *             $ref: '#/components/schemas/Directorys'
   */
  async getDirectorys(ctx: Context) {
    try {
      ctx.body = response({
        data: await getDirectories(),
        message: "查询成功"
      });
    } catch (error: any) {
      throw responseError({ code: 18001, message: error?.message });
    }
  },
  /**
   * @openapi
   * components:
   *   schemas:
   *     File:
   *       description: 文件信息
   *       type: object
   *       properties:
   *         name:
   *           type: string
   *           description: 目录/文件名称
   *         directory:
   *           type: boolean
   *           description: 是否为目录
   *         url:
   *           type: string
   *           description: 文件的访问地址
   *         size:
   *           type: parseInt
   *           description: 文件的大小（字节）
   *         lastModified:
   *           type: string
   *           description: 文件的最后更改时间（日期时间字符串）
   */
  async list(ctx: Context) {
    try {
      const { directorie = "", keyword = "", page = 1, pageSize = 10 } = ctx.params;
      let result: FileResult[] = [];

      const { objects, prefixes } = await oss.list({
        prefix: directorie,
        delimiter: "/",
        "max-keys": "1000"
      });

      for (const path of prefixes ?? []) {
        result.push({
          directory: true,
          name: path.split("/").slice(-2)[0]
        });
      }
      for (const item of objects) {
        if (item.name !== directorie) {
          result.push({
            path: item.name,
            name: item.name.split("/").slice(-1)[0],
            url: item.url,
            lastModified: item.lastModified,
            size: item.size
          });
        }
      }

      result = result.filter(file => file.name.includes(keyword));
      ctx.body = response({
        data: {
          total: result.length,
          list: result.slice((page - 1) * pageSize, page * pageSize)
        },
        message: "查询成功"
      });
    } catch (error: any) {
      throw responseError({ code: 18002, message: error?.message });
    }
  },
  xlsx_parse(ctx: Context) {
    const file = ctx.request.files?.file;
    if (!Array.isArray(file)) {
      try {
        if (!file) {
          throw responseError({ code: 12001 });
        }

        ctx.body = response({
          data: xlsx.parse(file.filepath),
          message: "解析成功"
        });
      } catch (error: any) {
        throw responseError({ code: 18003, message: error?.message });
      } finally {
        if (file) {
          fs.remove(file?.filepath);
        }
      }
    }
  },
  async videoType(ctx: Context) {
    try {
      const { video } = ctx.params;

      const res = await fetch(video, { method: "HEAD" });
      if (res.ok) {
        const type = res.headers.get("Content-Type");
        if (type) {
          ctx.body = response({
            data: type,
            message: "获取成功"
          });
        } else {
          throw responseError({ code: 18004 });
        }
      } else {
        throw responseError({ code: 18004 });
      }
    } catch (error: any) {
      throw responseError({ code: 18004, message: error?.message });
    }
  }
};
