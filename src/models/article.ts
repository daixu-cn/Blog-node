/**
 * @Description: 文章数据模型
 * @Author: daixu
 * @Date: 2023-04-22 20:51:38
 */

import { DataTypes } from "sequelize";
import sequelize from "@/config/sequelize";
import { category } from "@/global/enum";
import { generateId } from "@/utils/api";
import { ASSET_PREFIX, MIN_DATE } from "@/config/env";
import { deleteLocalAsset, validateAndRemoveOld } from "@/utils/file";
import oss from "@/utils/oss";

import Comment from "@/models/comment";
import { recursiveDeletionComment } from "@/controllers/comment";

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
      get() {
        const poster = this.getDataValue("poster");
        return poster ? `${ASSET_PREFIX}${poster}` : null;
      },
      set(poster: string) {
        this.setDataValue("poster", poster ? poster.replace(ASSET_PREFIX, "") : null);
      }
    },
    video: {
      type: DataTypes.CHAR(255),
      comment: "视频",
      get() {
        const video = this.getDataValue("video");
        return video ? `${ASSET_PREFIX}${video}` : null;
      },
      set(video?: string) {
        this.setDataValue("video", video ? video?.replace(ASSET_PREFIX, "") : null);
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
    unlockAt: {
      type: DataTypes.DATE,
      comment: "解锁时间",
      allowNull: false,
      defaultValue: MIN_DATE,
      validate: {
        isDate: {
          msg: "unlockAt 字段类型错误",
          args: false
        }
      },
      set(unlockAt) {
        this.setDataValue("unlockAt", unlockAt ?? MIN_DATE);
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
  {
    freezeTableName: true,
    comment: "文章表",
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    hooks: {
      afterUpdate(instance) {
        const changed = instance.changed();
        if (changed) {
          if (changed.includes("poster")) {
            validateAndRemoveOld(instance.previous("poster"), instance.getDataValue("poster"));
          } else if (changed.includes("video")) {
            validateAndRemoveOld(instance.previous("video"), instance.getDataValue("video"));
          }
        }
      },
      async afterDestroy({ dataValues: article }) {
        // 删除文章关联内容、封面、视频的本地文件
        oss.delete(article.poster);
        oss.delete(article.video);
        deleteLocalAsset(article.content);

        // 删除文章关联的评论/回复
        const commentList = await Comment.findAll({ where: { articleId: article.articleId } });
        for (const { dataValues } of commentList) {
          await recursiveDeletionComment(dataValues.commentId);
        }
      }
    }
  }
);

export default Article;
