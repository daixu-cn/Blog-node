/**
 * @Description: redis配置
 * @Author: daixu
 * @Date: 2023-04-22 21:16:29
 */

import Redis from "ioredis";
import { _REDIS } from "@/config/env";

// 原始redis对象
export const REDIS = new Redis(_REDIS);

class RedisClient {
  private client = REDIS;

  /**
   * @description 设置键值对
   * @param {string} key 键名
   * @param {string | object | number} value 键值
   * @param {number} expiration 过期时间（单位：秒）
   * @return {void}
   */
  public async set(
    key: string,
    value: string | object | number,
    expiration?: number
  ): Promise<void> {
    if (typeof value === "object") {
      value = JSON.stringify(value);
    }

    await this.client.set(key, value);

    if (expiration) {
      await this.client.expire(key, expiration);
    }
  }

  /**
   * @description 获取值
   * @param {string} key 键名
   * @return {string | object | null}
   */
  public async get(key: string): Promise<string | object | null> {
    const value = await this.client.get(key);

    if (value && /^[{[].*[}\]]$/.test(value)) {
      return JSON.parse(value);
    }

    return value;
  }

  /**
   * @description 添加元素到集合
   * @param {string} key 键名
   * @param {...string} members 需要添加的元素
   * @return {number} 返回添加的元素数量
   */
  public async sadd(key: string, ...members: string[]): Promise<number> {
    return await this.client.sadd(key, ...members);
  }

  /**
   * @description 获取集合的所有成员
   * @param {string} key 键名
   * @return {string[]} 返回集合的所有成员
   */
  public async smembers(key: string): Promise<string[]> {
    return await this.client.smembers(key);
  }

  /**
   * @description 从集合中移除元素
   * @param {string} key 键名
   * @param {...string} members 需要移除的元素
   * @return {number} 返回移除的元素数量
   */
  public async srem(key: string, ...members: string[]): Promise<number> {
    return await this.client.srem(key, ...members);
  }

  /**
   * @description 判断元素是否在集合中
   * @param {string} key 键名
   * @param {string} member 需要判断的元素
   * @return {boolean} 如果元素存在于集合中，则返回 true，否则返回 false
   */
  public async sismember(key: string, member: string): Promise<boolean> {
    return (await this.client.sismember(key, member)) === 1;
  }

  /**
   * @description 获取集合的成员数量
   * @param {string} key 键名
   * @return {number} 返回集合的成员数量
   */
  public async scard(key: string): Promise<number> {
    return await this.client.scard(key);
  }

  /**
   * @description 删除键
   * @param {string} key 键名
   * @return {number}
   */
  public async del(key: string): Promise<number> {
    return await this.client.del(key);
  }

  /**
   * @description 设置过期时间
   * @param {string} key 键名
   * @param {number} expiration 过期时间（单位：秒）
   * @return {number}
   */
  public async expire(key: string, expiration: number): Promise<number> {
    return await this.client.expire(key, expiration);
  }
}
export default new RedisClient();
