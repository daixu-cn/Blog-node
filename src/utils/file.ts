import fs from "fs-extra";
import FileType from "file-type";
import path from "path";
import got from "got";
import { generateId } from "@/utils/api";
import { UPLOAD_PREFIX } from "@/config/env";
import oss from "@/utils/oss";
import { DirectoriesList, FileStats } from "./type";
import { URL } from "@/config/env";

const filePathPrefix = `../../public/${UPLOAD_PREFIX}`;

/**
 * @description 区分不同模块获取对应路径
 * @param {string | undefined} fileType 文件类型
 * @param {number} module 哪个模块的文件
 * @return {string} 返回模块路径
 */
export function moduleFormat(fileType: string | undefined, module: number) {
  if (fileType === "image") {
    switch (module) {
      case -1:
        return "/*";
      case 0:
        return "/article";
      case 1:
        return "/user";
      default:
        throw new Error("module参数异常");
    }
  }
  return "";
}

/**
 * @description 将网络文件保存到本地
 * @param {string} src 文件地址
 * @param {number} module 哪个模块的文件
 * @return {Promise<string>} 返回文件名
 */
export function saveFile(src: string, module: number) {
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
      const filePath = path.join(
        __dirname,
        `${filePathPrefix}${fileType}${moduleFormat(fileType, module)}`
      );

      // 校验文件目录是否存在
      fs.ensureDirSync(filePath);
      // 写入文件
      await fs.writeFile(`${filePath}/${fileName}`, buffer);

      // 文件最终地址
      const result = `${fileType}${moduleFormat(fileType, module)}/${fileName}`;
      // 上传到oss
      oss.put(`${UPLOAD_PREFIX}${result}`, path.join(__dirname, `${filePathPrefix}${result}`));
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
    if (fs.statSync(path.join(dirPath, name)).isDirectory()) {
      result.push({ name, subDirectories: getDirectories(`${dirPath}/${name}`) });
    }
  }

  return result;
}

/**
 * @description 获取指令文件夹下的所有文件
 * @param {string} dirPath 文件夹路径
 * @return {FileStats[]} 返回文件列表
 */
export function getFiles(dirPath: string): FileStats[] {
  // 初始化文件和文件夹列表
  const result: FileStats[] = [];
  // 获取指定文件夹下的所有文件
  const files = fs.readdirSync(dirPath);

  for (const name of files) {
    const stat = fs.statSync(path.join(dirPath, name));
    if (stat.isFile()) {
      result.push({
        ...stat,
        name,
        path: `${URL}${dirPath.split("/public")[1]}/${name}`
      });
    }
  }

  return result;
}
