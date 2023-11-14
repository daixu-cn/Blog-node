/**
 * @Description: 临时文件定时清理脚本
 * @Author: daixu
 * @Date: 2023-04-16 21:23:59
 */

import fs from "fs-extra";
import { errorLogger } from "@/utils/log4";
import schedule from "node-schedule";
import { ASSET_DIR, PM2_INSTANCE } from "@/config/env";

// 临时文件目录
const TEMP_DIR = `${ASSET_DIR}/temp`;
// 临时文件清理周期，单位为毫秒
const CLEAN_INTERVAL = 12 * 60 * 60 * 1000;

// 只在PM2第一个进程运行该脚本
if (PM2_INSTANCE === "0") {
  // 每天00:00执行一次
  schedule.scheduleJob("0 0 0 * * *", () => {
    try {
      // 校验临时目录是否存在
      if (fs.existsSync(TEMP_DIR)) {
        // 当前时间戳
        const now = Date.now();
        // 读取临时文件夹下面的文件/文件夹
        fs.readdir(TEMP_DIR, (err, files) => {
          if (err) {
            errorLogger(err);
            return;
          }
          // 遍历读取到的文件/文件夹名称
          for (const fileName of files) {
            // 当前处理的文件/文件夹路径
            const filePath = `${TEMP_DIR}/${fileName}`;
            // 获取当前文件/文件夹信息
            fs.stat(filePath, (err, stats) => {
              if (err) {
                errorLogger(err);
                return;
              }
              // 如果文件/文件夹创建时间超过清理间隔，则删除该文件/文件夹
              if (now - stats.ctimeMs >= CLEAN_INTERVAL) {
                fs.remove(filePath);
              }
            });
          }
        });
      }
    } catch (err) {
      errorLogger(err);
    }
  });
}
