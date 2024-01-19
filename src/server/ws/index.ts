import { server } from "@/server";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { REDIS } from "@/utils/redis";

const io = new Server(server);
io.adapter(createAdapter(REDIS, REDIS.duplicate()));

export default io;
