/**
 * @Description: 静态资源定时备份脚本
 * @Author: daixu
 * @Date: 2023-04-16 21:23:30
 */

import archiver from "archiver";
import fs from "fs-extra";
import dayjs from "dayjs";
import { errorLogger } from "@/utils/log4";
import schedule from "node-schedule";
import { sendMail } from "@/utils/nodemailer";
import path from "path";
import { PM2_INSTANCE } from "@/config/env";
import oss from "@/utils/oss";

// 只在PM2第一个进程运行该脚本
if (PM2_INSTANCE === "0") {
  // 每周一00:00执行一次
  schedule.scheduleJob("0 0 0 * * 1", () => {
    try {
      // 备份之后存放的路径
      const storagePath = `backups/mysql/${dayjs().format("YYYY")}/${dayjs().format("YYYY-MM")}`;
      // 如果不存在该路径则创建一个
      fs.ensureDirSync(storagePath);
      // 备份的 Zip 名字
      const filename = `${dayjs().format("YYYY-MM-DD HH:mm:ss")}.zip`;

      // 创建写入文件流，将 Zip 文件写入指定路径
      const output = fs.createWriteStream(`${storagePath}/${filename}`);

      const archive = archiver("zip", {
        zlib: { level: 9 } // 压缩级别
      });

      // 监听输出流的 'close' 事件，在打包完成后执行回调
      output.on("close", async function () {
        const result = await oss.put(
          `backups/public/${filename}`,
          path.join(__dirname, `../../${storagePath}/${filename}`)
        );
        if (result.res.status !== 200) {
          sendMail("daixu.cn@outlook.com", "静态资源备份失败", JSON.stringify(result));
        }
      });

      archive.on("error", function (err) {
        throw err;
      });

      // 将输出流绑定到 archiver 实例
      archive.pipe(output);

      // 添加文件夹到 Zip 文件
      archive.directory("public", false);

      // 完成打包
      archive.finalize();
    } catch (err) {
      sendMail("daixu.cn@outlook.com", "静态资源备份失败", JSON.stringify(err));
      errorLogger(err);
    }
  });
}
