import { Context } from "koa";
import responseError from "@/config/response/error";
import { generateId } from "@/utils/api";
import fs from "fs-extra";
import { File } from "formidable";
import path from "path";
import { ASSET_DIR, ASSET_PREFIX } from "@/config/env";
import FileType from "file-type";
import crypto from "crypto";
import sharp from "sharp";

/**
 * @description 分片文件校验
 * @param {Context} ctx 上下文对象
 * @param {File} file 需要校验的文件
 */
export function chunkFileVerification(ctx: Context, file: File) {
  const { name, chunk, chunks, hash } = ctx.params;
  if (!name || !chunks || !hash) {
    throw responseError({ code: 12008 });
  }

  const md5 = crypto.createHash("md5");
  md5.update(fs.readFileSync(file.filepath));
  const fileMD5 = md5.digest("hex");
  // 校验文件MD5和上传的MD5是否一致
  if (!fileMD5 || fileMD5 !== hash) {
    throw responseError({ code: 12005 });
  }

  // 如果分片已存在，直接返回
  if (fs.existsSync(`${ASSET_DIR}/temp/${decodeURIComponent(name)}/${hash}-${chunk}`)) {
    throw responseError({
      code: 12009,
      data: fs.readdirSync(`${ASSET_DIR}/temp/${decodeURIComponent(name)}`).length
    });
  }
}

/**
 * @description 分片文件合并
 * @param {Context} ctx 上下文对象
 * @param {File} file 分片文件
 * @return {Promise<string>} 文件地址
 */
export function chunkMerge(ctx: Context, file: File) {
  return new Promise<string>(async (resolve, reject) => {
    const { name, chunk, chunks } = ctx.params;
    const fileName = decodeURIComponent(name);
    // 获取分片文件目录和文件路径
    const chunkDir = `${ASSET_DIR}/temp/${fileName}`;

    // 合并之后的临时文件地址
    const filePath = `${ASSET_DIR}/${name}`;

    try {
      // 判断是否为最后一个分片
      if (Number(chunk) === Number(chunks)) {
        // 读取分片文件夹
        const chunkPaths = fs.readdirSync(chunkDir);

        // 对分片文件按照升序排序
        chunkPaths.sort((a, b) => {
          const a_num = a.split("-");
          const b_num = b.split("-");
          return Number(a_num[a_num.length - 1]) - Number(b_num[b_num.length - 1]);
        });

        // 遍历读取分片文件夹数据写入到合并之后的文件
        for (const chunkName of chunkPaths) {
          fs.appendFileSync(filePath, fs.readFileSync(path.join(chunkDir, chunkName)));
        }

        // 获取文件信息
        const fileTypeResult = await FileType.fromFile(filePath);
        if (!fileTypeResult) {
          throw responseError({ code: 12003 });
        }
        // 获取文件类型
        const mime = fileTypeResult?.mime.split("/")[0];
        // 将文件移入该目录
        const destPath = `${ASSET_DIR}/${mime}`;

        // 判断文件目录是否存在，如果不存在则创建一个
        fs.ensureDirSync(destPath);

        // 将文件移动到对应目录
        const newFileName = `${generateId()}.${fileTypeResult?.ext}`;
        const newPath = `${destPath}/${newFileName}`;
        // 将文件转入对应文件夹下
        fs.moveSync(filePath, newPath);
        // 移除分片的临时文件夹
        fs.remove(chunkDir);
        // 返回合并之后的文件路径
        resolve(`${mime}/${newFileName}`);
      }
      // 返回分片文件路径
      reject(
        responseError({ code: 12011, data: `${ASSET_DIR}/temp/${fileName}/${file.newFilename}` })
      );
    } catch (err) {
      fs.remove(chunkDir);
      fs.remove(filePath);
      reject(err);
    }
  });
}

/**
 * @description 处理完整文件
 * @param {Context} ctx 上下文对象
 * @param {File} file 文件
 * @return {Promise<string>} 文件地址
 */
export async function handleUploadFile(ctx: Context, file: File): Promise<string> {
  try {
    const { name, chunk, hash } = ctx.params;

    // 文件类型
    const fileType = file.mimetype?.split("/")[0];

    // 最终的文件地址
    const filePath = chunk ? `temp/${decodeURIComponent(name)}` : `${fileType}`;

    // 对分片文件进行校验
    chunk && chunkFileVerification(ctx, file);

    // 将文件移入该目录
    const destPath = `${ASSET_DIR}/${filePath}`;

    // 判断文件目录是否存在，如果不存在则创建一个
    fs.ensureDirSync(destPath);

    // 将文件移动到对应目录
    fs.moveSync(file.filepath, `${destPath}/${chunk ? `${hash}-${chunk}` : file.newFilename}`);
    if (chunk) {
      // 校验是否为最后一个分片
      const filePath = await chunkMerge(ctx, file);
      return `${ASSET_PREFIX}/${filePath}`;
    }

    return `${ASSET_PREFIX}/${filePath}/${file.newFilename}`;
  } catch (error: any) {
    fs.remove(file.filepath);
    throw responseError({ code: error?.code ?? 12007, data: error?.data, message: error?.message });
  }
}
