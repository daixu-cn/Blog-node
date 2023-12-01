/**
 * @Description: 文章模块路由
 * @Author: daixu
 * @Date: 2023-04-22 20:36:55
 */

import Router from "koa-router";
const router = new Router();
import auth from "@/middlewares/auth";

import articleController from "@/controllers/article";

router.prefix("/article");

/**
 * @swagger
 * /article/create:
 *   put:
 *     tags:
 *       - 文章管理
 *     summary: 创建文章
 *     description: 创建文章
 *     requestBody:
 *       description:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 文章标题
 *               content:
 *                 type: string
 *                 description: 文章正文(Markdown)
 *               category:
 *                 $ref: '#/components/schemas/Category'
 *               poster:
 *                 type: string
 *                 example: https://daixu.cn/images/avatar.png
 *                 description: 预览图片
 *               video:
 *                 type: string
 *                 example: https://daixu.cn/images/xxx.mp4
 *                 description: 视频
 *               disableComment:
 *                 type: integer
 *                 default: 0
 *                 description: 禁止评论(0:允许评论、1:禁止评论)
 *               isPrivate:
 *                 type: integer
 *                 default: 0
 *                 description: 私有文章(0:公开、1:私有)
 *               unlockAt:
 *                 type: string
 *                 default: "1000-01-01 00:00:00"
 *                 description: 解锁时间
 *               description:
 *                 type: string
 *                 description: 文章描述
 *             required:
 *               - title
 *               - content
 *               - content
 *               - category
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
 *                   $ref: '#/components/schemas/Article'
 */
router.put("/create", auth(0), articleController.create);

/**
 * @swagger
 * /article/list:
 *   post:
 *     tags:
 *       - 文章管理
 *     summary: 获取文章列表
 *     description: 获取文章列表
 *     security: []
 *     requestBody:
 *       description:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               keyword:
 *                 type: string
 *                 description: 搜索关键字（articleId，title，description）
 *               category:
 *                 $ref: '#/components/schemas/Category'
 *               status:
 *                 type: integer
 *                 description: 解锁状态(0:解锁、1:锁定)
 *               startTime:
 *                 type: string
 *                 description: 文章创建的开始时间
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 description: 文章创建的结束时间
 *                 format: date-time
 *               page:
 *                 type: integer
 *                 example: 1
 *                 description: 第几页
 *               pageSize:
 *                 type: integer
 *                 example: 10
 *                 description: 每页几条
 *               orderBy:
 *                 type: string
 *                 description: 按照哪个字段排序（默认createdAt）
 *                 default: "createdAt"
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
 *                         $ref: '#/components/schemas/Article'
 *                     total:
 *                       type: integer
 *                       example: 999
 *                       description: 总数
 */
router.post("/list", articleController.list);

/**
 * @swagger
 * /article/update:
 *   patch:
 *     tags:
 *       - 文章管理
 *     summary: 文章编辑
 *     description: 文章编辑
 *     requestBody:
 *       description:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               articleId:
 *                 type: string
 *                 description: 文章ID
 *               title:
 *                 type: string
 *                 description: 文章标题
 *               content:
 *                 type: string
 *                 description: 文章正文(Markdown)
 *               category:
 *                 $ref: '#/components/schemas/Category'
 *               poster:
 *                 type: string
 *                 example: https://daixu.cn/images/avatar.png
 *                 description: 预览图片
 *               video:
 *                 type: string
 *                 example: https://daixu.cn/images/xxx.mp4
 *                 description: 视频
 *               description:
 *                 type: string
 *                 description: 文章描述
 *               disableComment:
 *                 type: integer
 *                 description: 禁止评论(0:允许评论、1:禁止评论)
 *               isPrivate:
 *                 type: integer
 *                 description: 私有文章(0:公开、1:私有)
 *               unlockAt:
 *                 type: string
 *                 description: 解锁时间
 *             required:
 *               - articleId
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
router.patch("/update", auth(0), articleController.update);

/**
 * @swagger
 * /article/info/{articleId}:
 *   get:
 *     tags:
 *       - 文章管理
 *     summary: 获取文章信息
 *     description: 获取文章信息
 *     security: []
 *     parameters:
 *       - name: articleId
 *         in: path
 *         description: 文章ID
 *         required: true
 *         schema:
 *           type: string
 *       - name: disableViewsIncrement
 *         in: query
 *         description: 禁止自增浏览数（默认自增：true禁止、false自增）
 *         required: false
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
 *                 data:
 *                   $ref: '#/components/schemas/Article'
 */
router.get("/info/:articleId", articleController.info);

/**
 * @swagger
 * /article/title:
 *   get:
 *     tags:
 *       - 文章管理
 *     summary: 获取所有文章标题
 *     description: 获取所有文章标题
 *     security: []
 *     parameters:
 *       - name: keyword
 *         in: query
 *         description: 搜索关键字（title）
 *         required: false
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
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ArticleTitle'
 */
router.get("/title", articleController.title);

/**
 * @swagger
 * /article/{articleId}:
 *   delete:
 *     tags:
 *       - 文章管理
 *     summary: 删除文章
 *     description: 删除指定文章
 *     parameters:
 *       - name: articleId
 *         in: path
 *         description: '文章ID'
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
router.delete("/:articleId", auth(0), articleController.destroy);
export default router;
