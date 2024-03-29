/**
 * @Description: 友联模块处理层
 * @Author: daixu
 * @Date: 2023-04-22 20:35:20
 */

import { Context } from "koa";
import response from "@/config/response";
import responseError from "@/config/response/error";
import { sendMail } from "@/utils/nodemailer";
import { Op, FindAttributeOptions } from "sequelize";
import { filteredParams } from "@/utils/api";

import Link from "@/models/link";

// 友联响应内容
const LINK_ATTRIBUTES: FindAttributeOptions = [
  "linkId",
  "name",
  "description",
  "logo",
  "url",
  "check",
  "createdAt"
];

export default {
  /**
   * @openapi
   * components:
   *   schemas:
   *     Link:
   *       description: 友联信息
   *       type: object
   *       properties:
   *         linkId:
   *           type: string
   *           example: 161137488965100000
   *           description: 友联ID
   *         name:
   *           type: string
   *           example: DAIXU BLOG
   *           description: 网站名称
   *         description:
   *           type: string
   *           example: 网站描述
   *           description: 网站描述
   *         logo:
   *           type: string
   *           example: https://daixu.cn/images/avatar.png
   *           description: 网站LOGO
   *         url:
   *           type: string
   *           example: https://daixu.cn
   *           description: 网站地址
   *         check:
   *           type: boolean
   *           example: true
   *           description: 友联核验状态(false:不通过、true:通过)
   */
  async create(ctx: Context) {
    try {
      const values = ["name", "description", "logo", "url", "email", "qq"];
      const { dataValues: link } = await Link.create(filteredParams(ctx.params, values));

      sendMail("daixu.cn@outlook.com", "友联申请", `收到一份${link.name}的友联申请，请及时处理。`);

      ctx.body = response({ data: link, message: "创建成功" });
    } catch (error: any) {
      throw responseError({ code: 15001, message: error?.errors[0]?.message ?? error?.message });
    }
  },
  async update(ctx: Context) {
    try {
      const { linkId, ...values } = ctx.params;
      const { check } = values;

      const [rows] = await Link.update(values, { where: { linkId } });

      if (rows) {
        ctx.body = response({ message: "修改成功" });

        const link = (
          await Link.findByPk(linkId, {
            attributes: LINK_ATTRIBUTES
          })
        )?.toJSON();
        if ((check === 0 || check === 1) && link.email) {
          sendMail(
            link.email,
            "DAIXU BLOG",
            check === 0
              ? `抱歉，您的友联已被拒绝，可通过下方邮箱联系管理员。感谢您的支持。`
              : `您的友联已通过审核，感谢您的支持。`
          );
        }
      } else {
        throw responseError({ code: 15002 });
      }
    } catch (error: any) {
      throw responseError({ code: 15002, message: error.errors?.[0]?.message ?? error?.message });
    }
  },
  async list(ctx: Context) {
    try {
      const { keyword, check, startTime, endTime, page = 1, pageSize = 10, role } = ctx.params;

      const { count, rows } = await Link.findAndCountAll({
        where: {
          [Op.and]: [
            keyword && {
              [Op.or]: [
                { linkId: keyword },
                { name: { [Op.like]: `%${keyword}%` } },
                { description: { [Op.like]: `%${keyword}%` } },
                { url: { [Op.like]: `%${keyword}%` } }
              ]
            },
            startTime && { createdAt: { [Op.gte]: startTime } },
            endTime && { createdAt: { [Op.lte]: endTime } },
            (check === 0 || check === 1) && { check }
          ]
        },
        attributes: role !== 0 ? LINK_ATTRIBUTES : undefined,
        order: [["createdAt", "DESC"]],
        offset: (page - 1) * pageSize,
        limit: pageSize
      });

      ctx.body = response({ data: { total: count, list: rows }, message: "查询成功" });
    } catch (error: any) {
      throw responseError({ code: 15003, message: error?.message });
    }
  },
  async destroy(ctx: Context) {
    try {
      const { linkId } = ctx.params;
      const rows = await Link.destroy({
        where: {
          linkId
        }
      });
      if (rows) {
        ctx.body = response({ message: "删除成功" });
      } else {
        throw responseError({ code: 15004 });
      }
    } catch (error: any) {
      throw responseError({ code: 15004, message: error?.message });
    }
  }
};
