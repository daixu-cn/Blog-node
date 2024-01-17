import WebSocket, { ServerOptions } from "ws";
import { verifyToken } from "@/utils/jsonwebtoken";
import { MessageHandler, CloseHandler } from "./types";
class WebSocketServer {
  private server: WebSocket.Server;
  private messageListeners: Set<MessageHandler> = new Set();
  private closeListeners: Set<CloseHandler> = new Set();

  constructor(isAuth = false, options?: ServerOptions) {
    // 开启WebSocketServer
    this.server = new WebSocket.Server({
      verifyClient: async (info, callback) => {
        try {
          // 校验连接是否需要认证
          if (isAuth) {
            const token = info.req.headers["sec-websocket-protocol"];

            if (token && (await verifyToken(token))) {
              callback(true);
            }
          } else {
            callback(true);
          }
        } catch {
          callback(false);
        }
      },
      ...options
    });
    // 监听客户端连接
    this.server.on("connection", (ws: WebSocket) => {
      // 监听客户端发送过来的消息
      ws.on("message", (message: string) => {
        // 触发所有的messageListeners
        this.messageListeners.forEach(listener => {
          listener(message);
        });
      });

      // 监听客户端关闭连接事件
      ws.on("close", () => {
        // 触发所有的closeListeners
        this.closeListeners.forEach(listener => listener());
      });
    });
  }

  getServer() {
    return this.server;
  }

  // 添加消息监听器
  public addMessageListener(handler: MessageHandler): void {
    this.messageListeners.add(handler);
  }

  // 移除消息监听器
  public removeMessageListener(handler: MessageHandler): void {
    this.messageListeners.delete(handler);
  }

  // 添加关闭监听器
  public addCloseListener(handler: CloseHandler): void {
    this.closeListeners.add(handler);
  }

  // 移除关闭监听器
  public removeCloseListener(handler: CloseHandler): void {
    this.closeListeners.delete(handler);
  }

  // 发送消息给所有客户端
  public broadcast(message: string | Object): Promise<void[]> {
    const result: Promise<void>[] = [];

    for (const client of this.server.clients) {
      if (client.readyState === WebSocket.OPEN) {
        result.push(
          new Promise<void>((resolve, reject) => {
            client.send(JSON.stringify(message), error => {
              if (error) {
                reject(error);
              } else {
                resolve();
              }
            });
          })
        );
      }
    }

    return Promise.all(result);
  }

  // 关闭WebSocketServer
  public close(): void {
    this.messageListeners.clear();
    this.closeListeners.clear();
    this.server.close();
  }
}

export default WebSocketServer;
