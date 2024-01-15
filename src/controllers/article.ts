/**
 * @Description: 文章处理层
 * @Author: daixu
 * @Date: 2023-04-22 20:35:20
 */

import { Context } from "koa";
import response from "@/config/response";
import responseError from "@/config/response/error";
import { Op, FindAttributeOptions, Includeable } from "sequelize";
import sequelize from "@/config/sequelize";
import redis from "@/utils/redis";
import dayjs from "dayjs";
import { sendMail } from "@/utils/nodemailer";
import { filteredParams } from "@/utils/api";

import User from "@/models/user";
import Article from "@/models/article";
import Comment from "@/models/comment";
import Reply from "@/models/reply";

// 文章响应内容
const ARTICLE_ATTRIBUTES: FindAttributeOptions = [
  "articleId",
  "title",
  "description",
  "category",
  "content",
  "poster",
  "video",
  "views",
  "disableComment",
  "isPrivate",
  "unlockAt",
  "createdAt",
  "updatedAt"
];
// 对应文章作者用户响应内容
const USER_ATTRIBUTES: FindAttributeOptions = ["userId", "userName", "avatar", "email", "role"];
// 关联表
const INCLUDE: Includeable[] = [
  {
    model: User,
    as: "user",
    attributes: USER_ATTRIBUTES
  }
];

/**
 * @description 根据文章ID获取评论/回复总数
 * @param {string} articleId 文章ID
 * @return {number}
 */
function getCommentReplyTotal(articleId: string): Promise<number> {
  return new Promise<number>(async (resolve, reject) => {
    try {
      let total = 0;
      const comment = await Comment.findAndCountAll({ where: { articleId } });

      for (const item of comment.rows) {
        total += (await Reply.findAndCountAll({ where: { commentId: item.dataValues.commentId } }))
          .count;
      }

      resolve(total + comment.count);
    } catch (err) {
      reject(err);
    }
  });
}

export default {
  /**
   * @openapi
   * components:
   *   schemas:
   *     Article:
   *       description: 文章信息
   *       type: object
   *       properties:
   *         articleId:
   *           type: string
   *           example: 161137488965100000
   *           description: 文章ID
   *         title:
   *           type: string
   *           example: WEB开发
   *           description: 文章标题
   *         description:
   *           type: string
   *           example: 文章描述
   *           description: 文章描述
   *         category:
   *           $ref: '#/components/schemas/Category'
   *         poster:
   *           type: string
   *           example: https://daixu.cn/images/avatar.png
   *           description: 预览图片
   *         video:
   *           type: string
   *           example: https://daixu.cn/images/xxx.mp4
   *           description: 视频
   *         content:
   *           type: string
   *           example: 文章内容
   *           description: 文章正文(Markdown)
   *         views:
   *           type: integer
   *           example: 1
   *           description: 文章阅读量
   *         disableComment:
   *           type: boolean
   *           example: true
   *           description: 禁止评论(false:允许评论、true:禁止评论)
   *         isPrivate:
   *           type: boolean
   *           example: true
   *           description: 私有文章(false:公开、true:私有)
   *         user:
   *           type: object
   *           description: 发布用户
   *           properties:
   *             userId:
   *               type: string
   *               example: 161137488965100000
   *               description: 用户ID
   *             userName:
   *               type: string
   *               example: admin
   *               description: 用户名
   *             email:
   *               type: string
   *               example: daixu.cn@outlook.com
   *               description: 邮箱
   *             avatar:
   *               type: string
   *               example: https://daixu.cn/images/avatar.png
   *               description: 头像
   *             role:
   *               type: integer
   *               example: 1
   *               description: 角色(0:管理员、1:普通用户)
   *         unlockAt:
   *           type: string
   *           example: 2023-01-10T01:55:16.000Z
   *           description: 解锁时间
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
      const values = [
        "title",
        "description",
        "category",
        "poster",
        "video",
        "content",
        "disableComment",
        "isPrivate",
        "unlockAt",
        "userId"
      ];

      const { dataValues: article } = await Article.create(filteredParams(ctx.params, values));

      ctx.body = response({ data: article, message: "创建成功" });

      if (!article.isPrivate && dayjs().isAfter(article.unlockAt)) {
        const userList = await User.findAll({
          where: {
            emailService: true
          }
        });
        for (const item of userList) {
          if (item.dataValues.email && item.dataValues.emailService) {
            sendMail(
              item.dataValues.email,
              "DAIXU BLOG",
              `博主发布了新文章--<a href="https://daixu.cn/article/${article.articleId}" target="_blank" style="color:#9fa3f1;font-weight:initial;cursor:pointer;text-decoration:none">${article.title}</a>。<div>${article.description}</div>`
            );
          }
        }
      }
    } catch (error: any) {
      throw responseError({ code: 13001, message: error?.message });
    }
  },
  async list(ctx: Context) {
    try {
      const {
        keyword,
        category,
        status,
        startTime,
        endTime,
        page = 1,
        pageSize = 10,
        orderBy = "createdAt",
        role
      } = ctx.params;

      const { count, rows } = await Article.findAndCountAll({
        where: {
          [Op.and]: [
            keyword && {
              [Op.or]: [
                { articleId: keyword },
                { title: { [Op.like]: `%${keyword}%` } },
                { description: { [Op.like]: `%${keyword}%` } }
              ]
            },
            category && { category },
            (status === 0 || status === 1) && {
              unlockAt: {
                [Op[status === 1 ? "gte" : "lte"]]: dayjs().format("YYYY-MM-DDTHH:mm:ss.sssZZ")
              }
            },
            startTime && { createdAt: { [Op.gte]: startTime } },
            endTime && { createdAt: { [Op.lte]: endTime } }
          ]
        },
        attributes: ARTICLE_ATTRIBUTES,
        include: INCLUDE,
        order: [[orderBy, "DESC"]],
        offset: (page - 1) * pageSize,
        limit: pageSize
      });

      const list: any[] = [];
      for (const item of rows) {
        const article = item.toJSON();
        const unlock = dayjs().isAfter(article.unlockAt);

        list.push({
          ...article,
          comment_reply_total: await getCommentReplyTotal(article.articleId),
          content:
            article.isPrivate || !unlock ? (role === 0 ? article.content : "") : article.content
        });
      }

      ctx.body = response({ data: { total: count, list }, message: "查询成功" });
    } catch (error: any) {
      throw responseError({ code: 13002, message: error?.message });
    }
  },
  async update(ctx: Context) {
    try {
      const { articleId, userId, ...values } = ctx.params;

      const [rows] = await Article.update(values, {
        where: { articleId, userId },
        individualHooks: true
      });

      if (rows) {
        ctx.body = response({ message: "修改成功" });
      } else {
        throw responseError({ code: 13003 });
      }
    } catch (error: any) {
      throw responseError({ code: 13003, message: error?.message });
    }
  },
  async info(ctx: Context) {
    try {
      const { articleId, disableViewsIncrement, role, userId } = ctx.params;

      const article = (
        await Article.findOne({
          where: { articleId },
          attributes: ARTICLE_ATTRIBUTES,
          include: INCLUDE
        })
      )?.toJSON();

      // 如果不是文章作者并且同一天没有访问过该文章则增加阅读量
      if (
        userId !== article.user.userId &&
        disableViewsIncrement !== "true" &&
        (await redis.get(`${ctx.clientIp}-${articleId}`)) !== dayjs().format("YYYY-MM-DD")
      ) {
        Article.increment({ views: 1 }, { where: { articleId } });
        redis.set(`${ctx.clientIp}-${articleId}`, dayjs().format("YYYY-MM-DD"), 60 * 60 * 24);
      }

      if (article) {
        const unlock = dayjs().isAfter(dayjs(article.unlockAt));

        ctx.body = response({
          data: {
            ...article,
            comment_reply_total: await getCommentReplyTotal(articleId),
            content:
              article.isPrivate || !unlock ? (role === 0 ? article.content : "") : article.content
          },
          message: "查询成功"
        });
      } else {
        throw responseError({ code: 13005 });
      }
    } catch (error: any) {
      throw responseError({ code: 13005, message: error.message });
    }
  },
  /**
   * @openapi
   * components:
   *   schemas:
   *     ArticleTitle:
   *       description: 文章标题
   *       type: object
   *       properties:
   *         articleId:
   *           type: string
   *           example: 161137488965100000
   *           description: 文章ID
   *         title:
   *           type: string
   *           example: WEB开发
   *           description: 文章标题
   *         category:
   *           $ref: '#/components/schemas/Category'
   */
  async title(ctx: Context) {
    try {
      const { keyword } = ctx.params;

      const rows = await Article.findAll({
        where: {
          title: {
            [Op.like]: `%${keyword ?? ""}%`
          }
        },
        attributes: ["articleId", "title", "category"],
        order: [["createdAt", "DESC"]]
      });

      ctx.body = response({ data: rows, message: "查询成功" });
    } catch (error: any) {
      throw responseError({ code: 13006, message: error.message });
    }
  },
  async destroy(ctx: Context) {
    try {
      const { articleId, userId } = ctx.params;

      const rows = await Article.destroy({
        where: { articleId, userId },
        individualHooks: true
      });

      if (rows) {
        ctx.body = response({ message: "删除成功" });
      } else {
        throw responseError({ code: 13007 });
      }
    } catch (error: any) {
      throw responseError({ code: 13007, message: error.message });
    }
  }
};
