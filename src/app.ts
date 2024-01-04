import Koa from "koa";
const app = new Koa();
import "module-alias/register";
import "@/plugins";
import middlewares from "@/middlewares";
import Logger, { errorLogger } from "@/utils/log4";
import "@/scripts";
import { APP_PORT } from "@/config/env";
import figlet from "figlet";
import "@/models";

app.use(middlewares);

app.on("error", error => {
  errorLogger(`server error: ${error}\n`);
});

app.listen(APP_PORT, () => {
  Logger(`http://localhost:${APP_PORT}\n${figlet.textSync("DAIXU BLOG", { font: "Blocks" })}`);
});

export default app;
