/**
 * @Description: 网站更新日志模块数据模型
 * @Author: daixu
 * @Date: 2023-04-22 20:35:20
 */

import { DataTypes } from "sequelize";
import sequelize from "@/config/sequelize";
import { generateId } from "@/utils/api";

const Update = sequelize.define(
  "update",
  {
    updateId: {
      type: DataTypes.BIGINT.UNSIGNED,
      comment: "更新ID",
      defaultValue: () => generateId(),
      primaryKey: true,
      unique: true,
      get() {
        return String(this.getDataValue("updateId"));
      }
    },
    content: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
      comment: "更新内容(Markdown)",
      validate: {
        notNull: {
          msg: "更新内容不能为空"
        }
      }
    }
  },
  { freezeTableName: true, comment: "网站更新表", createdAt: "createdAt", updatedAt: "updatedAt" }
);

export default Update;
