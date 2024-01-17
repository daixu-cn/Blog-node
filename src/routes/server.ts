/**
 * @Description: 站点信息路由
 * @Author: daixu
 * @Date: 2023-04-22 20:36:55
 */

import Router from "koa-router";
const router = new Router();
import auth from "@/middlewares/auth";

import serverController from "@/controllers/server";

router.prefix("/server");

/**
 * @swagger
 * /server/site:
 *   get:
 *     tags:
 *       - 服务器/站点管理
 *     summary: 获取站点信息
 *     description: 获取站点信息
 *     security: []
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
 *                   $ref: '#/components/schemas/Site'
 */
router.get("/site", serverController.site);

/**
 * @swagger
 * /server/info:
 *   get:
 *     tags:
 *       - 服务器/站点管理
 *     summary: 获取服务器信息
 *     description: 获取服务器信息
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
 *                   $ref: '#/components/schemas/ServerInfo'
 */
router.get("/info", auth(), serverController.info);

/**
 * @swagger
 * /server/checker:
 *   post:
 *     tags:
 *       - 服务器/站点管理
 *     summary: 站点更新推送
 *     description: 站点更新推送
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
router.post("/checker", auth(0), serverController.checker);

export default router;
