import { Router } from "express";
import dotenv from 'dotenv'
dotenv.config()
import { InfoController } from "controllers/InfoController";
import { AuthMiddlewareClass } from "middlewares/AuthMiddleware";

export class InfoRouter {
    router: Router;
    path: string;
    controller: InfoController;
    authMiddleware: AuthMiddlewareClass
  
    constructor(path: string) {
      (this.router = Router()), (this.path = path);
      this.controller = new InfoController();
      this.authMiddleware = new AuthMiddlewareClass()
      this.router.get('/getMe', this.authMiddleware.isAuthorized, this.controller.getMe)
    }
  }