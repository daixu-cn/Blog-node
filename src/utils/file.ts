import fs from "fs-extra";
import FileType from "file-type";
import got from "got";
import { generateId } from "@/utils/api";
import { ASSET_DIR } from "@/config/env";
import { DirectoriesList, Files } from "./type";
import { ASSET_PREFIX } from "@/config/env";
import { destroyVideoAssets } from "@/utils/video";

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
 * @param {string} dirPath 文件夹路径
 * @return {DirectoriesList[]} 返回文件夹列表
 */
export function getDirectories(dirPath: string): DirectoriesList[] {
  // 初始化文件和文件夹列表
  const result: DirectoriesList[] = [];
  // 获取指定文件夹下的所有文件
  const files = fs.readdirSync(dirPath);

  for (const name of files) {
    // 判断是否是文件夹
    if (fs.statSync(`${dirPath}/${name}`).isDirectory()) {
      result.push({ name, subDirectories: getDirectories(`${dirPath}/${name}`) });
    }
  }

  return result;
}

/**
 * @description 获取指令文件夹下的所有文件
 * @param {string} dirPath 文件夹路径
 * @return {Files[]} 返回文件/文件夹列表
 */
export function getFiles(dirPath: string): Files[] {
  const result: Files[] = [];
  // 文件夹下的所有文件/文件夹
  const files = fs.readdirSync(dirPath);

  for (const name of files) {
    const stat = fs.statSync(`${dirPath}/${name}`);
    const path = `/${dirPath.split("/Blog")?.[1]}/${name}`.replace(/\/+/g, "/");

    result.push({
      ...stat,
      name,
      path: path.replace(/\\/g, "/"),
      url: `${ASSET_PREFIX}${path}`,
      directory: stat.isDirectory()
    });
  }

  // 按照文件夹优先排序
  return result.sort((a, b) => {
    if (a.directory && !b.directory) {
      return -1;
    }
    if (!a.directory && b.directory) {
      return 1;
    }
    return 0;
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
        const path = `${ASSET_DIR}${link.replace(ASSET_PREFIX, "")}`;
        if (fs.existsSync(path) && fs.statSync(path).isFile()) {
          fs.remove(path);
          resolve();
        }
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
        fs.remove(`${ASSET_DIR}${oldPath}`);
      }
      destroyVideoAssets(oldPath, oldPath !== newPath);
    } catch (err) {
      reject(err);
    }
  });
}
