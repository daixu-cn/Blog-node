import sequelize from "@/config/sequelize";
import User from "@/models/user";
import Article from "@/models/article";
import Comment from "@/models/comment";
import Reply from "@/models/reply";
import Link from "@/models/link";
import Update from "@/models/update";

// 模型同步
// sequelize.sync({ force: true });

Article.belongsTo(User, {
  foreignKey: "userId",
  constraints: false
});
User.hasMany(Article, {
  foreignKey: "userId",
  constraints: false
});

Comment.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "userId",
  as: "user",
  constraints: false
});

Comment.belongsTo(Article, {
  foreignKey: "articleId",
  targetKey: "articleId",
  as: "article",
  constraints: false
});

Reply.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "userId",
  as: "user",
  constraints: false
});
Reply.belongsTo(Comment, {
  foreignKey: "commentId",
  targetKey: "commentId",
  as: "comment",
  constraints: false
});
