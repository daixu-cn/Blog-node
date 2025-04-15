import { Context } from "koa";
import responseError from "@/config/response/error";
import fs from "fs-extra";
import { File } from "formidable";
import { fileTypeFromFile } from "file-type";
import oss from "@/utils/oss";

/**
 * @description 处理完整文件
 * @param {Context} ctx 上下文对象
 * @param {File} file 文件
 * @return {Promise<string>} 文件地址
 */
export async function handleUploadFile(ctx: Context, file: File): Promise<string> {
  try {
    const { path, replace } = ctx.params;

    // 文件类型
    const result = await fileTypeFromFile(file.filepath);
    if (!result) {
      throw responseError({ code: 12003 });
    }

    const fileName = `${file.newFilename}.${result.ext}`;
    const oss_path = replace
      ? replace
      : path
        ? `${path}/${fileName}`.replace(/\/+/g, "/")
        : `${result?.mime.split("/")[0]}/${fileName}`;

    return await oss.upload(oss_path, file.filepath);
  } catch (error: any) {
    throw responseError({ code: error?.code ?? 12007, data: error?.data, message: error?.message });
  } finally {
    fs.remove(file.filepath);
  }
}
