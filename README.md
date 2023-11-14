## 完整文档
DAIXU BLOG：[https://daixu.cn/article/213999943772434432](https://daixu.cn/article/213999943772434432)

## 项目指令

```shell
# 本地调试
npm run start

# 生产环境运行
npm run pm2

# 一键部署到服务器（只需要执行一次）
npm run deploy-setup

# 一键更新服务器代码
npm run deploy

# 对所有文件进行代码格式化
npm run prettier
```

## 工程目录

```shell
BLOG-NODE
├── public  #静态文件
│   ├── image
│   │   └── logo.png
│   ├── upload
│   │   └── .DS_Store
│   ├── .DS_Store
│   ├── favicon.ico
│   └── favicon.png
├── src #项目主目录
│   ├── config              #全局配置文件
│   │   ├── response        #状态码管理
│   │   │   ├── error.ts
│   │   │   └── index.ts
│   │   ├── env.ts          #全局变量
│   │   ├── log4.ts         #日志配置
│   │   └── sequelize.ts    #sequelize配置
│   ├── controllers #控制层代码
│   │   ├── article.ts
│   │   ├── comment.ts
│   │   ├── link.ts
│   │   ├── reply.ts
│   │   ├── server.ts
│   │   ├── update.ts
│   │   ├── upload.ts
│   │   └── user.ts
│   ├── global
│   │   └── enum.ts #枚举文件
│   ├── middlewares #中间件
│   │   ├── auth.ts     #登录鉴权
│   │   ├── cors.ts     #跨域
│   │   ├── index.ts    #中间件入口
│   │   ├── ip.ts       #IP获取
│   │   ├── log4.ts     #日志拦截
│   │   ├── params.ts   #参数解析
│   │   └── ratelimit.ts    #安全配置
│   ├── models  #数据模型
│   │   ├── article.ts
│   │   ├── comment.ts
│   │   ├── index.ts
│   │   ├── link.ts
│   │   ├── reply.ts
│   │   ├── update.ts
│   │   └── user.ts
│   ├── routes #接口路由
│   │   ├── article.ts  #文章
│   │   ├── comment.ts  #评论
│   │   ├── index.ts    #路由入口
│   │   ├── link.ts     #友情链接
│   │   ├── reply.ts    #回复
│   │   ├── server.ts   #站点信息路由
│   │   ├── swagger.ts  #swagger
│   │   ├── update.ts   #站点动态
│   │   ├── upload.ts   #文件上传
│   │   └── user.ts     #用户模块
│   ├── scripts #脚本
│   │   ├── index.ts    #脚本入口
│   │   ├── mysqldump.ts    #数据库备份
│   │   ├── publicBackup.ts #静态资源备份
│   │   └── uploadClear.ts  #分片文件清理
│   ├── server  
│   │   ├── WebSocketServer.ts  #ws配置
│   │   └── index.ts    #axios
│   ├── types
│   │   ├── global.d.ts
│   │   └── processEnv.d.ts #环境变量类型
│   ├── utils   #工具库
│   │   ├── api.ts          #零散工具
│   │   ├── file.ts         #文件相关处理函数
│   │   ├── jsonwebtoken.ts #token生成/校验
│   │   ├── log4.ts         #日志输出
│   │   ├── nodemailer.ts   #发送邮件
│   │   ├── redis.ts        #redis封装
│   │   └── snowflake.ts    #雪花算法类
│   ├── .DS_Store
│   └── app.ts
├── .DS_Store
├── .cz-config.js
├── .editorconfig
├── .eslintignore
├── .eslintrc.js
├── .gitignore
├── .prettierignore
├── .prettierrc
├── blog.sql
├── commitlint.config.js
├── nodemon.json
├── package-lock.json
├── package.json
├── pm2.config.js
├── tsconfig.json
└── tsconfig.path.json
```

## 全局环境

### 基础变量

因为涉及到很多个私密配置所以git上面并没有创建环境变量的配置文件，所以你需要在跟目录手动创建 下面两个文件 `.env.development`、`.env.production`

创建完成之后拷贝下面的配置模版，然后根据对应的注释进行修改：
```shell
# 服务启动端口
APP_PORT=3000
# websocket端口
WS_SERVER_PORT=7651
# 请求协议
SCHEME=http
# 请求端口
PORT=3000
# 请求域名
DOMAIN=localhost

# mysql-地址
MYSQL_HOST=127.0.0.1
# mysql-名称
MYSQL_DATABASE=blog
# mysql-用户名
MYSQL_USER=root
# mysql-密码
MYSQL_PASSWORD=xxxxxx

# redis-端口
REDIS_PORT=6379
# redis-地址
REDIS_HOST=127.0.0.1
# redis-密码
REDIS_PASSWORD=xxxxxx
# redis-网络协议：4 (IPv4)、6 (IPv6)
REDIS_FAMILY=4
# redis-要使用的数据库索引
REDIS_DB=7

# jsonwebtoken 密钥（随便输入一个，瞎打几个字符也可以例如：das78sadu21h2eaw）
JWT_SECRET_KEY=xxxxxx

# 第三方 QQ 授权登录配置信息
SECRET_QQ_APPID=xxxxxx
SECRET_QQ_APPKEY=xxxxxx
# 第三方 GitHub 授权登录配置信息
SECRET_GITHUB_CLIENTID=xxxxxx
SECRET_GITHUB_CLIENTSECRET=xxxxxx

# 邮件服务-阿里云企业邮箱（你可以换成其他的邮箱：qq、163、outlook、gmail等等）
EMAIL_HOST=smtp.qiye.aliyun.com
# 邮件服务-阿里云企业邮箱端口
EMAIL_PORT=465
# 邮件服务-阿里云企业邮箱账号
EMAIL_USER=xxxxxx
# 邮件服务-阿里云企业邮箱密码
EMAIL_PASSWORD=xxxxxx
```

> 不论是生产环境的还是开发环境的你都可以复制上面的模版然后进行对应的修改，如果你相关`mysql`、`redis`环境都是默认的话你只需要修改模版中`xxxxxx`的部分就行了，其他的可以保持不变。
>
> 另外需要改的地方是生产环境的配置文件（`.env.production`），里面的`SCHEME`、`PORT`、`DOMAIN`需要改成你自己的域名和端口，否则最后部署之后公网无法访问的。

### 第三方授权登录
这个属实没啥好的办法了，如果你想搞的话你就需要去`QQ`、`GitHub`、`Google`三个平台的开发后台单独配置应用，然后把获取到的密钥值修改到前端和后端的环境变量文件中。