import response from "@/config/response";

/**
 * @description 用户模块错误码：10001--10999
 * @param {number} code 状态码
 * @return {string} 错误信息
 */
export function UserError(code: number): string {
  switch (code) {
    case 11001:
      return "用户名/密码错误";
    case 11002:
      return "密码不能为空";
    case 11003:
      return "注册失败";
    case 11004:
      return "验证码发送失败";
    case 11005:
      return "验证码错误";
    case 11006:
      return "密码修改失败";
    case 11007:
      return "未查询到该邮箱账号";
    case 11008:
      return "该邮箱已被其他账号绑定";
    case 11009:
      return "用户信息获取失败";
    case 11010:
      return "用户信息编辑失败";
    case 11011:
      return "用户列表获取失败";
    case 11012:
      return "QQ授权失败";
    case 11013:
      return "GitHub授权失败";
    case 11014:
      return "Google授权失败";
    default:
      return "用户模块异常";
  }
}

/**
 * @description 上传模块错误码：12001--12999
 * @param {number} code 状态码
 * @return {string} 错误信息
 */
export function UploadError(code: number): string {
  switch (code) {
    case 12001:
      return "文件上传异常，请联系管理员";
    case 12002:
      return "未检测到文件信息";
    case 12003:
      return "文件类型解析失败";
    case 12004:
      return "文件大小超过上限";
    case 12005:
      return "文件已损坏";
    case 12006:
      return "module参数异常";
    case 12007:
      return "文件处理异常";
    case 12008:
      return "分片文件参数缺失";
    case 12009:
      return "该分片文件已存在";
    case 12010:
      return "分片文件合并失败";
    case 12011:
      return "分片文件";
    case 12012:
      return "文件删除失败";
    case 12013:
      return "文件不存在";
    case 12014:
      return "删除权限不足";
    case 12015:
      return "OSS异常";
    case 12016:
      return "文件转换异常";
    case 12017:
      return "仅支持 JPEG、PNG、WebP、AVIF、GIF、TIFF 格式的图片";
    case 12018:
      return "禁止删除 Upload 之外的文件";
    default:
      return "上传模块异常";
  }
}

/**
 * @description 文章模块错误码：13001--13999
 * @param {number} code 状态码
 * @return {string} 错误信息
 */
export function ArticleError(code: number): string {
  switch (code) {
    case 13001:
      return "文章创建失败";
    case 13002:
      return "文章列表查询失败";
    case 13003:
      return "文章编辑失败";
    case 13004:
      return "文章信息获取失败";
    case 13005:
      return "文章不存在";
    case 13006:
      return "文章标题列表获取错误";
    case 13007:
      return "文章删除失败";
    default:
      return "文章管理模块异常";
  }
}

/**
 * @description 评论/回复模块错误码：14001--14999
 * @param {number} code 状态码
 * @return {string} 错误信息
 */
export function CommentError(code: number): string {
  switch (code) {
    case 14001:
      return "评论创建错误";
    case 14002:
      return "回复的记录不存在";
    case 14003:
      return "评论的文章不存在";
    case 14004:
      return "评论列表查询失败";
    case 14005:
      return "回复创建错误";
    case 14006:
      return "该评论不存在";
    case 14007:
      return "回复删除失败";
    case 14008:
      return "评论删除失败";
    case 14009:
      return "回复列表查询失败";
    case 14010:
      return "该文章已禁止评论";
    default:
      return "评论/回复模块异常";
  }
}

/**
 * @description 友情链接模块错误码：15001--15999
 * @param {number} code 状态码
 * @return {string} 错误信息
 */
export function LinkError(code: number): string {
  switch (code) {
    case 15001:
      return "友联创建失败";
    case 15002:
      return "友联修改失败";
    case 15003:
      return "友联查询失败";
    case 15004:
      return "友联删除失败";
    default:
      return "友联模块异常";
  }
}

/**
 * @description 站点信息错误码：16001--16999
 * @param {number} code 状态码
 * @return {string} 错误信息
 */
export function ServerError(code: number): string {
  switch (code) {
    case 16001:
      return "站点信息查询失败";
    case 16002:
      return "服务器信息查询失败";
    default:
      return "站点信息模块异常";
  }
}

/**
 * @description 站点信息错误码：17001--17999
 * @param {number} code 状态码
 * @return {string} 错误信息
 */
export function UpdateError(code: number): string {
  switch (code) {
    case 17001:
      return "网站更新记录创建失败";
    case 17002:
      return "网站更新记录修改失败";
    case 17003:
      return "网站更新记录查询失败";
    case 17004:
      return "网站更新记录删除失败";
    default:
      return "网站更新记录模块异常";
  }
}

/**
 * @description 文件模块错误码：18001--18999
 * @param {number} code 状态码
 * @return {string} 错误信息
 */
export function FileError(code: number): string {
  switch (code) {
    case 18001:
      return "文件目录查询失败";
    case 18002:
      return "文件列表查询失败";
    default:
      return "文件模块异常";
  }
}

interface Params {
  code?: number;
  data?: any;
  message?: string;
}

export default function errorFormat(params: Params) {
  const code = params?.code ?? -1;
  const data = params?.data ?? null;
  const message = params?.message?.toString() ?? "";

  if (message) {
    return response({ code, message, data });
  }

  if (code > 18000) {
    return response({ code, message: FileError(code), data });
  } else if (code > 17000) {
    return response({ code, message: UpdateError(code), data });
  } else if (code > 16000) {
    return response({ code, message: ServerError(code), data });
  } else if (code > 15000) {
    return response({ code, message: LinkError(code), data });
  } else if (code > 14000) {
    return response({ code, message: CommentError(code), data });
  } else if (code > 13000) {
    return response({ code, message: ArticleError(code), data });
  } else if (code > 12000) {
    return response({ code, message: UploadError(code), data });
  } else if (code > 11000) {
    return response({ code, message: UserError(code), data });
  }
}
