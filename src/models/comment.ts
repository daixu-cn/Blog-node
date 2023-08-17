/**
 * @Description: 评论表数据模型
 * @Author: daixu
 * @Date: 2023-04-22 20:51:38
 */

import { DataTypes } from "sequelize";
import sequelize from "@/config/sequelize";
import { generateId } from "@/utils/api";

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
  { freezeTableName: true, comment: "评论表", createdAt: "createdAt", updatedAt: "updatedAt" }
);

export default Comment;
