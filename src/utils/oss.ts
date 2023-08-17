import AliOSS from "ali-oss";
import responseError from "@/config/response/error";
import { _ALIOSS } from "@/config/env";

const aliOSS = new AliOSS(_ALIOSS);

class OSS {
  put(name: string, file: any, options?: AliOSS.PutObjectOptions) {
    return new Promise<AliOSS.PutObjectResult>(async (resolve, reject) => {
      try {
        const result = await aliOSS.put(name, file, options);

        if (result.res.statusCode === 200) {
          resolve(result);
        } else {
          reject(responseError({ code: 12015, message: result.res.statusMessage }));
        }
      } catch (error: any) {
        reject(responseError({ code: 12015, message: error.message }));
      }
    });
  }

  destroy(name: string, options?: AliOSS.RequestOptions) {
    return new Promise<AliOSS.DeleteResult>(async (resolve, reject) => {
      try {
        const result = await aliOSS.delete(name, options);
        resolve(result);
      } catch (error: any) {
        reject(responseError({ code: 12015, message: error.message }));
      }
    });
  }
}

export default new OSS();
