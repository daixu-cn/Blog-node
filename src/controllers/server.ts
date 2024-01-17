/**
 * @Description: 站点信息处理层
 * @Author: daixu
 * @Date: 2023-04-22 20:35:20
 */

import { Context } from "koa";
import response, { WSResponse } from "@/config/response";
import responseError from "@/config/response/error";
import { getServerInfo, getProcessList } from "@/utils/api";
import ws from "@/server/ws";
import Tags from "@/server/ws/tags";

import User from "@/models/user";
import Article from "@/models/article";
import Comment from "@/models/comment";
import Reply from "@/models/reply";
import Link from "@/models/link";

export default {
  /**
   * @openapi
   * components:
   *   schemas:
   *     Site:
   *       description: 站点信息
   *       type: object
   *       properties:
   *         count:
   *           type: object
   *           description: 数量统计
   *           properties:
   *             article:
   *               type: integer
   *               description: 文章总数
   *             views:
   *               type: integer
   *               description: 文章阅读总量
   *             comment:
   *               type: integer
   *               description: 评论总数
   *             reply:
   *               type: integer
   *               description: 回复总数
   *             user:
   *               type: integer
   *               description: 用户总数
   *             link:
   *               type: integer
   *               description: 友联总数
   */
  async site(ctx: Context) {
    try {
      ctx.body = response({
        data: {
          count: {
            article: (await Article.findAndCountAll()).count,
            views: await Article.sum("views"),
            comment: (await Comment.findAndCountAll()).count,
            reply: (await Reply.findAndCountAll()).count,
            user: (await User.findAndCountAll()).count,
            link: (await Link.findAndCountAll()).count
          }
        },
        message: "查询成功"
      });
    } catch (error: any) {
      throw responseError({ code: 16001, message: error?.message });
    }
  },

  /**
   * @openapi
   * components:
   *   schemas:
   *     ServerInfo:
   *       description: 服务器信息
   *       type: object
   *       properties:
   *         time:
   *           type: object
   *           description: 服务器时间
   *           properties:
   *             current:
   *               type: integer
   *               example: 1682559830384
   *               description: 本地（服务器）时间
   *             uptime:
   *               type: integer
   *               example: 482362
   *               description: 以秒为单位的正常运行时间
   *             timezone:
   *               type: string
   *               example: "GMT+0800"
   *               description: e.g. GMT+0200
   *             timezoneName:
   *               type: string
   *               example: "Asia/Shanghai"
   *               description: e.g. CEST
   *         os:
   *           type: object
   *           description: 操作系统信息
   *           properties:
   *             platform:
   *               type: string
   *               example: darwin
   *               description: 操作系统平台
   *             distro:
   *               type: string
   *               example: macOS
   *               description: 操作系统发行版
   *             release:
   *               type: string
   *               example: 13.3.1
   *               description: 操作系统版本号
   *             kernel:
   *               type: string
   *               example: 22.4.0
   *               description: 内核版本
   *             arch:
   *               type: string
   *               example: x64
   *               description: 系统架构
   *         cpu:
   *           type: object
   *           description: CPU 信息
   *           properties:
   *             manufacturer:
   *               type: string
   *               example: "Apple"
   *               description: CPU 制造商
   *             brand:
   *               type: string
   *               example: "M1 Max"
   *               description: CPU 型号
   *             speed:
   *               type: integer
   *               example: 2.4
   *               description: CPU 频率（GHz）
   *             cores:
   *               type: integer
   *               example: 10
   *               description: CPU 核心数
   *             physicalCores:
   *               type: integer
   *               example: 10
   *               description: CPU 物理核心数
   *             processors:
   *               type: integer
   *               example: 1
   *               description: 处理器数量
   *             currentSpeed:
   *               type: integer
   *               example: 2.4
   *               description: 当前速度（GHz）
   *             currentLoad:
   *               type: integer
   *               example: 15.074544955760816
   *               description: 当前负载百分比
   *             loadPerCore:
   *               type: array
   *               example: [46.39291521358949,45.368950841050534,19.71281795712145]
   *               description: 每个核心的负载百分比
   *         mem:
   *           type: object
   *           description: 内存信息
   *           properties:
   *             total:
   *               type: integer
   *               example: 34359738368
   *               description: 总内存（bytes）
   *             free:
   *               type: integer
   *               example: 1720127488
   *               description: 未使用内存（bytes）
   *             used:
   *               type: integer
   *               example: 32639610880
   *               description: 已使用内存，包括缓冲区/缓存（bytes）
   *             active:
   *               type: integer
   *               example: 11756797952
   *               description: 已使用内存，不包括缓冲区/缓存（bytes）
   *             available:
   *               type: integer
   *               example: 22602940416
   *               description: 可用内存（bytes）
   *             usedPercent:
   *               type: integer
   *               example: 94.99377012252808
   *               description: 已使用内存百分比
   *         disk:
   *           type: array
   *           description: 硬盘信息
   *           items:
   *             type: object
   *             description: 已安装文件系统的数组
   *             properties:
   *               fs:
   *                 type: string
   *                 example: "/dev/disk3s1s1"
   *                 description: 文件系统名称
   *               type:
   *                 type: string
   *                 example: "APFS"
   *                 description: 磁盘类型
   *               size:
   *                 type: integer
   *                 example: 994662584320
   *                 description: 磁盘容量（bytes）
   *               used:
   *                 type: integer
   *                 example: 9082707968
   *                 description: 已使用空间（bytes）
   *               usePercent:
   *                 type: integer
   *                 example: 1.2
   *                 description: 已使用空间百分比
   *         networkStats:
   *           type: array
   *           description: 网络信息
   *           items:
   *             type: object
   *             description: 当前网络统计信息
   *             properties:
   *               iface:
   *                 type: string
   *                 example: "en0"
   *                 description: 网络接口名称
   *               operstate:
   *                 type: string
   *                 example: "up"
   *                 description: 运行状态
   *               rx_bytes:
   *                 type: integer
   *                 example: 12160676156
   *                 description: 接收字节数
   *               tx_bytes:
   *                 type: integer
   *                 example: 2198305589
   *                 description: 发送字节数
   *         process:
   *           type: array
   *           description: 应用进程信息
   *           items:
   *             type: object
   *             description: 当前应用进程
   *             properties:
   *               pid:
   *                 type: integer
   *                 example: 24218
   *                 description: 进程的 ID
   *               pm_id:
   *                 type: integer
   *                 example: 0
   *                 description: PM2中的进程ID,可用于查询特定的进程信息
   *               name:
   *                 type: string
   *                 example: "blog"
   *                 description: 进程名称
   *               cpu:
   *                 type: integer
   *                 example: 92
   *                 description: CPU占用率百分比
   *               memory:
   *                 type: integer
   *                 example: 283525120
   *                 description: 内存占用情况（bytes）
   *               status:
   *                 type: string
   *                 example: "online"
   *                 description: 进程状态 online、stopped、errored 等
   *               pm_uptime:
   *                 type: integer
   *                 example: 1682563459957
   *                 description: 进程开始运行的时间（ms）
   *               version:
   *                 type: string
   *                 example: "1.0.0"
   *                 description: 应用版本
   *               pm2_version:
   *                 type: string
   *                 example: "5.3.0"
   *                 description: PM2版本
   *               node_version:
   *                 type: string
   *                 example: "14.17.3"
   *                 description: Node版本
   *               restart_time:
   *                 type: integer
   *                 example: 270
   *                 description: 进程重启次数
   */
  async info(ctx: Context) {
    try {
      ctx.body = response({
        data: {
          ...(await getServerInfo()),
          process: await getProcessList()
        },
        message: "查询成功"
      });
    } catch (error: any) {
      throw responseError({ code: 16002, message: error?.message });
    }
  },

  async checker(ctx: Context) {
    try {
      await ws.broadcast(WSResponse({ tag: Tags.CHECKER }));

      ctx.body = response({ message: "推送成功" });
    } catch (error: any) {
      throw responseError({ code: 16003, message: error?.message });
    }
  }
};
