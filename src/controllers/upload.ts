import { Context } from "koa";
import response from "@/config/response";
import responseError from "@/config/response/error";
import { generateId } from "@/utils/api";
import fs from "fs-extra";
import koaBody from "koa-body";
import { File } from "formidable";
import path from "path";
import { IMG_PREFIX } from "@/config/env";
import FileType from "file-type";
import crypto from "crypto";
import { moduleFormat } from "@/utils/file";
import oss from "@/utils/oss";

/**
 * @description 分片文件校验
 * @param {Context} ctx 上下文对象
 * @param {File} file 需要校验的文件
 * @return {}
 */
function chunkFileVerification(ctx: Context, file: File) {
  const { name, chunk, chunks, hash } = ctx.request.body;
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
  if (
    fs.existsSync(
      path.join(__dirname, `../../public/upload/temp/${decodeURIComponent(name)}/${hash}-${chunk}`)
    )
  ) {
    throw responseError({
      code: 12009,
      data: fs.readdirSync(
        path.join(__dirname, `../../public/upload/temp/${decodeURIComponent(name)}`)
      ).length
    });
  }
}

/**
 * @description 分片文件合并
 * @param {Context} ctx 上下文对象
 * @param {File} file 分片文件
 * @return {}
 */
function chunkMerge(ctx: Context, file: File) {
  return new Promise<string>(async (resolve, reject) => {
    const { module, name, chunk, chunks } = ctx.request.body;
    const fileName = decodeURIComponent(name);
    // 获取分片文件目录和文件路径
    const chunkDir = path.join(__dirname, `../../public/upload/temp/${fileName}`);

    // 合并之后的临时文件地址
    const filePath = path.join(__dirname, `../../public/upload/${name}`);

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
        const destPath = path.join(
          __dirname,
          `../../public/upload/${mime}${moduleFormat(mime, parseInt(module))}`
        );

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
        resolve(`${mime}${moduleFormat(mime, parseInt(module))}/${newFileName}`);
      }
      // 返回分片文件路径
      reject(
        responseError({ code: 12011, data: `${IMG_PREFIX}temp/${fileName}/${file.newFilename}` })
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
 * @return {}
 */
async function handleFile(ctx: Context, file: File): Promise<string | string[]> {
  try {
    const { module, name, chunk, hash } = ctx.request.body;

    // 文件类型
    const fileType = file.mimetype?.split("/")[0];

    // 最终的文件地址
    const filePath = chunk
      ? `temp/${decodeURIComponent(name)}`
      : `${fileType}${moduleFormat(fileType, parseInt(module))}`;

    // 对分片文件进行校验
    chunk && chunkFileVerification(ctx, file);

    // 将文件移入该目录
    const destPath = path.join(__dirname, `../../public/upload/${filePath}`);

    // 判断文件目录是否存在，如果不存在则创建一个
    fs.ensureDirSync(destPath);

    // 将文件移动到对应目录
    fs.moveSync(file.filepath, `${destPath}/${chunk ? `${hash}-${chunk}` : file.newFilename}`);
    if (chunk) {
      // 校验是否为最后一个分片
      const filePath = await chunkMerge(ctx, file);
      await oss.put(`upload/${filePath}`, path.join(__dirname, `../../public/upload/${filePath}`));

      return `${IMG_PREFIX}${filePath}`;
    }

    await oss.put(`upload/${filePath}/${file.newFilename}`, `${destPath}/${file.newFilename}`);
    return `${IMG_PREFIX}${filePath}/${file.newFilename}`;
  } catch (error: any) {
    fs.remove(file.filepath);
    throw responseError({ code: error?.code ?? 12007, data: error?.data, message: error?.message });
  }
}

export default {
  koaBody() {
    const uploadDir = path.join(__dirname, `../../public/upload`);
    return koaBody({
      multipart: true,
      formidable: {
        maxFileSize: 1024 * 1024 * 2, // 单个文件最大为2M
        uploadDir,
        keepExtensions: true,
        // 重写文件名
        filename(name, ext) {
          return `${generateId()}${ext}`;
        },
        onFileBegin(name, file) {
          // 判断一下上传的路径是否存在，避免报错
          fs.ensureDirSync(uploadDir);
        }
      },
      onError(error) {
        throw responseError({ code: 12003, message: error?.message });
      }
    });
  },
  async upload(ctx: Context) {
    try {
      const { role } = ctx.params;

      const files = ctx.request.files;
      // 如果文件不存在
      if (!files?.file) {
        throw responseError({ code: 12002 });
      }

      // 判断是否为多个文件
      if (Array.isArray(files.file)) {
        ctx.body = response({
          data: files.file.map(async item => {
            const res = await handleFile(ctx, item);
            return res;
          })
        });
      } else {
        ctx.body = response({ data: await handleFile(ctx, files.file) });
      }

      // 是否存在需要替换掉之前的文件
      if (ctx.request.body?.replaceFiles && role === 0) {
        const replaceFiles = ctx.request.body.replaceFiles.split(";");
        for (const item of replaceFiles) {
          const filePath = item.replace(IMG_PREFIX, "");
          const fullPath = path.join(__dirname, `../../public/upload/${filePath}`);

          if (fs.existsSync(fullPath)) {
            oss.destroy(`upload/${filePath}`);
            fs.remove(fullPath);
          }
        }
      }
    } catch (error: any) {
      throw responseError({
        code: error?.code ?? 12001,
        data: error?.data,
        message: error?.message
      });
    }
  },
  async destroy(ctx: Context) {
    try {
      const { filePath } = ctx.params;
      const fullPath = path.join(__dirname, `../../public/${filePath}`);

      if (filePath.startsWith("upload/")) {
        if (fs.existsSync(fullPath)) {
          await oss.destroy(filePath);
          fs.remove(fullPath);
          ctx.body = response({ message: "操作成功" });
        } else {
          throw responseError({ code: 12013 });
        }
      } else {
        throw responseError({ code: 12014 });
      }
    } catch (error: any) {
      throw responseError({
        code: error?.code ?? 12012,
        data: error?.data,
        message: error?.message
      });
    }
  }
};
