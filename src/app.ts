import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Database from "better-sqlite3";
import { AuthRouter } from "@/routers/AuthRouter";
import { drizzle } from "drizzle-orm/better-sqlite3";
import cors from "cors";
import { InfoRouter } from "@/routers/InfoRouter";
import socketioJwt from "socketio-jwt";
import { v4 as uuidv4 } from "uuid";
import { Table } from "@/schemas/mongoSchemas";
import { TicTacToeChecker } from "@/utils/GameChecker";
import { MatchesRepo } from "@/repositories/MatchesRepo";
import { MatchesRepoInstance } from "@/libs/databases";
import { handleConnection, handleTurn } from "@/listeners/emitHandlers";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: "*",
    credentials: true,
  },
});

mongoose.connect(process.env.MONGO_URL as string);

const authRouter = new AuthRouter("/auth");
const infoRouter = new InfoRouter("/info");

const routers = [authRouter, infoRouter];
0;

routers.forEach((router) => {
  app.use(router.path, router.router);
});

io.use(
  socketioJwt.authorize({
    secret: process.env.SECRET_KEY as string,
    handshake: true,
  })
);

let queue: {
  socketID: string;
  login: string;
}[] = [];

const emptyTable = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

io.on("connection", async (socket) => {
  // @ts-ignore
  const login = socket.decoded_token.login;

  // const userMatch = await Table.findOne().or([
  //   { player1: login },
  //   { player2: login },
  // ]);

  // if (userMatch) {
  //   socket.join(userMatch.matchID);
  // } else {
  //   queue.push({
  //     socketID: socket.id,
  //     login,
  //   });

  //   if (queue.length >= 2) {
  //     const matchID = uuidv4();
  //     console.log(queue);
  //     io.sockets.sockets.get(queue[0].socketID)?.join(matchID);
  //     io.sockets.sockets.get(queue[1].socketID)?.join(matchID);
  //     const tableParams = {
  //       matchID,
  //       player1: queue[0].login,
  //       player2: queue[1].login,
  //       table: emptyTable,
  //       turn: queue[0].login,
  //     };
  //     await Table.create(tableParams);
  //     queue = queue.slice(2);
  //     console.log(queue);
  //     io.to(matchID).emit("message", tableParams);
  //   }
  // }

  handleConnection(io, socket, login, queue);

  socket.on("turn", async (pos) => {
    // const userMatch = await Table.findOne().or([
    //   { player1: login },
    //   { player2: login },
    // ]);

    // if (
    //   userMatch &&
    //   userMatch.turn === login &&
    //   userMatch.table[Math.floor((pos - 1) / 3)][(pos - 1) % 3] === ""
    // ) {
    //   let newTable = userMatch.table;

    //   newTable[Math.floor((pos - 1) / 3)][(pos - 1) % 3] =
    //     login === userMatch.player1 ? "X" : "O";

    //   const filter = { matchID: userMatch.matchID };

    //   const update = {
    //     matchID: userMatch.matchID,
    //     player1: userMatch.player1,
    //     player2: userMatch.player2,
    //     table: newTable,
    //     turn:
    //       login === userMatch.player1 ? userMatch.player2 : userMatch.player1,
    //   };

    //   await Table.findOneAndUpdate(filter, update);

    //   io.to(userMatch.matchID).emit("turn", update);

    //   const winChecker = TicTacToeChecker.checkWinner(update.table);
    //   if (winChecker) {
    //     const winner = winChecker === "X" ? update.player1 : update.player2;
    //     io.to(userMatch.matchID).emit("winNotification", winner);
    //     await Table.findOneAndDelete({ _id: userMatch._id });
    //     MatchesRepoInstance.addMatchResults({
    //       id: userMatch.matchID,
    //       player1: userMatch.player1,
    //       player2: userMatch.player2,
    //       winner,
    //     });
    //     io.in(userMatch.matchID).disconnectSockets();
    //   }
    // }
    handleTurn(io, login, pos)
  });

  socket.on("disconnect", () => {
    queue = queue.filter((queueItem) => queueItem.socketID !== socket.id);
  });

})

server.listen(3000, () => {
  console.log("listening on *:3000");
});
