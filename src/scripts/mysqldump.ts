/**
 * @Description: 数据库定时备份脚本
 * @Author: daixu
 * @Date: 2024-04-16 15:42:41
 */

import fs from "fs-extra";
import dayjs from "dayjs";
import { _MYSQL } from "@/config/env";
import { errorLogger } from "@/utils/log4";
import schedule from "node-schedule";
import { sendMail } from "@/utils/nodemailer";
import { PM2_INSTANCE } from "@/config/env";
import oss from "@/utils/oss";
import { ASSET_DIR } from "@/config/env";
import { spawn } from "child_process";

// 只在PM2第一个进程运行该脚本
if (PM2_INSTANCE === "0") {
  // 每天00:00执行一次
  schedule.scheduleJob("0 0 0 * * *", async () => {
    const filename = `${dayjs().format("YYYY-MM-DD")}.dump.sql`;
    const writeStream = fs.createWriteStream(filename);
    const args = [
      "-h",
      _MYSQL.host,
      "--port",
      _MYSQL.port.toString(),
      "-u",
      _MYSQL.user,
      `-p${_MYSQL.password}`,
      _MYSQL.database
    ];
    if (_MYSQL.ca) args.push("--ssl-ca", _MYSQL.ca);
    const dump = spawn("mysqldump", args);

    dump.stdout
      .pipe(writeStream)
      .on("finish", async () => {
        try {
          await oss.upload(`backups/mysql/${filename}`, `${ASSET_DIR}/${filename}`, {
            headers: { "x-oss-object-acl": "private" }
          });
        } catch (err) {
          sendMail("daixu.cn@outlook.com", "数据库备份上传阿里云失败", JSON.stringify(err));
          errorLogger(`mysqldump.ts\n${JSON.stringify(err)}`);
        } finally {
          fs.remove(`${ASSET_DIR}/${filename}`);
        }
      })
      .on("error", error => {
        sendMail("daixu.cn@outlook.com", "数据库备份失败", JSON.stringify(error));
        errorLogger(`mysqldump.ts\n${JSON.stringify(error)}`);
        fs.remove(`${ASSET_DIR}/${filename}`);
      });
  });
}
