import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Database from "better-sqlite3";
import { AuthRouter } from "routers/AuthRouter";
import { drizzle } from "drizzle-orm/better-sqlite3";
import cors from "cors";
import { InfoRouter } from "routers/InfoRouter";
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(cors())
app.set('socket.io',io)

mongoose.connect(process.env.MONGO_URL as string);
const sqliteDB = drizzle(new Database('users.db'))


const authRouter = new AuthRouter("/auth", sqliteDB)
const infoRouter = new InfoRouter("/info", sqliteDB)

const routers = [authRouter, infoRouter]

routers.forEach(router => {
  app.use(router.path, router.router)
})

io.on('connection', (socket) => {
  console.log(`a user ${socket.id} connected`);
  socket.on("message", ( msg ) => {
    console.log(`Message is from ${socket.id} : ${msg}`)
    socket.emit("message", `hello ${socket.id}`)
  })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
