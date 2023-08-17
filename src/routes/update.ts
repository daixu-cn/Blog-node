/**
 * @Description: 网站更新日志模块路由
 * @Author: daixu
 * @Date: 2023-04-22 20:36:55
 */

import Router from "koa-router";
const router = new Router();
import auth from "@/middlewares/auth";

import updateController from "@/controllers/update";

router.prefix("/update");

/**
 * @swagger
 * /update/create:
 *   put:
 *     tags:
 *       - 网站更新管理
 *     summary: 创建网站更新信息
 *     description: 创建网站更新信息
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
 *                 example: "更新内容"
 *                 description: 更新内容
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
 *                   $ref: '#/components/schemas/Update'
 */
router.put("/create", auth(0), updateController.create);

/**
 * @swagger
 * /update/update:
 *   patch:
 *     tags:
 *       - 网站更新管理
 *     summary: 网站更新信息编辑
 *     description: 网站更新信息编辑
 *     requestBody:
 *       description:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               updateId:
 *                 type: string
 *                 description: 更新ID
 *               content:
 *                 type: string
 *                 description: 更新内容
 *             required:
 *               - updateId
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
 *                   $ref: '#/components/schemas/Update'
 */
router.patch("/update", auth(0), updateController.update);

/**
 * @swagger
 * /update/list:
 *   post:
 *     tags:
 *       - 网站更新管理
 *     summary: 获取网站更新信息列表
 *     description: 获取网站更新信息列表
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
 *                 description: 搜索关键字（updateId，content）
 *               startTime:
 *                 type: string
 *                 description: 网站更新信息创建的开始时间
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 description: 网站更新信息创建的结束时间
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
 *                       items:
 *                         $ref: '#/components/schemas/Update'
 *                     total:
 *                       type: integer
 *                       example: 999
 *                       description: 总数
 */
router.post("/list", updateController.list);

/**
 * @swagger
 * /update/{updateId}:
 *   delete:
 *     tags:
 *       - 网站更新管理
 *     summary: 删除网站更新信息
 *     description: 删除指定网站更新信息
 *     parameters:
 *       - name: updateId
 *         in: path
 *         description: '更新ID'
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
router.delete("/:updateId", auth(0), updateController.destroy);
export default router;
