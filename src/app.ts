import "module-alias/register";
import "@/plugins";
import "@/scripts";
import "@/models";
// 创建 Node服务
import app from "@/server";
import middlewares from "@/middlewares";

app.use(middlewares);
