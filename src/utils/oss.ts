import OSS from "ali-oss";
import { _ALI } from "@/config/env";

export const client = new OSS({
  accessKeyId: _ALI.ALI_ACCESS_KEY_ID,
  accessKeySecret: _ALI.ALI_ACCESS_KEY_SECRET,
  region: _ALI.OSS.ALI_OSS_REGION,
  bucket: _ALI.OSS.ALI_OSS_BUCKET
});

export default {
  /**
   * @description 上传文件至阿里云OSS
   * @param {string} path 文件在OSS中的路径
   * @param {OSS.HeadObjectOptions} options OSS配置项
   * @return {Promise<OSS.HeadObjectResult>} 文件信息
   */
  head(path: string, options?: OSS.HeadObjectOptions): Promise<OSS.HeadObjectResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await client.head(path, options);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  },
  /**
   * @description 上传文件至阿里云OSS
   * @param {string} path 文件在OSS中的路径
   * @param {string} params 请求参数
   * @param {OSS.GetObjectOptions} options OSS配置项
   * @return {Promise<OSS.GetObjectResult>} 文件信息
   */
  get(path: string, params?: any, options?: OSS.GetObjectOptions): Promise<OSS.GetObjectResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await client.get(path, params, options);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  },
  /**
   * @description 上传文件至阿里云OSS
   * @param { OSS.ListV2ObjectsQuery} query 请求参数
   * @param {OSS.RequestOptions} options OSS配置项
   * @return {Promise<OSS.ListObjectResult>} 文件在OSS中的路径
   */
  list(
    query: OSS.ListV2ObjectsQuery,
    options: OSS.RequestOptions = {}
  ): Promise<OSS.ListObjectResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await client.listV2(query, options);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  },
  /**
   * @description 上传文件至阿里云OSS
   * @param {string} path 文件在OSS中的路径
   * @param {string|Buffer} localFile 本地文件路径或者Buffer
   * @param {OSS.PutObjectOptions} options OSS配置项
   * @return {Promise<string>} 文件在OSS中的路径
   */
  upload(
    path: string,
    localFile: string | Buffer,
    options?: OSS.PutObjectOptions
  ): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await client.put(path, localFile, options);
        resolve(result.name);
      } catch (error) {
        reject(error);
      }
    });
  },
  /**
   * @description 上传文件至阿里云OSS
   * @param {string} path 文件在OSS中的路径
   * @param {OSS.RequestOptions} options OSS配置项
   * @return {Promise<OSS.DeleteResult>} 删除结果
   */
  delete(path: string, options?: OSS.RequestOptions): Promise<OSS.DeleteResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await client.delete(path, options);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }
};
