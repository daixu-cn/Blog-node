/**
 * @Description: 评论回复路由
 * @Author: daixu
 * @Date: 2023-04-22 20:36:55
 */

import Router from "koa-router";
const router = new Router();
import auth from "@/middlewares/auth";

import replyController from "@/controllers/reply";

router.prefix("/reply");

/**
 * @swagger
 * /reply/create:
 *   put:
 *     tags:
 *       - 评论/回复管理
 *     summary: 创建回复
 *     description: 创建回复
 *     requestBody:
 *       description:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: 回复内容(Markdown)
 *               commentId:
 *                 type: string
 *                 example: "173598718455681024"
 *                 description: 评论ID
 *               parentId:
 *                 type: string
 *                 example: "169774769959575552"
 *                 description: 父级回复ID
 *             required:
 *               - content
 *               - commentId
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
 *                   type: object
 *                   $ref: '#/components/schemas/Reply'
 */
router.put("/create", auth(), replyController.create);

/**
 * @swagger
 * /reply/{replyId}:
 *   delete:
 *     tags:
 *       - 评论/回复管理
 *     summary: 删除回复
 *     description: 删除指定回复
 *     parameters:
 *       - name: replyId
 *         in: path
 *         description: '回复ID'
 *         required: true
 *         schema:
 *           type: string
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
 */
router.delete("/:replyId", auth(), replyController.destroy);

/**
 * @swagger
 * /reply/list:
 *   post:
 *     tags:
 *       - 评论/回复管理
 *     summary: 获取回复列表
 *     description: 获取指定评论的回复列表
 *     security: []
 *     requestBody:
 *       description:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentId:
 *                 type: string
 *                 description: 评论ID
 *               page:
 *                 type: integer
 *                 example: 1
 *                 description: 第几页
 *               pageSize:
 *                 type: integer
 *                 example: 10
 *                 description: 每页几条
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
 *                   type: object
 *                   properties:
 *                     list:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Reply'
 *                     total:
 *                       type: integer
 *                       example: 999
 *                       description: 总数
 */
router.post("/list", replyController.list);
export default router;
