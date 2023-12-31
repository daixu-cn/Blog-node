/**
 * @Description: 文件模块处理层
 * @Author: daixu
 * @Date: 2023-10-25 16:50:31
 */

import { Context } from "koa";
import response from "@/config/response";
import responseError from "@/config/response/error";
import { getDirectories, getFiles } from "@/utils/file";
import xlsx from "node-xlsx";
import fs from "fs-extra";
import { ASSET_DIR } from "@/config/env";

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
  getDirectorys(ctx: Context) {
    try {
      ctx.body = response({
        data: getDirectories(ASSET_DIR),
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
   *           description: 目录名称
   *         path:
   *           type: string
   *           description: 文件访问地址
   *         url:
   *           type: string
   *           description: 文件地址
   *         directory:
   *           type: string
   *           description: 是否为文件夹
   *         dev:
   *           type: integer
   *           description: 设备 ID
   *         mode:
   *           type: integer
   *           description: 文件的权限和模式
   *         nlink:
   *           type: integer
   *           description: 链接数
   *         uid:
   *           type: integer
   *           description: 用户 ID
   *         gid:
   *           type: integer
   *           description: 组 ID
   *         rdev:
   *           type: integer
   *           description: 保留设备字段
   *         blksize:
   *           type: integer
   *           description: 文件系统的块大小
   *         ino:
   *           type: integer
   *           description: 文件的索引节点号
   *         size:
   *           type: integer
   *           description: 文件的大小
   *         blocks:
   *           type: integer
   *           description: 分配给文件的块数
   *         atimeMs:
   *           type: number
   *           format: double
   *           description: 文件的最后访问时间（毫秒）
   *         mtimeMs:
   *           type: number
   *           format: double
   *           description: 文件的最后修改时间（毫秒）
   *         ctimeMs:
   *           type: number
   *           format: double
   *           description: 文件的最后更改时间（毫秒）
   *         birthtimeMs:
   *           type: number
   *           format: double
   *           description: 文件的创建时间（毫秒）
   *         atime:
   *           type: string
   *           description: 文件的最后访问时间（日期时间字符串）
   *         mtime:
   *           type: string
   *           description: 文件的最后修改时间（日期时间字符串）
   *         ctime:
   *           type: string
   *           description: 文件的最后更改时间（日期时间字符串）
   *         birthtime:
   *           type: string
   *           description: 文件的创建时间（日期时间字符串）
   */
  list(ctx: Context) {
    try {
      const { directorie = "/", keyword = "", page = 1, pageSize = 10 } = ctx.params;

      const files = getFiles(`${ASSET_DIR}${directorie}`);
      // 需要排除的文件
      const excludeFiles = [".DS_Store"];

      ctx.body = response({
        data: {
          total: files.length,
          list: files
            .filter(file => file.name.includes(keyword) && !excludeFiles.includes(file.name))
            .slice((page - 1) * pageSize, page * pageSize)
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
  }
};
