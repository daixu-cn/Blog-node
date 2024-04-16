import { Context } from "koa";
import response from "@/config/response";
import responseError from "@/config/response/error";
import { ASSET_PREFIX } from "@/config/env";
import { handleUploadFile } from "@/controllers/upload/file-process";
import oss from "@/utils/oss";

export default {
  async upload(ctx: Context) {
    try {
      const files = ctx.request.files;
      // 如果文件不存在
      if (!files?.file) {
        throw responseError({ code: 12002 });
      }

      // 判断是否为多个文件
      if (Array.isArray(files.file)) {
        const data: string[] = [];
        for (const file of files.file) {
          const path = await handleUploadFile(ctx, file);
          data.push(`${ASSET_PREFIX}/${path}`);
        }
        ctx.body = response({ data });
      } else {
        const path = await handleUploadFile(ctx, files.file);
        ctx.body = response({ data: `${ASSET_PREFIX}/${path}` });
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
      const filePath = ctx.params?.path?.replace(ASSET_PREFIX, "");
      await oss.delete(filePath);
      ctx.body = response({ message: "操作成功" });
    } catch (error: any) {
      throw responseError({
        code: error?.code ?? 12012,
        data: error?.data,
        message: error?.message
      });
    }
  }
};
