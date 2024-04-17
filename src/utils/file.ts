import fs from "fs-extra";
import FileType from "file-type";
import got from "got";
import { generateId } from "@/utils/api";
import { ASSET_DIR } from "@/config/env";
import { DirectoriesList } from "./type";
import { ASSET_PREFIX } from "@/config/env";
import oss from "@/utils/oss";

/**
 * @description 将网络文件保存到本地
 * @param {string} src 文件地址
 * @return {Promise<string>} 返回文件名
 */
export function saveFile(src: string): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      // 读取文件
      const buffer = await got(src, { responseType: "buffer" }).buffer();
      // 解析文件类型
      const fileTypeResult = await FileType.fromBuffer(buffer);

      // 文件名
      const fileName = `${generateId()}.${fileTypeResult?.ext}`;
      // 文件类型
      const fileType = fileTypeResult?.mime.split("/")[0];
      // 将文件移入该目录
      const filePath = `${ASSET_DIR}/${fileType}`;

      // 校验文件目录是否存在
      fs.ensureDirSync(filePath);
      // 写入文件
      await fs.writeFile(`${filePath}/${fileName}`, buffer);

      // 文件最终地址
      const result = `/${fileType}/${fileName}`;

      // 返回文件地址
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * @description 递归获取指定文件夹下的所有文件夹(包含多级子文件夹)
 * @param {string} prefix 文件夹路径
 * @return {Promise<DirectoriesList[]>} 返回文件夹列表
 */
export function getDirectories(prefix: string = ""): Promise<DirectoriesList[]> {
  return new Promise(async (resolve, reject) => {
    const result: DirectoriesList[] = [];
    const { prefixes } = await oss.list({ prefix, delimiter: "/", "max-keys": "1000" });

    for (const name of prefixes ?? []) {
      result.push({ name, subDirectories: await getDirectories(name) });
    }

    for (const item of result) {
      item.name = item.name.split("/").slice(-2, -1)[0];
    }

    resolve(result);
  });
}

/**
 * @description 删除字符串中包含的本地资源
 * @param {string} content 内容
 */
export function deleteLocalAsset(content: string) {
  return new Promise<void>((resolve, reject) => {
    try {
      const reg = new RegExp(`(?<=\\]\\()(${ASSET_PREFIX}.+?)(?=\\))`, "g");
      const links = content.match(reg) ?? [];

      for (const link of links) {
        oss.delete(link.replace(ASSET_PREFIX, ""));
        resolve();
      }
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * @description 校验新旧文件路径，将旧文件删除
 * @param {string} oldPath 旧文件路径
 * @param {string} newPath 新文件路径
 */
export function validateAndRemoveOld(oldPath: string, newPath: string) {
  return new Promise<void>((resolve, reject) => {
    try {
      if (oldPath && oldPath !== newPath) {
        oss.delete(oldPath);
      }
    } catch (err) {
      reject(err);
    }
  });
}
