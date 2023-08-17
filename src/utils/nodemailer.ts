/**
 * @Description: 邮件服务
 * @Author: daixu
 * @Date: 2023-04-22 21:14:49
 */

import nodemailer, { SendMailOptions } from "nodemailer";
import { _EMAIL } from "@/config/env";
import { errorLogger } from "@/utils/log4";
import SMTPTransport from "nodemailer/lib/smtp-transport";

type ISendInfo = string | undefined;

export const transporter = nodemailer.createTransport(_EMAIL.options);

/**
 * @description 发送邮件
 * @param {ISendInfo} to 发送对象邮箱
 * @param {ISendInfo} subject 邮件标题
 * @param {ISendInfo} content 邮件正文
 * @param {SendMailOptions} options 邮件配置
 * @return {}
 */
export function sendMail(
  to: ISendInfo,
  subject: ISendInfo,
  content: ISendInfo,
  options?: SendMailOptions
) {
  return new Promise<SMTPTransport.SentMessageInfo>((resolve, reject) => {
    transporter.sendMail(
      {
        from: _EMAIL.USER_EMAIL,
        to,
        subject,
        html: `<div id="DAIXU-EMAIL" style="display:flex;justify-content:center"><div class="DAIXU-container" style="width:660px;box-sizing:border-box;border:1px solid #f6f6f6;background-color:#f7f8fa;padding:20px 20px 30px 20px;display:flex;flex-direction:column"><div class="DAIXU-logo"><img src="https://api.daixu.cn/image/logo.png" alt="LOGO" style="width:80px;object-fit:contain;display:inline-block;margin-left: 1px;"></div><div class="DAIXU-content" style="margin-top:30px;border:1px solid #f6f6f6;border-top:2px solid #9fa3f1;padding:20px;background-color:#fff;box-shadow:0 1px 1px 0 rgba(122,55,55,.2);font-family:'helvetica neue',PingFangSC-Light,arial,'hiragino sans gb','microsoft yahei ui','microsoft yahei',simsun,sans-serif;color:#333;font-size:14px;line-height:24px;word-wrap:break-word;word-break:break-all">${content}<div class="DAIXU-sender" style="color:#333;font-size:14px;line-height:26px;word-wrap:break-word;word-break:break-all;margin-top:32px"><strong>Good Luck!</strong><br><strong>daixu</strong></div></div><div class="DAIXU-footer" style="margin-top:30px;color:#666;font-size:12px;text-align:center"><p>反馈邮箱: <a style="color:#9fa3f1;font-weight:initial;cursor:pointer;text-decoration:none">daixu.cn@outlook.com</a></p><p>如果您不希望再收到 DAIXU BLOG 的电子邮件，请 <a href="https://daixu.cn/account" target="_blank" style="color:#9fa3f1;font-weight:initial;cursor:pointer;text-decoration:none">关闭邮箱服务 </a>。</p></div></div></div>`,
        ...options
      },
      (error, info) => {
        if (error) {
          errorLogger(error);
          reject(error);
        } else {
          resolve(info);
        }
      }
    );
  });
}