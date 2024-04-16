/**
 * @Description: 数据库定时备份脚本
 * @Author: daixu
 * @Date: 2024-04-16 15:42:41
 */

import fs from "fs-extra";
import { spawn } from "child_process";
import dayjs from "dayjs";
import { _MYSQL } from "@/config/env";
import { errorLogger } from "@/utils/log4";
import schedule from "node-schedule";
import { sendMail } from "@/utils/nodemailer";
import { PM2_INSTANCE } from "@/config/env";
import oss from "@/utils/oss";
import { ASSET_DIR } from "@/config/env";

// 只在PM2第一个进程运行该脚本
if (PM2_INSTANCE === "0") {
  // 每天00:00执行一次
  schedule.scheduleJob("0 0 0 * * *", () => {
    try {
      // 如果不存在该路径则创建一个
      fs.ensureDirSync(ASSET_DIR);
      // 备份的数据库名字
      const filename = `${dayjs().format("YYYY-MM-DD HH:mm:ss")}.dump.sql`;
      // 创建写入文件流
      const writeStream = fs.createWriteStream(`${ASSET_DIR}/${filename}`);
      // 数据库配置
      const dump = spawn("mysqldump", [
        "-h",
        `${_MYSQL.host}`,
        "-u",
        `${_MYSQL.user}`,
        `-p${_MYSQL.password}`,
        `${_MYSQL.database}`
      ]);
      dump.stdout
        .pipe(writeStream)
        .on("finish", async function () {
          writeStream.close();
          await oss.upload(`backups/mysql/${filename}`, `${ASSET_DIR}/${filename}`);
          fs.remove(`${ASSET_DIR}/${filename}`);
        })
        .on("error", function (err) {
          sendMail("daixu.cn@outlook.com", "数据库备份失败", JSON.stringify(err.message));
          errorLogger(err);
        });
    } catch (err) {
      sendMail("daixu.cn@outlook.com", "数据库备份失败", JSON.stringify(err));
      errorLogger(err);
    }
  });
}
