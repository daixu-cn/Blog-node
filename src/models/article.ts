/**
 * @Description: 文章数据模型
 * @Author: daixu
 * @Date: 2023-04-22 20:51:38
 */

import { DataTypes } from "sequelize";
import sequelize from "@/config/sequelize";
import { category } from "@/global/enum";
import { generateId } from "@/utils/api";
import { FILE_PREFIX } from "@/config/env";

const Article = sequelize.define(
  "article",
  {
    articleId: {
      type: DataTypes.BIGINT.UNSIGNED,
      comment: "文章ID",
      defaultValue: () => generateId(),
      primaryKey: true,
      unique: true,
      get() {
        return String(this.getDataValue("articleId"));
      }
    },
    title: {
      type: DataTypes.CHAR(255),
      allowNull: false,
      comment: "文章标题",
      validate: {
        notNull: {
          msg: "文章标题不能为空"
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      comment: "文章描述"
    },
    category: {
      type: DataTypes.ENUM({ values: Object.keys(category) }),
      comment: `文章类别：${JSON.stringify(category).slice(1, -1)}`,
      allowNull: false,
      validate: {
        notNull: {
          msg: "文章类别不能为空"
        },
        isIn: {
          args: [Object.keys(category)],
          msg: "文章类别不存在"
        }
      }
    },
    poster: {
      type: DataTypes.CHAR(255),
      comment: "预览图片",
      defaultValue: "",
      get() {
        const poster = this.getDataValue("poster");
        return poster ? `${FILE_PREFIX}${poster}` : null;
      }
    },
    video: {
      type: DataTypes.CHAR(255),
      comment: "视频",
      get() {
        const video = this.getDataValue("video");
        return video ? `${FILE_PREFIX}${video}` : null;
      }
    },
    content: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
      comment: "文章正文(Markdown)",
      validate: {
        notNull: {
          msg: "文章正文不能为空"
        }
      }
    },
    views: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "文章阅读量",
      defaultValue: 0
    },
    disableComment: {
      type: DataTypes.BOOLEAN,
      comment: "禁止评论(0:允许评论、1:禁止评论)",
      allowNull: false,
      defaultValue: false,
      validate: {
        isBoolean: {
          message: "disableComment 字段类型错误"
        }
      }
    },
    isPrivate: {
      type: DataTypes.BOOLEAN,
      comment: "私有文章(0:公开、1:私有)",
      allowNull: false,
      defaultValue: false,
      validate: {
        isBoolean: {
          message: "isPrivate 字段类型错误"
        }
      }
    },
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: "用户ID",
      validate: {
        notNull: {
          msg: "用户ID不能为空"
        }
      },
      get() {
        return String(this.getDataValue("userId"));
      }
    }
  },
  { freezeTableName: true, comment: "文章表", createdAt: "createdAt", updatedAt: "updatedAt" }
);

export default Article;
