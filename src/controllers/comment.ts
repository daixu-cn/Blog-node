/**
 * @Description: 评论模块处理层
 * @Author: daixu
 * @Date: 2023-04-22 20:35:20
 */

import { Context } from "koa";
import response from "@/config/response";
import responseError from "@/config/response/error";
import { Op, FindAttributeOptions, Transaction } from "sequelize";
import sequelize from "@/config/sequelize";
import { recursiveDeletionReply } from "@/controllers/reply";
import { getReplies } from "@/controllers/reply";
import { sendMail } from "@/utils/nodemailer";

import Comment from "@/models/comment";
import Reply from "@/models/reply";
import User from "@/models/user";
import Article from "@/models/article";

// 评论响应内容
const COMMENT_ATTRIBUTES: FindAttributeOptions = ["commentId", "content", "articleId", "createdAt"];
// 对应评论/回复用户的响应内容
const USER_ATTRIBUTES: FindAttributeOptions = ["userId", "userName", "avatar", "role"];

/**
 * @description 递归删除评论记录
 * @param {Transaction} transaction 事务对象
 * @param {string} commentId 需要删除的评论ID
 * @param {string} userId 操作的用户ID
 * @return {}
 */
export function recursiveDeletionComment(
  transaction: Transaction,
  commentId: string,
  userId?: string
) {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const rows = await Comment.destroy({
        where: userId ? { userId, commentId } : { commentId },
        transaction
      });
      if (!rows) {
        reject(`${commentId}评论删除失败`);
      }

      const replyList = await Reply.findAll({ where: { commentId } });
      for (const item of replyList) {
        await recursiveDeletionReply(transaction, item?.dataValues.replyId);
      }
      resolve();
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
   *     Comment:
   *       description: 评论信息
   *       type: object
   *       properties:
   *         commentId:
   *           type: string
   *           example: 161137488965100000
   *           description: 评论ID
   *         content:
   *           type: string
   *           example: 评论内容
   *           description: 评论内容(Markdown)
   *         articleId:
   *           type: string
   *           example: 161137488965100000
   *           description: 文章ID
   *         createdAt:
   *           type: string
   *           example: 2023-01-10T01:55:16.000Z
   *           description: 评论时间
   *         user:
   *           description: 评论的用户信息
   *           type: object
   *           properties:
   *             userId:
   *               type: string
   *               example: "169774769959575552"
   *               description: 用户ID
   *             userName:
   *               type: string
   *               example: daixu
   *               description: 用户名称
   *             role:
   *               type: integer
   *               example: 1
   *               description: 角色(0:管理员、1:普通用户)
   *             avatar:
   *               type: string
   *               example: http://localhost:3000/upload/image/user/avatar.png
   *               description: 用户头像
   *         replyTotal:
   *           type: integer
   *           example: 99
   *           description: 该评论回复总数
   *         replies:
   *           type: array
   *           description: 回复列表
   *           items:
   *             $ref: '#/components/schemas/Reply'
   */
  async list(ctx: Context) {
    try {
      const { articleId, keyword, startTime, endTime, page = 1, pageSize = 10 } = ctx.params;
      let total = 0;
      const commentResult = await Comment.findAndCountAll({
        where: {
          [Op.and]: [
            keyword && {
              [Op.or]: [
                { commentId: { [Op.substring]: keyword } },
                { content: { [Op.substring]: keyword } },
                { userId: { [Op.substring]: keyword } }
              ]
            },
            startTime && { createdAt: { [Op.gte]: startTime } },
            endTime && { createdAt: { [Op.lte]: endTime } },
            articleId && {
              articleId: articleId === "-1" ? null : articleId
            }
          ]
        },
        attributes: COMMENT_ATTRIBUTES,
        include: [
          {
            model: User,
            as: "user",
            attributes: USER_ATTRIBUTES
          },
          {
            model: Article,
            as: "article",
            attributes: ["articleId", "title"]
          }
        ],
        order: [["createdAt", "DESC"]],
        offset: (page - 1) * pageSize,
        limit: pageSize
      });

      if (commentResult.count) {
        for (const item of commentResult.rows) {
          const res = await getReplies({
            commentId: item.dataValues.commentId,
            pageSize: 3
          });
          total += res.count;
          item.dataValues.replyTotal = res.count;
          item.dataValues.replies = res.rows;
        }
      }

      ctx.body = response({
        data: {
          total: commentResult.count,
          comment_reply_total: commentResult.count + total,
          list: commentResult.rows
        },
        message: "查询成功"
      });
    } catch (error: any) {
      throw responseError({ code: 14004, message: error?.message });
    }
  },
  async create(ctx: Context) {
    try {
      const { content, articleId, userId } = ctx.params;

      if (articleId && articleId !== "-1") {
        const article = await Article.findOne({
          where: { articleId }
        });
        if (!article) {
          throw responseError({ code: 14003 });
        }
      }

      const { dataValues } = await Comment.create({
        content,
        articleId: articleId === "-1" ? null : articleId,
        userId
      });

      const comment = await Comment.findByPk(dataValues.commentId, {
        attributes: COMMENT_ATTRIBUTES
      });
      ctx.body = response({ data: comment, message: "创建成功" });

      sendMail(
        "daixu.cn@outlook.com",
        "DAIXU BLOG",
        `收到一条评论，<a href="https://daixu.cn/${
          articleId === "-1" ? "community" : "article/" + articleId
        }" target="_blank" style="color:#9fa3f1;font-weight:initial;cursor:pointer;text-decoration:none">去查看 </a>。<div>${content}</div>`
      );
    } catch (error: any) {
      throw responseError({ code: 14001, message: error.errors?.[0]?.message ?? error?.message });
    }
  },
  async destroy(ctx: Context) {
    const transaction = await sequelize.transaction();
    try {
      const { commentId, userId } = ctx.params;
      await recursiveDeletionComment(transaction, commentId, userId);

      await transaction.commit();
      ctx.body = response({ message: "删除成功" });
    } catch (error: any) {
      await transaction.rollback();
      throw responseError({ code: 14008, message: error?.message });
    }
  }
};