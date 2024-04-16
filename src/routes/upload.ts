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
 *               path:
 *                 type: string
 *                 example: /image/user
 *                 description: 需要存放的路径
 *               replace:
 *                 type: string
 *                 example: /image/xxx.png
 *                 description: 需要替换的文件路径 (replace传入时，path无效)
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
 * /upload/image/comment:
 *   put:
 *     tags:
 *       - 文件服务
 *     summary: 评论/回复图片上传
 *     description: 上传图片到服务器，可同时上传多个图片，单个图片最大为1M
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
 *                   example: "https://daixu.cn/162757520497303552.png"
 */
router.put(
  "/image/comment",
  auth(1),
  koaBody(1024 * 1024, { allowTypes: ["image"] }),
  params({ path: "/image/comment" }),
  uploadController.upload
);

/**
 * @swagger
 * /upload/image/user:
 *   put:
 *     tags:
 *       - 文件服务
 *     summary: 用户头像上传
 *     description: 上传图片到服务器，可同时上传多个图片，单个图片最大为1M
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
 *                   type: string
 *                   description: 根据上传数量返回文件地址或者数组
 *                   example: "https://daixu.cn/162757520497303552.png"
 */
router.put(
  "/image/user",
  auth(1),
  koaBody(1024 * 1024, { allowTypes: ["image"] }),
  params({ path: "/image/user" }),
  uploadController.upload
);

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

export default router;
