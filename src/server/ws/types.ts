import WebSocket from "ws";
import { generateId } from "@/utils/api";

export type MessageHandler = (message: string) => void;
export type CloseHandler = () => void;

export class WebSocketExpand extends WebSocket {
  identifier: string;

  constructor(address: string | URL, options?: WebSocket.ServerOptions) {
    super(address, options);

    this.identifier = generateId();
  }
}
