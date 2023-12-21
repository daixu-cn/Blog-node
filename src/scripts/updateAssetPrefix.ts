/**
 * @Description: 全局修改 Markdown 内容中访问前缀
 * @Author: daixu
 * @Date: 2023-11-29 16:11:02
 */

import sequelize from "@/config/sequelize";

import Article from "@/models/article";
import Commemt from "@/models/comment";
import Reply from "@/models/reply";

function uploadMarkdownAssets(oldPath: string, newPath: string) {
  return new Promise(async (resolve, reject) => {
    const transaction = await sequelize.transaction();

    try {
      const articles = await Article.findAll();
      for (const item of articles) {
        const article = item.toJSON();
        const content = article.content.replace(
          /!\[.*?\]\((.*?)\)/g,
          (match: string, p1: string) => {
            return match.replace(p1, p1.replace(oldPath, newPath));
          }
        );

        await Article.update({ content }, { where: { articleId: article.articleId }, transaction });
      }

      const comments = await Commemt.findAll();
      for (const item of comments) {
        const comment = item.toJSON();
        const content = comment.content.replace(
          /!\[.*?\]\((.*?)\)/g,
          (match: string, p1: string) => {
            return match.replace(p1, p1.replace(oldPath, newPath));
          }
        );

        await Commemt.update({ content }, { where: { commentId: comment.commentId }, transaction });
      }

      const replies = await Reply.findAll();
      for (const item of replies) {
        const reply = item.toJSON();
        const content = reply.content.replace(/!\[.*?\]\((.*?)\)/g, (match: string, p1: string) => {
          return match.replace(p1, p1.replace(oldPath, newPath));
        });

        await Reply.update({ content }, { where: { replyId: reply.replyId }, transaction });
      }

      await transaction.commit();
      resolve(true);
    } catch (err) {
      await transaction.rollback();
      reject(err);
    }
  });
}

// 传入旧的访问前缀和新的访问前缀，执行后会将 Markdown 内容中的旧的访问前缀替换为新的访问前缀
// 可以一次性替换多个，但是不建议一次性替换过多，以免出现问题
uploadMarkdownAssets("https://api.daixu.cn:443/upload", "https://api.daixu.cn");
uploadMarkdownAssets("https://asset.daixu.cn/Blog", "https://api.daixu.cn");
