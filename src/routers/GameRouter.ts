import { Router } from "express";
import dotenv from 'dotenv'
dotenv.config()
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { AuthMiddlewareClass } from "middlewares/AuthMiddleware";
import { GameController } from "./../controllers/GameController";

export class InfoRouter {
    router: Router;
    path: string;
    controller: GameController;
    authMiddleware: AuthMiddlewareClass
  
    constructor(path: string, db: BetterSQLite3Database) {
      (this.router = Router()), (this.path = path);
      this.controller = new GameController(db);
      this.authMiddleware = new AuthMiddlewareClass(db)
      this.router.get('/createConnection', this.authMiddleware.isAuthorized, this.controller.createConnection)
    }
  }