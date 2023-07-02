
import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { Table } from "@/schemas/mongoSchemas";
import { TicTacToeChecker } from "@/utils/GameChecker";
import { MatchesRepoInstance } from "@/libs/databases";

const emptyTable = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

export const handleConnection = async (
  io: Server,
  socket: Socket,
  login: string,
  queue: {
    socketID: string;
    login: string;
  }[]
) => {
  const userMatch = await Table.findOne().or([
    { player1: login },
    { player2: login },
  ]);
  console.log(login);

  if (userMatch) {
    socket.join(userMatch.matchID);
  } else {
    queue.push({
      socketID: socket.id,
      login,
    });

    if (queue.length >= 2) {
      const matchID = uuidv4();
      console.log(queue);
      io.sockets.sockets.get(queue[0].socketID)?.join(matchID);
      io.sockets.sockets.get(queue[1].socketID)?.join(matchID);
      const tableParams = {
        matchID,
        player1: queue[0].login,
        player2: queue[1].login,
        table: emptyTable,
        turn: queue[0].login,
      };
      await Table.create(tableParams);
      queue = queue.slice(2);
      console.log(queue);
      io.to(matchID).emit("message", tableParams);
    }
  }
};

export const handleTurn = async (io: Server, login: string, pos: number) => {
  const userMatch = await Table.findOne().or([
    { player1: login },
    { player2: login },
  ]);

  if (
    userMatch &&
    userMatch.turn === login &&
    userMatch.table[Math.floor((pos - 1) / 3)][(pos - 1) % 3] === ""
  ) {
    let newTable = userMatch.table;

    newTable[Math.floor((pos - 1) / 3)][(pos - 1) % 3] =
      login === userMatch.player1 ? "X" : "O";

    const filter = { matchID: userMatch.matchID };

    const update = {
      matchID: userMatch.matchID,
      player1: userMatch.player1,
      player2: userMatch.player2,
      table: newTable,
      turn: login === userMatch.player1 ? userMatch.player2 : userMatch.player1,
    };

    await Table.findOneAndUpdate(filter, update);

    io.to(userMatch.matchID).emit("turn", update);

    const winChecker = TicTacToeChecker.checkWinner(update.table);
    if (winChecker) {
      const winner = winChecker === "X" ? update.player1 : update.player2;
      io.to(userMatch.matchID).emit("winNotification", winner);
      await Table.findOneAndDelete({ _id: userMatch._id });
      MatchesRepoInstance.addMatchResults({
        id: userMatch.matchID,
        player1: userMatch.player1,
        player2: userMatch.player2,
        winner,
      });
      io.in(userMatch.matchID).disconnectSockets();
    }
  }
};
