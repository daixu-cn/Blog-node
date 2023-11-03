/**
 * @Description: 文件相关模块路由
 * @Author: daixu
 * @Date: 2023-04-22 20:36:55
 */

import Router from "koa-router";
const router = new Router();
import auth from "@/middlewares/auth";

import uploadController from "@/controllers/upload";
import fileController from "@/controllers/file";

router.prefix("/file");

/**
 * @swagger
 * /file/directory:
 *   get:
 *     tags:
 *       - 文件服务
 *     summary: 获取文件目录
 *     description: 获取指定文件目录
 *     parameters:
 *       - name: path
 *         in: path
 *         description: 文件路径
 *         default: /
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
 *                     $ref: '#/components/schemas/Directorys'
 */
router.get("/directory", auth(0), fileController.getDirectorys);

/**
 * @swagger
 * /file/list:
 *   post:
 *     tags:
 *       - 文件服务
 *     summary: 获取文件列表
 *     description: 获取文件列表
 *     requestBody:
 *       description:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               directory:
 *                 type: string
 *                 description: 文件目录
 *                 default: /
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
 *                         $ref: '#/components/schemas/File'
 *                     total:
 *                       type: integer
 *                       example: 999
 *                       description: 总数
 */
router.post("/list", auth(0), fileController.list);

/**
 * @swagger
 * /file/xlsx/parse:
 *   post:
 *     tags:
 *       - 文件服务
 *     summary: 表格解析
 *     description: 表格文件最大为5M
 *     security: []
 *     requestBody:
 *       description:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: 二进制文件
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
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.post(
  "/xlsx/parse",
  uploadController.koaBody(1024 * 1024 * 5, {
    maxFiles: 1
  }),
  fileController.xlsx_parse
);

export default router;
