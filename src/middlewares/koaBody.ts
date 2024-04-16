/**
 * @Description: 文件上传中间件
 * @Author: daixu
 * @Date: 2023-11-16 15:06:45
 */

import responseError from "@/config/response/error";
import { generateId } from "@/utils/api";
import fs from "fs-extra";
import koaBody, { ExtendedFormidableOptions } from "koa-body";
import { ASSET_DIR } from "@/config/env";

interface Options extends ExtendedFormidableOptions {
  allowTypes?: string[];
}

/**
 * @description 上传文件
 * @param {number} maxFileSize 默认单个文件最大为100M
 * @param {Options} options 配置项
 */
export default function (maxFileSize: number = 1024 * 1024 * 100, options?: Options) {
  return koaBody({
    multipart: true,
    formidable: {
      maxFileSize,
      uploadDir: ASSET_DIR,
      // 重写文件名
      filename() {
        return generateId();
      },
      onFileBegin(_, file) {
        // 判断一下上传的路径是否存在，避免报错
        fs.ensureDirSync(ASSET_DIR);

        // 判断文件类型
        const allowTypes = options?.allowTypes;
        const fileType = file.mimetype?.split("/")[0] ?? "";
        if (allowTypes && !allowTypes.includes(fileType)) {
          throw new Error(`文件仅支持类型：${allowTypes.join(",")}`);
        }
      },
      ...options
    },
    onError(error) {
      throw responseError({ code: 12003, message: error?.message });
    }
  });
}
