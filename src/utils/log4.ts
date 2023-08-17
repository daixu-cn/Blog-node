/**
 * @Description: log4日志封装
 * @Author: daixu
 * @Date: 2023-04-22 21:12:02
 */

import log4js, { getLogger } from "log4js";
import createConfigure from "@/config/log4";
type IType = "trace" | "debug" | "info" | "warn" | "error" | "fatal" | "mark";

/**
 * @description 错误日志
 * @param {any} content 打印内容
 * @param {IType} type 日志等级
 * @return {}
 */
export const errorLogger = (content: any, type: IType = "error") => {
  log4js.configure(createConfigure());
  getLogger("error")[type](content);
};

/**
 * @description 请求日志
 * @param {any} content 打印内容
 * @param {IType} type 日志等级
 * @return {}
 */
export const httpLogger = (content: any, type: IType = "info") => {
  log4js.configure(createConfigure());
  getLogger("http")[type](content);
};

/**
 * @description 平常日志
 * @param {any} content 打印内容
 * @param {IType} type 日志等级
 * @return {}
 */
export default function (content: any, type: IType = "info") {
  log4js.configure(createConfigure());
  getLogger()[type](content);
}
