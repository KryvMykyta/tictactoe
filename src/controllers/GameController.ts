import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { Request, Response } from "express";
import { UsersRepo } from "@/repositories/UsersRepo";
import { ErrorGenerator } from "@/utils/ErrorGenerator";

export class GameController {
  usersRepo: UsersRepo;
  constructor(db: BetterSQLite3Database) {
    this.usersRepo = new UsersRepo(db);
  }

  public createMatch = (
    req: Request<{}, { login: string }>,
    res: Response
  ) => {
    try {
      
    } catch (error) {
      console.log(error);
      if (error instanceof ErrorGenerator) {
        return res.status(error.status).send(error.message);
      }
      return res.status(500).send("Server error");
    }
  };
}
