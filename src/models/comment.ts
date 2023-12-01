/**
 * @Description: 评论表数据模型
 * @Author: daixu
 * @Date: 2023-04-22 20:51:38
 */

import { DataTypes } from "sequelize";
import sequelize from "@/config/sequelize";
import { generateId } from "@/utils/api";
import { deleteLocalAsset } from "@/utils/file";

import Reply from "@/models/reply";

const Comment = sequelize.define(
  "comment",
  {
    commentId: {
      type: DataTypes.BIGINT.UNSIGNED,
      comment: "评论ID",
      defaultValue: () => generateId(),
      primaryKey: true,
      unique: true,
      get() {
        return String(this.getDataValue("commentId"));
      }
    },
    content: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
      comment: "评论内容(Markdown)",
      validate: {
        notNull: {
          msg: "评论内容不能为空"
        }
      }
    },
    articleId: {
      type: DataTypes.BIGINT.UNSIGNED,
      comment: "文章ID",
      allowNull: true,
      defaultValue: null,
      get() {
        const articleId = this.getDataValue("articleId");
        return articleId ? String(articleId) : articleId;
      }
    },
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: "评论的用户ID",
      validate: {
        notNull: {
          msg: "评论的用户ID不能为空"
        }
      },
      get() {
        return String(this.getDataValue("userId"));
      }
    }
  },
  {
    freezeTableName: true,
    comment: "评论表",
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    hooks: {
      afterDestroy({ dataValues: comment }) {
        return new Promise<void>(async (resolve, reject) => {
          try {
            // 删除评论关联内容的本地文件
            deleteLocalAsset(comment.content);

            // 删除评论关联的回复
            const replyList = await Reply.findAll({ where: { commentId: comment.commentId } });
            for (const { dataValues } of replyList) {
              Reply.destroy({
                where: { replyId: dataValues.replyId },
                individualHooks: true
              });
            }

            resolve();
          } catch (error) {
            reject(error);
          }
        });
      }
    }
  }
);

export default Comment;
