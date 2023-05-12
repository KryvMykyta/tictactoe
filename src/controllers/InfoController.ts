import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { Request, Response } from "express";
import { UsersRepo } from "repositories/UsersRepo";
import { ErrorGenerator } from "utils/ErrorGenerator";
import { TokenGenerator } from "utils/Tokens";

export class InfoController {
  usersRepo: UsersRepo;
  tokenGenerator: TokenGenerator
  constructor(db: BetterSQLite3Database) {
    this.usersRepo = new UsersRepo(db);
    this.tokenGenerator = new TokenGenerator()
  }

  public getMe = (
    req: Request<{}, { login: string }>,
    res: Response
  ) => {
    try {
      const { login } = req.body;
      if (!login)
        throw new ErrorGenerator(401, "Unauthorized");
     const userData = this.usersRepo.getUserByLogin(login)
     const userMatches = this.usersRepo.getUserMatches(login)
     return res.status(200).send({
        login: userData[0].login,
        rating: userData[0].rating,
        matches: userMatches
     })
    } catch (error) {
      console.log(error)
      if (error instanceof ErrorGenerator) {
        return res.status(error.status).send(error.message);
      }
      return res.status(500).send("Server error");
    }
  };
}
