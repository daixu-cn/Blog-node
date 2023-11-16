/**
 * @Description: 日志配置
 * @Author: daixu
 * @Date: 2023-04-22 20:31:48
 */

import { ASSET_DIR } from "@/config/env";
import { Configuration } from "log4js";
import dayjs from "dayjs";

// 默认级别：ALL < TRACE < DEBUG < INFO < WARN < ERROR < FATAL < MARK < OFF

const GeneralConfiguration = {
  // 按文件大小分割日志
  type: "file",
  // 文件最大存储空间(Byte)
  maxLogSize: 1024 * 1024 * 100,
  // 备份文件的数量
  backups: 100,
  keepFileExt: false,
  compress: true
};

function createConfigure(): Configuration {
  // 日志文件路径
  const filePath = `${dayjs().year()}/${dayjs().format("YYYY-MM")}/${dayjs().format(
    "YYYY-MM-DD"
  )}/${dayjs().format("YYYY-MM-DD")}.log`;

  return {
    appenders: {
      stdout: {
        type: "console"
      },
      console: {
        ...GeneralConfiguration,
        // logger 名称
        category: "consoleLogger",
        // 日志输出位置
        filename: `${ASSET_DIR}/logs/console/${filePath}`
      },
      error: {
        ...GeneralConfiguration,
        category: "errorLogger",
        filename: `${ASSET_DIR}/logs/error/${filePath}`
      },
      http: {
        ...GeneralConfiguration,
        category: "httpLogger",
        filename: `${ASSET_DIR}/logs/http/${filePath}`
      }
    },
    categories: {
      error: {
        appenders: ["stdout", "error"],
        level: "error"
      },
      http: {
        appenders: ["stdout", "http"],
        level: "info"
      },
      default: {
        appenders: ["stdout", "console"],
        level: "all"
      }
    },
    pm2: true,
    pm2InstanceVar: "PM2_INSTANCE"
  };
}

export default createConfigure;
