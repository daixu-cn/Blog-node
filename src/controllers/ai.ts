import { Context } from "koa";
import response from "@/config/response";
import responseError from "@/config/response/error";
import { GoogleGenerativeAI, GenerateContentResult } from "@google/generative-ai";
import { _GOOGLE } from "@/config/env";

const genAI = new GoogleGenerativeAI(_GOOGLE.apiKey);

export default {
  async chat(ctx: Context) {
    try {
      const { prompt } = ctx.params;
      const model = genAI.getGenerativeModel({ model: "models/gemini-pro" });
      let result: GenerateContentResult;

      if (!Array.isArray(prompt)) {
        result = await model.generateContent(prompt[0]);
      } else {
        const chat = model.startChat({
          history: prompt.slice(0, -1).map((text: string, index: number) => {
            return {
              role: index % 2 === 0 ? "user" : "model",
              parts: text
            };
          })
        });

        result = await chat.sendMessage(prompt.slice(-1)[0]);
      }

      ctx.body = response({ data: result.response.text() });
    } catch (error: any) {
      throw responseError({ code: 20001, message: error?.message });
    }
  }
};
