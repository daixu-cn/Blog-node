/**
 * @Description: 工具库
 * @Author: daixu
 * @Date: 2023-04-22 21:06:37
 */

import snowflake from "@/utils/snowflake";
import si from "systeminformation";
import pm2 from "pm2";

/**
 * @description 生成唯一ID
 * @return {string}
 */
export function generateId() {
  return snowflake.nextId().toString();
}

/**
 * @description 获取服务器信息
 * @return {object}
 */
export function getServerInfo() {
  return new Promise<object>(async (resolve, reject) => {
    try {
      // 获取操作系统信息
      const os = await si.osInfo();
      // 获取 CPU 信息
      const cpu = await si.cpu();
      // 获取 CPU 当前速度
      const cpuCurrentSpeed = await si.cpuCurrentSpeed();
      // 获取 CPU 当前负载
      const currentLoad = await si.currentLoad();
      // 获取内存信息
      const mem = await si.mem();
      // 获取硬盘信息
      const disk = await si.fsSize();
      // 获取网络信息
      const networkStats = await si.networkStats();

      resolve({
        time: si.time(), // 获取服务器时间
        os: {
          platform: os.platform, // 操作系统平台
          distro: os.distro, // 操作系统发行版
          release: os.release, // 操作系统版本号
          kernel: os.kernel, // 内核版本
          arch: os.arch // 系统架构
        },
        cpu: {
          manufacturer: cpu.manufacturer, // CPU 制造商
          brand: cpu.brand, // CPU 型号
          speed: cpu.speed, // CPU 频率（GHz）
          cores: cpu.cores, // CPU 核心数
          physicalCores: cpu.physicalCores, // CPU 物理核心数
          processors: cpu.processors, // 处理器数量
          currentSpeed: cpuCurrentSpeed.avg, // 当前速度（GHz）
          currentLoad: currentLoad.currentLoad, // 当前负载百分比
          loadPerCore: currentLoad.cpus.map(c => c.load) // 每个核心的负载百分比
        },
        mem: {
          total: mem.total, // 总内存（bytes）
          free: mem.free, // 未使用内存（bytes）
          used: mem.used, // 已使用内存，包括缓冲区/缓存（bytes）
          active: mem.active, // 已使用内存，不包括缓冲区/缓存（bytes）
          available: mem.available, // 可用内存（bytes）
          usedPercent: (mem.used / mem.total) * 100 // 已使用内存百分比
        },
        disk: disk.map(d => ({
          fs: d.fs, // 文件系统名称
          type: d.type, // 磁盘类型
          size: d.size, // 磁盘容量（bytes）
          used: d.used, // 已使用空间（bytes）
          usePercent: d.use // 已使用空间百分比
        })),
        networkStats: networkStats.map(n => ({
          iface: n.iface, // 网络接口名称
          operstate: n.operstate, // 运行状态
          rx_bytes: n.rx_bytes, // 接收字节数
          tx_bytes: n.tx_bytes // 发送字节数
        }))
      });
    } catch (err) {
      reject("服务器信息获取失败");
    }
  });
}

/**
 * @description 获取应用进程列表
 * @return {{ [key: string]: any }[]}
 */
export function getProcessList() {
  return new Promise<{ [key: string]: any }[]>((resolve, reject) => {
    try {
      pm2.connect(err => {
        if (err) {
          reject(err);
          process.exit(2);
        }

        pm2.describe("blog", function (err, description) {
          if (err) {
            reject(err);
            process.exit(2);
          }

          resolve(
            description.map(item => {
              return {
                // 进程ID
                pid: item.pid,
                // PM2中的进程ID,可用于查询特定的进程信息
                pm_id: item.pm_id,
                // 进程名称
                name: item.name,
                // CPU占用率百分比
                cpu: item.monit?.cpu,
                // 内存占用情况（bytes）
                memory: item.monit?.memory,
                // 进程状态 online、stopped、errored 等
                status: item.pm2_env?.status,
                // 进程开始运行的时间（ms）
                pm_uptime: item.pm2_env?.pm_uptime,
                // 应用版本
                version: item.pm2_env?.version,
                // PM2版本
                pm2_version: item.pm2_env?._pm2_version,
                // Node版本
                node_version: item.pm2_env?.node_version,
                // 进程重启次数
                restart_time: item.pm2_env?.restart_time
              };
            })
          );
        });
      });
    } catch (err) {
      reject(err);
    } finally {
      pm2.disconnect();
    }
  });
}
