import { Router } from "express";
import dotenv from 'dotenv'
dotenv.config()
import { AuthController } from "./../controllers/AuthController";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { InfoController } from "./../controllers/InfoController";
import { AuthMiddlewareClass } from "middlewares/AuthMiddleware";

export class InfoRouter {
    router: Router;
    path: string;
    controller: InfoController;
    authMiddleware: AuthMiddlewareClass
  
    constructor(path: string, db: BetterSQLite3Database) {
      (this.router = Router()), (this.path = path);
      this.controller = new InfoController(db);
      this.authMiddleware = new AuthMiddlewareClass(db)
      this.router.post('/getMe', this.authMiddleware.isAuthorized, this.controller.getMe)
    }
  }