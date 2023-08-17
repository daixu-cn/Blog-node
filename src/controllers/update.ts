/**
 * @Description: 网站更新日志模块处理层
 * @Author: daixu
 * @Date: 2023-04-22 20:35:20
 */

import { Context } from "koa";
import response from "@/config/response";
import responseError from "@/config/response/error";
import { Op } from "sequelize";

import Update from "@/models/update";

export default {
  /**
   * @openapi
   * components:
   *   schemas:
   *     Update:
   *       description: 网站更新信息
   *       type: object
   *       properties:
   *         updateId:
   *           type: string
   *           example: 161137488965100000
   *           description: 更新ID
   *         content:
   *           type: string
   *           description: 更新内容
   *         createdAt:
   *           type: string
   *           example: 2023-01-10T01:55:16.000Z
   *           description: 创建时间
   *         updatedAt:
   *           type: string
   *           example: 2023-01-10T01:55:16.000Z
   *           description: 更新时间
   */
  async create(ctx: Context) {
    try {
      const { content } = ctx.params;
      const { dataValues } = await Update.create({
        content
      });

      const update = await Update.findByPk(dataValues.updateId);
      ctx.body = response({ data: update, message: "创建成功" });
    } catch (error: any) {
      throw responseError({ code: 17001, message: error.errors?.[0]?.message ?? error?.message });
    }
  },
  async update(ctx: Context) {
    try {
      const { updateId, content } = ctx.params;
      const [rows] = await Update.update({ content }, { where: { updateId } });

      if (rows) {
        const update = await Update.findByPk(updateId);
        ctx.body = response({ data: update, message: "修改成功" });
      } else {
        throw responseError({ code: 17002 });
      }
    } catch (error: any) {
      throw responseError({ code: 17002, message: error.errors?.[0]?.message ?? error?.message });
    }
  },
  async list(ctx: Context) {
    try {
      const { keyword, startTime, endTime, page = 1, pageSize = 10 } = ctx.params;

      const { count, rows } = await Update.findAndCountAll({
        where: {
          [Op.and]: [
            keyword && {
              [Op.or]: [{ updateId: keyword }, { content: { [Op.like]: `%${keyword}%` } }]
            },
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
      throw responseError({ code: 17003, message: error?.message });
    }
  },
  async destroy(ctx: Context) {
    try {
      const { updateId } = ctx.params;
      const rows = await Update.destroy({
        where: {
          updateId
        }
      });
      if (rows) {
        ctx.body = response({ message: "删除成功" });
      } else {
        throw responseError({ code: 17004 });
      }
    } catch (error: any) {
      throw responseError({ code: 17004, message: error?.message });
    }
  }
};
