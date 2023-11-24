/**
 * @Description: 柠檬模块路由
 * @Author: daixu
 * @Date: 2023-11-19 16:43:21
 */

import Router from "koa-router";
const router = new Router();
import auth from "@/middlewares/auth";
import koaBody from "@/middlewares/koaBody";
import params from "@/middlewares/params";

import lemonController from "@/controllers/lemon";

router.prefix("/lemon");

/**
 * @swagger
 * /lemon/create:
 *   put:
 *     tags:
 *       - 柠檬管理
 *     summary: 创建柠檬记录
 *     description: 上传文件到服务器，可同时上传多个文件，单个文件最大为2M，如果超过2M，请使用分片上传规则
 *     requestBody:
 *       description:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: array
 *                 description: 二进制文件
 *                 items:
 *                   type: string
 *                   format: binary
 *               description:
 *                 type: string
 *                 description: 描述
 *               name:
 *                 type: string
 *                 description: 分片文件(必传)：文件标识（确保同一个文件的标识一致）
 *               chunk:
 *                 type: string
 *                 description: 分片文件(必传)：当前是第几个分片文件
 *               chunks:
 *                 type: string
 *                 description: 分片文件(必传)：该文件被分成了多少个分片
 *               hash:
 *                 type: string
 *                 description: 分片文件(必传)：分片文件的 md5 值
 *             required:
 *               - file
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
router.put("/create", auth(0), koaBody(), params(), lemonController.create);

/**
 * @swagger
 * /lemon/list:
 *   post:
 *     tags:
 *       - 柠檬管理
 *     summary: 获取柠檬记录列表
 *     description: 获取柠檬记录列表
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
 *                 description: 搜索关键字（lemonId，path，description）
 *               mediaType:
 *                 $ref: '#/components/schemas/LemonMediaType'
 *               startTime:
 *                 type: string
 *                 description: 柠檬记录创建的开始时间
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 description: 柠檬记录创建的结束时间
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
 *                         $ref: '#/components/schemas/Lemon'
 *                     total:
 *                       type: integer
 *                       example: 999
 *                       description: 总数
 */
router.post("/list", lemonController.list);

/**
 * @swagger
 * /lemon/update:
 *   patch:
 *     tags:
 *       - 柠檬管理
 *     summary: 柠檬记录编辑
 *     description: 柠檬记录编辑
 *     requestBody:
 *       description:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lemonId:
 *                 type: string
 *                 description: 柠檬记录ID
 *               path:
 *                 type: string
 *                 example: /images/avatar.png
 *                 description: 文件路径
 *               description:
 *                 type: string
 *                 description: 柠檬记录描述
 *             required:
 *               - lemonId
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
 *                   $ref: '#/components/schemas/Lemon'
 */
router.patch("/update", auth(0), lemonController.update);

/**
 * @swagger
 * /lemon/{lemonId}:
 *   delete:
 *     tags:
 *       - 柠檬管理
 *     summary: 删除柠檬记录
 *     description: 删除指定柠檬记录
 *     parameters:
 *       - name: lemonId
 *         in: path
 *         description: '柠檬记录ID'
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
router.delete("/:lemonId", auth(0), lemonController.destroy);
export default router;
