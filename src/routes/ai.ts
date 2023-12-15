/**
 * @Description: ai模块路由
 * @Author: daixu
 * @Date: 2023-04-22 20:36:55
 */

import Router from "koa-router";
const router = new Router();
import auth from "@/middlewares/auth";

import aiController from "@/controllers/ai";

router.prefix("/ai");

/**
 * @swagger
 * /ai/chat:
 *   post:
 *     tags:
 *       - AI管理
 *     summary: 文本聊天
 *     description: 文本聊天
 *     requestBody:
 *       description:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompt:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: 聊天内容
 *             required:
 *               - prompt
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
router.post("/chat", auth, aiController.chat);

export default router;
