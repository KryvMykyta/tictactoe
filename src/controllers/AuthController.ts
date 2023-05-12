import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { Request, Response } from "express";
import { UsersRepo } from "repositories/UsersRepo";
import { ErrorGenerator } from "utils/ErrorGenerator";
import { TokenGenerator } from "utils/Tokens";

export class AuthController {
  usersRepo: UsersRepo;
  tokenGenerator: TokenGenerator
  constructor(db: BetterSQLite3Database) {
    this.usersRepo = new UsersRepo(db);
    this.tokenGenerator = new TokenGenerator()
  }

  public login = (
    req: Request<{}, { login: string; password: string }>,
    res: Response
  ) => {
    try {
      const { login, password } = req.body;
      if (!login || !password)
        throw new ErrorGenerator(400, "Login or password is empty");
      const user = this.usersRepo.getUserByLogin(login);
      if (!user[0] || user[0].password !== password) throw new ErrorGenerator(400, "Wrong credentials");
      const accessToken = this.tokenGenerator.createAccessToken(login)
      return res.status(200).send({accessToken})
    } catch (error) {
      console.log(error)
      if (error instanceof ErrorGenerator) {
        return res.status(error.status).send(error.message);
      }
      return res.status(500).send("Server error");
    }
  };

  public register = (
    req: Request<{}, { login: string; password: string }>,
    res: Response
  ) => {
    try {
      const { login, password } = req.body;
      if (!login || !password)
        throw new ErrorGenerator(400, "Login or password is empty");
      const user = this.usersRepo.getUserByLogin(login);
      if (user[0]) throw new ErrorGenerator(400, "User with this login already exists");
      this.usersRepo.createUser(login, password);
      return res.send("User created");
    } catch (error) {
      console.log(error)
      if (error instanceof ErrorGenerator) {
        return res.status(error.status).send(error.message);
      }
      return res.status(500).send("Server error");
    }
  };
}
