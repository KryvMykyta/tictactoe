import { NextFunction, Request, RequestHandler, Response } from "express";
import { ErrorGenerator } from "@/utils/ErrorGenerator";
import { TokenGenerator } from "@/utils/Tokens";
import { UsersRepo } from "@/repositories/UsersRepo";
import { UserRepoInstance } from "@/libs/databases";

export class AuthMiddlewareClass {
  tokenGenerator: TokenGenerator;
  usersRepository: UsersRepo;
  constructor() {
    this.tokenGenerator = new TokenGenerator();
    // this.usersRepository = new UsersRepo(db);
    this.usersRepository = UserRepoInstance
  }

  public isAuthorized: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.header("Authorization")?.split(" ")[1];
      if (!token) {
        throw new ErrorGenerator(401, "Unauthorized");
      }
      const decoded = this.tokenGenerator.verifyToken(token) as {
        login: string;
      };
      const userFound = this.usersRepository.getUserByLogin(
        decoded.login
      );
      if (!userFound[0]) {
        throw new ErrorGenerator(401, "Unauthorized");
      }
      req.body.login = decoded.login;
      next();
    } catch (err) {
      console.log(err);
      if (err instanceof ErrorGenerator) {
        return res.status(err.status).send(err.message);
      }
      return res.status(500).send("Server Error");
    }
  };
}