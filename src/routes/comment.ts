/**
 * @Description: 评论回复路由
 * @Author: daixu
 * @Date: 2023-04-22 20:36:55
 */

import Router from "koa-router";
const router = new Router();
import auth from "@/middlewares/auth";

import commentController from "@/controllers/comment";

router.prefix("/comment");

/**
 * @swagger
 * /comment/create:
 *   put:
 *     tags:
 *       - 评论/回复管理
 *     summary: 创建评论
 *     description: 创建评论
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
 *                 description: 评论内容(Markdown)
 *               html:
 *                 type: string
 *                 description: 评论内容(HTML)
 *               articleId:
 *                 type: string
 *                 example: "172669927453589504"
 *                 description: 文章ID
 *             required:
 *               - content
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
 *                   $ref: '#/components/schemas/Comment'
 */
router.put("/create", auth(), commentController.create);

/**
 * @swagger
 * /comment/{commentId}:
 *   delete:
 *     tags:
 *       - 评论/回复管理
 *     summary: 删除评论
 *     description: 删除指定评论
 *     parameters:
 *       - name: commentId
 *         in: path
 *         description: '评论ID'
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
router.delete("/:commentId", auth(), commentController.destroy);

/**
 * @swagger
 * /comment/list:
 *   post:
 *     tags:
 *       - 评论/回复管理
 *     summary: 获取评论/回复列表
 *     description: 获取评论/回复列表
 *     security: []
 *     requestBody:
 *       description:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               articleId:
 *                 type: string
 *                 description: 文章ID（传 -1 为留言评论）
 *               keyword:
 *                 type: string
 *                 description: 搜索关键字（commentId，content，userId）
 *               startTime:
 *                 type: string
 *                 description: 评论创建的开始时间
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 description: 评论创建的结束时间
 *                 format: date-time
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
 *                       description: 评论列表
 *                       items:
 *                         $ref: '#/components/schemas/Comment'
 *                     total:
 *                       type: integer
 *                       example: 999
 *                       description: 评论总数
 *                     comment_reply_total:
 *                       type: integer
 *                       example: 999
 *                       description: 评论和回复总数
 */
router.post("/list", commentController.list);

export default router;
