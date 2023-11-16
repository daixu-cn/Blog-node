import { Context } from "koa";
import response from "@/config/response";
import responseError from "@/config/response/error";
import fs from "fs-extra";
import { ASSET_DIR, ASSET_PREFIX } from "@/config/env";
import { handleUploadFile, fileToBase64 } from "@/controllers/upload/file-process";

export default {
  async upload(ctx: Context) {
    try {
      const { replaceFile } = ctx.params;

      const files = ctx.request.files;
      // 如果文件不存在
      if (!files?.file) {
        throw responseError({ code: 12002 });
      }
      // 如果传入了 replaceFile 属性，则只能传入一个文件
      if (replaceFile && Array.isArray(files.file)) {
        for (const file of files.file) {
          fs.remove(file.filepath);
        }
        throw responseError({ code: 12015 });
      }

      // 判断是否为多个文件
      if (Array.isArray(files.file)) {
        const data: string[] = [];
        for (const file of files.file) {
          data.push(await handleUploadFile(ctx, file));
        }
        ctx.body = response({ data });
      } else {
        const data = await handleUploadFile(ctx, files.file);

        if (replaceFile) {
          const oldPath = replaceFile.replace(ASSET_PREFIX, "");
          fs.removeSync(`${ASSET_DIR}${oldPath}`);
          fs.renameSync(`${ASSET_DIR}${data.replace(ASSET_PREFIX, "")}`, `${ASSET_DIR}${oldPath}`);

          ctx.body = response({ data: `${ASSET_PREFIX}${oldPath}` });
        } else {
          ctx.body = response({ data });
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
  destroy(ctx: Context) {
    try {
      const _path: string = ctx.params?.path;
      const fullPath = `${ASSET_DIR}${_path.replace(ASSET_PREFIX, "")}`;

      if (_path?.includes("/Blog/")) {
        if (fs.existsSync(fullPath)) {
          fs.remove(fullPath);
          ctx.body = response({ message: "操作成功" });
        } else {
          throw responseError({ code: 12013 });
        }
      } else {
        throw responseError({ code: 12018 });
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
