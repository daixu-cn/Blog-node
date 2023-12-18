/**
 * @Description: ai模块路由
 * @Author: daixu
 * @Date: 2023-04-22 20:36:55
 */

import Router from "koa-router";
const router = new Router();
import koaBody from "@/middlewares/koaBody";
import params from "@/middlewares/params";
import auth from "@/middlewares/auth";

import aiController from "@/controllers/ai";

router.prefix("/ai");

/**
 * @swagger
 * /ai/chat:
 *   post:
 *     tags:
 *       - AI管理
 *     summary: 输入纯文本生成文本
 *     description: 输入纯文本生成文本
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: 聊天内容
 *               history:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Google_ai_history'
 *             required:
 *               - message
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: 状态码：0成功
 *                 message:
 *                   type: string
 *                   description: 返回信息
 *                 data:
 *                   type: string
 *                   description: 响应结果
 */
router.post("/chat", auth(), aiController.chat);

/**
 * @swagger
 * /ai/chat/image:
 *   post:
 *     tags:
 *       - AI管理
 *     summary: 输入文本和图片生成文本
 *     description: 输入文本和图片生成文本，注意：整个提示（包括图片和文本）不得超过 4MB
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: array
 *                 description: 图片二进制文件（最多十六张图片）
 *                 items:
 *                   type: string
 *                   format: binary
 *               message:
 *                 type: string
 *                 description: 聊天内容
 *             required:
 *               - file
 *               - message
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: 状态码：0成功
 *                 message:
 *                   type: string
 *                   description: 返回信息
 *                 data:
 *                   type: string
 *                   description: 响应结果
 */
router.post("/chat/image", auth(), koaBody(1024 * 1024 * 3.9), params(), aiController.image);

export default router;
