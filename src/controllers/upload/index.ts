import { Context, Middleware } from "koa";
import response from "@/config/response";
import responseError from "@/config/response/error";
import { generateId } from "@/utils/api";
import fs from "fs-extra";
import koaBody from "koa-body";
import path from "path";
import { IMG_PREFIX } from "@/config/env";
import oss from "@/utils/oss";
import { filePathPrefix, handleUploadFile, fileToBase64 } from "@/controllers/upload/file-process";

export default {
  /**
   * @description 上传文件
   * @param {number} maxFileSize 默认单个文件最大为2M
   * @returns {Middleware} koaBody
   */
  koaBody(maxFileSize: number = 1024 * 1024 * 2): Middleware {
    const uploadDir = path.join(__dirname, filePathPrefix);
    return koaBody({
      multipart: true,
      formidable: {
        maxFileSize,
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
        const data: string[] = [];

        for (const file of files.file) {
          data.push(await handleUploadFile(ctx, file));
        }

        ctx.body = response({ data });
      } else {
        ctx.body = response({ data: await handleUploadFile(ctx, files.file) });
      }

      // 是否存在需要替换掉之前的文件
      if (ctx.request.body?.replaceFiles && role === 0) {
        const replaceFiles = ctx.request.body.replaceFiles.split(";");
        for (const item of replaceFiles) {
          const filePath = item.replace(IMG_PREFIX, "");
          const fullPath = path.join(__dirname, `${filePathPrefix}/${filePath}`);

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
  },
  async imageToBase64(ctx: Context) {
    const files = ctx.request?.files;

    try {
      if (!files?.file) {
        throw responseError({ code: 12002 });
      }

      // 判断是否为多个文件
      if (Array.isArray(files.file)) {
        const data: string[] = [];

        for (const file of files.file) {
          data.push(await fileToBase64(file));
        }

        ctx.body = response({ data });
      } else {
        ctx.body = response({ data: await fileToBase64(files.file) });
      }
    } catch (error: any) {
      throw responseError({
        code: error?.code ?? 12016,
        data: error?.data,
        message: error?.message
      });
    }
  }
};
