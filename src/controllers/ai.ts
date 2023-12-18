import { Context } from "koa";
import response from "@/config/response";
import responseError from "@/config/response/error";
import { GoogleGenerativeAI, GenerateContentResult, InlineDataPart } from "@google/generative-ai";
import { _GOOGLE } from "@/config/env";
import FileType from "file-type";
import fs from "fs-extra";

const genAI = new GoogleGenerativeAI(_GOOGLE.ai.apiKey);

export default {
  /**
   * @openapi
   * components:
   *   schemas:
   *     Google_ai_history:
   *       description: 历史聊天列表
   *       type: object
   *       properties:
   *         role:
   *           type: string
   *           description: 角色（user、model）
   *         parts:
   *           type: string
   *           description: 聊天内容
   */
  async chat(ctx: Context) {
    try {
      const { message, history } = ctx.params;
      const model = genAI.getGenerativeModel({ model: "models/gemini-pro" });
      let result: GenerateContentResult;

      if (Array.isArray(history) && history.length > 0) {
        const chat = model.startChat({
          history
        });
        result = await chat.sendMessage(message);
      } else {
        result = await model.generateContent(message);
      }

      ctx.body = response({ data: result.response.text() });
    } catch (error: any) {
      throw responseError({ code: 20001, message: error?.message });
    }
  },
  async image(ctx: Context) {
    const files = ctx.request.files?.file;
    const images = Array.isArray(files) ? files : files ? [files] : [];

    try {
      // 如果图片不存在
      if (!images.length) {
        throw responseError({ code: 12002 });
      }
      const model = genAI.getGenerativeModel({ model: "models/gemini-pro-vision" });

      const imageParts: InlineDataPart[] = [];
      for (const image of images) {
        const mimeType = (await FileType.fromFile(image.filepath))?.mime;

        mimeType &&
          imageParts.push({
            inlineData: {
              data: Buffer.from(fs.readFileSync(image.filepath)).toString("base64"),
              mimeType
            }
          });
      }
      const result = await model.generateContent([ctx.params.message, ...imageParts]);

      ctx.body = response({ data: result.response.text() });
    } catch (error: any) {
      throw responseError({ code: 20001, message: error?.message });
    } finally {
      for (const image of images) {
        fs.remove(image?.filepath);
      }
    }
  }
};
