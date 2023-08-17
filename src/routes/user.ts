/**
 * @Description: 用户模块路由
 * @Author: daixu
 * @Date: 2023-04-22 20:36:55
 */

import Router from "koa-router";
const router = new Router();
import auth from "@/middlewares/auth";

import userController from "@/controllers/user";

router.prefix("/user");

/**
 * @swagger
 * /user/sms:
 *   post:
 *     tags:
 *       - 用户管理
 *     summary: 获取邮箱验证码
 *     description: 请求邮箱验证码
 *     security: []
 *     requestBody:
 *       description:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: daixu.cn@outlook.com
 *                 description: 邮箱
 *             required:
 *               - email
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
router.post("/sms", userController.sms);

/**
 * @swagger
 * /user/login:
 *   post:
 *     tags:
 *       - 用户管理
 *     summary: 用户登录
 *     description: 用户登录
 *     security: []
 *     requestBody:
 *       description: 登录账号
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: daixu.cn@outlook.com
 *                 description: 邮箱
 *               password:
 *                 type: string
 *                 example: 1bc2a8b7478a135446ee4e98f924efbf
 *                 description: 密码
 *             required:
 *               - email
 *               - password
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
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2MTEzNzQ4ODk2NTEyODIwMCwiaWF0IjoxNjc5NTQxODg0LCJleHAiOjE2Nzk1NDkwODR9.5XNV8CINYl52mQ_UqxrASGIb98mcpiFWrwaTBgVviA0
 *                       description: Token
 */
router.post("/login", userController.login);

/**
 * @swagger
 * /user/login/qq:
 *   post:
 *     tags:
 *       - 用户管理
 *     summary: QQ授权登录
 *     description: QQ授权登录
 *     security: []
 *     requestBody:
 *       description:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accessToken:
 *                 type: string
 *                 example: EFC718B0E9750DF946ED8755452E623F
 *                 description: 用户凭证(QQ官方接口获取)
 *             required:
 *               - accessToken
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
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2MTEzNzQ4ODk2NTEyODIwMCwiaWF0IjoxNjc5NTQxODg0LCJleHAiOjE2Nzk1NDkwODR9.5XNV8CINYl52mQ_UqxrASGIb98mcpiFWrwaTBgVviA0
 *                       description: Token
 */
router.post("/login/qq", userController.login_qq);

/**
 * @swagger
 * /user/login/github:
 *   post:
 *     tags:
 *       - 用户管理
 *     summary: GitHub授权登录
 *     description: GitHub授权登录
 *     security: []
 *     requestBody:
 *       description:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: da9a33c478081caa488a
 *                 description: 用户凭证(GitHub官方接口获取)
 *             required:
 *               - code
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
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2MTEzNzQ4ODk2NTEyODIwMCwiaWF0IjoxNjc5NTQxODg0LCJleHAiOjE2Nzk1NDkwODR9.5XNV8CINYl52mQ_UqxrASGIb98mcpiFWrwaTBgVviA0
 *                       description: Token
 */
router.post("/login/github", userController.login_github);

/**
 * @swagger
 * /user/login/google:
 *   post:
 *     tags:
 *       - 用户管理
 *     summary: Google授权登录
 *     description: Google授权登录
 *     security: []
 *     requestBody:
 *       description:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accessToken:
 *                 type: string
 *                 example: ya29.a0AWY7CknsEur8a5xnB6xfsKjH0KPVFDDCOYtOU2-sbV6PYAOzZ1h2epJ9I0HegXpI5Wb4aPEOk_DHVTcAoZxe_XaqtnUwM7ABegWCljPygpIkW8lM5BxkeiCRS-1_gLmM3N_QQHHUYNqmAfW68IbNEZ3U-wGbaCgYKAVsSARESFQG1tDrpW6Tey8j9FI5G4M8GGtd3bg0163
 *                 description: 用户凭证(Google官方接口获取)
 *             required:
 *               - accessToken
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
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2MTEzNzQ4ODk2NTEyODIwMCwiaWF0IjoxNjc5NTQxODg0LCJleHAiOjE2Nzk1NDkwODR9.5XNV8CINYl52mQ_UqxrASGIb98mcpiFWrwaTBgVviA0
 *                       description: Token
 */
router.post("/login/google", userController.login_google);

/**
 * @swagger
 * /user/register:
 *   put:
 *     tags:
 *       - 用户管理
 *     summary: 用户注册
 *     description: 普通用户注册
 *     security: []
 *     requestBody:
 *       description: 账号注册
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 example: daixu
 *                 description: 用户名
 *               email:
 *                 type: string
 *                 example: daixu.cn@outlook.com
 *                 description: 邮箱
 *               sms:
 *                 type: string
 *                 example: "123456"
 *                 description: 邮箱验证码
 *               password:
 *                 type: string
 *                 example: 1bc2a8b7478a135446ee4e98f924efbf
 *                 description: 登录密码
 *             required:
 *               - email
 *               - sms
 *               - password
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
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2MTEzNzQ4ODk2NTEyODIwMCwiaWF0IjoxNjc5NTQxODg0LCJleHAiOjE2Nzk1NDkwODR9.5XNV8CINYl52mQ_UqxrASGIb98mcpiFWrwaTBgVviA0
 *                       description: Token
 */
router.put("/register", userController.register);

/**
 * @swagger
 * /user/password:
 *   patch:
 *     tags:
 *       - 用户管理
 *     summary: 修改密码
 *     description: 修改密码
 *     security: []
 *     requestBody:
 *       description: 修改密码
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: daixu.cn@outlook.com
 *                 description: 邮箱
 *               sms:
 *                 type: string
 *                 example: "123456"
 *                 description: 邮箱验证码
 *               password:
 *                 type: string
 *                 example: 1bc2a8b7478a135446ee4e98f924efbf
 *                 description: 新密码
 *             required:
 *               - email
 *               - sms
 *               - password
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
router.patch("/password", userController.password);

/**
 * @swagger
 * /user/info:
 *   get:
 *     tags:
 *       - 用户管理
 *     summary: 获取用户信息
 *     description: 获取用户信息
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
 *                     user:
 *                       $ref: '#/components/schemas/User'
 */
router.get("/info", auth(), userController.info);

/**
 * @swagger
 * /user/refreshToken:
 *   post:
 *     tags:
 *       - 用户管理
 *     summary: 刷新Token
 *     description: 刷新Token
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
 *                   description: 刷新Token
 */
router.post("/refreshToken", auth(), userController.refreshToken);

/**
 * @swagger
 * /user/update:
 *   patch:
 *     tags:
 *       - 用户管理
 *     summary: 用户信息编辑
 *     description: 用户信息编辑
 *     requestBody:
 *       description: 用户信息编辑
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 example: /images/avatar.png
 *                 description: 头像
 *               email:
 *                 type: string
 *                 example: daixu.cn@outlook.com
 *                 description: 邮箱
 *               sms:
 *                 type: string
 *                 example: daixu.cn@outlook.com
 *                 description: 邮箱验证码（如果需要修改邮箱的话该字段必传）
 *               userName:
 *                 type: string
 *                 description: 用户名
 *               qq:
 *                 type: string
 *                 description: qq
 *               google:
 *                 type: string
 *                 description: google
 *               github:
 *                 type: string
 *                 description: github
 *               emailService:
 *                 type: integer
 *                 description: 邮箱服务(0:关闭、1:开启)
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
 *                     user:
 *                       $ref: '#/components/schemas/User'
 */
router.patch("/update", auth(), userController.update);

/**
 * @swagger
 * /user/list:
 *   post:
 *     tags:
 *       - 用户管理
 *     summary: 获取用户列表
 *     description:
 *     requestBody:
 *       description: 用户信息编辑
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               keyword:
 *                 type: string
 *                 description: 搜索关键字（userId，email，userName）
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
 *                         $ref: '#/components/schemas/User'
 *                     total:
 *                       type: integer
 *                       example: 999
 *                       description: 总数
 */
router.post("/list", auth(), userController.list);
export default router;
