import WebSocketServer from "@/server/ws/WebSocketServer";
import { server } from "@/server";
import Tags from "@/server/ws/tags";
import { WSResponse } from "@/config/response";
import { errorLogger } from "@/utils/log4";

const ws = new WebSocketServer(false, { server });

ws.addMessageListener(message => {
  try {
    const { tag, sn } = JSON.parse(message);
    const client = ws.getClient(sn);

    if (tag === Tags.PING && client) {
      client.send(WSResponse({ tag: Tags.PONG, message: "PONG" }));
    }
  } catch (error: any) {
    errorLogger(`WebSocket Error: ${error?.message ?? error}`);
  }
});

export default ws;
