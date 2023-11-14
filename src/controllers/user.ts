import { Context } from "koa";
import md5 from "md5";
import redis from "@/utils/redis";
import { sign } from "@/utils/jsonwebtoken";
import response from "@/config/response";
import responseError from "@/config/response/error";
import { Op, FindAttributeOptions } from "sequelize";
import { sendMail } from "@/utils/nodemailer";
import http from "@/server";
import { saveFile } from "@/utils/file";
import User from "@/models/user";
import { UPLOAD_PREFIX, FILE_PREFIX, _JWT, _SECRET } from "@/config/env";
import fs from "fs-extra";
import path from "path";

const FILE_UPLOAD_PATH_PREFIX = `../../public/${UPLOAD_PREFIX}`;

const USER_ATTRIBUTES: FindAttributeOptions = [
  "userId",
  "userName",
  "avatar",
  "email",
  "role",
  "emailService",
  "qq",
  "github",
  "google",
  "createdAt",
  "updatedAt"
];
export default {
  /**
   * @openapi
   * components:
   *   schemas:
   *     User:
   *       description: 用户信息
   *       type: object
   *       properties:
   *         userId:
   *           type: string
   *           example: 161137488965100000
   *           description: 用户ID
   *         userName:
   *           type: string
   *           example: admin
   *           description: 用户名
   *         email:
   *           type: string
   *           example: daixu.cn@outlook.com
   *           description: 邮箱
   *         avatar:
   *           type: string
   *           example: https://daixu.cn/images/avatar.png
   *           description: 头像
   *         role:
   *           type: integer
   *           example: 1
   *           description: 角色(0:管理员、1:普通用户)
   *         emailService:
   *           type: integer
   *           example: 1
   *           description: 邮箱服务(0:关闭、1:开启)
   *         createdAt:
   *           type: string
   *           example: 2023-01-10T01:55:16.000Z
   *           description: 注册时间
   *         updatedAt:
   *           type: string
   *           example: 2023-01-10T01:55:16.000Z
   *           description: 更新时间
   */
  async sms(ctx: Context) {
    try {
      const { email } = ctx.params;
      const verifyCode = parseInt((Math.random() * 1000000).toString());
      await sendMail(
        email,
        "验证您的电子邮件地址",
        `安全验证码：${verifyCode}，该验证码5分钟内有效。为了保障您的账户安全,请勿向他人泄漏验证码信息。`
      );
      redis.set(email, verifyCode, 60 * 5);

      ctx.body = response({ message: "验证码发送成功" });
    } catch (error: any) {
      throw responseError({ code: 11004, message: error?.message });
    }
  },
  async login(ctx: Context) {
    try {
      const { email, password } = ctx.params;

      const user = await User.findOne({
        attributes: USER_ATTRIBUTES,
        where: {
          email,
          password: md5(`${password}${_JWT.SECRET_KEY}`)
        }
      });

      if (user) {
        ctx.body = response({
          data: {
            user,
            token: sign({ userId: user.dataValues.userId })
          },
          message: "登录成功"
        });
      } else {
        throw responseError({ code: 11001 });
      }
    } catch (error: any) {
      throw responseError({ code: 11001, message: error?.message });
    }
  },
  async login_qq(ctx: Context) {
    try {
      const { accessToken, userId } = ctx.params;
      const res = await http.get(
        `https://graph.qq.com/oauth2.0/me?access_token=${accessToken}&fmt=json`
      );
      if (res.openid) {
        const info = await http.get(
          `https://graph.qq.com/user/get_user_info?access_token=${accessToken}&oauth_consumer_key=${_SECRET.qq.AppID}&openid=${res.openid}`
        );
        if (info.ret === 0) {
          const hasUser = await User.findOne({
            where: {
              qq: res.openid
            }
          });
          if (!hasUser) {
            if (userId) {
              await User.update(
                {
                  qq: res.openid
                },
                { where: { userId } }
              );
            } else {
              await User.create({
                userName: info.nickname ?? "--",
                qq: res.openid,
                avatar: info.figureurl_qq_1 ? await saveFile(info.figureurl_qq_1, 1) : null
              });
            }
          }

          const user = await User.findOne({
            attributes: USER_ATTRIBUTES,
            where: {
              qq: res.openid
            }
          });
          ctx.body = response({
            data: {
              newUser: !hasUser && !userId,
              user,
              token: sign({ userId: user?.dataValues.userId })
            },
            message: userId ? "绑定成功" : "登录成功"
          });
        } else {
          throw responseError({ code: 11012, message: info.msg });
        }
      } else {
        throw responseError({ code: 11012, message: res.error_description });
      }
    } catch (error: any) {
      throw responseError({ code: error?.code ?? 11012, message: error?.message });
    }
  },
  async login_github(ctx: Context) {
    try {
      const { code, userId } = ctx.params;

      const res = await http.post(
        "https://github.com/login/oauth/access_token",
        {
          client_id: _SECRET.github.clientId,
          client_secret: _SECRET.github.clientSecret,
          code
        },
        {
          headers: {
            Accept: "application/json"
          }
        }
      );

      if (res?.access_token) {
        const info = await http.get(
          `https://api.github.com/user`,
          {},
          {
            headers: {
              Authorization: `Bearer ${res.access_token}`
            }
          }
        );
        const github = String(info.id);
        if (github) {
          const hasUser = await User.findOne({
            where: {
              github
            }
          });
          if (!hasUser) {
            if (userId) {
              await User.update(
                {
                  github
                },
                { where: { userId } }
              );
            } else {
              await User.create({
                userName: info.name ?? info.login ?? "--",
                avatar: info.avatar_url ? await saveFile(info.avatar_url, 1) : null,
                github,
                email: info.email
              });
            }
          }

          const user = await User.findOne({
            attributes: USER_ATTRIBUTES,
            where: {
              github
            }
          });
          ctx.body = response({
            data: {
              newUser: !hasUser && !userId,
              user,
              token: sign({ userId: user?.dataValues.userId })
            },
            message: userId ? "绑定成功" : "登录成功"
          });
        } else {
          throw responseError({ code: 11013 });
        }
      } else {
        throw responseError({ code: 11013, message: res.error_description });
      }
    } catch (error: any) {
      throw responseError({ code: 11013, message: error?.message });
    }
  },
  async login_google(ctx: Context) {
    try {
      const { accessToken, userId } = ctx.params;
      const doc = await http.get("https://accounts.google.com/.well-known/openid-configuration");
      const res = await http.get(`${doc.userinfo_endpoint}?access_token=${accessToken}`);

      const google = res?.sub;
      if (google) {
        const hasUser = await User.findOne({
          where: {
            google
          }
        });
        if (!hasUser) {
          if (userId) {
            await User.update(
              {
                google
              },
              { where: { userId } }
            );
          } else {
            await User.create({
              userName: res.name ?? "--",
              google,
              avatar: res.picture ? await saveFile(res.picture, 1) : null
            });
          }
        }

        const user = await User.findOne({
          attributes: USER_ATTRIBUTES,
          where: {
            google
          }
        });
        ctx.body = response({
          data: {
            newUser: !hasUser && !userId,
            user,
            token: sign({ userId: user?.dataValues.userId })
          },
          message: userId ? "绑定成功" : "登录成功"
        });
      } else {
        throw responseError({ code: 11014, message: res.error_description });
      }
    } catch (error: any) {
      throw responseError({ code: error?.code ?? 11014, message: error?.message });
    }
  },
  async register(ctx: Context) {
    try {
      const { userName, email, sms, password } = ctx.params;

      if (!password) {
        throw responseError({ code: 11002 });
      } else if ((await redis.get(email)) !== sms) {
        throw responseError({ code: 11005 });
      }

      const userList = await User.findAll({
        where: { email }
      });
      if (userList.length) {
        throw responseError({ code: 11008 });
      } else {
        const { dataValues } = await User.create({
          userName: userName ?? email,
          password: md5(`${password}${_JWT.SECRET_KEY}`),
          email
        });

        const user = await User.findByPk(dataValues.userId, {
          attributes: USER_ATTRIBUTES
        });
        ctx.body = response({
          data: {
            user,
            token: sign({ userId: user?.dataValues.userId })
          },
          message: "注册成功"
        });
      }
    } catch (error: any) {
      throw responseError({
        code: error?.code ?? 11003,
        message: error.errors?.[0]?.message ?? error?.message
      });
    }
  },
  async password(ctx: Context) {
    try {
      const { email, sms, password } = ctx.params;

      if (!password) {
        throw responseError({ code: 11002 });
      } else if ((await redis.get(email)) !== sms) {
        throw responseError({ code: 11005 });
      }

      const [rows] = await User.update(
        { password: md5(`${password}${_JWT.SECRET_KEY}`) },
        { where: { email } }
      );
      if (rows) {
        ctx.body = response({ message: "修改成功" });
      } else {
        throw responseError({ code: 11007 });
      }
    } catch (error: any) {
      throw responseError({ code: error?.code ?? 11006, message: error?.message });
    }
  },
  async info(ctx: Context) {
    try {
      const { userId } = ctx.params;
      const user = await User.findOne({
        attributes: USER_ATTRIBUTES,
        where: {
          userId
        }
      });
      ctx.body = response({ data: user, message: "查询成功" });
    } catch (error: any) {
      throw responseError({ code: 11009, message: error.errors?.[0]?.message ?? error?.message });
    }
  },
  refreshToken(ctx: Context) {
    const { userId } = ctx.params;
    ctx.body = response({ data: sign({ userId }), message: "Token刷新成功" });
  },
  async update(ctx: Context) {
    try {
      const { avatar, userName, email, sms, qq, google, github, emailService, userId } = ctx.params;

      const removeAvatar = avatar && (await User.findByPk(userId))?.dataValues.avatar;

      if (email) {
        if ((await redis.get(email)) !== sms) {
          throw responseError({ code: 11005 });
        }
        const userList = await User.findAll({
          where: { email }
        });
        if (userList.length) {
          throw responseError({ code: 11008 });
        }
      }

      const [rows] = await User.update(
        {
          avatar: avatar ? avatar.replace(FILE_PREFIX, "") : undefined,
          email,
          userName,
          qq,
          google,
          github,
          emailService
        },
        { where: { userId } }
      );

      const user = await User.findByPk(userId, {
        attributes: USER_ATTRIBUTES
      });
      if (rows) {
        ctx.body = response({ data: user, message: "修改成功" });

        if (removeAvatar && !removeAvatar.endsWith("avatar.png")) {
          fs.remove(path.join(__dirname, `${FILE_UPLOAD_PATH_PREFIX}${removeAvatar}`));
        }
      } else {
        throw responseError({ code: 11010 });
      }
    } catch (error: any) {
      throw responseError({
        code: error?.code ?? 11010,
        message: error.errors?.[0]?.message ?? error?.message
      });
    }
  },
  async list(ctx: Context) {
    try {
      const { keyword, page = 1, pageSize = 10, role } = ctx.params;

      const { count, rows } = await User.findAndCountAll({
        where: {
          [Op.or]: [
            {
              userId: {
                [Op.like]: `%${keyword ?? ""}%`
              }
            },
            {
              email: {
                [Op.like]: `%${keyword ?? ""}%`
              }
            },
            {
              userName: {
                [Op.like]: `%${keyword ?? ""}%`
              }
            }
          ]
        },
        attributes: role !== 0 ? USER_ATTRIBUTES : undefined,
        order: [["createdAt", "DESC"]],
        offset: (page - 1) * pageSize,
        limit: pageSize
      });

      ctx.body = response({ data: { total: count, list: rows }, message: "查询成功" });
    } catch (error: any) {
      throw responseError({ code: 11011, message: error?.message });
    }
  }
};
