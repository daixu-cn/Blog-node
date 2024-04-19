import Koa from "koa";
import http from "http";
import figlet from "figlet";
import { APP_PORT } from "@/config/env";
import Logger, { errorLogger } from "@/utils/log4";

const app = new Koa();
const server = http.createServer(app.callback());

server.listen(APP_PORT, () => {
  Logger(`http://localhost:${APP_PORT}`);

  if (process.env.NODE_ENV !== "development") {
    Logger(`\n${figlet.textSync("DAIXU BLOG", { font: "Blocks" })}`);
  }
});
server.on("error", error => {
  errorLogger(`src/server/index.ts\nserver error: ${error}\n`);
});

export default app;
export { server };
