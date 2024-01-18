import WebSocketServer from "@/server/ws/WebSocketServer";
import { server } from "@/server";

const ws = new WebSocketServer(false, { server });

export default ws;
