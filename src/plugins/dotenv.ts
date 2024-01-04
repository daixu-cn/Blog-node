/**
 * @Description: 全局环境变量配置
 * @Author: daixu
 * @Date: 2024-01-04 10:59:27
 */

import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === "development" ? ".env.development" : ".env.production"
  )
});
