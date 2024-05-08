import { server } from "@/server";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import redis from "@/utils/redis";

const io = new Server(server);
io.adapter(createAdapter(redis, redis.duplicate()));

export default io;
