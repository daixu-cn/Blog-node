/*
 Navicat Premium Data Transfer

 Source Server         : 127.0.0.1
 Source Server Type    : MySQL
 Source Server Version : 80033 (8.0.33)
 Source Host           : localhost:3306
 Source Schema         : blog

 Target Server Type    : MySQL
 Target Server Version : 80033 (8.0.33)
 File Encoding         : 65001

 Date: 17/08/2023 16:45:32
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for article
-- ----------------------------
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article` (
  `article_id` bigint unsigned NOT NULL COMMENT '文章ID',
  `title` char(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章标题',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT '文章描述',
  `category` enum('CODE','TUTORIAL','LEISURE','JOURNAL') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章类别："CODE":"实验室","TUTORIAL":"探索站","LEISURE":"咖啡屋","JOURNAL":"生活碎片"',
  `poster` char(255) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '预览图片',
  `video` char(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '视频',
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章正文(Markdown)',
  `views` int NOT NULL DEFAULT '0' COMMENT '文章阅读量',
  `user_id` bigint unsigned NOT NULL COMMENT '用户ID',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`article_id`),
  UNIQUE KEY `article_id` (`article_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章表';

-- ----------------------------
-- Records of article
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for comment
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `comment_id` bigint unsigned NOT NULL COMMENT '评论ID',
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '评论内容(Markdown)',
  `article_id` bigint unsigned DEFAULT NULL COMMENT '文章ID',
  `user_id` bigint unsigned NOT NULL COMMENT '评论的用户ID',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`comment_id`),
  UNIQUE KEY `comment_id` (`comment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论表';

-- ----------------------------
-- Records of comment
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for link
-- ----------------------------
DROP TABLE IF EXISTS `link`;
CREATE TABLE `link` (
  `link_id` bigint unsigned NOT NULL COMMENT '友链ID',
  `name` char(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '网站名称',
  `description` char(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '网站描述',
  `logo` char(255) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '网站LOGO',
  `url` char(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '网站地址',
  `email` char(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '站长邮箱',
  `qq` char(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '站长QQ',
  `check` tinyint(1) NOT NULL DEFAULT '0' COMMENT '友联核验状态(0:不通过、1:通过)',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`link_id`),
  UNIQUE KEY `link_id` (`link_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='友情链接表';

-- ----------------------------
-- Records of link
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for reply
-- ----------------------------
DROP TABLE IF EXISTS `reply`;
CREATE TABLE `reply` (
  `reply_id` bigint unsigned NOT NULL COMMENT '回复ID',
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '回复内容(Markdown)',
  `comment_id` bigint unsigned NOT NULL COMMENT '评论ID',
  `user_id` bigint unsigned NOT NULL COMMENT '回复的用户ID',
  `parent_id` bigint unsigned DEFAULT NULL COMMENT '父级回复ID',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`reply_id`),
  UNIQUE KEY `reply_id` (`reply_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='回复表';

-- ----------------------------
-- Records of reply
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for update
-- ----------------------------
DROP TABLE IF EXISTS `update`;
CREATE TABLE `update` (
  `update_id` bigint unsigned NOT NULL COMMENT '更新ID',
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新内容(Markdown)',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`update_id`),
  UNIQUE KEY `update_id` (`update_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='网站更新表';

-- ----------------------------
-- Records of update
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `user_id` bigint unsigned NOT NULL COMMENT '用户ID',
  `user_name` char(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户名',
  `password` char(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1bc2a8b7478a135446ee4e98f924efbf' COMMENT '密码',
  `email` char(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户邮箱',
  `avatar` char(50) COLLATE utf8mb4_unicode_ci DEFAULT 'image/user/avatar.png' COMMENT '用户头像',
  `qq` char(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'qq',
  `github` char(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'github',
  `google` char(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'google',
  `role` int NOT NULL DEFAULT '1' COMMENT '角色(0:管理员、1:普通用户)',
  `email_service` tinyint(1) NOT NULL DEFAULT '1' COMMENT '邮箱服务(0:关闭、1:开启)',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- ----------------------------
-- Records of user
-- ----------------------------
BEGIN;
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
