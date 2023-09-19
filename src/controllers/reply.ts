/**
 * @Description: 回复模块处理层
 * @Author: daixu
 * @Date: 2023-04-22 20:35:20
 */

import { Context } from "koa";
import response from "@/config/response";
import responseError from "@/config/response/error";
import sequelize from "@/config/sequelize";
import { Transaction, FindAttributeOptions, Includeable } from "sequelize";
import { sendMail } from "@/utils/nodemailer";

import Article from "@/models/article";
import Comment from "@/models/comment";
import Reply from "@/models/reply";
import User from "@/models/user";

// 回复响应内容
const REPLY_ATTRIBUTES: FindAttributeOptions = [
  "replyId",
  "content",
  "commentId",
  "parentId",
  "createdAt"
];
// 关联的用户
const USER_INCLUDE: Includeable[] = [
  {
    model: User,
    as: "user",
    attributes: ["userId", "userName", "avatar", "role"]
  }
];
// 关联的评论
const Comment_INCLUDE: Includeable[] = [
  {
    model: Comment,
    as: "comment"
  }
];

/**
 * @description 根据评论ID获取回复列表
 * @param {params} params 参数信息
 * @return {{ rows: any[]; count: number }}
 */
export function getReplies(params: { commentId?: string; page?: number; pageSize?: number }) {
  return new Promise<{ rows: any[]; count: number }>(async (resolve, reject) => {
    try {
      const { commentId, page = 1, pageSize = 10 } = params;
      const comment = await Comment.findByPk(commentId, {
        attributes: [],
        include: USER_INCLUDE
      });
      const replyResult = await Reply.findAndCountAll({
        where: {
          commentId
        },
        attributes: REPLY_ATTRIBUTES,
        include: USER_INCLUDE,
        order: [["createdAt", "ASC"]],
        offset: (page - 1) * pageSize,
        limit: pageSize
      });
      for (const reply of replyResult.rows) {
        if (reply.dataValues.parentId) {
          const parent = await Reply.findByPk(reply.dataValues.parentId, {
            attributes: [],
            include: USER_INCLUDE
          });
          reply.dataValues.parent = parent?.dataValues.user;
        } else {
          reply.dataValues.parent = comment?.dataValues.user;
        }
      }
      resolve(replyResult);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * @description 递归删除回复记录
 * @param {Transaction} transaction 事务对象
 * @param {string} replyId 需要删除的回复ID
 * @param {string} userId 操作的用户ID
 * @return {}
 */
export function recursiveDeletionReply(transaction: Transaction, replyId: string, userId?: string) {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const rows = await Reply.destroy({
        where: userId ? { userId, replyId } : { replyId },
        transaction
      });
      if (!rows && userId) {
        reject(`${replyId}回复删除失败`);
      }

      const replyList = await Reply.findAll({ where: { parentId: replyId } });
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
   *     Reply:
   *       description: 回复信息
   *       type: object
   *       properties:
   *         replyId:
   *           type: string
   *           example: 161137488965100000
   *           description: 回复ID
   *         content:
   *           type: string
   *           example: 回复内容
   *           description: 回复内容(Markdown)
   *         commentId:
   *           type: string
   *           example: 161137488965100000
   *           description: 评论ID
   *         parentId:
   *           type: string
   *           example: 161137488965100000
   *           description: 父级回复ID
   *         createdAt:
   *           type: string
   *           example: 2023-01-10T01:55:16.000Z
   *           description: 回复时间
   *         user:
   *           description: 回复的用户信息
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
   *         parent:
   *           description: 被回复的用户信息
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
   */
  async create(ctx: Context) {
    try {
      const { content, html, commentId, parentId, userId } = ctx.params;

      if (parentId) {
        if (!(await Reply.findByPk(parentId))) {
          throw responseError({ code: 14002 });
        }
      }
      if (commentId) {
        if (!(await Comment.findByPk(commentId))) {
          throw responseError({ code: 14006 });
        }
      }

      const reply = await Reply.create({
        content,
        commentId,
        parentId,
        userId
      });

      ctx.body = response({ data: reply, message: "创建成功" });

      if (parentId) {
        const reply = (
          await Reply.findByPk(parentId, {
            include: [{ model: User, as: "user" }, ...Comment_INCLUDE]
          })
        )?.toJSON();

        if (reply.user.emailService && reply.user.email) {
          const articleId = reply.comment.articleId;
          sendMail(
            reply.user.email,
            "DAIXU BLOG",
            `收到一条回复，<a href="https://daixu.cn/${
              articleId ? "article/" + articleId : "community"
            }" target="_blank" style="color:#9fa3f1;font-weight:initial;cursor:pointer;text-decoration:none">去查看 </a>。<div>${html}</div>`
          );
        }
      } else {
        const comment = (
          await Comment.findByPk(reply.dataValues.commentId, {
            include: [{ model: User, as: "user" }]
          })
        )?.toJSON();

        if (comment.user.emailService && comment.user.email) {
          sendMail(
            comment.user.email,
            "DAIXU BLOG",
            `收到一条回复，<a href="https://daixu.cn/${
              comment.articleId ? "article/" + comment.articleId : "community"
            }" target="_blank" style="color:#9fa3f1;font-weight:initial;cursor:pointer;text-decoration:none">去查看 </a>。`
          );
        }
      }
    } catch (error: any) {
      throw responseError({
        code: error?.code ?? 14005,
        message: error.errors?.[0]?.message ?? error?.message
      });
    }
  },
  async destroy(ctx: Context) {
    const transaction = await sequelize.transaction();
    try {
      const { replyId, userId } = ctx.params;
      await recursiveDeletionReply(transaction, replyId, userId);

      await transaction.commit();
      ctx.body = response({ message: "删除成功" });
    } catch (error: any) {
      await transaction.rollback();
      throw responseError({ code: 14007, message: error?.message });
    }
  },
  async list(ctx: Context) {
    try {
      const { count, rows } = await getReplies(ctx.params);

      ctx.body = response({ data: { total: count, list: rows }, message: "查询成功" });
    } catch (error: any) {
      throw responseError({ code: 14009, message: error?.message });
    }
  }
};
