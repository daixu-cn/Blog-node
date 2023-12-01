/**
 * @Description: 用户模块数据模型
 * @Author: daixu
 * @Date: 2023-04-22 20:35:20
 */

import { DataTypes } from "sequelize";
import sequelize from "@/config/sequelize";
import { generateId } from "@/utils/api";
import { ASSET_DIR, ASSET_PREFIX } from "@/config/env";
import fs from "fs-extra";

const User = sequelize.define(
  "user",
  {
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      comment: "用户ID",
      defaultValue: () => generateId(),
      primaryKey: true,
      unique: true,
      get() {
        return String(this.getDataValue("userId"));
      }
    },
    userName: {
      type: DataTypes.CHAR(100),
      comment: "用户名",
      allowNull: false,
      validate: {
        notNull: {
          msg: "用户名不能为空"
        }
      }
    },
    password: {
      type: DataTypes.CHAR(100),
      comment: "密码",
      allowNull: false,
      defaultValue: "1bc2a8b7478a135446ee4e98f924efbf"
    },
    email: {
      type: DataTypes.CHAR(50),
      comment: "用户邮箱",
      validate: {
        isEmail: {
          msg: "邮箱格式错误"
        }
      }
    },
    avatar: {
      type: DataTypes.CHAR(50),
      comment: "用户头像",
      defaultValue: "/image/avatar.png",
      get() {
        return `${ASSET_PREFIX}${this.getDataValue("avatar")}`;
      },
      set(avatar: string) {
        this.setDataValue("avatar", avatar ? avatar.replace(ASSET_PREFIX, "") : null);
      }
    },
    qq: {
      type: DataTypes.CHAR(50),
      comment: "qq",
      get() {
        return this.getDataValue("qq") ? true : false;
      }
    },
    github: {
      type: DataTypes.CHAR(50),
      comment: "github",
      get() {
        return this.getDataValue("github") ? true : false;
      }
    },
    google: {
      type: DataTypes.CHAR(50),
      comment: "google",
      get() {
        return this.getDataValue("google") ? true : false;
      }
    },
    role: {
      type: DataTypes.INTEGER,
      comment: "角色(0:管理员、1:普通用户)",
      allowNull: false,
      defaultValue: 1
    },
    emailService: {
      type: DataTypes.BOOLEAN,
      comment: "邮箱服务(0:关闭、1:开启)",
      allowNull: false,
      defaultValue: true,
      validate: {
        isBoolean: {
          msg: "emailService 字段类型错误"
        }
      }
    }
  },
  {
    freezeTableName: true,
    comment: "用户表",
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    hooks: {
      afterUpdate(instance) {
        const oldAvatar = instance.previous("avatar");
        if (!oldAvatar.endsWith("/image/avatar.png")) {
          fs.remove(`${ASSET_DIR}${oldAvatar}`);
        }
      }
    }
  }
);

export default User;
