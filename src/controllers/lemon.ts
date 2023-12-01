/**
 * @Description: 柠檬路由处理层
 * @Author: daixu
 * @Date: 2023-11-19 16:43:47
 */

import { Context } from "koa";
import response from "@/config/response";
import responseError from "@/config/response/error";
import { Op } from "sequelize";
import { ASSET_DIR, ASSET_PREFIX } from "@/config/env";
import FileType from "file-type";
import fs from "fs-extra";
import { handleUploadFile } from "@/controllers/upload/file-process";

import Lemon from "@/models/lemon";
export default {
  /**
   * @openapi
   * components:
   *   schemas:
   *     Lemon:
   *       description: 柠檬信息
   *       type: object
   *       properties:
   *         lemonId:
   *           type: string
   *           example: 161137488965100000
   *           description: ID
   *         description:
   *           type: string
   *           example: 柠檬记录描述
   *           description: 柠檬记录描述
   *         path:
   *           type: string
   *           example: https://daixu.cn/images/avatar.png
   *           description: 文件地址
   *         mediaType:
   *           $ref: '#/components/schemas/LemonMediaType'
   */
  async create(ctx: Context) {
    try {
      const files = ctx.request.files;
      const { description } = ctx.params;

      // 如果文件不存在
      if (!files?.file) {
        throw responseError({ code: 12002 });
      }

      const list = Array.isArray(files.file) ? files.file : [files.file];

      for (const file of list) {
        const path = await handleUploadFile(ctx, file);
        const result = await FileType.fromFile(`${ASSET_DIR}${path.replace(ASSET_PREFIX, "")}`);

        await Lemon.create({
          description,
          path,
          mediaType: result?.mime.split("/")[0]?.toUpperCase()
        });
      }
      ctx.body = response({ message: "创建成功" });
    } catch (error: any) {
      throw responseError({
        code: error?.code ?? 19001,
        data: error?.data,
        message: error?.message
      });
    }
  },
  async list(ctx: Context) {
    try {
      const { keyword, mediaType, startTime, endTime, page = 1, pageSize = 10 } = ctx.params;

      const { count, rows } = await Lemon.findAndCountAll({
        where: {
          [Op.and]: [
            keyword && {
              [Op.or]: [
                { lemonId: keyword },
                { path: { [Op.like]: `%${keyword}%` } },
                { description: { [Op.like]: `%${keyword}%` } }
              ]
            },
            mediaType && { mediaType },
            startTime && { createdAt: { [Op.gte]: startTime } },
            endTime && { createdAt: { [Op.lte]: endTime } }
          ]
        },
        order: [["createdAt", "DESC"]],
        offset: (page - 1) * pageSize,
        limit: pageSize
      });

      ctx.body = response({ data: { total: count, list: rows }, message: "查询成功" });
    } catch (error: any) {
      throw responseError({ code: 19002, message: error?.message });
    }
  },
  async update(ctx: Context) {
    try {
      const { lemonId, description, path } = ctx.params;

      const assetPath = path.replace(ASSET_PREFIX, "");
      const result = await FileType.fromFile(`${ASSET_DIR}${assetPath}`);

      const [rows] = await Lemon.update(
        {
          description,
          mediaType: path ? result?.mime.split("/")[0]?.toUpperCase() : undefined,
          path: path ?? undefined
        },
        { where: { lemonId } }
      );

      const lemon = await Lemon.findByPk(lemonId);
      if (rows) {
        ctx.body = response({ data: lemon, message: "修改成功" });
      } else {
        throw responseError({ code: 19003 });
      }
    } catch (error: any) {
      throw responseError({ code: 19003, message: error?.message });
    }
  },
  async destroy(ctx: Context) {
    try {
      const { lemonId } = ctx.params;

      const rows = await Lemon.destroy({
        where: { lemonId },
        individualHooks: true
      });

      if (rows) {
        ctx.body = response({ message: "删除成功" });
      } else {
        throw responseError({ code: 19004 });
      }
    } catch (error: any) {
      throw responseError({ code: 19004, message: error.message });
    }
  }
};
