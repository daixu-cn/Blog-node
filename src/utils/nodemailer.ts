/**
 * @Description: 邮件服务
 * @Author: daixu
 * @Date: 2023-04-22 21:14:49
 */

import nodemailer, { SendMailOptions } from "nodemailer";
import { _EMAIL } from "@/config/env";
import { errorLogger } from "@/utils/log4";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import handlebars from "handlebars";
import path from "path";
import fs from "fs-extra";

type ISendInfo = string | undefined;

export const transporter = nodemailer.createTransport(_EMAIL.options);

// 获取邮件模板
const template = handlebars.compile(
  fs.readFileSync(path.resolve(process.cwd(), "public/template/email.hbs"), "utf8")
);

/**
 * @description 发送邮件
 * @param {ISendInfo} to 发送对象邮箱
 * @param {ISendInfo} subject 邮件标题
 * @param {ISendInfo} content 邮件正文
 * @param {SendMailOptions} options 邮件配置
 * @return {Promise<SMTPTransport.SentMessageInfo>}
 */
export function sendMail(
  to: ISendInfo,
  subject: ISendInfo,
  content: ISendInfo,
  options?: SendMailOptions
): Promise<SMTPTransport.SentMessageInfo> {
  return new Promise<SMTPTransport.SentMessageInfo>((resolve, reject) => {
    transporter.sendMail(
      {
        from: _EMAIL.USER_EMAIL,
        to,
        subject,
        html: template({ content }),
        ...options
      },
      (error, info) => {
        if (error) {
          errorLogger(error);
          errorLogger(`src/utils/nodemailer.ts\n${JSON.stringify(error)}`);
          reject(error);
        } else {
          resolve(info);
        }
      }
    );
  });
}
