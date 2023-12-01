/**
 * @Description: 回复表数据模型
 * @Author: daixu
 * @Date: 2023-04-22 20:51:38
 */

import { DataTypes } from "sequelize";
import sequelize from "@/config/sequelize";
import { generateId } from "@/utils/api";
import { deleteLocalAsset } from "@/utils/file";

const Reply = sequelize.define(
  "reply",
  {
    replyId: {
      type: DataTypes.BIGINT.UNSIGNED,
      comment: "回复ID",
      defaultValue: () => generateId(),
      primaryKey: true,
      unique: true,
      get() {
        return String(this.getDataValue("replyId"));
      }
    },
    content: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
      comment: "回复内容(Markdown)",
      validate: {
        notNull: {
          msg: "回复内容不能为空"
        }
      }
    },
    commentId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: "评论ID",
      validate: {
        notNull: {
          msg: "评论ID不能为空"
        }
      },
      get() {
        return String(this.getDataValue("commentId"));
      }
    },
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: "回复的用户ID",
      validate: {
        notNull: {
          msg: "回复的用户ID不能为空"
        }
      },
      get() {
        return String(this.getDataValue("userId"));
      }
    },
    parentId: {
      type: DataTypes.BIGINT.UNSIGNED,
      comment: "父级回复ID",
      allowNull: true,
      defaultValue: null,
      get() {
        const parentId = this.getDataValue("parentId");
        return parentId ? String(parentId) : parentId;
      }
    }
  },
  {
    freezeTableName: true,
    comment: "回复表",
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    hooks: {
      afterDestroy({ dataValues: reply }) {
        return new Promise<void>(async (resolve, reject) => {
          try {
            // 删除回复关联内容的本地文件
            deleteLocalAsset(reply.content);

            // 删除回复下级的记录
            const replyList = await Reply.findAll({ where: { parentId: reply.replyId } });

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

export default Reply;
