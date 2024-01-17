import WebSocketServer from "@/server/ws/WebSocketServer";
import { server } from "@/server";

const ws = new WebSocketServer(false, { noServer: true });

server.on("upgrade", (request, socket, head) => {
  ws.getServer().handleUpgrade(request, socket, head, ws => {
    ws.emit("connection", ws, request);
  });
});

export default ws;
