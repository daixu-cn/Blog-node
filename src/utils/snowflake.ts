/**
 * @Description: 雪花算法类
 * @Author: daixu
 * @Date: 2023-04-22 21:16:45
 */

import crypto from "crypto";
import os from "os";

class Snowflake {
  private static readonly EPOCH = 1640995200000n; // 时间戳的起始值
  private static readonly WORKER_ID_BITS = 5n; // 用于工作进程ID的比特位数
  private static readonly DATACENTER_ID_BITS = 5n; // 用于数据中心ID的比特位数
  private static readonly SEQUENCE_BITS = 12n; // 用于序列号的比特位数
  private static readonly MAX_WORKER_ID = (1n << Snowflake.WORKER_ID_BITS) - 1n; // 最大工作进程ID
  private static readonly MAX_DATACENTER_ID = (1n << Snowflake.DATACENTER_ID_BITS) - 1n; // 最大数据中心ID
  private static readonly MAX_SEQUENCE = (1n << Snowflake.SEQUENCE_BITS) - 1n; // 最大序列号
  private static readonly WORKER_ID_SHIFT = Snowflake.SEQUENCE_BITS; // 工作进程ID左移比特位数
  private static readonly DATACENTER_ID_SHIFT = Snowflake.SEQUENCE_BITS + Snowflake.WORKER_ID_BITS; // 数据中心ID左移比特位数
  private static readonly TIMESTAMP_LEFT_SHIFT =
    Snowflake.SEQUENCE_BITS + Snowflake.WORKER_ID_BITS + Snowflake.DATACENTER_ID_BITS; // 时间戳左移比特位数
  private readonly workerId: bigint; // 工作进程ID
  private readonly datacenterId: bigint; // 数据中心ID

  private sequence = 0n; // 序列号

  private lastTimestamp = -1n; // 最后生成ID的时间戳

  constructor(workerId: bigint, datacenterId: bigint) {
    if (workerId > Snowflake.MAX_WORKER_ID || workerId < 0n) {
      throw new Error(`工作进程ID必须在0和${Snowflake.MAX_WORKER_ID}之间`);
    }

    if (datacenterId > Snowflake.MAX_DATACENTER_ID || datacenterId < 0n) {
      throw new Error(`数据中心ID必须在0和${Snowflake.MAX_DATACENTER_ID}之间`);
    }
    this.workerId = workerId;
    this.datacenterId = datacenterId;
  }
  public nextId(): bigint {
    let timestamp = this.timestamp();
    // 在时钟漂移的情况下，等待时钟前进
    if (timestamp < this.lastTimestamp) {
      timestamp = this.lastTimestamp;
    }
    // 如果使用相同的时间戳，增加序列号
    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1n) & Snowflake.MAX_SEQUENCE;
      // 如果序列号超过最大限制，等待下一毫秒
      if (this.sequence === 0n) {
        timestamp = this.waitNextMillis(timestamp);
      }
    } else {
      // 如果生成了新的时间戳，则重置序列号
      this.sequence = 0n;
    }
    this.lastTimestamp = timestamp;
    return (
      ((timestamp - Snowflake.EPOCH) << Snowflake.TIMESTAMP_LEFT_SHIFT) |
      (this.datacenterId << Snowflake.DATACENTER_ID_SHIFT) |
      (this.workerId << Snowflake.WORKER_ID_SHIFT) |
      this.sequence
    );
  }
  private waitNextMillis(timestamp: bigint): bigint {
    while (timestamp <= this.lastTimestamp) {
      timestamp = this.timestamp();
    }
    return timestamp;
  }

  private timestamp(): bigint {
    return BigInt(Date.now());
  }
}

// 生成机器 ID
function generateWorkerId(): bigint {
  // 获取 MAC 地址，如果无法获取则使用随机数
  let mac: string | null = null;
  let numFound = 0; // 追踪找到的网络接口数
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName of Object.keys(networkInterfaces)) {
    const networkInterface = networkInterfaces[interfaceName];
    const found = networkInterface?.find(
      ({ internal }) => !internal && (mac === null || mac === undefined)
    );
    if (found) {
      mac = found.mac;
      numFound++;
    }
  }

  if (numFound !== 1 || !mac) {
    // 没有找到网络接口或者找到多个网络接口
    // 生成随机数
    const randomBytes = crypto.randomBytes(6);
    const bytes = new Uint8Array(randomBytes.buffer, 0, 6);
    mac = Array.from(bytes)
      .map(b => b.toString(16).padStart(2, "0"))
      .join(":");
  }

  // 取 MAC 地址的低 3 位
  const macBigInt = BigInt(`0x${mac.replace(/:/g, "").slice(-6)}`);
  const workerId = macBigInt & ((1n << 3n) - 1n);
  // 取进程 ID 的低 2 位
  const processId = BigInt(process.pid) & ((1n << 2n) - 1n);
  return (workerId << 2n) | processId;
}

const workerId = generateWorkerId();
const datacenterId = 1n;
export default new Snowflake(workerId, datacenterId);
