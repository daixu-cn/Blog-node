/**
 * @Description: redis配置
 * @Author: daixu
 * @Date: 2023-04-22 21:16:29
 */

import Redis from "ioredis";
import { _REDIS } from "@/config/env";
class RedisClient extends Redis {
  constructor() {
    super(_REDIS);
  }
}
export default new RedisClient();
