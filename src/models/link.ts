/**
 * @Description: 友情链接模块数据模型
 * @Author: daixu
 * @Date: 2023-04-22 20:35:20
 */

import { DataTypes } from "sequelize";
import sequelize from "@/config/sequelize";
import { generateId } from "@/utils/api";

const Link = sequelize.define(
  "link",
  {
    linkId: {
      type: DataTypes.BIGINT.UNSIGNED,
      comment: "友链ID",
      defaultValue: () => generateId(),
      primaryKey: true,
      unique: true,
      get() {
        return String(this.getDataValue("linkId"));
      }
    },
    name: {
      type: DataTypes.CHAR(50),
      allowNull: false,
      comment: "网站名称",
      validate: {
        notNull: {
          msg: "网站名称不能为空"
        },
        len: {
          args: [1, 50],
          msg: "网站名称必须在1-50个字符之间"
        }
      }
    },
    description: {
      type: DataTypes.CHAR(100),
      comment: "网站描述",
      allowNull: false,
      validate: {
        notNull: {
          msg: "网站描述不能为空"
        },
        len: {
          args: [1, 100],
          msg: "网站描述必须在1-100个字符之间"
        }
      }
    },
    logo: {
      type: DataTypes.CHAR(255),
      comment: "网站LOGO",
      defaultValue: ""
    },
    url: {
      type: DataTypes.CHAR(255),
      allowNull: false,
      comment: "网站地址",
      validate: {
        notNull: {
          msg: "网站地址不能为空"
        },
        isUrl: {
          msg: "网站地址格式错误"
        }
      }
    },
    email: {
      type: DataTypes.CHAR(50),
      comment: "站长邮箱",
      validate: {
        isEmail: {
          msg: "邮箱格式错误"
        }
      }
    },
    qq: {
      type: DataTypes.CHAR(30),
      comment: "站长QQ"
    },
    check: {
      type: DataTypes.BOOLEAN,
      comment: "友联核验状态(0:不通过、1:通过)",
      allowNull: false,
      defaultValue: false,
      validate: {
        isBoolean: {
          message: "check 字段类型错误"
        }
      }
    }
  },
  { freezeTableName: true, comment: "友情链接表", createdAt: "createdAt", updatedAt: "updatedAt" }
);

export default Link;
