import { Router } from "express";
import dotenv from 'dotenv'
dotenv.config()
import { AuthController } from "@/controllers/AuthController";

export class AuthRouter {
    router: Router;
    path: string;
    controller: AuthController;
  
    constructor(path: string) {
      (this.router = Router()), (this.path = path);
      this.controller = new AuthController();
      this.router.post('/login', this.controller.login)
      this.router.post('/register', this.controller.register)
    }
  }