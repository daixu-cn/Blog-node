/**
 * @Description: 柠檬数据模型
 * @Author: daixu
 * @Date: 2023-11-19 16:22:31
 */

import { DataTypes } from "sequelize";
import sequelize from "@/config/sequelize";
import { generateId } from "@/utils/api";
import { ASSET_PREFIX } from "@/config/env";
import { lemon_media_type } from "@/global/enum";

const Lemon = sequelize.define(
  "lemon",
  {
    lemonId: {
      type: DataTypes.BIGINT.UNSIGNED,
      comment: "ID",
      defaultValue: () => generateId(),
      primaryKey: true,
      unique: true,
      get() {
        return String(this.getDataValue("lemonId"));
      }
    },
    description: {
      type: DataTypes.TEXT,
      comment: "描述"
    },
    path: {
      type: DataTypes.CHAR(255),
      allowNull: false,
      comment: "文件地址",
      validate: {
        notNull: {
          msg: "文件地址不能为空"
        }
      },
      get() {
        const path = this.getDataValue("path");
        return path ? `${ASSET_PREFIX}${path}` : null;
      }
    },
    mediaType: {
      type: DataTypes.ENUM({ values: Object.keys(lemon_media_type) }),
      comment: `媒体类型：${JSON.stringify(lemon_media_type).slice(1, -1)}`,
      allowNull: false,
      validate: {
        notNull: {
          msg: "媒体类型不能为空"
        },
        isIn: {
          args: [Object.keys(lemon_media_type)],
          msg: "媒体类型不存在"
        }
      }
    }
  },
  {
    freezeTableName: true,
    comment: "柠檬生活记录表",
    createdAt: "createdAt",
    updatedAt: "updatedAt"
  }
);

export default Lemon;
