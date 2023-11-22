/**
 * @Description: 文件上传模块路由
 * @Author: daixu
 * @Date: 2023-04-22 20:36:55
 */

import Router from "koa-router";
const router = new Router();
import auth from "@/middlewares/auth";
import koaBody from "@/middlewares/koaBody";
import params from "@/middlewares/params";

import uploadController from "@/controllers/upload";

router.prefix("/upload");

/**
 * @swagger
 * /upload/file:
 *   put:
 *     tags:
 *       - 文件服务
 *     summary: 上传文件
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
 *               replaceFile:
 *                 type: string
 *                 description: 替换文件：传入文件路径或者完整地址，传入该属性则只能传入一个文件（且文件后缀必须与替换前的文件保持一致）
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
 *                 data:
 *                   type: string
 *                   description: 根据上传数量返回文件地址或者数组（如果是分片上传，之后最后一截上传完之后才会返回正确路径）
 *                   example: "https://daixu.cn/162757520497303552.png"
 */
router.put("/file", auth(0), koaBody(), params(), uploadController.upload);

/**
 * @swagger
 * /upload/file:
 *   delete:
 *     tags:
 *       - 文件服务
 *     summary: 删除文件
 *     description: 删除指定文件
 *     parameters:
 *       - name: path
 *         in: query
 *         description: '文件路径'
 *         required: true
 *         example: "upload/image/user/202609519367528448.png (或者完整地址：http://localhost:3000/upload/image/article/202609519367528448.png)"
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
router.delete("/file", auth(1), uploadController.destroy);

/**
 * @swagger
 * /upload/image/to/base64:
 *   post:
 *     tags:
 *       - 文件服务
 *     summary: 图片转base64格式
 *     description: 将上传的图片转换为base64格式
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
 *                 type: array
 *                 description: 二进制图片文件
 *                 items:
 *                   type: string
 *                   format: binary
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
 *                   type: string
 *                   description: 根据上传数量返回文件地址或者数组
 *                   example: "data:image/jpeg;base64,iVBORw0KGg..."
 */
router.post("/image/to/base64", koaBody(), params(), uploadController.imageToBase64);
export default router;
