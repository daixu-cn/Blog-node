/**
 * @Description: sequelize框架配置
 * @Author: daixu
 * @Date: 2023-04-22 20:34:29
 */

import { _MYSQL } from "@/config/env";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(_MYSQL.database, _MYSQL.user, _MYSQL.password, {
  host: _MYSQL.host,
  dialect: "mysql",
  timezone: "+08:00",
  logging: false,
  define: {
    underscored: true,
    timestamps: true
  }
});

export default sequelize;
