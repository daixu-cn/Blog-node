/**
 * @Description: sequelize框架配置
 * @Author: daixu
 * @Date: 2023-04-22 20:34:29
 */

import { _MYSQL } from "@/config/env";
import { Sequelize } from "sequelize";
import fs from "fs";

const sequelize = new Sequelize(_MYSQL.database, _MYSQL.user, _MYSQL.password, {
  host: _MYSQL.host,
  dialect: "mysql",
  timezone: "+08:00",
  logging: false,
  port: _MYSQL.port,
  dialectOptions: _MYSQL.ca ? { ssl: { ca: fs.readFileSync(_MYSQL.ca) } } : undefined,
  define: { underscored: true, timestamps: true }
});

export default sequelize;
