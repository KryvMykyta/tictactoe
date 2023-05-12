import { Router } from "express";
import dotenv from 'dotenv'
dotenv.config()
import { AuthController } from "./../controllers/AuthController";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

export class AuthRouter {
    router: Router;
    path: string;
    controller: AuthController;
  
    constructor(path: string, db: BetterSQLite3Database) {
      (this.router = Router()), (this.path = path);
      this.controller = new AuthController(db);
      this.router.post('/login', this.controller.login)
      this.router.post('/register', this.controller.register)
    }
  }