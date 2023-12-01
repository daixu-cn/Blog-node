/**
 * @Description: 友情链接模块路由
 * @Author: daixu
 * @Date: 2023-04-22 20:36:55
 */

import Router from "koa-router";
const router = new Router();
import auth from "@/middlewares/auth";

import linkController from "@/controllers/link";

router.prefix("/link");

/**
 * @swagger
 * /link/create:
 *   put:
 *     tags:
 *       - 友联管理
 *     summary: 创建友联
 *     description: 创建友联
 *     security: []
 *     requestBody:
 *       description:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 网站名称
 *               description:
 *                 type: string
 *                 description: 网站描述
 *               logo:
 *                 type: string
 *                 example: https://daixu.cn/images/avatar.png
 *                 description: 网站LOGO
 *               url:
 *                 type: string
 *                 example: https://daixu.cn
 *                 description: 网站地址
 *               email:
 *                 type: string
 *                 example: daixu.cn@outlook.com
 *                 description: 站长邮箱
 *               qq:
 *                 type: string
 *                 example: 2064889594
 *                 description: 站长QQ
 *             required:
 *               - name
 *               - description
 *               - url
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
 *                   $ref: '#/components/schemas/Link'
 */
router.put("/create", linkController.create);

/**
 * @swagger
 * /link/update:
 *   patch:
 *     tags:
 *       - 友联管理
 *     summary: 友联编辑
 *     description: 友联编辑
 *     requestBody:
 *       description:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               linkId:
 *                 type: string
 *                 description: 友联ID
 *               name:
 *                 type: string
 *                 description: 网站名称
 *               description:
 *                 type: string
 *                 description: 网站描述
 *               logo:
 *                 type: string
 *                 example: https://daixu.cn/images/avatar.png
 *                 description: 网站LOGO
 *               url:
 *                 type: string
 *                 example: https://daixu.cn
 *                 description: 网站地址
 *               email:
 *                 type: string
 *                 example: daixu.cn@outlook.com
 *                 description: 站长邮箱
 *               qq:
 *                 type: string
 *                 example: 2064889594
 *                 description: 站长QQ
 *               check:
 *                 type: integer
 *                 example: 1
 *                 description: 友联核验状态(0:不通过、1:通过)
 *             required:
 *               - linkId
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
router.patch("/update", auth(0), linkController.update);

/**
 * @swagger
 * /link/list:
 *   post:
 *     tags:
 *       - 友联管理
 *     summary: 获取友联列表
 *     description: 获取友联列表
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
 *                 description: 搜索关键字（linkId，name，description，url）
 *               check:
 *                 type: integer
 *                 description: 友联核验状态(0:不通过、1:通过)
 *               startTime:
 *                 type: string
 *                 description: 友联创建的开始时间
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 description: 友联创建的结束时间
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
 *                         $ref: '#/components/schemas/Link'
 *                     total:
 *                       type: integer
 *                       example: 999
 *                       description: 总数
 */
router.post("/list", linkController.list);

/**
 * @swagger
 * /link/{linkId}:
 *   delete:
 *     tags:
 *       - 友联管理
 *     summary: 删除友联
 *     description: 删除指定友联
 *     parameters:
 *       - name: linkId
 *         in: path
 *         description: '友联ID'
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
router.delete("/:linkId", auth(0), linkController.destroy);
export default router;
